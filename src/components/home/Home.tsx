import { useEffect, useState, useContext, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { CurrentRadioContext } from '../../App';

import { IconContext } from 'react-icons';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import { BiRadio } from 'react-icons/bi';

import { saveLastStation } from '../../helpers/localStorage';

function Home() {
    let { setCurrentRadioStation } = useContext(CurrentRadioContext);

    let [stations, setStations] = useState([]);
    let [geolocationEnabled, setGeolocationEnabled] = useState(true);
    let [searchInput, setSearchInput] = useState('');

    let navigate = useNavigate();

    /* Get user location and top 5 stations from users country */
    useEffect(() => {
        fetch('https://geolocation-db.com/json/')
            .then((response) => response.json())
            .then((response) => {
                let userLocation = response.country_name;

                return fetch(
                    `https://at1.api.radio-browser.info/json/stations/bycountry/${userLocation}?hidebroken=true&order=clickcount&limit=10&reverse=true`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'User-Agent': 'radio-stream.live',
                        },
                    }
                );
            })
            .then((response) => response.json())
            .then((response) => {
                setStations(response);
            })
            .catch((_error) => setGeolocationEnabled(false));
    }, []);

    function handleSearchInputChange(
        event: ChangeEvent<HTMLInputElement>
    ): void {
        setSearchInput(event.target.value);
    }

    /** Fetch radio station on search submit */
    function fetchRadioStations(event: any): void {
        event.preventDefault();

        fetch(
            `https://at1.api.radio-browser.info/json/stations/byname/${searchInput}?hidebroken=true&order=clickcount&reverse=true`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'radio-stream.live',
                },
            }
        )
            .then((response) => response.json())
            .then((response) => {
                navigate(`/search-result?query=${searchInput}`, {
                    state: { stations: response },
                });
            })
            .catch((error) => console.log(error));
    }

    function playRadioStation(
        stationName: string,
        streamUrl: string,
        stationThumbnail: string,
        autoPlay: boolean
    ): void {
        // @ts-ignore
        setCurrentRadioStation({
            stationName: stationName,
            streamUrl: streamUrl,
            stationThumbnail: stationThumbnail,
            autoPlay: autoPlay,
        });
        saveLastStation({
            stationName: stationName,
            streamUrl: streamUrl,
            stationThumbnail: stationThumbnail,
            autoPlay: autoPlay,
        });
    }

    function horizontalScroll(direction: string): void {
        let stationsSection = document.getElementById('popularStations');

        if (direction === 'left') {
            stationsSection?.scrollBy({
                left: -300,
                top: 0,
                behavior: 'smooth',
            });
        } else if (direction === 'right') {
            stationsSection?.scrollBy({
                left: 300,
                top: 0,
                behavior: 'smooth',
            });
        }
    }

    return (
        <>
            {/* Heading + search bar */}
            <article className='grid grid-flow-row grid-rows-2 justify-items-center align-middle mb-8 sm:mb-16'>
                <section className='self-center my-6'>
                    <h1 className='text-center text-2xl font-bold sm:text-3xl'>
                        Welcome to Radio-Stream
                    </h1>
                </section>

                <section className='self-center'>
                    <form
                        className='flex flex-row'
                        onSubmit={fetchRadioStations}
                    >
                        <span id='homeSearchLabel' hidden>
                            Search
                        </span>
                        <input
                            className='w-[250px] sm:w-[450px] h-12 mr-4 px-2 border rounded-lg outline-none focus:ring-2 focus:ring-gray-800 drop-shadow-md'
                            type='text'
                            value={searchInput}
                            placeholder='Search for radio stations...'
                            onChange={handleSearchInputChange}
                            aria-labelledby='homeSearchLabel'
                        />
                        <span id='homeSubmitLabel' hidden>
                            Search
                        </span>
                        <input
                            className='w-24 px-2 text-white bg-gray-800 hover:bg-gray-700 hover:cursor-pointer rounded-lg drop-shadow-md'
                            type='submit'
                            value='Search'
                            name='search'
                            aria-labelledby='homeSubmitLabel'
                        />
                    </form>
                </section>
            </article>

            <h1 className='text-center mb-10 text-xl'>
                Popular stations from your country
            </h1>

            {/* Popular radio stations from country / geo location message */}
            {geolocationEnabled ? (
                <article className='grid grid-cols-12 h-[300px] sm:h-auto justify-center'>
                    <section className='col-span-1 flex flex-row items-center justify-center'>
                        <button
                            data-e2e='home-popular-station-scroll-left-button'
                            onClick={() => horizontalScroll('left')}
                            aria-labelledby='leftArrow'
                        >
                            <IconContext.Provider
                                value={{
                                    className:
                                        'w-6 h-6 text-gray-800 hover:text-gray-500',
                                }}
                            >
                                <AiOutlineLeft />
                            </IconContext.Provider>
                            <span id='leftArrow' hidden>
                                Scroll left
                            </span>
                        </button>
                    </section>
                    <section
                        data-e2e='home-popular-stations-container'
                        id='popularStations'
                        className='col-span-10 flex flex-row items-center overflow-x-auto snap-x mx-1 disableScroll'
                    >
                        {stations.map(
                            (
                                station: {
                                    name: string;
                                    favicon: string;
                                    url: string;
                                },
                                index
                            ) => {
                                return (
                                    <div
                                        className='mx-6 h-60 w-60 border rounded-lg grid grid-row-3 justify-items-center items-center snap-center'
                                        key={index}
                                    >
                                        <p
                                            data-e2e={`home-popular-station-name-${index}`}
                                            className='w-60 text-center'
                                        >
                                            {station.name}
                                        </p>
                                        {station.favicon !== '' ? (
                                            <img
                                                data-e2e={`home-popular-station-logo-${index}`}
                                                src={station.favicon}
                                                alt='station icon'
                                                className='w-28'
                                            ></img>
                                        ) : (
                                            <IconContext.Provider
                                                value={{
                                                    className:
                                                        'text-gray-500 w-28 h-28',
                                                }}
                                            >
                                                <BiRadio
                                                    data-e2e={`home-popular-station-logo-${index}`}
                                                />
                                            </IconContext.Provider>
                                        )}
                                        <button
                                            data-e2e={`home-popular-station-play-button-${index}`}
                                            onClick={() =>
                                                playRadioStation(
                                                    station.name,
                                                    station.url,
                                                    station.favicon,
                                                    true
                                                )
                                            }
                                            className='w-20 h-6 px-2 text-white bg-gray-800 hover:bg-gray-700 hover:cursor-pointer rounded-lg drop-shadow-md'
                                        >
                                            Play
                                        </button>
                                    </div>
                                );
                            }
                        )}
                    </section>
                    <section className='col-span-1 flex flex-row items-center justify-center'>
                        <button
                            data-e2e='home-popular-station-scroll-right-button'
                            onClick={() => horizontalScroll('right')}
                            aria-labelledby='rightArrow'
                        >
                            <IconContext.Provider
                                value={{
                                    className:
                                        'w-6 h-6 text-gray-800 hover:text-gray-500',
                                }}
                            >
                                <AiOutlineRight />
                            </IconContext.Provider>
                            <span id='rightArrow' hidden>
                                Scroll right
                            </span>
                        </button>
                    </section>
                </article>
            ) : (
                <article className='grid grid-flow-row grid-rows-1 justify-center align-middle'>
                    <p className='text-lg text-red-400 text-center'>
                        Disable location blockers to see top stations in your
                        country. <br />
                        Your location is not stored or passed to anyone, we use
                        it strictly to display popular stations from your
                        country.
                    </p>
                </article>
            )}
        </>
    );
}

export default Home;
