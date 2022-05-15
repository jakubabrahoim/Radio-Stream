function Navigation() {
    return (
        <nav className='bg-gray-800 h-12'>
            <div className='navWrapper'>
                <div className='basis-5/6 flex justify-start'>
                    <button className='navigationButton'>Home</button>
                    <button className='navigationButton'>Countries</button>
                    <button className='navigationButton'>About</button>
                </div>
                <div className='basis-1/6 flex justify-end'>
                    <button className='navigationButton'>Login</button>
                    <button className='navigationButton'>Register</button>
                </div>
            </div>

            <div className='mx-auto px-2 sm:px-6 lg:px-8 h-12 flex items-center justify-end'>
            </div>
        </nav>
    )
}

export default Navigation;