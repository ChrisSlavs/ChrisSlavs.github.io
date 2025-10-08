import React, { useState, useEffect, useRef } from 'react'
import Cookies from "js-cookie";

import DownArrow from './DownArrow';
import UpArrow from './UpArrow';
import coinIcon from '../assets/CoinIcon.svg';
import sweepIcon from '../assets/SweepIcon.svg';

import { CURRENCY_COIN, CURRENCY_SWEEP } from '../GlobalVariables.js';

import '../styles/HeaderWallet.css'
import WalletPopup from './WalletPopup.jsx';
import useGetCurrencyAmount from '../hooks/useGetCurrencyAmount.jsx';

const HeaderWallet = ( { } ) => {
    const [toggleMenu, setToggleMenu] = useState(false);
    const [currentCurrency, setCurrentCurrency] = useState(Cookies.get('currency') === CURRENCY_SWEEP ? CURRENCY_SWEEP : CURRENCY_COIN);
    const currencySelectionMenuRef = useRef(null);
    //const [render, setRender] = useState(false);
    const [showWallet, setShowWallet] = useState(false);
    const {coin, sweep} = useGetCurrencyAmount();

    const WalletButton = () => {
        return (
            <button className='wallet-button'
                    onClick={() => setShowWallet(true)}>
                <span>Wallet</span>
            </button>
        )
    }

    useEffect(() => {
        function handleClickOutside(event) {
          if (currencySelectionMenuRef.current && !currencySelectionMenuRef.current.contains(event.target)) {
            setToggleMenu(false);
          }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleToggleMenu = () => {
        setToggleMenu(!toggleMenu);
    }

    return (
        <div className='header-wallet-button-wallet-container'>
            <div ref={currencySelectionMenuRef} className='header-wallet-amount-selection-container' onClick={toggleMenu ? handleToggleMenu : () => {}}>
                <button className='wallet-container' id="currency-button" onClick={toggleMenu ? () => {} : handleToggleMenu}>
                    { !toggleMenu && (
                        <DownArrow 
                            arrowId={'arrow'}
                        />
                    )}
                    { toggleMenu && (
                        <UpArrow 
                            arrowId={'up-arrow-id'}
                        />
                    )}
                    <img src={currentCurrency == CURRENCY_COIN ? coinIcon : sweepIcon} id='currency-icon' alt='Currency Icon'/>
                </button>
                <span className='wallet-container' id='amount-text-box'>{(currentCurrency == CURRENCY_COIN ? coin : sweep)}</span>
                { toggleMenu && (
                    <button className='currency-selection-menu' onClick={handleToggleMenu} onBlur={handleToggleMenu}> 
                        <span className='currency-selection' id='sweep-selection' onClick={() => setCurrentCurrency(CURRENCY_SWEEP)}>
                            <img src={sweepIcon} alt="Sweep Icon" className='selection-icon'/>
                            <span>{sweep}</span>
                        </span>
                        <span className='currency-selection' id='coin-selection' onClick={() => setCurrentCurrency(CURRENCY_COIN)}>
                            <img src={coinIcon} alt="Casino Coin Icon" className='selection-icon'/>
                            <span>{coin}</span>
                        </span>
                    </button>
                )}
            </div>
            <WalletButton />
            <WalletPopup 
                open={showWallet}
                closeFunc={() => setShowWallet(false)}
            />
        </div>
  )
}

export default HeaderWallet