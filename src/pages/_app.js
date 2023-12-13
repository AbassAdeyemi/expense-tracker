import '@/styles/globals.css'
import '@/styles/ExpenseForm.css'
import '@/styles/Expenses.css'
import '@/styles/ExpenseItem.css'
import '@/styles/ExpenseDate.css'
import '@/styles/Analytics.css'
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";

config.autoAddCss = false;

export default function App({ Component, pageProps }) {
    return (
        <>
            <header>
                Expense Tracker
            </header>
            <main>
        <Component {...pageProps} />)
            </main>
            <footer>
                Vibranium
            </footer>
        </>
    )
}