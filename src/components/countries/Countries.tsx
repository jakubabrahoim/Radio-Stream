/*eslint-disable no-useless-concat */
import { useState } from 'react';
import { WorldMap } from '../world-map/WorldMap';
import CountriesListView from './CountriesListView';

function Countries() {

    let [currentView, setCurrentView] = useState<'list' | 'map'>('list');

    return (
        <div>
            <div className='hidden sm:flex w-screen items-center gap-4 justify-center'>
                <button 
                    className={`${currentView === 'list' && 'underline'}`}
                    onClick={() => setCurrentView('list')}
                >
                    List View
                </button>
                <button 
                    className={`${currentView === 'map' && 'underline'}`}
                    onClick={() => setCurrentView('map')}
                >
                    Map View
                </button>
            </div>

            <div className='hidden sm:block'>
                {currentView === 'list' && <CountriesListView />}
                {currentView === 'map' && <WorldMap />}
            </div>

            <div className='sm:hidden'>
                <CountriesListView />
            </div>

    
        </div>

        
        
    )
}

export default Countries;