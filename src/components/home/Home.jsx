import { useEffect, useState } from "react";
import axios from "axios";

import { IconContext } from "react-icons";
import { BiRadio } from "react-icons/bi";

function Home() {

    let [stations, setStations] = useState([]);

    useEffect(() => {        
        axios.get('https://geolocation-db.com/json/')
        .then(response => {
            let userLocation = response.data.country_name;

            return fetch(`https://at1.api.radio-browser.info/json/stations/bycountry/${userLocation}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'radio-sh web app'
                }
            })
        })
        .then(response => response.json())
        .then(response => {
            // Sort the response by click count in descending order
            response.sort((a, b) => b.clickcount - a.clickcount);

            // Take top 5 stations by click count
            let topStations = response.slice(0, 5);
            console.log(topStations);
            setStations(topStations);
        })
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
                                <div className='mx-6 h-60 w-60 border rounded-lg grid grid-row-3 justify-items-center' key={index}>
                                    <p className='w-60 text-center'>{station.name}</p>
                                    {
                                        station.favicon !== '' ?
                                        <img src={station.favicon} alt='station icon' className='w-28'></img> :
                                        <IconContext.Provider value={{ className: 'text-gray-500 w-28 h-28' }}>
                                            <BiRadio/>
                                        </IconContext.Provider>

                                    }
                                    
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