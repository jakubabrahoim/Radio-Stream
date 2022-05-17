import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import Navigation from './components/navigation/Navigation';
import Login from './components/login-signup/Login';
import SignUp from './components/login-signup/SignUp';
import AudioPlayer from './components/audio-player/AudioPlayer';

import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

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

function App() {

    let queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            
            <Navigation/>
            <AudioPlayer/>

            <Router>
                <Routes>
                    <Route path='/login' element={<Login/>}/>
                    <Route path='/signup' element={<SignUp/>}/>
                </Routes>
            </Router>

            

            <ReactQueryDevtools/>
        </QueryClientProvider>
    );
}

export default App;
