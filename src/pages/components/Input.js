export function Input({errorMessage, onChange, id, ...inputProps}) {

  //  const { errorMessage, onChange, id, ...inputProps} =props;
 //   console.log(inputProps)
    return (
        <div className='formInput'>
            <input {...inputProps} onChange={onChange}/>
            {/*<span>{errorMessage}</span>*/}
        </div>
    )
}
