import ExpenseDate from "@/pages/components/ExpenseDate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import {
    faTrash
} from "@fortawesome/free-solid-svg-icons";


export default function ExpenseItem({date, item, amount, id, handleDelete}) {
    return (
        <div className="expense-item card">
            <ExpenseDate date={date}/>
            <div className="expense-item__description">
                <h2>{item}</h2>
                <div className="expense-item__price">{amount}</div>

                <FontAwesomeIcon
                    icon={faTrash}
                    style={{ fontSize: 30, color: "#fff", cursor:"pointer" }}
                    onClick = {() => handleDelete(id)}
                />

            </div>

        </div>
    )
}