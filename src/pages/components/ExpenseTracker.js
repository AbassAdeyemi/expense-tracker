import ExpenseForm from "@/pages/components/ExpenseForm";
import Expenses from "@/pages/components/Expenses";

export default function ExpenseTracker({onChange, handleSubmit, values, expenses} ) {
   // console.log(values)
    return <div>
        <div className="new-expense">
            <ExpenseForm handleSubmit={handleSubmit} onChange={onChange} values={values}/>
            <Expenses expenses={expenses}/>
        </div>
    </div>
}