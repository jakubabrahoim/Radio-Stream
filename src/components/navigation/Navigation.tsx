import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import Avatar from 'react-avatar';

import { AiOutlineMenu } from 'react-icons/ai';
import { IconContext } from 'react-icons';
let logo = require('../../assets/logo.png');

function Navigation() {
    let [user, setUser] = useState<User | null>(null);
    let [verified, setVerified] = useState(false);

    let [mobileNavVisibility, setMobileNavVisibility] =
        useState<string>('hidden');

    /* Check if user is logged in -> if yes we show avatar */
    useEffect(function getUserAuth() {
        let auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                if (user.emailVerified) setVerified(true);
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

    function toggleMobileNav(): void {
        setMobileNavVisibility(
            mobileNavVisibility === 'hidden' ? 'visible' : 'hidden'
        );
    }

    return (
        <nav
            className={`bg-gray-800 ${
                mobileNavVisibility === 'visible' ? 'h-52' : 'h-12'
            }  sm:h-12 sticky top-0}`}
        >
            <div className='mx-auto px-2 sm:px-6 lg:px-8 h-12 flex flex-col sm:flex-row items-center'>
                {/* Hamburger menu icon */}
                <button
                    className='self-start visible sm:hidden rounded-md px-2 text-white mt-3 mr-4'
                    onClick={() => toggleMobileNav()}
                    aria-labelledby='menuLabel'
                >
                    <IconContext.Provider value={{ className: 'h-6 w-6' }}>
                        <AiOutlineMenu />
                    </IconContext.Provider>
                    <span id='menuLabel' hidden>
                        Menu
                    </span>
                </button>

                {/* Left side navigation - not logged in */}
                {user === null && (
                    <div
                        className={`basis-3/6 flex flex-col sm:flex-row justify-start items-center
                        ${
                            mobileNavVisibility === 'visible'
                                ? 'visible'
                                : 'invisible'
                        } sm:visible`}
                    >
                        <NavLink
                            data-e2e='navigation-link-home-icon'
                            to='/home'
                        >
                            <div className='mx-2 px-2 flex items-center'>
                                <img
                                    src={logo}
                                    alt='logo'
                                    className='w-5 h-5'
                                />
                            </div>
                        </NavLink>
                        <NavLink
                            data-e2e='navigation-link-home'
                            className='navigationButton'
                            to='/home'
                        >
                            {({ isActive }) => (
                                <span
                                    className={`${isActive && 'text-cyan-200'}`}
                                >
                                    Home
                                </span>
                            )}
                        </NavLink>
                        <NavLink
                            data-e2e='navigation-link-countries'
                            className='navigationButton'
                            to='/countries'
                        >
                            {({ isActive }) => (
                                <span
                                    className={`${isActive && 'text-cyan-200'}`}
                                >
                                    Countries
                                </span>
                            )}
                        </NavLink>
                        {/*<Link className='navigationButton' to='/#'>About</Link>*/}
                    </div>
                )}

                {/* Left side navigation - logged in */}
                {user !== null && (
                    <div
                        className={`basis-3/6 flex flex-col sm:flex-row justify-start items-center
                        ${
                            mobileNavVisibility === 'visible'
                                ? 'visible'
                                : 'invisible'
                        } sm:visible`}
                    >
                        <NavLink
                            data-e2e='navigation-link-home-icon'
                            to='/home'
                        >
                            <div className='mx-2 px-2 flex items-center'>
                                <img
                                    src={logo}
                                    alt='logo'
                                    className='w-5 h-5'
                                />
                            </div>
                        </NavLink>
                        <NavLink
                            data-e2e='navigation-link-home'
                            className='navigationButton'
                            to='/home'
                        >
                            {({ isActive }) => (
                                <span
                                    className={`${isActive && 'text-cyan-200'}`}
                                >
                                    Home
                                </span>
                            )}
                        </NavLink>
                        <NavLink
                            data-e2e='navigation-link-my-stations'
                            className='navigationButton'
                            to='/my-stations'
                        >
                            {({ isActive }) => (
                                <span
                                    className={`${isActive && 'text-cyan-200'}`}
                                >
                                    My Stations
                                </span>
                            )}
                        </NavLink>
                        <NavLink
                            data-e2e='navigation-link-countries'
                            className='navigationButton'
                            to='/countries'
                        >
                            {({ isActive }) => (
                                <span
                                    className={`${isActive && 'text-cyan-200'}`}
                                >
                                    Countries
                                </span>
                            )}
                        </NavLink>
                        {/*<Link className='navigationButton' to='/#'>About</Link>*/}
                    </div>
                )}

                {/* Right side navigation - not logged in */}
                {user === null && (
                    <div
                        className={`basis-3/6 flex flex-col sm:flex-row justify-end items-center
                        ${
                            mobileNavVisibility === 'visible'
                                ? 'visible'
                                : 'invisible'
                        } sm:visible`}
                    >
                        <NavLink
                            data-e2e='navigation-link-login'
                            className='navigationButton'
                            to='/login'
                        >
                            {({ isActive }) => (
                                <span
                                    className={`${isActive && 'text-cyan-200'}`}
                                >
                                    Login
                                </span>
                            )}
                        </NavLink>
                        <NavLink
                            data-e2e='navigation-link-signup'
                            className='navigationButton'
                            to='/signup'
                        >
                            {({ isActive }) => (
                                <span
                                    className={`${isActive && 'text-cyan-200'}`}
                                >
                                    Sign up
                                </span>
                            )}
                        </NavLink>
                    </div>
                )}

                {/* Right side navigation - logged in */}
                {user !== null && (
                    <div
                        className={`basis-3/6 flex flex-col sm:flex-row justify-end items-center
                        ${
                            mobileNavVisibility === 'visible'
                                ? 'visible'
                                : 'invisible'
                        } sm:visible`}
                    >
                        <div
                            data-e2e='navigation-user-avatar'
                            className='avatar'
                        >
                            {user.providerData[0].providerId ===
                            'google.com' ? (
                                <Avatar
                                    name={user.displayName!}
                                    size='35'
                                    round={true}
                                />
                            ) : (
                                <Avatar
                                    name={user.email!}
                                    size='35'
                                    round={true}
                                />
                            )}
                            <div className='dropdown'>
                                <p className='border-b border-black pb-2 mb-1'>
                                    Hello, <br />{' '}
                                    {user.displayName === null
                                        ? user.email!.split('@')[0]
                                        : user.displayName}{' '}
                                    {verified ? '' : ' (not verified)'}
                                </p>

                                <button
                                    data-e2e='navigation-logout-button'
                                    className='text-red-400 font-semibold hover:text-red-500 hover:font-bold'
                                    onClick={signOut}
                                >
                                    Sign out
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navigation;
