import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import ReactCountryFlag from "react-country-flag";
import { IconContext } from "react-icons";
import { BiRadio } from "react-icons/bi";

function SearchResult() {
    
    let location: any = useLocation();
    let [searchResult, setSearchResult] = useState<any[]>([]);
    let [successfulLoad, setSuccessfulLoad] = useState(true);
    let [searchInput, setSearchInput] = useState('');
    let navigate = useNavigate();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        try{
            setSearchResult(location.state.stations);
            setSuccessfulLoad(true);
        } catch {
            setSuccessfulLoad(false);
        }
    });

    function handleSearchInputChange(e: ChangeEvent<HTMLInputElement>) {
        setSearchInput(e.target.value);
    }

    function fetchRadioStations(e: any) {
        e.preventDefault();

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

    if(successfulLoad) return (
        <>
            {/* Heading + search bar */}
            <article className='grid grid-flow-row justify-items-center align-middle sticky top-14 mb-10 mt-8'>
                <section className='self-center'>
                    <form className='flex flex-row w-full justify-center' onSubmit={fetchRadioStations}>
                        <label hidden>Search</label>
                        <input className='w-[450px] h-12 mr-4 px-2 border rounded-lg outline-none focus:ring-2 focus:ring-gray-800 drop-shadow-md' type='text' value={searchInput} placeholder='Search for radio stations...' onChange={handleSearchInputChange}></input>
                        <label hidden>Submit</label>
                        <input className='w-24 px-2 text-white bg-gray-800 hover:bg-gray-700 hover:cursor-pointer rounded-lg drop-shadow-md' type='submit' name="search" value='Search'></input>
                    </form>
                    <p className='text-xs text-gray-500 ml-1 mt-1.5'>{searchResult.length} stations found</p>
                </section>
            </article>
            
            <article className='grid grid-cols-7 justify-items-center'>
                {
                    searchResult.map((station, id) => {
                        return (
                            <section className='grid grid-rows-10 justify-items-center items-center border w-52 h-52 rounded-lg mb-2' key={id}>
                                <div className='row-span-2'>
                                    <p className='w-52 text-center'>{station.name}</p>
                                    {
                                        station.country !== '' ?
                                        <p className='text-center'>
                                            {station.country} &nbsp;
                                            <ReactCountryFlag countryCode={station.countrycode}/>
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
                                <button className='w-20 h-6 px-2 mb-2 text-white bg-gray-800 hover:bg-gray-700 hover:cursor-pointer rounded-lg drop-shadow-md'>
                                    Play
                                </button>
                                
                            </section>
                        );
                    })
                }
            </article>
        </>
    )
    
    return (
        <p>400 Bad Request - Something went wrong</p>
    )
}

export default SearchResult;