import {useEffect, useState} from "react";
import {Web5} from "@web5/api";
import {AnalyticsHelper} from "@/pages/helpers/AnalyticsHelper";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import dayjs from "dayjs";
import PieChart from "@/pages/components/PieChart";

Chart.register(CategoryScale);

export default function Analytics({}) {

    const [web5, setWeb5] = useState(null)
    const [did, setDid] = useState(null)
    const [insight, setInsight] = useState("")
    const [formValues, setFormValues] = useState({
        fromDate: "",
        toDate: ""
    })

    const [chartData, setChartData] = useState({labels: [], datasets: [] });

    useEffect(() => {
        const initWeb5 = async () => {
            const {web5, did} = await Web5.connect();
            setWeb5(web5);
            setDid(did);

            if(web5 && did) {
                const statement = await AnalyticsHelper.getInsight(web5)
                setInsight(statement.budgetStatement)
            }
        };
        initWeb5();
    }, [])

    const onChange = (e) => {
        setFormValues({...formValues, [e.target.name]: e.target.value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const from = dayjs(formValues.fromDate).format('YYYY-MM-DDTHH:mm:ss.SSS000')
        const to = dayjs(formValues.toDate).format('YYYY-MM-DDTHH:mm:ss.SSS000')
        const records = await AnalyticsHelper.fetchExpenseData(web5, from, to)
        setChartData({
            labels: records.map((data) => data.category),
            datasets: [
                {
                    label: "Expense Analysis",
                    data: records.map((data) => data.amount),
                    backgroundColor: [
                            "rgba(75,192,192,1)",
                        "#ecf0f1",
                    "#50AF95",
                    "#f3ba2f",
                    "#2a71d0"
            ],
            borderColor: "black",
            borderWidth: 2
        }
    ]
    })
    }

        return (
            <div className='date_chart'>
                <div className="texts">
                    <h3>{insight}</h3>


                </div>
                <div>

                    <h5>Check your monthly budget using the date below</h5>
                    <form className="from_To" onSubmit={handleSubmit}>
                        <div className="from formInput" >
                            <h4>FROM</h4>
                            <input type="date" name="fromDate" value={formValues["fromDate"]} onChange={onChange}/>
                        </div>
                        <div className="to formInput">
                            <h4>TO</h4>
                            <input type="date" name="toDate" value={formValues["toDate"]} onChange={onChange}/>
                        </div>

                            <button className='registerButton analytics_button'>Submit</button>

                    </form>

                </div>

                <div className="pie">
                    <PieChart chartData={chartData}></PieChart>
                </div>
            </div>

        )
}