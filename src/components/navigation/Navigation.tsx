import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, User } from "firebase/auth";


function Navigation() {

    let [user, setUser] = useState<User | null>(null);
    let [verified, setVerified] = useState(false);
    
    useEffect(() => {
        let auth = getAuth();
        onAuthStateChanged(auth, user => {
            if(user) {
                //console.log(user);
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
                        <button className='navigationButton'><a href='/home'>Home</a></button>
                        <button className='navigationButton'>Countries</button>
                        <button className='navigationButton'>About</button>
                    </div>
                }
                {
                    user !== null &&
                    <div className='navGroupLeft'>
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
                        <button className='text-white text-center cursor-default'>
                            Hello {user.email} {verified ? '' : ' (not verified)'}
                        </button>
                        <button className='navigationButton' onClick={signOut}>Sign out</button>
                    </div>
                }

            </div>
        </nav>

    )
}

export default Navigation;