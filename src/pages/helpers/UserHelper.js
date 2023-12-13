
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
                    return await record.data.json();
                })
            );
            console.log(userInfo, "I received user info");
          //  setIsAReturningUser(userInfo.length > 0)
            return userInfo;
        } else {
            console.log("error", response.status);
        }
    };

}