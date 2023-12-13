import ExpenseItem from "@/pages/components/ExpenseItem";

export default function ExpenseItems({expenses, handleDelete}) {
    const items = expenses? expenses : []
    return (
        <div>
            <div className="expenses card">
                {items.length > 0 ? items.map(ele =>
                        <ExpenseItem key={ele.id} id={ele.id} date={new Date(ele.date).toDateString()} item={ele.item} amount={ele.amount}
                        handleDelete={handleDelete}/>)
                    :
                    <p>No item found</p>
                }
            </div>
        </div>
    )
}


