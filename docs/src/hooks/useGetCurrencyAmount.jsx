import React, { useState, useEffect } from 'react'
import { CURRENCY_COIN, CURRENCY_SWEEP } from '../GlobalVariables';
import { getUserCurrency } from '../../libraries/CasinoLib/UserManagement/UserDataFunctions';

const useGetCurrencyAmount = ( ) => {
    const [coin, setCoin] = useState(getUserCurrency(CURRENCY_COIN));
    const [sweep, setSweep] = useState(getUserCurrency(CURRENCY_SWEEP));

    useEffect(() => {
        
        const valueChangedHandler = (e) => {
            if (e.detail.currency === CURRENCY_COIN) {
                setCoin(getUserCurrency(CURRENCY_COIN));
            } else if (e.detail.currency === CURRENCY_SWEEP) {
                setSweep(getUserCurrency(CURRENCY_SWEEP));
            }
        }

        window.addEventListener("walletValueChanged", valueChangedHandler);
        return () => {
            window.removeEventListener("walletValueChanged", valueChangedHandler);
        };
    }, []);

    return {
        coin, 
        sweep
    };
}

export default useGetCurrencyAmount