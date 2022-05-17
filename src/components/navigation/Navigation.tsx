function Navigation() {
    
    return (
        <nav className='bg-gray-800 h-12'>
            <div className='navWrapper'>
                <div className='navGroupLeft'>
                    <button className='navigationButton'>Home</button>
                    <button className='navigationButton'>Countries</button>
                    <button className='navigationButton'>About</button>
                </div>
                <div className='navGroupRight'>
                    
                    <button className='navigationButton'><a href='/login'>Login</a></button>
                    <button className='navigationButton'><a href='/signup'>Sign up</a></button>
                </div>
            </div>
        </nav>

    )
}

export default Navigation;