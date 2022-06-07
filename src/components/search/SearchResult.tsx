import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ReactCountryFlag from "react-country-flag";

function SearchResult() {
    
    let location = useLocation();
    let [searchResult, setSearchResult] = useState<any[]>([]);
    let [successfulLoad, setSuccessfulLoad] = useState(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        try{
            // @ts-ignore
            setSearchResult(location.state.stations);
            setSuccessfulLoad(true);
        } catch {
            setSuccessfulLoad(false);
        }
        console.log(searchResult);
    });

    if(successfulLoad) return (
        <div>
            {
                searchResult.map((station, id) => {
                    return (
                        <div className='flex flex-row border-b' key={id}>
                            <p className='mr-4'>Name: {station.name}</p>
                            <p className='mr-2'>Country: {station.country}</p>
                            <ReactCountryFlag countryCode={station.countrycode}/>
                        </div>
                    );
                })
            }
        </div>
    )
    
    return (
        <p>400 Bad Request - Something went wrong</p>
    )
}

export default SearchResult;