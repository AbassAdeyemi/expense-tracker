
export default function ExpenseForm({onChange, values, handleSubmit}) {

    return (
        <form onSubmit={handleSubmit}>
            <div className="new-expense__controls">
                <div className="new-expense__control">
                    <label>Item</label>
                    <input type="text" name="item" value={values.item} onChange={onChange} required/>
                </div>
                <div className="new-expense__control">
                    <label>Amount</label>
                    <input type="number" name="amount" value={values["amount"]} min="0" onChange={onChange}/>
                </div>
                <div className="new-expense__control">
                    <label>Date</label>
                    <input type="date"  name="date" value={values["date"]} onChange={onChange}/>
                </div>
                <div className="new-expense__control">
                    <label>Category</label>
                    <select  name="category" value={values["category"]} onChange={onChange}>
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