import {Web5} from "@web5/api";
import {useEffect, useState} from "react";
import Register from "@/pages/components/Register";
import ExpenseTracker from "@/pages/components/ExpenseTracker";

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
      // console.log("name: ", e.target)
        setRegisterFormValues({...registerFormValues, [e.target.name]: e.target.value})
    }

    const expenseChangeHandler = (e) => {
        console.log("name: ", e.target.name)
        setExpenseFormValues({...expenseFormValues, [e.target.name]: e.target.value})
    }

    useEffect(() => {
        const initWeb5 = async () => {
            const {web5, did} = await Web5.connect();
            setWeb5(web5);
            setDid(did);

            if (web5 && did) {
                await configureProtocol(web5, did);
                const userInfo = await fetchUserInfo(web5)
                setIsAReturningUser(userInfo.length > 0)
            }
            if(isAReturningUser) {
                const expenses = await fetchExpenses(web5)
                setExpenses(expenses)
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

    const constructUserInfo = (userInfo) => {
        const currentDate = new Date().toLocaleDateString();
        const currentTime = new Date().toLocaleTimeString();
        return {
            ...userInfo,
            timestamp: `${currentDate} ${currentTime}`,
        }
    }

    const writeUserInfoToDwn = async (userInfo) => {
        await web5.dwn.records.write({
            data: userInfo,
            message: {
                protocol: "https://example.com/expense-protocol",
                protocolPath: "userInfo",
                schema: "https://example.com/userInfo"
            }
        })

    }

    const fetchUserInfo = async (web5) => {
        const response = await web5.dwn.records.query({
            message: {
                filter: {
                    protocol: "https://example.com/expense-protocol",
                    schema: "https://example.com/userInfo",
                },
            },
        });

        if (response.status.code === 200) {
            const userInfo = await Promise.all(
                response.records.map(async (record) => {
                    return await record.data.json();
                })
            );
            console.log(userInfo, "I received user info");
            return userInfo;
        } else {
            console.log("error", response.status);
        }
    };

    const deleteUserInfo = async (web5) => {
        const response = await web5.dwn.records.delete({
            message: {
                filter: {
                    protocol: "https://example.com/expense-protocol",
                    schema: "https://example.com/userInfo",
                },
            },
        });
    }

    const constructExpense = (expense) => {
        const currentDate = new Date().toLocaleDateString();
        const currentTime = new Date().toLocaleTimeString();
        return {
            ...expense,
            timestamp: `${currentDate} ${currentTime}`,
        }
    }

    const writeExpenseToDwn = async (expense) => {
        await web5.dwn.records.write({
            data: expense,
            message: {
                protocol: "https://example.com/expense-protocol",
                protocolPath: "expense",
                schema: "https://example.com/expense"
            }
        })

    }

    const fetchExpenses = async (web5) => {
        const response = await web5.dwn.records.query({
            message: {
                filter: {
                    protocol: "https://example.com/expense-protocol",
                    schema: "https://example.com/expense",
                },
            },
        });

        if (response.status.code === 200) {
            const expense = await Promise.all(
                response.records.map(async (record) => {
                    return await record.data.json();
                })
            );
            console.log(expense, "I received expenses");
            return expense;
        } else {
            console.error("error", response.status);
        }
    };

    const registerSubmitHandler = async (e) => {
        e.preventDefault();
        const userInfo = constructUserInfo(registerFormValues);
        await writeUserInfoToDwn(userInfo);
        Object.keys(registerFormValues).forEach(key => registerFormValues[key] = "")
        console.log(registerFormValues)
        setRegisterFormValues(registerFormValues)
        const records = await fetchUserInfo(web5);
        setIsAReturningUser(records.length > 0);
    }

    const expenseSubmitHandler = async (e) => {
        e.preventDefault();
        const expense = constructExpense(expenseFormValues)
        await writeExpenseToDwn(expense);
        Object.keys(expenseFormValues).forEach(key => expenseFormValues[key] = "")
        setExpenseFormValues(expenseFormValues)
        const records = await fetchExpenses(web5);
        setExpenses(records)
    }

    return (
        <div>
            {/*<header>*/}
            {/*    Expense Tracker*/}
            {/*</header>*/}
            <main>
                {
                    isAReturningUser ?
                        <ExpenseTracker onChange={expenseChangeHandler}
                                        values={expenseFormValues}
                                        handleSubmit={expenseSubmitHandler}
                                        expenses={expenses}
                        />
                        :
                        <Register onChange={registerChangeHandler}
                                  values={registerFormValues}
                                  handleSubmit={registerSubmitHandler}
                        />
                }
            </main>
            {/*<footer>*/}
            {/*    Vibranium*/}
            {/*</footer>*/}

        </div>

    )


}
