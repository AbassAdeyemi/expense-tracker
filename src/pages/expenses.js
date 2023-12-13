import ExpenseForm from "@/pages/components/ExpenseForm";
import ExpenseItems from "@/pages/components/ExpenseItems";
import Router from "next/router";
import {useState, useEffect} from "react";
import {Web5} from "@web5/api";
import {ExpenseHelper} from "@/helpers/ExpenseHelper";

export default function Expenses() {

    const [web5, setWeb5] = useState(null)
    const [did, setDid] = useState(null)
    const [expenses, setExpenses] = useState([])

    const [formValues, setFormValues] = useState({
        item: "",
        amount: "",
        date: "",
        category: ""
    })

    const onChange = (e) => {
        setFormValues({...formValues, [e.target.name]: e.target.value})
    }

    useEffect(() => {
        const initWeb5 = async () => {
            const {web5, did} = await Web5.connect();
            setWeb5(web5);
            setDid(did);

            if (web5 && did) {
                const expenseRecords = await ExpenseHelper.fetchExpenses(web5)
                setExpenses(expenseRecords)
            }
        };
        initWeb5();
    }, [])

    const deleteExpense = async (recordId) => {
        const remainingRecords = await ExpenseHelper.deleteExpense(web5, recordId)
        setExpenses(remainingRecords);
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        const expense = ExpenseHelper.constructExpense(formValues)
        await ExpenseHelper.writeExpenseToDwn(web5, expense);
        Object.keys(formValues).forEach(key => formValues[key] = "")
        setFormValues(formValues)
        const records = await ExpenseHelper.fetchExpenses(web5);
        setExpenses(records)
    }

    return <div>
        <div className="new-expense">
            <ExpenseForm handleSubmit={onSubmit} onChange={onChange} values={formValues}/>
            <ExpenseItems expenses={expenses} handleDelete={deleteExpense}/>
        </div>
    </div>
}