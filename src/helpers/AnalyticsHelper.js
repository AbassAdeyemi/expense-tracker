import {UserHelper} from "@/helpers/UserHelper";
import dayjs from "dayjs";

export class AnalyticsHelper {

    static fetchMonthlyExpenseData = async (web5) => {
        const currentDate = new Date()
        const endDate = dayjs(currentDate).format('YYYY-MM-DDTHH:mm:ss.SSS000')
        currentDate.setDate(1)
        const startDate = dayjs(currentDate).format('YYYY-MM-DDTHH:mm:ss.SSS000')

       return AnalyticsHelper.fetchExpenseData(web5, startDate, endDate)
    };

    static fetchExpenseData = async (web5, startDate, endDate) => {
        const response = await web5.dwn.records.query({
            message: {
                filter: {
                    protocol: "https://example.com/expense-protocol",
                    schema: "https://example.com/expense",
                    dateCreated: {
                        from: startDate + "Z",
                        to: endDate + "Z"
                    }
                },
            }
        });

        if (response.status.code === 200) {
            const expenses = await Promise.all(
                response.records.map(async (record) => {
                    const data = await record.data.json();
                    return {...data, id: record.id}
                })
            );
            console.log("Monthly expense data: ", expenses);
            return expenses;
        } else {
            console.error("error", response.status);
        }
    }

    static getInsight = async (web5) => {
        const expenses = await AnalyticsHelper.fetchMonthlyExpenseData(web5);
        const records = await UserHelper.fetchUserInfo(web5)
        if(records.length === 0) {
            return {
                budgetStatement: ""
            }
        }
        const userInfo = records[0]
        const amountSpent = expenses.map(e => parseFloat(e.amount)).reduce((a, b) => a + b, 0)
        const budgetStatement = AnalyticsHelper.getBudgetInsight(amountSpent, parseFloat(userInfo.budget), userInfo.currency)
        return {
            budgetStatement
        }
    }

    static getBudgetInsight = (amountSpent, monthlyBudget, currency) => {
        if(amountSpent > monthlyBudget) {
            return `You have exceeded your budget!!!. You have spent ${amountSpent} ${currency} so far and your budget is ${monthlyBudget} ${currency}`
        }
        else {
            return `You have spent ${amountSpent} ${currency} so far. You have ${monthlyBudget - amountSpent} ${currency} naira left in your budget`
        }
    }
}