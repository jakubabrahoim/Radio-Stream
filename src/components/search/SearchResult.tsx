import { useLocation } from "react-router-dom";


function SearchResult() {
    
    let location = useLocation();
    
    return (
        <>
            <div>
                {/* @ts-ignore */}
                {location.state.stations.map((station, id) => {
                    return (
                        <div key={id}>
                            <p>Name: {station.name}</p>
                            <p>Country: {station.country}</p>
                            <hr/>
                        </div>
                    );
                })}
            </div>
        </>
    )
}

export default SearchResult;