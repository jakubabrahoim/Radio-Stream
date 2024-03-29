import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import { createContext, useEffect, useState } from 'react';

import Home from './components/home/Home';
import Navigation from './components/navigation/Navigation';
import Login from './components/login-signup/Login';
import SignUp from './components/login-signup/SignUp';
import AudioPlayer from './components/audio-player/AudioPlayer';
import SearchResult from './components/search/SearchResult';
import Countries from './components/countries/Countries';
import CountrySearch from './components/search/CountrySearch';
import LikedStations from './components/user/LikedStations';
import BadRequest from './components/error-pages/BadRequest';
import NotFound from './components/error-pages/NotFound';

import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';

import { loadLastStation } from './helpers/localStorage';

const firebaseConfig = {
    apiKey: "AIzaSyAkSTkF9OnUVDjWZEOuhABQXan1aqZMTks",
    authDomain: "radio-sh.firebaseapp.com",
    projectId: "radio-sh",
    storageBucket: "radio-sh.appspot.com",
    messagingSenderId: "573057895617",
    appId: "1:573057895617:web:28b6e1bfb7efeafdf31840",
    measurementId: "G-HS77NGNZYS"
};
  
// Initialize Firebase
const app = initializeApp(firebaseConfig);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const analytics = getAnalytics(app);
let db = getFirestore(app);

export interface Station {
    stationName: string;
    streamUrl: string;
    stationThumbnail: string;
    autoPlay: boolean
}

export let CurrentRadioContext = createContext({currentRadioStation: {}, setCurrentRadioStation: () => {}});

function App() {

    let [currentRadioStation, setCurrentRadioStation] = useState<Station>({
        stationName: 'No station selected', 
        streamUrl: '', 
        stationThumbnail: '',
        autoPlay: true
    });

    useEffect(() => {
        let lastStation: Station = loadLastStation();
        setCurrentRadioStation(lastStation);
    }, [])

    return (
        <>
            {/* @ts-ignore */}
            <CurrentRadioContext.Provider value={{currentRadioStation, setCurrentRadioStation}}>
                <AudioPlayer database={db}/>

                {/* Background image */}
                {/* <div className="bg-[url('https://svgshare.com/i/hcM.svg')] fixed bottom-20 border-none w-screen invisible sm:visible h-24 sm:h-44 md:h-48 z-10"> &nbsp;  </div> */}
                
                <Router>
                    <Navigation/>
                    <Routes>
                        <Route path='/' element={<Navigate to='/home' />}/>
                        <Route path='/home' element={<Home/>}/>
                        <Route path='/countries' element={<Countries/>}/>
                        <Route path='/countries/:country' element={<CountrySearch/>}/>
                        <Route path='/login' element={<Login/>}/>
                        <Route path='/signup' element={<SignUp firebaseApp={app}/>}/>
                        <Route path='/search-result' element={<SearchResult/>}/>
                        <Route path='/my-stations' element={<LikedStations database={db}/>}/>
                        <Route path='/400' element={<BadRequest/>}/>
                        <Route path='*' element={<NotFound/>}/>
                    </Routes>
                </Router>
            </CurrentRadioContext.Provider>
        </>
    );
}

export default App;
