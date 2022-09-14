import { WorldMap } from "../world-map/WorldMap";
import CountriesListView from "./CountriesListView";

function CountriesCombinedView() {
    return (
        <div className='flex items-center'>
            <div className='justify-self-start'>
                <CountriesListView />
            </div>
            <div className='justify-self-end'>
                <WorldMap height={500} scale={100} />
            </div>
        </div>
    )
}

export default CountriesCombinedView;