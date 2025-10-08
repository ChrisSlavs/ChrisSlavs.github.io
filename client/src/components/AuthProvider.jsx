import React, { createContext, useState, useEffect } from 'react'
import { AUTH_TEST } from '../../ENDPOINTS';
import Cookies from 'js-cookie';
import { EVENT_COIN_CHANGE, EVENT_SWEEP_CHANGE } from '../../libraries/CasinoLib/CustomEvents';

import { CURRENCY_SWEEP, CURRENCY_COIN } from '../GlobalVariables';

export const AuthContext = createContext(false);

const AuthProvider = ( {children} ) => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [allowedPlay, setAllowedPlay] = useState(false);
    const [fetchData, setFetchData] = useState(true);
    const [fetched, setFetched] = useState(false);

    const testAuthFetchData = async () => {
        try {
            const response = await fetch(AUTH_TEST, {
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            const d = await response.json();
            if (!Object.keys(d).length || d.result === 'failed')
            {
                setLoggedIn(false);
                return;
            }
            if (response.status === 200) {
                const u = d.user;
                Cookies.set(CURRENCY_SWEEP, u.sweepAmount);
                Cookies.set(CURRENCY_COIN, u.coinAmount);
                Cookies.set("username", u.username);
                setAllowedPlay(u.allowedPlay);
                setLoggedIn(true);
                window.dispatchEvent(EVENT_SWEEP_CHANGE);
                window.dispatchEvent(EVENT_COIN_CHANGE);
                setFetched(true);
            }
        } catch (error) {
            console.log(Error(error.message));
            setLoggedIn(false);
        }
    }

    useEffect(() => {
        testAuthFetchData();
        return () => {
            
        };
    }, []);

    useEffect(() => {
        if (!fetched && fetchData && (loggedIn || Cookies.get('.BetterBets') !== undefined))
        {
            testAuthFetchData();
        }
        return () => {
            
        };
    }, [fetchData, loggedIn]);

    const setLoginStatus = (val) => {
        setLoggedIn(val);
    }

    return (
        <AuthContext.Provider value={{loggedIn, 
                                     setLoginStatus, 
                                     fetchData, 
                                     setFetchData,
                                     allowedPlay
                                     }}>
            {children}
        </AuthContext.Provider>
  )
}

export default AuthProvider