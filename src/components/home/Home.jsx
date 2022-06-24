import { useEffect, useState, useContext } from "react";
import { CurrentRadioContext } from "../../App";
import { IconContext } from "react-icons";
import { BiRadio } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

function Home() {

    let { setCurrentRadioStation } = useContext(CurrentRadioContext);
    
    let [stations, setStations] = useState([]);
    let [geolocationEnabled, setGeolocationEnabled] = useState(true);
    let [searchInput, setSearchInput] = useState('');

    let navigate = useNavigate();

    /* Get user location and top 5 stations from users country */
    useEffect(() => {        
        fetch('https://geolocation-db.com/json/')
        .then(response => response.json())
        .then(response => {
            let userLocation = response.country_name;

            return fetch(`https://at1.api.radio-browser.info/json/stations/bycountry/${userLocation}?hidebroken=true&order=clickcount&limit=5&reverse=true`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'radio-sh.web.app'
                }
            })
        })
        .then(response => response.json())
        .then(response => {
            setStations(response);
        })
        .catch(_error => setGeolocationEnabled(false));
    }, []);

    function handleSearchInputChange(event: ChangeEvent<HTMLInputElement>): void {
        setSearchInput(event.target.value);
    }

    /** Fetch radio station on search submit */
    function fetchRadioStations(event: Event): void {
        event.preventDefault();

        fetch(`https://at1.api.radio-browser.info/json/stations/byname/${searchInput}?hidebroken=true&order=clickcount&reverse=true`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'radio-sh.web.app',
            }
        })
        .then(response => response.json())
        .then(response => {
            navigate(`/search-result?query=${searchInput}`, { state: { stations: response } });
        })
        .catch(error => console.log(error));
    }

    function playRadioStation(stationName: string, streamUrl: string, stationThumbnail: string): void {
        setCurrentRadioStation({stationName: stationName, streamUrl: streamUrl, stationThumbnail: stationThumbnail});
    }
    
    return (
        <>
            {/* Heading + search bar */}
            <article className='grid grid-flow-row grid-rows-2 justify-items-center align-middle mb-16'>
                <section className='self-center my-6'>
                    <h1 className='text-3xl'>Welcome to Radio-Stream</h1>
                </section>
                
                <section className='self-center'>
                    <form className='flex flex-row' onSubmit={fetchRadioStations}>
                        <label hidden>Search</label>
                        <input 
                            className='w-[450px] h-12 mr-4 px-2 border rounded-lg outline-none focus:ring-2 focus:ring-gray-800 drop-shadow-md' 
                            type='text' 
                            value={searchInput} 
                            placeholder='Search for radio stations...' 
                            onChange={handleSearchInputChange}
                        />
                        <label hidden>Submit</label>
                        <input 
                            className='w-24 px-2 text-white bg-gray-800 hover:bg-gray-700 hover:cursor-pointer rounded-lg drop-shadow-md' 
                            type='submit' 
                            value='Search'
                            name="search" 
                        />
                    </form>
                </section>
                
            </article>

            <h1 className='text-center mb-10 text-xl'>Popular stations from your country</h1>

            {/* Popular radio stations from country / geo location message */}
            {
                geolocationEnabled ? 

                <article className='grid grid-rows-1 justify-center align-middle'>
                    <section className='flex flex-row items-center'>
                        {
                            stations.map((station, index) => {
                                return (
                                    <div className='mx-6 h-60 w-60 border rounded-lg grid grid-row-3 justify-items-center items-center' key={index}>
                                        <p className='w-60 text-center'>{station.name}</p>
                                        {
                                            station.favicon !== '' ?
                                            <img src={station.favicon} alt='station icon' className='w-28'></img>
                                            :
                                            <IconContext.Provider value={{ className: 'text-gray-500 w-28 h-28' }}>
                                                <BiRadio/>
                                            </IconContext.Provider>
                                        }
                                        <button 
                                            onClick={() => playRadioStation(station.name, station.url, station.favicon)}
                                            className='w-20 h-6 px-2 text-white bg-gray-800 hover:bg-gray-700 hover:cursor-pointer rounded-lg drop-shadow-md'
                                        >
                                            Play
                                        </button>
                                    </div>
                                )
                            })
                        }
                    </section>
                </article>
                
                :

                <article className='grid grid-flow-row grid-rows-1 justify-center align-middle'>
                    <p className='text-lg text-red-400 text-center'>
                        Disable location blockers to see top stations in your country. <br/>
                        Your location is not stored or passed to anyone, we use it strictly to display popular stations from your country.
                    </p>
                </article>
            }            
        </>
    )
}

export default Home;