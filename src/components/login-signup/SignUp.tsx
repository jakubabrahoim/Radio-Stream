function SignUp() {

    return (
        <article>
            <section className='formWrapper'>
                <form>
                    <h1 className='formHeading'>Create a new account</h1>
                    <label className='inputLabel'>First name:</label><br/>
                    <input type='text' className='formInput' name='firstName'/><br/>
                    <label className='inputLabel'>Last name:</label><br/>
                    <input type='text' className='formInput' name='lastName'/><br/>
                    <label className='inputLabel'>Email:</label><br/>
                    <input type='email' className='formInput' name='email'/><br/>
                    <input type='submit' className='submitButton' value='Create account'/>
                </form>
            </section>
        </article>
    )
}

export default SignUp;