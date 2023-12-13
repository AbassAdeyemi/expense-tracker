import * as Yup from 'yup'
import { Formik, Form, Field, ErrorMessage } from "formik";

export default function Register({
    onChange,
    handleSubmit,
    values,
    handleDelete,
    isExistingUser
                                 }) {

    const initialValues = {
        fullname: "",
        alias: "",
        budget: 0
    }
    const RegisterSchema = Yup.object().shape({
        fullname: Yup.string().required("Full Name is required"),
        alias: Yup.string().required("Nickname is required"),
        budget: Yup.number().min(1, "Budget must me greater than zero").required("Budget is required")
    })

    const formValues = values? values : {
        "fullname": "",
        "alias": "",
        "budget": "",
        "currency": ""
    }

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={RegisterSchema}
            onSubmit={(values) => {
                console.log(values);
            }}
        >
            {(formik) => {
                const { errors, touched, isValid, dirty } = formik;

    return (
        <div className='register'>
            <form className='registerForm' onSubmit={handleSubmit}>
                <div className='formInput'>

                    <div className="form-row">
                       <label htmlFor="fullname"></label>
                        <Field className= {errors.fullname && touched.fullname ?
                            "input-error" : null} id= 'registerInput' name='fullname' type='text' placeholder='Full Name' value={formValues['fullname']} onChange={onChange} />
                        <ErrorMessage name="fullname" component="span" className="error" />
                    </div>


                    <div className="form-row">
                        <label htmlFor="alias"></label>
                        <Field className= {errors.alias && touched.alias ?
                            "input-error" : null} id= 'registerInput' name='alias' type='text' placeholder='Nickname' value={formValues['alias']} onChange={onChange} />
                        <ErrorMessage name="alias" component="span" className="error" />
                    </div>

                    <div className="form-row">
                        <label htmlFor="budget"></label>
                        <Field className= {errors.budget && touched.budget ?
                            "input-error" : null} id= 'registerInput' name='budget' type='number' placeholder='Budget' value={formValues['budget']} onChange={onChange} />
                        <ErrorMessage name="budget" component="span" className="error" />
                    </div>


                    <div className="form-row">
                        <label htmlFor="currency"></label>
                        <Field as='select' id='registerInput' name='currency'  value={formValues['currency']} onChange={onChange} >
                            <option value="" disabled selected hidden>Choose a currency...</option>
                        <option value="NGN">NGN</option>
                        <option value="USD">USD</option>
                    </Field>
                    </div>


                    {/*<input className='registerInput' name='alias' type='text' placeholder='Nickname' value={values['alias']} onChange={onChange} />*/}
                    {/*<input className='registerInput' name='budget' type='number' placeholder='Budget' value={values['budget']} onChange={onChange} />*/}
                    {/*<select  className='registerInput' name="currency"  value={values["currency"]} onChange={onChange}>*/}
                    {/*    <option value="" disabled selected hidden>Choose a currency...</option>*/}
                    {/*    <option value="NGN">NGN</option>*/}
                    {/*    <option value="USD">USD</option>*/}
                    {/*</select>*/}
                </div>

                <button className="registerButton">Register</button>

            </form>
            { isExistingUser ?
                <div className="del_user">
                    <button onClick={handleDelete}>Delete your existing info</button>
                </div>
                : <p></p>
            }
        </div>

    )
            }}
        </Formik>
            )
}