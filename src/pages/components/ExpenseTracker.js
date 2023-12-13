import ExpenseForm from "@/pages/components/ExpenseForm";
import Expenses from "@/pages/components/Expenses";
import Router from "next/router";

export default function ExpenseTracker({onChange, handleSubmit, values, expenses, handleDelete} ) {

    return <div>
        <div className="new-expense">
            <ExpenseForm handleSubmit={handleSubmit} onChange={onChange} values={values}/>
            <Expenses expenses={expenses} handleDelete={handleDelete}/>
            <button onClick={() => Router.push('/components/Analytics')}>Analysis</button>
        </div>
    </div>
}