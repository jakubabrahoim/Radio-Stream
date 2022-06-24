import { useNavigate } from 'react-router-dom';

function BadRequest() {
    
    let navigate = useNavigate();

    function navigateHome(): void {
        navigate('/');
    }
    
    return (
        <article className='flex flex-col items-center mt-40'>
            <h1 className='font-black text-9xl text-gray-300'>400</h1>
            <h2 className='font-black text-3xl mt-4'>Bad request</h2>
            <p className='font-medium text-lg mt-2'>Something went wrong.</p>
            <button className='bg-gray-800 hover:bg-gray-700 text-white rounded-lg px-2 py-1 mt-4' onClick={navigateHome}>Take me back home</button>
        </article>
    )
}

export default BadRequest;