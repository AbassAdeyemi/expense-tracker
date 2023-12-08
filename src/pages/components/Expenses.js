import ExpenseItem from "@/pages/components/ExpenseItem";

export default function Expenses({expenses, handleDelete}) {
    return (
        <div>
            <div className="expenses card">
                {expenses.length > 0 ? expenses.map(ele =>
                        <ExpenseItem key={ele.id} id={ele.id} date={new Date(ele.date).toDateString()} item={ele.item} amount={ele.amount}
                        handleDelete={handleDelete}/>)
                    :
                    <p>No item found</p>
                }
            </div>
        </div>
    )
}


