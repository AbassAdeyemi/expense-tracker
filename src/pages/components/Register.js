import {Input} from "@/pages/components/Input";

export default function Register({
    onChange,
    handleSubmit,
    values,
                                 }) {

    const inputs =[
        {
            id:1,
            name:"fullname",
            type:"text",
            placeholder:"Full Name",
            title:"Fullname should be letters only without any special character!",
            label:"fullname",
            pattern:"^[a-zA-Z]+$",
            required:true
        },

        {
            id:2,
            name:"alias",
            type:"text",
            placeholder:"Nickname",
         //   errorMessage:"alias should be 4-10 characters",
            label:"Nickname",
            required:true

        },

        {
            id:3,
            name:"salary",
            type:"number",
            placeholder:"Salary",
            title:"salary should be a valid number",
            label:"Salary",
            pattern:"^[1-9][0-9]*$",
            required:true
        },

        {
            id:4,
            name:"budget",
            type:"number",
            placeholder:"Budget",
            title:"budget should be a valid number",
            pattern:"^[1-9][0-9]*$",
            required:true,
            label:"Budget"

        },

    ]

    return (
        <div className='register'>
            <form onSubmit={handleSubmit}>
                {inputs.map((input)=>(
                        <Input key={input.id} {...input} value={values[input.name]} onChange={onChange} />

                    )
                )}

                <button>Register</button>

            </form>
        </div>

    )
}