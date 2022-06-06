import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";


function SearchResult() {
    
    let location = useLocation();
    let [searchResult, setSearchResult] = useState([]);
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
    });
    
    return (
        <>
            {
                successfulLoad !== false ?
                <div>
                    {
                        searchResult.map((station, id) => {
                            return (
                                <div key={id}>
                                    {/* @ts-ignore */}
                                    <p>Name: {station.name}</p>
                                    {/* @ts-ignore */}
                                    <p>Country: {station.country}</p>
                                    <hr/>
                                </div>
                            );
                        })
                    }
                </div>
                :
                <p>400 Bad Request - Something went wrong</p>
            }
        </>
    )
}

export default SearchResult;