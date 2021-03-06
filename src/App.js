import './App.scss';

import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import { Routes } from './Routes';
import routerParams from '@redhat-cloud-services/frontend-components-utilities/files/RouterParams';

const App = (props) => {
    const [auth, setAuth] = useState(false);
    const appNavClick = {
        recommendations(redirect) { insights.chrome.appNavClick({ id: 'recommendations', redirect }); },
        systems(redirect) { insights.chrome.appNavClick({ id: 'systems', redirect }); },
        topics(redirect) { insights.chrome.appNavClick({ id: 'topics', redirect }); }
    };

    useEffect(() => {
        insights.chrome.init();
        insights.chrome.auth.getUser().then(() => setAuth(true));
        insights.chrome.identifyApp('advisor');
        const baseComponentUrl = props.location.pathname.split('/')[1];
        const unregister = insights.chrome.on('APP_NAVIGATION', event => {
            if (event.domEvent) {
                props.history.push(`/${event.navId}`);
                appNavClick[baseComponentUrl] !== undefined ? appNavClick[baseComponentUrl](true)
                    : appNavClick.recommendations;
            }
        });

        return () => unregister();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const baseComponentUrl = props.location.pathname.split('/')[1];
        insights && insights.chrome && baseComponentUrl && appNavClick[baseComponentUrl] !== undefined && appNavClick[baseComponentUrl](false);
    }, [appNavClick, props.location]);

    return (auth && <Routes childProps={props} />);
};

App.propTypes = {
    location: PropTypes.object,
    history: PropTypes.object
};

export default routerParams(App);
