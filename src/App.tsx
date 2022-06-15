import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';

import Home from './components/home/Home';
import Navigation from './components/navigation/Navigation';
import Login from './components/login-signup/Login';
import SignUp from './components/login-signup/SignUp';
import AudioPlayer from './components/audio-player/AudioPlayer';
import SearchResult from './components/search/SearchResult';
import Countries from './components/countries/Countries';
import CountrySearch from './components/search/CountrySearch';
import BadRequest from './components/error-pages/BadRequest';

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

// export let UserContext = React.createContext(null);

function App() {

    let queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
    
            <Navigation/>
            <AudioPlayer/>

            {/* Background image */}
            <div className="bg-[url('https://svgshare.com/i/hcM.svg')] fixed bottom-20 w-screen h-56"> &nbsp;
            </div>

            <Router>
                <Routes>
                    <Route path='/' element={<Navigate to='/home' />}/>
                    <Route path='/home' element={<Home/>}/>
                    <Route path='/countries' element={<Countries/>}/>
                    <Route path='/countries/:country' element={<CountrySearch/>}/>
                    <Route path='/login' element={<Login/>}/>
                    <Route path='/signup' element={<SignUp firebaseApp={app}/>}/>
                    <Route path='/search-result' element={<SearchResult/>}/>
                    <Route path='/400' element={<BadRequest/>}/>
                </Routes>
            </Router>

            <ReactQueryDevtools/>
        </QueryClientProvider>
    );
}

export default App;
