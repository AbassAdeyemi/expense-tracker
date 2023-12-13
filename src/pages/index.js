import {Web5} from "@web5/api";
import {useEffect, useState, useMemo} from "react";
import Register from "@/pages/components/Register";
import ExpenseTracker from "@/pages/components/ExpenseTracker";
import {UserHelper} from "@/pages/helpers/UserHelper";
import {ExpenseHelper} from "@/pages/helpers/ExpenseHelper";

export default function Home() {
    const [web5, setWeb5] = useState(null)
    const [did, setDid] = useState(null)
    const [protocolInstalled, setProtocolInstalled] = useState(false)
    const [isAReturningUser, setIsAReturningUser] = useState(false)
    const [expenses, setExpenses] = useState([])

    const [registerFormValues, setRegisterFormValues]
        = useState({
        fullname: "",
        alias: "",
        salary: "",
        budget: "",
    })

    const [expenseFormValues, setExpenseFormValues] = useState({
        item: "",
        amount: "",
        date: "",
        category: ""
    })

    const registerChangeHandler = (e) => {
        setRegisterFormValues({...registerFormValues, [e.target.name]: e.target.value})
    }

    const expenseChangeHandler = (e) => {
        setExpenseFormValues({...expenseFormValues, [e.target.name]: e.target.value})
    }


    useEffect(() => {
        const initWeb5 = async () => {
            const {web5, did} = await Web5.connect();
            setWeb5(web5);
            setDid(did);

            if (web5 && did) {
                await configureProtocol(web5, did);
                const userRecords = await UserHelper.fetchUserInfo(web5)
                setIsAReturningUser(userRecords.length > 0)
                const expenseRecords = await ExpenseHelper.fetchExpenses(web5)
                setExpenses(expenseRecords)
            }
        };
        initWeb5();
    }, [])

    const defineProtocol = () => {
        return {
            protocol: "https://example.com/expense-protocol",
            published: true,
            types: {
                userInfo: {
                    schema: "https://example.com/userInfo",
                    dataFormats: ["application/json"]
                },
                expense: {
                    schema: "https://example.com/expense",
                    dataFormats: ["application/json"]
                }
            },
            structure: {
                userInfo: {
                    $actions: [
                        {who: "author", of: "userInfo", can: "write"},
                        {who: "author", of: "userInfo", can: "read"}
                    ]
                },
                expense: {
                    $actions: [
                        {who: "author", of: "expense", can: "write"},
                        {who: "anyone", can: "read"}
                    ]
                }
            }
        }
    }

    const queryForProtocol = async (web5) => {
        return web5.dwn.protocols.query({
            message: {
                filter: {
                    protocol: "https://example.com/expense-protocol"
                }
            }
        })
    }

    const installProtocolLocally = async (web5, protocolDefinition) => {
        return web5.dwn.protocols.configure({
            message: {
                definition: protocolDefinition,
            },
        });
    };


    const configureProtocol = async (web5) => {
        if (protocolInstalled) return;

        const protocolDefinition = defineProtocol();
        const {protocols, status} = await queryForProtocol(web5);

        if (status.code !== 200 || protocols.length === 0) {
            const {protocol, status} = await installProtocolLocally(web5, protocolDefinition);
            setProtocolInstalled(true);
            console.log("Protocol installed locally", protocol, status);

            await protocol.send(did);
        }
    }


    const expenseDeleteHandler = async (recordId) => {
        const remainingRecords = await ExpenseHelper.deleteExpense(web5, recordId)
        setExpenses(remainingRecords);
    }

    const registerSubmitHandler = async (e) => {
        e.preventDefault();
        const userInfo = UserHelper.constructUserInfo(registerFormValues);
        await UserHelper.writeUserInfoToDwn(web5, userInfo);
        Object.keys(registerFormValues).forEach(key => registerFormValues[key] = "")
        setRegisterFormValues(registerFormValues)
        const records = await UserHelper.fetchUserInfo(web5);
        setIsAReturningUser(records.length > 0);
    }

    const expenseSubmitHandler = async (e) => {
        e.preventDefault();
        const expense = ExpenseHelper.constructExpense(expenseFormValues)
        await ExpenseHelper.writeExpenseToDwn(web5, expense);
        Object.keys(expenseFormValues).forEach(key => expenseFormValues[key] = "")
        setExpenseFormValues(expenseFormValues)
        const records = await ExpenseHelper.fetchExpenses(web5);
        setExpenses(records)
    }

    return (
        <div>
                {
                    isAReturningUser ?
                        <ExpenseTracker onChange={expenseChangeHandler}
                                        values={expenseFormValues}
                                        handleSubmit={expenseSubmitHandler}
                                        expenses={expenses}
                                        handleDelete={expenseDeleteHandler}
                        />
                        :
                        <Register onChange={registerChangeHandler}
                                  values={registerFormValues}
                                  handleSubmit={registerSubmitHandler}
                        />
                }

        </div>

    )


}
