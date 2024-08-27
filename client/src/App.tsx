import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Whiteboard from './components/Whiteboard';
import Keycloak from 'keycloak-js';
import './App.css';

const keycloak = Keycloak('/keycloak.json');

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
            <Switch>
                <Route path="/whiteboard" component={Whiteboard} />
                <Redirect from="/" to="/whiteboard" />
            </Switch>
        </Router>
    );
}

export default App;
