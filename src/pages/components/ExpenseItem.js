import ExpenseDate from "@/pages/components/ExpenseDate";

export default function ExpenseItem({date, item, amount}) {
    return (
        <div className="expense-item card">
            <ExpenseDate date={date}/>
            <div className="expense-item__description">
                <h2>{item}</h2>
                <div className="expense-item__price">{amount}</div>
            </div>

        </div>
    )
}