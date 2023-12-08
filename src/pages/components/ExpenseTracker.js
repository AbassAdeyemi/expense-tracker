import ExpenseForm from "@/pages/components/ExpenseForm";
import Expenses from "@/pages/components/Expenses";

export default function ExpenseTracker({onChange, handleSubmit, values, expenses, handleDelete} ) {
    return <div>
        <div className="new-expense">
            <ExpenseForm handleSubmit={handleSubmit} onChange={onChange} values={values}/>
            <Expenses expenses={expenses} handleDelete={handleDelete}/>
        </div>
    </div>
}