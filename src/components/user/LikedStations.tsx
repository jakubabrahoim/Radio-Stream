import { ChangeEvent, useEffect, useState } from "react";

import { getAuth, onAuthStateChanged} from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";

import { IconContext } from "react-icons";
import { BiRadio } from "react-icons/bi";
import { TiDeleteOutline } from "react-icons/ti";

function LikedStations(database: any) {
    
    let [likedStations, setLikedStations] = useState<any[]>([]);
    let [searchInput, setSearchInput] = useState('');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let [page, setPage] = useState(1);

    useEffect(() => {

        let getLikedStations = async (uid: string) => {
            let firestoreQuery: any = query(collection(database.database, 'liked-stations'), where('uid', '==', uid));
            let fetchedLikedStations: any = await getDocs(firestoreQuery);
            
            let likedStations: any = [];

            fetchedLikedStations.forEach((station: any) => {
                likedStations.push(station.data());
            })
            
            setLikedStations(likedStations);
        }
        
        let auth = getAuth();
        onAuthStateChanged(auth, user => {
            if(user) {
                getLikedStations(user.uid);
            }
        });
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /*
    function removeFromLikedStations(): void {

    }
    */

    function playRadioStation(stationName: string, stationUrl: string, stationThumbnail: string, autoplay: boolean): void {

    }

    function handleSearchInputChange(event: ChangeEvent<HTMLInputElement>): void {
        setSearchInput(event.target.value);
    }


    return (
        <>
            {/* Heading + search bar */}
            <article className='grid grid-flow-row grid-rows-2 justify-items-center align-middle mb-8 sm:mb-16'>
                <section className='self-center'>
                    <form className='flex flex-row'>
                        <span id='homeSearchLabel' hidden>Search</span>
                        <input 
                            className='w-[250px] sm:w-[450px] h-12 mr-4 px-2 border rounded-lg outline-none focus:ring-2 focus:ring-gray-800 drop-shadow-md' 
                            type='text' 
                            value={searchInput} 
                            placeholder='Search for radio stations...' 
                            onChange={handleSearchInputChange}
                            aria-labelledby='homeSearchLabel'
                        />
                        <span id='homeSubmitLabel' hidden>Search</span>
                        <input 
                            className='w-24 px-2 text-white bg-gray-800 hover:bg-gray-700 hover:cursor-pointer rounded-lg drop-shadow-md' 
                            type='submit' 
                            value='Search'
                            name="search" 
                            aria-labelledby='homeSubmitLabel'
                        />
                    </form>
                </section>
            </article>

            {/* Liked stations */}
            <article className='grid grid-cols-7 justify-items-center mt-2'>
                {
                    likedStations.slice((page - 1) * 14, (page - 1) * 14 + 14).map((station, id) => {
                        return (
                            <section className='grid grid-rows-10 justify-items-center items-center border w-52 h-52 rounded-lg mb-2' key={id}>
                                <div className='row-span-2'>
                                    <p className='w-52 text-center truncate'>{station.stationName}</p>
                                </div>
                                <div className='row-span-6'>
                                    {
                                        station.stationThumbnail !== '' ?
                                        <img src={station.stationThumbnail} alt='station icon' className='w-20'></img>
                                        :
                                        <IconContext.Provider value={{ className: 'text-gray-500 w-20 h-20' }}>
                                            <BiRadio/>
                                        </IconContext.Provider>
                                    }
                                </div>
                                <div className='flex flex-row items-center mb-2'>
                                    <button 
                                        className='w-20 h-6 px-2 text-white bg-gray-800 hover:bg-gray-700 hover:cursor-pointer rounded-lg drop-shadow-md'
                                        onClick={() => playRadioStation(station.name, station.url, station.favicon, true)}
                                    >
                                        Play
                                    </button>
                                    <button>
                                        <IconContext.Provider value={{ className: 'text-gray-800 w-6 h-6' }}>
                                            <TiDeleteOutline/>
                                        </IconContext.Provider>
                                    </button>
                                </div>
                                
                                
                            </section>
                        );
                    })
                }
            </article>
        </>
    )
}

export default LikedStations;