import React from "react";
import { Pie } from "react-chartjs-2";

export default function PieChart({ chartData }) {
    const data = chartData? chartData : {labels: [], datasets: [] }
    return (
        <div className="chart-container">

            <Pie
                data={data}
                // options={{
                //     plugins: {
                //         title: {
                //             display: true,
                //             text: "Spending Analysis"
                //         }
                //     }
                // }}
            />
        </div>
    );
}