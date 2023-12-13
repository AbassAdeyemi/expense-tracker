import {Web5} from "@web5/api";
import {useEffect, useState} from "react";
import Register from "@/pages/components/Register";
import {UserHelper} from "@/helpers/UserHelper";
import Router from "next/router";

export default function Home() {
    const [web5, setWeb5] = useState(null)
    const [did, setDid] = useState(null)
    const [protocolInstalled, setProtocolInstalled] = useState(false)

    const [formValues, setFormValues]
        = useState({
        fullname: "",
        alias: "",
        budget: "",
        currency: ""
    })


    const onChange = (e) => {
        setFormValues({...formValues, [e.target.name]: e.target.value})
    }

    useEffect(() => {
        const initWeb5 = async () => {
            const {web5, did} = await Web5.connect();
            setWeb5(web5);
            setDid(did);

            if (web5 && did) {
                await configureProtocol(web5, did);
            }
        };
        initWeb5();
    }, [])


    const defineProtocol = () => {
        return {
            protocol: "https://example.com/expense-protocol",
            published: true,
            types: {
                userInfo: {
                    schema: "https://example.com/userInfo",
                    dataFormats: ["application/json"]
                },
                expense: {
                    schema: "https://example.com/expense",
                    dataFormats: ["application/json"]
                }
            },
            structure: {
                userInfo: {
                    $actions: [
                        {who: "author", of: "userInfo", can: "write"},
                        {who: "author", of: "userInfo", can: "read"}
                    ]
                },
                expense: {
                    $actions: [
                        {who: "author", of: "expense", can: "write"},
                        {who: "anyone", can: "read"}
                    ]
                }
            }
        }
    }

    const queryForProtocol = async (web5) => {
        return web5.dwn.protocols.query({
            message: {
                filter: {
                    protocol: "https://example.com/expense-protocol"
                }
            }
        })
    }

    const installProtocolLocally = async (web5, protocolDefinition) => {
        return web5.dwn.protocols.configure({
            message: {
                definition: protocolDefinition,
            },
        });
    };


    const configureProtocol = async (web5) => {
        if (protocolInstalled) return;

        const protocolDefinition = defineProtocol();
        const {protocols, status} = await queryForProtocol(web5);

        if (status.code !== 200 || protocols.length === 0) {
            const {protocol, status} = await installProtocolLocally(web5, protocolDefinition);
            setProtocolInstalled(true);
            console.log("Protocol installed locally", protocol, status);

            await protocol.send(did);
        }
    }

    const handleDelete = async (e) => {
        const records = await UserHelper.fetchUserInfo(web5);
        for(const record of records) {
            await UserHelper.deleteUserInfo(web5, record.id)
        }
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        const userInfo = UserHelper.constructUserInfo(formValues);
        await UserHelper.writeUserInfoToDwn(web5, userInfo);
        Object.keys(formValues).forEach(key => formValues[key] = "")
        setFormValues(formValues)
        const records = await UserHelper.fetchUserInfo(web5);
        if(records.length > 0) {
            await Router.push("/expenses")
        }
    }

    return (
        <div>
                <Register onChange={onChange}
                          values={formValues}
                          handleSubmit={handleSubmit}
                          handleDelete={handleDelete}
                />

        </div>

    )


}
