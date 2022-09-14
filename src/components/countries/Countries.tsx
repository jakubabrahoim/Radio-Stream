/*eslint-disable no-useless-concat */
import { useState } from 'react';
import { WorldMap } from '../world-map/WorldMap';
import CountriesListView from './CountriesListView';
import CountriesCombinedView from './CountriesCombinedView';

function Countries() {

    let [currentView, setCurrentView] = useState<'list' | 'map' | 'combined'>('list');

    return (
        <div>
            <div className='w-screen flex justify-center'>
                <div className='my-2 rounded-lg hidden sm:flex items-center justify-center border w-fit'>
                    <button 
                        className={`${currentView === 'list' && 'bg-gray-800 text-white'} w-36 h-full p-2 border-r rounded-l-lg`}
                        onClick={() => setCurrentView('list')}
                    >
                        List View
                    </button>
                    <button 
                        className={`${currentView === 'combined' && 'bg-gray-800 text-white'} w-36 h-full p-2`}
                        onClick={() => setCurrentView('combined')}
                    >
                        Combined View
                    </button>
                    <button 
                        className={`${currentView === 'map' && 'bg-gray-800 text-white'} w-36 h-full p-2 border-l rounded-r-lg`}
                        onClick={() => setCurrentView('map')}
                    >
                        Map View
                    </button>
                </div>
            </div>

            <div className='hidden sm:block'>
                {currentView === 'list' && <CountriesListView />}
                {currentView === 'combined' && <CountriesCombinedView />}
                {currentView === 'map' && <WorldMap height={350} scale={80} />}
            </div>

            <div className='sm:hidden'>
                <CountriesListView />
            </div>
        </div>
    )
}

export default Countries;