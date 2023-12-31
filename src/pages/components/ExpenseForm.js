
export default function ExpenseForm({onChange, values, handleSubmit}) {
    const formValues = values ?  values : {
        "item": "",
        "amount": "",
        "date": "",
        "category": ""
    }
    return (
        <form onSubmit={handleSubmit}>
            <div className="new-expense__controls">
                <div className="new-expense__control">
                    <input type="text" name="item" placeholder="Item" value={formValues["item"]} onChange={onChange} required/>
                </div>
                <div className="new-expense__control">
                    <input type="number" name="amount" placeholder="Amount" value={formValues["amount"]} min="0" onChange={onChange}/>
                </div>
                <div className="new-expense__control">
                    <input type="date"  name="date" placeholder="Date" value={formValues["date"]} onChange={onChange}/>
                </div>
                <div className="new-expense__control">
                    <select  name="category"  value={formValues["category"]} onChange={onChange}>
                        <option value="" disabled selected hidden>Category</option>
                        <option value="food">Food</option>
                        <option value="housing">Housing</option>
                        <option value="shopping">Shopping</option>
                        <option value="utilities">Utilities</option>
                        <option value="transportation">Transportation</option>
                        <option value="healthcare">Healthcare</option>
                        <option value="other" >Other</option>
                    </select>
                </div>
            </div>
            <div className="new-expense__actions">
                <button>Add Expense</button>
            </div>
        </form>
    )
}