
export class ExpenseHelper {

       static constructExpense = (expense) => {
        const currentDate = new Date().toLocaleDateString();
        const currentTime = new Date().toLocaleTimeString();
        return {
            ...expense,
            timestamp: `${currentDate} ${currentTime}`,
        }
    }

     static writeExpenseToDwn = async (web5, expense) => {
        await web5.dwn.records.write({
            data: expense,
            message: {
                protocol: "https://example.com/expense-protocol",
                protocolPath: "expense",
                schema: "https://example.com/expense",
            }
        })

    }

    static fetchExpenses = async (web5) => {
        const response = await web5.dwn.records.query({
            message: {
                filter: {
                    protocol: "https://example.com/expense-protocol",
                    schema: "https://example.com/expense",
                },
                pagination: {
                    limit: 5
                },
                dateSort: 'createdDescending'
            }
        });

        if (response.status.code === 200) {
            const expenses = await Promise.all(
                response.records.map(async (record) => {
                    const data = await record.data.json();
                    return {...data, id: record.id}
                })
            );
            console.log(expenses, "I received expenses");
            return expenses;
        } else {
            console.error("error", response.status);
        }
    };

    static deleteExpense = async (web5, recordId) => {
        await web5.dwn.records.delete({
            message: {
                recordId: recordId
            }
        })
        return ExpenseHelper.fetchExpenses(web5);
    }


}