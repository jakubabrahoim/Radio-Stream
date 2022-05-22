import { useState } from 'react';
import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, sendEmailVerification, signInWithPopup} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';


interface Props {
    firebaseApp: any;
}

function SignUp(props: Props) {
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    //let {user, setUser} = useContext(UserContext);
        
    const auth = getAuth(props.firebaseApp);
    let navigate = useNavigate();

    let [passwordInput, setPasswordInput] = useState('');
    let [confirmPasswordInput, setConfirmpasswordInput] = useState('');
    let [isPasswordValid, setIsPasswordValid] = useState(true);
    let [passwordMatch, setPasswordMatch] = useState(true);
    let [registration, setRegistration] = useState('notRegistered');

    function handlePasswordChange(event: any) {
        setPasswordInput(event.target.value);
    }

    function handleConfirmPasswordChange(event: any) {
        setConfirmpasswordInput(event.target.value);
    }

    async function handleSubmit(event: any) {
        event.preventDefault();

        // Validate entered password - one uppercase, one lowercase, one number
        let passwordRegex: RegExp = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/g
        let passwordValidation: boolean = passwordRegex.test(passwordInput);

        if(passwordValidation === false) {
            setIsPasswordValid(false);
            return; 
        }
        else setIsPasswordValid(true);

        if(passwordInput !== confirmPasswordInput) {
            setPasswordMatch(false);
            return;
        } 
        else setPasswordMatch(true);

        let email: string = event.target.email.value;

        let firebaseSignUp;
        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            firebaseSignUp = await createUserWithEmailAndPassword(auth, email, passwordInput);
            // @ts-ignore
            await sendEmailVerification(auth.currentUser);
            setRegistration('registeredNotVerified');
        } catch (error) {
            setRegistration('emailExists');
            return;
        }
    }

    async function handleGoogleSubmit() {
        let provider = new GoogleAuthProvider();
        let auth = getAuth();

        try {
            await signInWithPopup(auth, provider);
            navigate('/home');
        } catch (error) {}

    }

    return (
        <article className='signUpContainer'>
            <section className='formWrapper'>
                <form className='form' onSubmit={handleSubmit}>
                    <h1 className='formHeading'>Create a new account</h1>

                    <label className='inputLabel'>Email</label>
                    <input type='email' name='email' required/>

                    <label className='inputLabel'>Password</label>
                    <input className={isPasswordValid && passwordMatch ? 'formPassword' : 'formPasswordIncorrect'} type='password' name='password' value={passwordInput} onChange={handlePasswordChange} required></input>
                    {
                        isPasswordValid === false && 
                        <p className='w-56 mt-1 text-left text-red-400 text-xs'>
                            * Password must have:<br/>
                            - at least 8 characters<br/>
                            - at least one uppercase character<br/>
                            - at least one lowercase character<br/>
                            - at least one number
                        </p>
                    }

                    <label className='inputLabel'>Confirm password</label>
                    <input className={passwordMatch ? 'formPassword' : 'formPasswordIncorrect'} type='password' name='confirmPassword' value={confirmPasswordInput} onChange={handleConfirmPasswordChange} required></input>
                    {
                        passwordMatch === false && 
                        <p className='w-56 mt-1 text-left text-red-400 text-xs'>
                            * Passwords must match
                        </p>
                    }
                    {
                        registration === 'emailExists' &&
                        <p className='w-56 mt-1 text-left text-red-400 text-xs'>
                            * Account with this email address <br/> &nbsp; already exists
                        </p>
                    }
                    {
                        registration === 'registeredNotVerified' &&
                        <p className='w-56 mt-1 text-left text-green-400 text-xs'>
                            * Account created. Please check your <br/> &nbsp; email to verify your account
                        </p>
                    }

                    <input type='submit' className='submitButton' value='Create account'/>
                    <label className='my-1'>OR</label>
                </form>
                <form className='form' onSubmit={e => e.preventDefault()}>
                    <input type='submit' className='googleButton' value='Sign up with Google' onClick={handleGoogleSubmit}/>
                    <p>Already have an account? <a href='/login' className='text-blue-500 underline'>Log in</a></p>
                </form>
            </section>
            <section className='imageWrapper'>
                <svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" width="500.20604" height="500.35625" viewBox="0 0 832.20604 500.35625" xmlnsXlink="http://www.w3.org/1999/xlink"><path d="M227.31663,699.06c-.05567-.24512-5.44-24.79785,5.55615-45.19043,10.99609-20.39166,34.46826-29.38477,34.7041-29.47363l1.07275-.40235.25342,1.11817c.05566.24511,5.43994,24.79785-5.55615,45.19043-10.99561,20.39166-34.46826,29.38476-34.7041,29.47363l-1.07325.40234Zm39.86181-72.33783c-4.70166,2.02246-23.25781,10.874-32.54492,28.09668-9.28809,17.22461-6.48584,37.59375-5.59229,42.63086,4.69971-2.01758,23.24854-10.85547,32.54493-28.09668C270.87375,652.1293,268.07248,631.76211,267.17844,626.72213Z" transform="translate(-183.89698 -199.82188)" fill="#f1f1f1"/><path d="M254.94373,663.14907c-19.76056,11.88861-27.371,35.50269-27.371,35.50269s24.42779,4.3388,44.18835-7.54981,27.371-35.50268,27.371-35.50268S274.70429,651.26046,254.94373,663.14907Z" transform="translate(-183.89698 -199.82188)" fill="#f1f1f1"/><path d="M554.19262,472.56441a10.83726,10.83726,0,0,0-10.47951-12.89681l-9.15082-23.01244-15.3409,2.15012,13.37918,32.31652a10.896,10.896,0,0,0,21.59205,1.44261Z" transform="translate(-183.89698 -199.82188)" fill="#9f616a"/><path d="M525.92964,464.47855l-4.75346-11.3351-29.62149-56.38484,1.61062-104.33228.30923-.041c18.954-2.50423,31.77818,84.82857,32.315,88.54784l18.71553,64.00809,4.45518,14.10849Z" transform="translate(-183.89698 -199.82188)" fill="#4b5563"/><polygon points="296.518 484.658 310.92 484.657 317.771 429.106 296.515 429.107 296.518 484.658" fill="#9f616a"/><path d="M476.741,679.77772l28.363-.00114h.00115a18.07611,18.07611,0,0,1,18.07514,18.07485v.58737l-46.43846.00172Z" transform="translate(-183.89698 -199.82188)" fill="#2f2e41"/><polygon points="164.095 462.715 175.912 470.949 213.294 429.291 195.854 417.138 164.095 462.715" fill="#9f616a"/><path d="M347.66667,656.57887l23.27053,16.21554.00094.00065a18.07611,18.07611,0,0,1,4.49515,25.16356l-.33583.4819L336.997,671.89089Z" transform="translate(-183.89698 -199.82188)" fill="#2f2e41"/><path d="M472.49955,671.42229l-.62235-104.21007L462.81533,501.686,445.9204,559.31028l-.03285.04733-61.225,88.88515-23.82325-12.07048.13051-.31012c1.45591-3.46284,35.76216-84.7936,44.98333-84.7936a4.97985,4.97985,0,0,0,4.24236-1.86422c2.70645-3.614.50244-11.28284.47983-11.35983-2.63969-10.94588,3.99742-14.67362,5.3193-15.296l3.55555-73.397.36857.02543,96.38955,6.76108-4.04386,91.76589-8.69878,120.23153-.29881.03391Z" transform="translate(-183.89698 -199.82188)" fill="#2f2e41"/><path d="M517.781,472.20177l-.41678-.03391L413.69966,463.8117l.25589-34.29989,5.07382-89.55836.02878-.06216,20.66277-44.85865,14.6473-6.63252,21.37023-1.12461.0521.01307,19.50283,4.83187,20.288,145.63873Z" transform="translate(-183.89698 -199.82188)" fill="#4b5563"/><circle cx="465.99537" cy="251.83011" r="27.29373" transform="translate(-247.58414 54.55847) rotate(-28.66324)" fill="#9f616a"/><path d="M438.54633,258.68144v-10.6343s-8.576-10.10035.85759-12.64464c0,0,2.57278-25.44285,24.87023-13.56952,0,0,30.87339-5.08857,27.443,12.72143,0,0,7.71835-4.64962,5.14556,7.22372L491.88689,260.904s2.40306-12.634-5.31529-14.33024l-4.288-2.54429s-12.00632,11.87334-30.0158-2.54428c0,0-7.71834-1.84217-6.86075,5.79069S438.54633,258.68144,438.54633,258.68144Z" transform="translate(-183.89698 -199.82188)" fill="#2f2e41"/><path d="M463.15358,446.58748a10.83729,10.83729,0,0,0-12.62376-10.80688l-13.13193-20.99672-14.706,4.86818,18.96129,29.391a10.896,10.896,0,0,0,21.50042-2.45556Z" transform="translate(-183.89698 -199.82188)" fill="#9f616a"/><path d="M429.23633,439.96884l-23.75756-48.2346.021-.11726c.09572-.53405,9.659-53.63372,16.97316-73.15156,7.36048-19.64146,17.43552-23.585,17.86078-23.74325l.21263-.07912,9.03379,8.66522-12.51394,83.527,13.489,40.28392Z" transform="translate(-183.89698 -199.82188)" fill="#4b5563"/><rect x="786.20604" width="46" height="46" fill="#f1f1f1"/><rect x="426.20604" y="179" width="46" height="46" fill="#f1f1f1"/><path d="M635.92184,404.66451H999.59653V220.55582H635.92184Z" transform="translate(-183.89698 -199.82188)" fill="#fff"/><path d="M1002.59656,407.66458H632.92176V217.5557h369.6748Zm-363.6748-6h357.6748V223.5557H638.92176Z" transform="translate(-183.89698 -199.82188)" fill="#e5e5e5"/><rect x="495.67778" y="85.31585" width="279.80647" height="9.27916" fill="#e5e5e5"/><rect x="495.67778" y="107.81893" width="279.80647" height="9.27916" fill="#e5e5e5"/><rect x="723.48425" y="141.04542" width="52" height="8.05267" fill="#4b5563"/><path d="M565.897,700.13773h-381a1,1,0,1,1,0-2h381a1,1,0,0,1,0,2Z" transform="translate(-183.89698 -199.82188)" fill="#cbcbcb"/></svg>
            </section>
            <div className="bg-[url('https://svgshare.com/i/hcM.svg')] fixed bottom-20 w-screen h-56"> &nbsp;
            </div>
        </article>
    )
}

export default SignUp;