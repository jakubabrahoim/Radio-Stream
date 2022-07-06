import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import Avatar from 'react-avatar';
let logo = require('../../assets/logo.png');

function Navigation() {

    let [user, setUser] = useState<User | null>(null);
    let [verified, setVerified] = useState(false);

    /* Check if user is logged in -> if yes we show avatar */
    useEffect(function getUserAuth() {
        let auth = getAuth();
        onAuthStateChanged(auth, user => {
            if(user) {
                setUser(user);
                if(user.emailVerified) setVerified(true);
                else setVerified(false);
            }
        });
    }, []);

    async function signOut(): Promise<void> {
        let auth = getAuth();
        await auth.signOut();
        setUser(null);

        let homePageLink: HTMLElement = document.createElement('a');
        homePageLink.setAttribute('id', 'navigateHome');
        homePageLink.setAttribute('href', '/home');
        homePageLink.click();
    }

    return (
        <nav className='bg-gray-800 h-12 sticky top-0'>
            <div className='navWrapper'>
                {/* Left side navigation - not logged in */}
                {
                    user === null && 
                    <div className='navGroupLeft'>
                        <div className='navigationLogo'>
                            <img src={logo} alt='logo' className='w-5 h-5'/>
                        </div>
                        <Link className='navigationButton' to='/home'>Home</Link>
                        <Link className='navigationButton' to='/countries'>Countries</Link>
                        <Link className='navigationButton' to='/#'>About</Link>
                    </div>
                }
                {/* Left side navigation - logged in */}
                {
                    user !== null &&
                    <div className='navGroupLeft'>
                        <div className='navigationLogo'>
                            <img src={logo} alt='logo' className='w-5 h-5'/>
                        </div>
                        <Link className='navigationButton' to='/home'>Home</Link>
                        <Link className='navigationButton' to='/#'>My stations</Link>
                        <Link className='navigationButton' to='/countries'>Countries</Link>
                        <Link className='navigationButton' to='/#'>About</Link>
                    </div>
                }
                {/* Right side navigation - not logged in */}
                {
                    user === null &&
                    <div className='navGroupRight'>
                        <Link className='navigationButton' to='/login'>Login</Link>
                        <Link className='navigationButton' to='/signup'>Sign up</Link>
                    </div>
                }
                {/* Right side navigation - logged in */}
                {
                    user !== null &&
                    <div className='navGroupRight'>
                        <div className='avatar'>
                        {
                            user.providerData[0].providerId === 'google.com' ?
                            <Avatar name={user.displayName!} size='35' round={true}/> :
                            <Avatar name={user.email!} size='35' round={true}/>
                        }
                            <div className='dropdown'>
                                <p className='border-b border-black pb-2 mb-1'>
                                    Hello, <br/> {user.displayName === null ? user.email!.split('@')[0] : user.displayName} {verified ? '' : ' (not verified)'}
                                </p>
                                
                                <button className='text-red-400 font-semibold hover:text-red-500 hover:font-bold' onClick={signOut}>Sign out</button>
                            </div>
                        </div> 
                    </div>
                }
            </div>
        </nav>
    )
}

export default Navigation;