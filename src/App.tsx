import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import Navigation from './components/navigation/Navigation';
import Login from './components/login-signup/Login';
import SignUp from './components/login-signup/SignUp';

function App() {

    let queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            
            <Navigation/>

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
