import { WorldMap } from "../world-map/WorldMap";
import CountriesListView from "./CountriesListView";

function CountriesCombinedView() {
    return (
        <div className='flex items-center gap-4'>
            <div className='justify-self-start'>
                <CountriesListView />
            </div>
            
                <WorldMap height={350} scale={80} />
            
        </div>
    )
}

export default CountriesCombinedView;