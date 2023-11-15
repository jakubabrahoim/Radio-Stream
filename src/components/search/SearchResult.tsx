import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CurrentRadioContext } from '../../App';
import BadRequest from '../error-pages/BadRequest';

import { Pagination, Tooltip } from '@mantine/core';
import ReactCountryFlag from 'react-country-flag';
import { IconContext } from 'react-icons';
import { BiRadio } from 'react-icons/bi';

import { saveLastStation } from '../../helpers/localStorage';

function SearchResult() {
    let { setCurrentRadioStation } = useContext(CurrentRadioContext);

    let location: any = useLocation();
    let [stations, setStations] = useState<any[]>([]);
    let [filter, setFilter] = useState({
        alphabeticaly: false,
        byPopularity: true,
        sortOrder: 'Descending',
    });
    let [successfulLoad, setSuccessfulLoad] = useState(true);
    let [searchInput, setSearchInput] = useState('');
    let [page, setPage] = useState(1);
    let navigate = useNavigate();

    // Didn't add dependency because location.state.stations might be null/undefined when user changes the url
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        try {
            setStations(location.state.stations);
            setSuccessfulLoad(true);
        } catch {
            setSuccessfulLoad(false);
            navigate('/400');
        }
    });

    function handleSearchInputChange(
        event: ChangeEvent<HTMLInputElement>
    ): void {
        setSearchInput(event.target.value);
    }

    function fetchRadioStations(event: any): void {
        event.preventDefault();
        setFilter({
            alphabeticaly: false,
            byPopularity: true,
            sortOrder: 'Descending',
        });

        fetch(
            `https://de1.api.radio-browser.info/json/stations/byname/${searchInput}?hidebroken=true&order=clickcount&reverse=true`,
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

    function changePage(page: number): void {
        setPage(page);
    }

    /* Applies sort -> by popularity or alphabetical and orders them (asc/desc) */
    function applySort(clickedFilterType: string): void {
        if (clickedFilterType === 'alphabeticaly') {
            // Turn on alphabetical filter, turn off popularity filter
            setFilter({ ...filter, alphabeticaly: true, byPopularity: false });

            if (filter.sortOrder === 'Descending')
                setStations(
                    stations.sort((a, b) => b.name.localeCompare(a.name))
                );
            else
                setStations(
                    stations.sort((a, b) => a.name.localeCompare(b.name))
                );
        } else if (clickedFilterType === 'byPopularity') {
            // Turning on byPopularity filter, turn off alphabetical filter
            setFilter({ ...filter, alphabeticaly: false, byPopularity: true });
            if (filter.sortOrder === 'Descending')
                setStations(
                    stations.sort((a, b) => b.clickcount - a.clickcount)
                );
            else
                setStations(
                    stations.sort((a, b) => a.clickcount - b.clickcount)
                );
        }
    }

    /* Changes order (asc/desc) and re-sorts stations */
    function sortOrderChanged(event: any): void {
        setFilter({ ...filter, sortOrder: event.target.value });

        if (filter.alphabeticaly) {
            if (event.target.value === 'Descending')
                setStations(
                    stations.sort((a, b) => b.name.localeCompare(a.name))
                );
            else
                setStations(
                    stations.sort((a, b) => a.name.localeCompare(b.name))
                );
        } else if (filter.byPopularity) {
            if (event.target.value === 'Descending')
                setStations(
                    stations.sort((a, b) => b.clickcount - a.clickcount)
                );
            else
                setStations(
                    stations.sort((a, b) => a.clickcount - b.clickcount)
                );
        }
    }

    if (successfulLoad)
        return (
            <>
                {/* Heading + search bar */}
                <article className='grid grid-flow-row justify-items-center align-middle top-14 mb-10 mt-8'>
                    <section className='self-center'>
                        <form
                            className='flex flex-row w-full justify-center'
                            onSubmit={fetchRadioStations}
                        >
                            <label hidden>Search</label>
                            <input
                                className='w-[250px] sm:w-[450px] h-12 mr-4 px-2 border rounded-lg outline-none focus:ring-2 focus:ring-gray-800 drop-shadow-md'
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
                                name='search'
                            ></input>
                        </form>
                        {/* Additional search info - # of results, filters */}
                        <div
                            data-e2e='search-station-filters-container'
                            className='flex flex-col sm:flex-row mt-2 mx-4 sm:mx-0'
                        >
                            <div className='flex basis-1/4 justify-start items-center mb-2 sm:mb-0'>
                                <p
                                    data-e2e='search-station-number-of-stations'
                                    className='text-xs text-gray-500 ml-1'
                                >
                                    {stations.length} stations found
                                </p>
                            </div>
                            <div className='flex basis-3/4 justify-end items-center'>
                                <h3 className='text-xs text-gray-500 mr-2'>
                                    Sort:
                                </h3>
                                <button
                                    data-e2e='search-station-alphabetical-sort-button'
                                    className={
                                        filter.alphabeticaly === false
                                            ? 'text-xs bg-gray-100 text-gray-500 mr-2 px-1 py-0.5 border border-gray-400 rounded-full'
                                            : 'text-xs bg-blue-50 text-blue-500 mr-2 px-1 py-0.5 border border-blue-400 rounded-full'
                                    }
                                    onClick={() => applySort('alphabeticaly')}
                                >
                                    Alphabeticaly
                                </button>
                                <button
                                    data-e2e='search-station-popularity-sort-button'
                                    className={
                                        filter.byPopularity === false
                                            ? 'text-xs bg-gray-100 text-gray-500 mr-2 px-1 py-0.5 border border-gray-400 rounded-full'
                                            : 'text-xs bg-blue-50 text-blue-500 mr-2 px-1 py-0.5 border border-blue-400 rounded-full'
                                    }
                                    onClick={() => applySort('byPopularity')}
                                >
                                    By popularity
                                </button>
                                <select
                                    data-e2e='search-station-sort-order-select'
                                    className='text-xs focus:outline-none'
                                    onChange={sortOrderChanged}
                                    value={filter.sortOrder}
                                >
                                    <option>Descending</option>
                                    <option>Ascending</option>
                                </select>
                            </div>
                        </div>
                    </section>
                </article>

                <article className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7 justify-items-center h-[350px] sm:h-[430px] overflow-y-auto mt-2 mb-4 lg:mb-0'>
                    {stations
                        .slice((page - 1) * 14, (page - 1) * 14 + 14)
                        .map((station, id) => {
                            return (
                                <section
                                    data-e2e={`search-station-result-wrapper-${id}`}
                                    className='grid grid-rows-10 justify-items-center items-center border w-52 h-52 rounded-lg mb-4 sm:mb-2'
                                    key={id}
                                >
                                    <div className='row-span-2'>
                                        <p
                                            data-e2e={`search-station-result-name-${id}`}
                                            className='w-52 text-center truncate'
                                        >
                                            {station.name}
                                        </p>
                                        {station.country !== '' ? (
                                            <p
                                                data-e2e={`search-station-result-flag-${id}`}
                                                className='text-center'
                                            >
                                                <Tooltip
                                                    position='bottom'
                                                    withArrow
                                                    transition='fade'
                                                    transitionDuration={200}
                                                    label={station.countrycode}
                                                >
                                                    <ReactCountryFlag
                                                        countryCode={
                                                            station.countrycode
                                                        }
                                                    />
                                                </Tooltip>
                                            </p>
                                        ) : (
                                            <p
                                                data-e2e={`search-station-result-flag-${id}`}
                                                className='text-center'
                                            >
                                                Unknown country
                                            </p>
                                        )}
                                    </div>
                                    <div
                                        data-e2e={`search-station-result-logo-${id}`}
                                        className='row-span-6'
                                    >
                                        {station.favicon !== '' ? (
                                            <img
                                                src={station.favicon}
                                                alt='station icon'
                                                className='w-20'
                                            ></img>
                                        ) : (
                                            <IconContext.Provider
                                                value={{
                                                    className:
                                                        'text-gray-500 w-20 h-20',
                                                }}
                                            >
                                                <BiRadio />
                                            </IconContext.Provider>
                                        )}
                                    </div>
                                    <button
                                        data-e2e={`search-station-result-play-button-${id}`}
                                        className='w-20 h-6 px-2 mb-2 text-white bg-gray-800 hover:bg-gray-700 hover:cursor-pointer rounded-lg drop-shadow-md'
                                        onClick={() =>
                                            playRadioStation(
                                                station.name,
                                                station.url,
                                                station.favicon,
                                                true
                                            )
                                        }
                                    >
                                        Play
                                    </button>
                                </section>
                            );
                        })}
                </article>

                {stations.length > 14 && (
                    <article className='flex flex-row justify-center mb-24 sm:mb-72 xl:mb-0 xl:fixed sm:bottom-[285px] mt-2 w-full'>
                        <Pagination
                            data-e2e='search-station-pagination'
                            page={page}
                            total={Math.ceil(stations.length / 14)}
                            initialPage={1}
                            onChange={changePage}
                            color='gray'
                            radius='md'
                            withControls
                        />
                    </article>
                )}
            </>
        );

    return <BadRequest />;
}

export default SearchResult;
