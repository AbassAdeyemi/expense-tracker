import ExpenseItem from "@/pages/components/ExpenseItem";

export default function Expenses({expenses}) {
    const random = Math.random() + 1
    return (
        <div>
            <div className="expenses card">
                {expenses.length > 0 ? expenses.map(ele =>
                        <ExpenseItem key={random} date={new Date(ele.date).toDateString()} item={ele.item} amount={ele.amount} />)
                    :
                    <p>No item found</p>
                }
            </div>
        </div>
    )
}


