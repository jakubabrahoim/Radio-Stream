import { useEffect, useState } from "react";

interface Props {
    country: Object
}

function Home(props: Props) {

    let [stations, setStations] = useState([]);

    useEffect(() => {
        fetch(`https://at1.api.radio-browser.info/json/stations/bycountry/slovakia?limit=6`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'radio-sh web app'
            }
        })
        .then(response => response.json())
        .then(response => {console.log(response); setStations(response)})
        .catch(error => console.error(error));
    }, []);
    
    return (
        <>
            <article className='grid grid-flow-row grid-rows-2 justify-items-center align-middle mb-16'>
                <section className='self-center my-6'>
                    <h1 className='text-3xl'>Welcome to Radio-sh</h1>
                </section>
                
                <section className='self-center'>
                    <form className='flex flex-row' onSubmit={e => e.preventDefault()}>
                        <input className='w-96 h-12 mr-4 px-2 border rounded-lg drop-shadow-md' type='text' placeholder='Search for radio stations...'></input>
                        <input className='w-24 px-2 text-white bg-gray-800 hover:bg-gray-700 hover:cursor-pointer rounded-lg drop-shadow-md' type='submit' name="search" value='Search'></input>
                    </form>
                </section>
                
            </article>
            
            <h1 className='text-center mb-10 text-xl'>Popular stations from your country</h1>

            <article className='grid grid-flow-row grid-rows-1 justify-center align-middle'>
                <section className='flex flex-row items-center'>
                    {
                        stations.map((station, index) => {
                            return (
                                <div className='mx-6 h-60 w-60 border rounded-lg grid grid-row-3 justify-items-center'>
                                    <p className='w-60 text-center'>{station.name}</p>
                                    <img src={station.favicon} alt='station icon' className='w-28'></img>
                                    <button>Play</button>
                                </div>
                            )
                        })
                    }
                </section>
            </article>
            
        </>
    )
}

export default Home;