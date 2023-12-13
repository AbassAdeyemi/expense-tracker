import '@/styles/globals.css'
import '@/styles/ExpenseForm.css'
import '@/styles/Expenses.css'
import '@/styles/ExpenseItem.css'
import '@/styles/ExpenseDate.css'
import '@/styles/Analytics.css'
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import Link from "next/link";

config.autoAddCss = false;

export default function App({ Component, pageProps }) {
    return (
        <>
            <header>
                <navbar>
                    <div className= "nav_title">
                <p>Expense Tracker</p>
                    </div>


                  <ul>
                      <li> <Link href="/">Home</Link> </li>
                      <li> <Link href="/expenses">Expenses</Link> </li>
                      <li> <Link href="/analytics">Analytics</Link> </li>
                  </ul>

                </navbar>

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