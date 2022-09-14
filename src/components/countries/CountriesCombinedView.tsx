import { WorldMap } from "../world-map/WorldMap";
import CountriesListView from "./CountriesListView";

function CountriesCombinedView() {
    return (
        <div className='flex'>
            <CountriesListView />
            <WorldMap />
        </div>
    )
}

export default CountriesCombinedView;