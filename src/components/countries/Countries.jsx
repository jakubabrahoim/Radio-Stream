import { useEffect, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { useNavigate } from "react-router-dom";



function Countries() {
    let [countries, setCountries] = useState([]);
    let [searchInput, setSearchInput] = useState('');
    let [searchResult, setSearchResult] = useState([]);
    let [selectedCountry, setSelectedCountry] = useState('');
    let navigate = useNavigate();

    /* Get user location and top 5 stations from users country */
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

    function handleSearchInputChange(e: ChangeEvent<HTMLInputElement>) {
        setSearchInput(e.target.value);
    }


    /** Fetch radio station on search submit */
    function fetchRadioCountries(e: Event) {
        e.preventDefault();
        
        const result = countries.filter((country) => country.name.toUpperCase().startsWith(searchInput.toUpperCase()));
        setSearchResult(result);
    }

    /** Fetch radio station on search submit */
    function fetchRadioStations(e: Event) {
        e.preventDefault();
        console.log('sc',selectedCountry);
        fetch(`https://at1.api.radio-browser.info/json/stations/bycountry/${selectedCountry}?hidebroken=true&order=clickcount&reverse=true`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'radio-sh.web.app',
            }
        })
        .then(response => response.json())
        .then(response => {
            navigate(`/search-result?query=${selectedCountry}`, { state: { stations: response } });
        })
        .catch(error => console.log(error));
    }
    
    return (
        <>
            {/* Heading + search bar */}
            <article className='grid grid-flow-row grid-rows-2 justify-items-center align-middle mb-16'>
                <br></br>
                <section className='self-center'>
                    <form className='flex flex-row' onSubmit={fetchRadioCountries}>
                        <label hidden>Search</label>
                        <input className='w-[450px] h-12 mr-4 px-2 border rounded-lg outline-none focus:ring-2 focus:ring-gray-800 drop-shadow-md' type='text' value={searchInput} placeholder='Search for radio stations...' onChange={handleSearchInputChange}></input>
                        <label hidden>Submit</label>
                        <input className='w-24 px-2 text-white bg-gray-800 hover:bg-gray-700 hover:cursor-pointer rounded-lg drop-shadow-md' type='submit' name="search" value='Search'></input>
                    </form>
                </section>
            </article>    

            <article className='grid grid-rows-1 justify-center align-middle'>
                {
                    searchResult.map((country, index) => {
                        return (
                            <div onClick={fetchRadioStations}>
                                <ReactCountryFlag countryCode={country.iso_3166_1}/>
                                <p>{country.name} ({country.stationcount})</p>
                                <hr></hr>
                            </div>
                        )
                    })
                }
            </article>

        </>
    )
}
export default Countries;