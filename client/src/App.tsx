import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Whiteboard from './components/Whiteboard.tsx';
import Keycloak from 'keycloak-js';
import './App.css';

import Home from './pages/Home.tsx';
import Login from './pages/Login.tsx';
import Dashboard from './pages/Dashboard.tsx';


// const keycloak = Keycloak('/keycloak.json');
const keycloak = new Keycloak({
    url: 'https://your-keycloak-server/auth',
    realm: 'your-realm',
    clientId: 'your-client-id',
});


function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        keycloak.init({ onLoad: 'login-required' }).then((authenticated) => {
            setIsAuthenticated(authenticated);
        });
    }, []);

    if (!isAuthenticated) {
        return <div>Loading...</div>;
    }

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}
export default App;