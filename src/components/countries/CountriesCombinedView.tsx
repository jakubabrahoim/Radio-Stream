import { useState } from "react";
import { WorldMap } from "../world-map/WorldMap";
import CountriesListView from "./CountriesListView";

function CountriesCombinedView() {
    let [hoveredCountry, setHoveredCountry] = useState<string>('');

    return (
        <div className='flex gap-8 px-8'>
            <div className='justify-self-end'>
                <CountriesListView setHoveredCountry={setHoveredCountry}  />
            </div>
            <WorldMap height={350} scale={80} hoveredCountry={hoveredCountry} />
        </div>
    )
}

export default CountriesCombinedView;