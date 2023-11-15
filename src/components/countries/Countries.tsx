/*eslint-disable no-useless-concat */
import { useState } from 'react';
import { WorldMap } from '../world-map/WorldMap';
import CountriesListView from './CountriesListView';
import CountriesCombinedView from './CountriesCombinedView';
import ViewButton from './ViewButton';
import { isMobile } from 'mobile-device-detect';

function Countries() {
    let [currentView, setCurrentView] = useState<'list' | 'map' | 'combined'>(
        'list'
    );

    return (
        <div>
            <div className='w-screen flex justify-center'>
                <div className='my-2 rounded-lg hidden sm:flex items-center justify-center border w-fit'>
                    <ViewButton
                        caption='List view'
                        currentView={currentView}
                        setView={setCurrentView}
                        viewType='list'
                        customClass='rounded-l-lg border-r'
                    />
                    <ViewButton
                        caption='Combined view'
                        currentView={currentView}
                        setView={setCurrentView}
                        viewType='combined'
                    />
                    <ViewButton
                        caption='Map view'
                        currentView={currentView}
                        setView={setCurrentView}
                        viewType='map'
                        customClass='rounded-r-lg border-l'
                    />
                </div>
            </div>

            {isMobile ? (
                <div>
                    <CountriesListView />
                </div>
            ) : (
                <div>
                    {currentView === 'list' && <CountriesListView />}
                    {currentView === 'combined' && <CountriesCombinedView />}
                    {currentView === 'map' && (
                        <WorldMap height={260} scale={60} />
                    )}
                </div>
            )}
        </div>
    );
}

export default Countries;
