import Cookies from 'js-cookie';
import { CURRENCY_COIN, CURRENCY_SWEEP } from '../../../src/GlobalVariables';
import { EVENT_COIN_CHANGE, EVENT_SWEEP_CHANGE } from '../CustomEvents';
import { DAILY_BONUS_ENDPOINT, DAILY_BONUS_INFO_ENDPOINT } from '../../../ENDPOINTS';

export const dispatchWalletChangeEvent = (currency) => {
    const event = currency === CURRENCY_COIN ? EVENT_COIN_CHANGE : EVENT_SWEEP_CHANGE;
    return window.dispatchEvent(event);
}

export const handleUserData = (username, sweepAmount, coinAmount) => {
    Cookies.set('username', username);
    Cookies.set(CURRENCY_SWEEP, sweepAmount);
    Cookies.set(CURRENCY_COIN, coinAmount);
}

export const updateCurrencyFromFloat = (currency, amount) => {
    const cur = parseFloat(Cookies.get(currency));
    const delta = parseFloat(amount);
    console.log(cur, delta);
    console.log("New:", cur + delta);
    Cookies.set(currency, cur + delta);
    dispatchWalletChangeEvent(currency)
    
    return Cookies.get(currency);
}

export const updateCurrencyFromInt = (currency, amount) => {
    const cur = parseInt(Cookies.get(currency));
    const delta = parseInt(amount)
    Cookies.set(currency, cur + delta);
    dispatchWalletChangeEvent(currency)

    return Cookies.get(currency);
}

export const getUserCurrency = (currency) => {
    return (parseFloat((Cookies.get(currency)))).toFixed(2);
}

export const setSelectedCurrency = (currency) => {
    var selectedCur = currency;
    if (selectedCur !== CURRENCY_COIN || selectedCur !== CURRENCY_SWEEP) {
        selectedCur = CURRENCY_COIN;
       
    }
    Cookies.set("currency", selectedCur, { expires: 7 });
}

export const GetDailyBonusTimeLeft = async () => {
    try {
        const response = await fetch(DAILY_BONUS_INFO_ENDPOINT, {
            credentials:"include"
        });
        if (response.ok) {
            const d = await response.json();
            return d;
        }
    } catch (error) {
        console.log(error);
    }
}

export const GetDailyBonus = async () => {
    try {
        const response = await fetch(DAILY_BONUS_ENDPOINT, {
            credentials:"include"
        });
        if (response.ok) {
            const d = await response.json();
            updateCurrencyFromFloat(CURRENCY_COIN, d.coinAmount);
            updateCurrencyFromFloat(CURRENCY_SWEEP, d.sweepAmount);
            return true;
        }
        if (!response.ok) {
            return false
            /**
             * Handle with pop up panels when they are implemented
             * Users should not get this status with normal useage
             * as frontend blocks the submit button
             */
        }
    } catch (error) {
        console.log(error);
        return false;
    }
    return false;
}


// delete all local user data,
// revoke auth token
export const LogOut = async (cookies, homepageUrl, logoutURL) => {
    const response = await fetch(logoutURL , {
        credentials:'include'
    });
    if (response.ok) {
        cookies.forEach(c => {
            Cookies.remove(c);
    });

        //send to home page

        //reload
        window.location.reload();
    }
    

}