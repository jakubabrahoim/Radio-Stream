import { useEffect, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { useNavigate } from "react-router-dom";

function Countries() {

    let [countries, setCountries] = useState([]);
    let [searchResult, setSearchResult] = useState([]);
    let [searchInput, setSearchInput] = useState('');
    let navigate = useNavigate();

    /* Fetch all countries */
    useEffect(() => {        
        fetch(`https://at1.api.radio-browser.info/json/countries`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'radio-sh.web.app',
            }
        })
        .then(response => response.json())
        .then(response => {
            setCountries(response);
            setSearchResult(response);
        })
    }, []);

    /* Search for country -> filters all countries array */
    function countrySearch(e: Event): void {
        e.preventDefault();
        setSearchResult(countries.filter((country) => country.name.toUpperCase().startsWith(searchInput.toUpperCase())));
    }

    function fetchRadioStationsForCountry(countryName: string): void {
        fetch(`https://at1.api.radio-browser.info/json/stations/bycountry/Slovakia?hidebroken=true&order=clickcount&reverse=true`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'radio-sh.web.app',
            }
        })
        .then(response => response.json())
        .then(response => {
            navigate(`/countries/${countryName}`, { state: { stations: response } });
        })
        .catch(error => console.log(error));
    }

    function handleSearchInputChange(e: ChangeEvent<HTMLInputElement>): void {
        setSearchInput(e.target.value);
    }
    
    return (
        <>
            {/* Heading + search bar */}
            <article className='grid grid-flow-row grid-rows-1 justify-items-center align-middle sticky top-14 mt-8 mb-10'>
                <section className='self-center'>
                    <form className='flex flex-row' onSubmit={countrySearch}>
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
                </section>
            </article>    

            <article className='grid justify-center align-middle h-[475px] overflow-y-auto'>
                {
                    searchResult.map((country, index) => {
                        return (    
                            <section className='flex flex-row items-center border rounded-lg mb-2 px-4 h-14 w-[580px]' key={index}>
                                <div className='flex basis-2/3 items-center justify-start'>
                                    <div>
                                        <span className='font-semibold mr-1'>{country.name}</span>
                                        <span className='mr-2'><ReactCountryFlag countryCode={country.iso_3166_1}/></span>
                                        <span className='text-sm'>({country.stationcount} {country.stationcount === 1 ? 'station' : 'stations'})</span>
                                    </div>
                                </div>
                                <div className='flex basis-1/3 justify-end'>
                                    <button className='text-sm text-gray-400' onClick={() => fetchRadioStationsForCountry(country.name)}>Browse stations</button>
                                </div>
                            </section>
                        )
                    })
                }
            </article>
        </>
    )
}

export default Countries;