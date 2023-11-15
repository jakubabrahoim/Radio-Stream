/*eslint-disable no-useless-concat */
import { ChangeEvent, useEffect, useState } from 'react';
import ReactCountryFlag from 'react-country-flag';
import { useNavigate } from 'react-router-dom';

interface Props {
    setHoveredCountry?: Function;
}

function CountriesListView({ setHoveredCountry }: Props) {
    let [userLocation, setUserLocation] = useState<null | string>(null);
    let [countries, setCountries] = useState([]);
    let [searchResult, setSearchResult] = useState([]);
    let [searchInput, setSearchInput] = useState('');
    let navigate = useNavigate();

    /* Fetch all countries and users location */
    useEffect(() => {
        // Countries
        fetch(`https://de1.api.radio-browser.info/json/countries`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'radio-stream.live',
            },
        })
            .then((response) => response.json())
            .then((response) => {
                // Get user location
                fetch('https://geolocation-db.com/json/')
                    .then((countryResponse) => countryResponse.json())
                    .then((countryResponse) => {
                        // Get country name form response
                        let userCountryName = countryResponse.country_name;
                        // Alphabetically sort countries
                        let sortedCountries = response.sort((a: any, b: any) =>
                            a.name.localeCompare(b.name)
                        );
                        // Check if users country is in the list
                        let userCountry = sortedCountries.find(
                            (country: any) =>
                                country.name.toLowerCase() ===
                                userCountryName.toLowerCase()
                        );

                        if (userCountry === null || userCountry === undefined) {
                            setUserLocation(null);
                        } else {
                            // Filter out users country from array
                            sortedCountries = sortedCountries.filter(
                                (country: any) =>
                                    country.name.toLowerCase() !==
                                    userCountryName.toLowerCase()
                            );
                            // Set users country to the top of the list
                            sortedCountries.unshift(userCountry);
                            setUserLocation(userCountryName);
                            setCountries(sortedCountries);
                            setSearchResult(sortedCountries);
                        }
                    })
                    .catch((_error) => {
                        setUserLocation(null);

                        let sortedCountries = response.sort((a: any, b: any) =>
                            a.name.localeCompare(b.name)
                        );
                        setCountries(sortedCountries);
                        setSearchResult(sortedCountries);
                    });
            });
    }, []);

    /* Search for country -> filters all countries array */
    function countrySearch(event: any): void {
        event.preventDefault();
        setSearchResult(
            countries.filter((country: { name: string }) =>
                country.name.toUpperCase().includes(searchInput.toUpperCase())
            )
        );
    }

    /* Fetch stations for selected country and navigate to new page with these stations */
    function fetchRadioStationsForCountry(countryName: string): void {
        fetch(
            `https://de1.api.radio-browser.info/json/stations/bycountry/${countryName}?hidebroken=true&order=clickcount&reverse=true`,
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
                navigate(`/countries/${countryName}`, {
                    state: { stations: response },
                });
            })
            .catch((error) => console.log(error));
    }

    function handleSearchInputChange(
        event: ChangeEvent<HTMLInputElement>
    ): void {
        setSearchInput(event.target.value);
    }

    return (
        <div>
            {/* Heading + search bar */}
            <article className='grid grid-flow-row grid-rows-1 justify-items-center align-middle sticky top-14 mt-8 mb-10'>
                <section className='self-center'>
                    <form className='flex flex-row' onSubmit={countrySearch}>
                        <label hidden>Search</label>
                        <input
                            data-e2e='countries-search-input'
                            className='w-[250px] sm:w-[450px] h-12 mr-4 px-2 border rounded-lg outline-none focus:ring-2 focus:ring-gray-800 drop-shadow-md'
                            type='text'
                            value={searchInput}
                            placeholder='Search for countries...'
                            onChange={handleSearchInputChange}
                        ></input>
                        <label hidden>Submit</label>
                        <input
                            data-e2e='countries-search-submit'
                            className='w-24 px-2 text-white bg-gray-800 hover:bg-gray-700 hover:cursor-pointer rounded-lg drop-shadow-md'
                            type='submit'
                            value='Search'
                            name='search'
                        ></input>
                    </form>
                </section>
            </article>

            <article
                data-e2e='countries-list-container'
                className={
                    'grid justify-center align-middle ' +
                    `${
                        searchResult.length > 7
                            ? 'h-[475px]'
                            : 'h-[' + `${56 * searchResult.length}` + 'px]'
                    }` +
                    ' overflow-y-auto pb-12 sm:pb-0'
                }
            >
                {searchResult.map(
                    (
                        country: {
                            name: string;
                            stationcount: number;
                            iso_3166_1: string;
                        },
                        index
                    ) => {
                        return (
                            <div key={index}>
                                <section
                                    data-e2e={`countries-list-item-${index}`}
                                    className='flex flex-row items-center mb-2 px-4 h-20 sm:h-14 w-[370px] sm:w-[580px] hover:cursor-pointer'
                                    onClick={() =>
                                        fetchRadioStationsForCountry(
                                            country.name
                                        )
                                    }
                                    onMouseEnter={() =>
                                        setHoveredCountry?.(country.iso_3166_1)
                                    }
                                    onMouseLeave={() => setHoveredCountry?.('')}
                                >
                                    <div className='flex items-center justify-start w-full'>
                                        <div>
                                            <span
                                                data-e2e={`countries-list-item-name-${index}`}
                                                className='font-semibold mr-1 hover:cursor-pointer'
                                                onClick={() =>
                                                    fetchRadioStationsForCountry(
                                                        country.name
                                                    )
                                                }
                                            >
                                                {country.name}
                                            </span>
                                            <span className='mr-2'>
                                                <ReactCountryFlag
                                                    data-e2e={`countries-list-item-flag-${index}`}
                                                    countryCode={
                                                        country.iso_3166_1
                                                    }
                                                />
                                            </span>
                                            <span
                                                data-e2e={`countries-list-item-number-of-stations-${index}`}
                                                className='text-sm'
                                            >
                                                ({country.stationcount}{' '}
                                                {country.stationcount === 1
                                                    ? 'station'
                                                    : 'stations'}
                                                )
                                            </span>
                                        </div>
                                    </div>
                                </section>
                                {userLocation !== null &&
                                    index === 0 &&
                                    searchResult.length ===
                                        countries.length && (
                                        <hr className='border-1 mb-2'></hr>
                                    )}
                            </div>
                        );
                    }
                )}
            </article>

            {searchResult.length === 0 && (
                <article className='flex flex-row items-center justify-center'>
                    <span className='text-gray-800 text-xl font-bold'>
                        No countries found
                    </span>
                </article>
            )}
        </div>
    );
}

export default CountriesListView;
