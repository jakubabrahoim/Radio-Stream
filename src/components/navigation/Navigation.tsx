import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { BiRadio } from "react-icons/bi";
import { IconContext } from 'react-icons';
import Avatar from 'react-avatar';

function Navigation() {

    let [user, setUser] = useState<User | null>(null);
    let [verified, setVerified] = useState(false);
    
    useEffect(function getUserAuth() {
        let auth = getAuth();
        onAuthStateChanged(auth, user => {
            if(user) {
                console.log(user.displayName);
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
    }

    return (
        <nav className='bg-gray-800 h-12'>
            <div className='navWrapper'>
                {
                    user === null && 
                    <div className='navGroupLeft'>
                        <button className='navigationButton'>
                            <a href='/home'>
                                <IconContext.Provider value={{ className: 'text-white px-0.5 w-8 h-8' }}>
                                    <BiRadio/>
                                </IconContext.Provider>
                            </a>
                        </button>
                        <button className='navigationButton'><a href='/home'>Home</a></button>
                        <button className='navigationButton'>Countries</button>
                        <button className='navigationButton'>About</button>
                    </div>
                }
                {
                    user !== null &&
                    <div className='navGroupLeft'>
                        <button className='navigationButton'>
                            <a href='/home'>
                                <IconContext.Provider value={{ className: 'text-white px-0.5 w-8 h-8' }}>
                                    <BiRadio/>
                                </IconContext.Provider>
                            </a>
                        </button>
                        <button className='navigationButton'><a href='/home'>Home</a></button>
                        <button className='navigationButton'>My stations</button>
                        <button className='navigationButton'>Countries</button>
                        <button className='navigationButton'>About</button>
                    </div>
                }
                
                
                {
                    user === null &&
                    <div className='navGroupRight'>
                        <button className='navigationButton'><a href='/login'>Login</a></button>
                        <button className='navigationButton'><a href='/signup'>Sign up</a></button>
                    </div>
                }
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
                                
                                <button className='text-red-400 font-semibold' onClick={signOut}>Sign out</button>
                            </div>
                        </div>

                        
                        
                    </div>
                }

            </div>
        </nav>

    )
}

export default Navigation;