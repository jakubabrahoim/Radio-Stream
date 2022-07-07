import { ChangeEvent, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CurrentRadioContext } from "../../App";
import BadRequest from "../error-pages/BadRequest";

import { Pagination, Tooltip } from '@mantine/core';
import ReactCountryFlag from "react-country-flag";
import { IconContext } from "react-icons";
import { BiRadio } from "react-icons/bi";

import { saveLastStation } from "../../helpers/localStorage";

function CountrySearch() {
    
    let { setCurrentRadioStation } = useContext(CurrentRadioContext);
    
    let location: any = useLocation();
    let [stations, setStations] = useState<any[]>([]);
    let [filteredStations, setFilteredStations] = useState<any[]>([]);
    let [filter, setFilter] = useState({alphabeticaly: false, byPopularity: true, sortOrder: 'Descending'});
    let [successfulLoad, setSuccessfulLoad] = useState(true);
    let [searchInput, setSearchInput] = useState('');
    let [page, setPage] = useState(1);
    let navigate = useNavigate();
    
    // Didn't add dependency because location.state.stations might be null/undefined when user changes the url
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        try{
            setStations(location.state.stations);
            setFilteredStations(location.state.stations);
            setSuccessfulLoad(true);
        } catch {
            setSuccessfulLoad(false);
            navigate('/400');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function handleSearchInputChange(event: ChangeEvent<HTMLInputElement>): void {
        setSearchInput(event.target.value);
    }

    function filterRadioStations(event: any): void {
        event.preventDefault();
        setFilteredStations(stations.filter(station => station.name.toLowerCase().includes(searchInput.toLowerCase())));
    }

    function playRadioStation(stationName: string, streamUrl: string, stationThumbnail: string, autoPlay: boolean): void {
        // @ts-ignore
        setCurrentRadioStation({stationName: stationName, streamUrl: streamUrl, stationThumbnail: stationThumbnail, autoPlay: autoPlay});
        saveLastStation({stationName: stationName, streamUrl: streamUrl, stationThumbnail: stationThumbnail, autoPlay: autoPlay});
    }

    function changePage(page: number): void {
        setPage(page);
    }

    /* Applies sort -> by popularity or alphabetical and orders them (asc/desc) */
    function applySort(clickedFilterType: string): void {
        if(clickedFilterType === 'alphabeticaly') {
            // Turn on alphabetical filter, turn off popularity filter
            setFilter({...filter, alphabeticaly: true, byPopularity: false});
            if(filter.sortOrder === 'Descending') setFilteredStations(filteredStations.sort((a, b) => b.name.localeCompare(a.name)));
            else setFilteredStations(filteredStations.sort((a, b) => a.name.localeCompare(b.name)));
            
        } else if(clickedFilterType === 'byPopularity') {
            // Turning on byPopularity filter, turn off alphabetical filter
            setFilter({...filter, alphabeticaly: false, byPopularity: true});
            if(filter.sortOrder === 'Descending') setFilteredStations(filteredStations.sort((a, b) => b.clickcount - a.clickcount));
            else setFilteredStations(filteredStations.sort((a, b) => a.clickcount - b.clickcount));
        }
    }

    /* Changes order (asc/desc) and re-sorts stations */
    function sortOrderChanged(event: any): void {
        setFilter({...filter, sortOrder: event.target.value});

        if(filter.alphabeticaly) {
            if(event.target.value === 'Descending') setFilteredStations(filteredStations.sort((a, b) => b.name.localeCompare(a.name)));
            else setFilteredStations(filteredStations.sort((a, b) => a.name.localeCompare(b.name)));
        } else if(filter.byPopularity) {
            if(event.target.value === 'Descending') setFilteredStations(filteredStations.sort((a, b) => b.clickcount - a.clickcount));
            else setFilteredStations(filteredStations.sort((a, b) => a.clickcount - b.clickcount));
        }
    }

    if(successfulLoad) return (
        <>
            {/* Heading + search bar */}
            <article className='grid grid-flow-row justify-items-center align-middle sticky top-14 mb-10 mt-8'>
                <section className='self-center'>
                    <form className='flex flex-row w-full justify-center' onSubmit={filterRadioStations}>
                        <label hidden>Search</label>
                        <input 
                            className='w-[450px] h-12 mr-4 px-2 border rounded-lg outline-none focus:ring-2 focus:ring-gray-800 drop-shadow-md' 
                            type='text' 
                            value={searchInput} 
                            placeholder='Search for radio stations...' 
                            onChange={handleSearchInputChange}
                        ></input>
                        <label hidden>Submit</label>
                        <input 
                            className='w-24 px-2 text-white bg-gray-800 hover:bg-gray-700 hover:cursor-pointer rounded-lg drop-shadow-md' 
                            type='submit'
                            value='Search' 
                            name="search" 
                        ></input>
                    </form>
                    {/* Additional search info - # of results, filters */}
                    <div className='flex flex-row mt-2'>
                        <div className='flex basis-1/4 justify-start items-center'>
                            <p className='text-xs text-gray-500 ml-1'>{stations.length} stations found</p>
                        </div>
                        <div className='flex basis-3/4 justify-end items-center'>
                            <h3 className='text-xs text-gray-500 mr-2'>Sort:</h3>
                            <button 
                                className={filter.alphabeticaly === false ? 
                                    'text-xs bg-gray-100 text-gray-500 mr-2 px-1 py-0.5 border border-gray-400 rounded-full' :
                                    'text-xs bg-blue-50 text-blue-500 mr-2 px-1 py-0.5 border border-blue-400 rounded-full'} 
                                onClick={() => applySort('alphabeticaly')}
                            >
                                Alphabeticaly
                            </button>
                            <button 
                                className={filter.byPopularity === false ? 
                                    'text-xs bg-gray-100 text-gray-500 mr-2 px-1 py-0.5 border border-gray-400 rounded-full' :
                                    'text-xs bg-blue-50 text-blue-500 mr-2 px-1 py-0.5 border border-blue-400 rounded-full'} 
                                onClick={() => applySort('byPopularity')}
                            >
                                By popularity
                            </button>
                            <select className='text-xs focus:outline-none' onChange={sortOrderChanged} value={filter.sortOrder}>
                                <option>Descending</option>
                                <option>Ascending</option>
                            </select>
                        </div>
                    </div>
                </section>
            </article>
            
            <article className='grid grid-cols-7 justify-items-center'>
                {
                    filteredStations.slice((page - 1) * 14, (page - 1) * 14 + 14).map((station, id) => {
                        return (
                            <section className='grid grid-rows-10 justify-items-center items-center border w-52 h-52 rounded-lg mb-2' key={id}>
                                <div className='row-span-2'>
                                    <p className='w-52 text-center truncate'>{station.name}</p>
                                    {
                                        station.country !== '' ?
                                        <p className='text-center'>
                                            <Tooltip position='bottom' withArrow transition='fade' transitionDuration={200} label={station.countrycode}>
                                                <ReactCountryFlag countryCode={station.countrycode}/>
                                            </Tooltip>
                                        </p>
                                        :
                                        <p className='text-center'>
                                            Unknown country
                                        </p>
                                    }
                                </div>
                                <div className='row-span-6'>
                                    {
                                        station.favicon !== '' ?
                                        <img src={station.favicon} alt='station icon' className='w-20'></img>
                                        :
                                        <IconContext.Provider value={{ className: 'text-gray-500 w-20 h-20' }}>
                                            <BiRadio/>
                                        </IconContext.Provider>
                                    }
                                </div>
                                <button 
                                    className='w-20 h-6 px-2 mb-2 text-white bg-gray-800 hover:bg-gray-700 hover:cursor-pointer rounded-lg drop-shadow-md'
                                    onClick={() => playRadioStation(station.name, station.url, station.favicon, true)}
                                >
                                    Play
                                </button>
                                
                            </section>
                        );
                    })
                }
            </article>

            {
                stations.length > 14 &&
                <article className='flex flex-row justify-center fixed bottom-[285px] mt-2 w-full'>
                    <Pagination 
                        page={page} 
                        total={Math.ceil(stations.length/14)} 
                        initialPage={1} 
                        onChange={changePage} 
                        color='gray' 
                        radius='md'
                        withControls
                    />
                </article>
            }
        </>
    )
    
    return (
        <BadRequest/>
    )
}

export default CountrySearch;