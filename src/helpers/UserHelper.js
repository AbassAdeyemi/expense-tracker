
export class UserHelper {

    static constructUserInfo = (userInfo) => {
        const currentDate = new Date().toLocaleDateString();
        const currentTime = new Date().toLocaleTimeString();
        return {
            ...userInfo,
            timestamp: `${currentDate} ${currentTime}`,
        }
    }

    static writeUserInfoToDwn = async (web5, userInfo) => {
        const existing = await UserHelper.fetchUserInfo(web5)
        if(existing.length > 0) {
          return;
        }
        await web5.dwn.records.write({
            data: userInfo,
            message: {
                protocol: "https://example.com/expense-protocol",
                protocolPath: "userInfo",
                schema: "https://example.com/userInfo"
            }
        })

    }

    static fetchUserInfo = async (web5) => {
        const response = await web5.dwn.records.query({
            message: {
                filter: {
                    protocol: "https://example.com/expense-protocol",
                    schema: "https://example.com/userInfo",
                },
            },
        });

        if (response.status.code === 200) {
            const userInfo = await Promise.all(
                response.records.map(async (record) => {
                    const data = await record.data.json();
                    return {...data, id: record.id}
                })
            );
            console.log(userInfo, "I received user info");
            return userInfo;
        } else {
            console.log("error", response.status);
        }
    };

    static deleteUserInfo = async (web5, recordId) => {
        await web5.dwn.records.delete({
            message: {
                recordId: recordId
            }
        })
    }

}