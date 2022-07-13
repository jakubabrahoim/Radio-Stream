import { ChangeEvent, useContext, useEffect, useState } from "react";

import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { collection, query, where, doc, getDocs, deleteDoc } from "firebase/firestore";

import { CurrentRadioContext } from "../../App";

import { Pagination } from "@mantine/core";
import { IconContext } from "react-icons";
import { BiRadio } from "react-icons/bi";
import { TiDeleteOutline } from "react-icons/ti";

import { saveLastStation } from "../../helpers/localStorage";

type Station = {
    createdAt?: any,
    stationName: string,
    stationThumbnail: string,
    stationUrl: string,
    uid: string
}

function LikedStations(database: any) {
    
    let { setCurrentRadioStation } = useContext(CurrentRadioContext);
    
    let [user, setUser] = useState<User | null>(null);

    /*
        - likedStationsBase is used to keep all liked stations fetched from the database.
        - likedStations is the array which is rendered, it is also used to store filtered stations according to the search query.
    */
    let [likedStationsBase, setLikedStationsBase] = useState<Station[]>([]);
    let [likedStations, setLikedStations] = useState<Station[]>([]);
    let [searchInput, setSearchInput] = useState('');
    let [page, setPage] = useState(1);

    useEffect(() => {

        let getLikedStations = async (uid: string) => {
            let firestoreQuery: any = query(collection(database.database, 'liked-stations'), where('uid', '==', uid));
            let fetchedLikedStations: any = await getDocs(firestoreQuery);
            
            let likedStations: any = [];

            fetchedLikedStations.forEach((station: any) => {
                likedStations.push(station.data());
            })
            
            setLikedStationsBase(likedStations);
            setLikedStations(likedStations);
        }
        
        let auth = getAuth();
        onAuthStateChanged(auth, user => {
            if(user) {
                setUser(user);
                getLikedStations(user.uid);
            }
        });
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    
    async function removeFromLikedStations(stationName: string): Promise<void> {
        try {
            let documentId: string = `${user?.uid}-${stationName}`;
            await deleteDoc(doc(database.database, 'liked-stations', documentId));
            setLikedStationsBase(likedStationsBase.filter((station: Station) => station.stationName !== stationName));
            /* We don't set this from baseLikedStations because there might a specific search that is currently displayed */
            setLikedStations(likedStations.filter((station: any) => station.stationName !== stationName));
        } catch (error) {
            console.log(error);
        }
    }

    function playRadioStation(stationName: string, streamUrl: string, stationThumbnail: string, autoPlay: boolean): void {
        // @ts-ignore
        setCurrentRadioStation({stationName: stationName, streamUrl: streamUrl, stationThumbnail: stationThumbnail, autoPlay: autoPlay});
        saveLastStation({stationName: stationName, streamUrl: streamUrl, stationThumbnail: stationThumbnail, autoPlay: autoPlay});
    }

    function searchStations(event: any): void {
        event.preventDefault();
        setLikedStations(likedStationsBase.filter((station: Station) => station.stationName.toLowerCase().includes(searchInput.toLowerCase())));
    }

    function handleSearchInputChange(event: ChangeEvent<HTMLInputElement>): void {
        setSearchInput(event.target.value);
    }

    function changePage(page: number): void {
        setPage(page);
    }


    return (
        <>
            {/* Heading + search bar */}
            <article className='grid grid-flow-row grid-rows-1 justify-items-center align-middle sticky top-14 mt-8 mb-10'>
                <section className='self-center'>
                    <form className='flex flex-row' onSubmit={searchStations}>
                        <label hidden>Search</label>
                        <input 
                            className='w-[450px] h-12 mr-4 px-2 border rounded-lg outline-none focus:ring-2 focus:ring-gray-800 drop-shadow-md' 
                            type='text' 
                            value={searchInput} 
                            placeholder='Search for radio stations...' 
                            onChange={handleSearchInputChange}
                        ></input>
                        <label hidden>Submit</label>
                        <input 
                            className='w-24 px-2 text-white bg-gray-800 hover:bg-gray-700 hover:cursor-pointer rounded-lg drop-shadow-md' 
                            type='submit' 
                            value='Search'
                            name="search" 
                        ></input>
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
                                <div className='flex flex-row items-center mb-2 w-full'>
                                    <div className='flex basis-2/3 justify-center'>
                                        <button 
                                            className='
                                                justify-self-center
                                                w-20 h-6 px-2 text-white bg-gray-800 hover:bg-gray-700 hover:cursor-pointer rounded-lg drop-shadow-md
                                                '
                                            onClick={() => playRadioStation(station.stationName, station.stationUrl, station.stationThumbnail, true)}
                                        >
                                            Play
                                        </button>
                                    </div>

                                    <div className='flex basis-1/3 justify-center'>
                                        <button 
                                            className='justify-self-end'
                                            onClick={() => removeFromLikedStations(station.stationName)}
                                            aria-labelledby='removeFromLiked'
                                        >
                                            <IconContext.Provider value={{ className: 'text-gray-800 w-7 h-7' }}>
                                                <TiDeleteOutline/>
                                            </IconContext.Provider>
                                            <span id='removeFromLiked' hidden>Remove from liked stations</span>
                                        </button>
                                    </div>
                                </div>
                            </section>
                        );
                    })
                }
            </article>

            {
                likedStations.length > 14 &&
                <article className='flex flex-row justify-center fixed bottom-[285px] mt-2 w-full'>
                    <Pagination 
                        page={page} 
                        total={Math.ceil(likedStations.length/14)} 
                        initialPage={1} 
                        onChange={changePage} 
                        color='gray' 
                        radius='md' 
                        withControls
                    />
                </article>
            }
        </>
    )
}

export default LikedStations;