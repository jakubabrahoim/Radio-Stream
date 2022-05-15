import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { BrowserRouter } from 'react-router-dom';

import Navigation from './components/Navigation';

function App() {

    let queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <div className="App">
                <h1 className='heading'>React app 😎</h1>
            </div>
            
            <BrowserRouter>
                <Navigation />
            </BrowserRouter>

            <ReactQueryDevtools/>
        </QueryClientProvider>
    );
}

export default App;
