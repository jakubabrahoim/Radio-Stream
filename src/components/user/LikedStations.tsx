import { useEffect, useState } from "react";

import { getAuth, onAuthStateChanged} from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";

function LikedStations(database: any) {
    
    let [likedStations, setLikedStations] = useState<any[]>([]);

    useEffect(() => {

        let getLikedStations = async (uid: string) => {
            let firestoreQuery: any = query(collection(database.database, 'liked-stations'), where('uid', '==', uid));
            let fetchedLikedStations: any = await getDocs(firestoreQuery);
            
            let likedStations: any = [];

            fetchedLikedStations.forEach((station: any) => {
                likedStations.push(station.data());
            })
            
            console.log(likedStations);
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

    return (
        <>
            {likedStations.map((station: any) => {
                return (
                    <div key={station.stationName}>
                        <h3>{station.stationName}</h3>  
                    </div>
                )
            })}
        </>
    )
}

export default LikedStations;