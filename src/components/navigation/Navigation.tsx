import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import Avatar from 'react-avatar';

import { BiRadio } from "react-icons/bi";
import { IconContext } from 'react-icons';
let logo = require('../../assets/logo.png');

function Navigation() {

    let [user, setUser] = useState<User | null>(null);
    let [verified, setVerified] = useState(false);

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

    async function signOut() {
        let auth = getAuth();
        await auth.signOut();
        setUser(null);

        let homePageLink: HTMLElement = document.createElement('a');
        homePageLink.setAttribute('id', 'navigateHome');
        homePageLink.setAttribute('href', '/home');
        homePageLink.click();
    }

    return (
        <nav className='bg-gray-800 h-12'>
            <div className='navWrapper'>
                {/* Left side navigation - not logged in */}
                {
                    user === null && 
                    <div className='navGroupLeft'>
                        <div className='navigationLogo'>
                            <img src={logo} alt='logo' className='w-5 h-5'/>
                        </div>
                        <a className='navigationButton' href='/home'>Home</a>
                        <a className='navigationButton' href='/#'>Countries</a>
                        <a className='navigationButton' href='/#'>About</a>
                    </div>
                }
                {/* Left side navigation - logged in */}
                {
                    user !== null &&
                    <div className='navGroupLeft'>
                        <div className='navigationButton'>
                            <IconContext.Provider value={{ className: 'text-white px-0.5 w-8 h-8' }}>
                                <BiRadio/>
                            </IconContext.Provider>
                        </div>
                        <a className='navigationButton' href='/home'>Home</a>
                        <a className='navigationButton' href='/#'>My stations</a>
                        <a className='navigationButton' href='/#'>Countries</a>
                        <a className='navigationButton' href='/#'>About</a>
                    </div>
                }
                {/* Right side navigation - not logged in */}
                {
                    user === null &&
                    <div className='navGroupRight'>
                        <a className='navigationButton' href='/login'>Login</a>
                        <a className='navigationButton' href='/signup'>Sign up</a>
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