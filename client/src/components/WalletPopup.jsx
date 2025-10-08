import React, { useState, useEffect } from 'react'

import { Modal } from './Modal'
import { TitledTextBox } from './TitledTextBox.jsx'
import DarkBackgroundContainer from './DarkBackgroundContainer.jsx'
import BorderedContainer from './BorderedContainer.jsx'
import useGetCurrencyAmount from '../hooks/useGetCurrencyAmount.jsx'
import { CURRENCY_COIN, CURRENCY_SWEEP, DAILY_BONUS_COIN, DAILY_BONUS_SWEEP } from '../GlobalVariables.js'
import CoinIcon from "../assets/CoinIcon.svg"
import SweepIcon from "../assets/SweepIcon.svg"
import { GreenButton } from './Buttons.jsx'
import { GetDailyBonus, GetDailyBonusTimeLeft } from '../../libraries/CasinoLib/UserManagement/UserDataFunctions.jsx'
import Countdown from './Countdown.jsx'

import "../styles/WalletPopup.css"

const ActiveButton = ( {        
                                text,  
                                activeClassName="button-active", 
                                inactiveClassName="button-inactive", 
                                activeId="button-active-id", 
                                inactiveId="button-inactive-id",
                                onClick,
                                active=false
                            } ) => {
    
    return (
        <button className={active ? activeClassName : inactiveClassName}
                id={active ? activeId : inactiveId}
                onClick={() => onClick()}
            >
            {text}
        </button>
    )
}

export const CurrencyInfoOneUserAmounts = () => {
    const {coin, sweep} = useGetCurrencyAmount();

    return (
        <CurrencyInfoOne 
            coin={coin}
            sweep={sweep}
        />
    )
} 

export const CurrencyInfoOne = ( { coin, sweep } ) => {

    return (
        <div className='currency-info-one-container'>
            <CurrencyTitleIcon
                currency={CURRENCY_SWEEP}
                icon={SweepIcon}
                amount={parseFloat(sweep).toFixed(2)}
            />
            <CurrencyTitleIcon
                currency={CURRENCY_COIN}
                icon={CoinIcon}
                amount={parseFloat(coin).toFixed(2)}
            />
        </div>
    )
}

export const CurrencyTitleIcon = ( { currency, icon, amount } ) => {
    const title = currency.charAt(0).toUpperCase() + currency.slice(1);
    return (
        <div>
            <h4 className='currency-overview-name'>
                {title}
            </h4>
            <div className='currency-overview-icon-amount-container'>
                <img className='currency-overview-icon' src={icon} alt={title} />
                <span className='currency-overview-amount'>
                    {amount}
                </span>
            </div>
        </div>
    )
}

const WalletOverview = () => {
    return (
        <TitledTextBox 
            title={"Overview"}
            content={<CurrencyInfoOneUserAmounts/>}
        />
    )
}

const CurrencyInfoOneDailyBonus = () => {
    const [disabled, setDisabled] = useState(true);
    // do not update after timer runs out, looks better
    // but only if timer was originally showing upon opening menu
    const [showTimer, setShowTimer] = useState(false)
    const [buttonText, setButtonText] = useState("Claim");
    const [claimDate, setClaimDate] = useState(null);
    const [buttonClicked, setButtonClicked] = useState(true);

    useEffect(() => {
        
        const handleClaimDate = async () => {
            if (claimDate === null) {
                const d = await GetDailyBonusTimeLeft();
                const claim = new Date(d);
                // adjust for local timezone
                claim.setMinutes(claim.getMinutes() - (new Date()).getTimezoneOffset());;
                setClaimDate(claim);
            }
        }

        handleClaimDate();
        return () => {
            
        };
    }, [buttonClicked]);

    useEffect(() => {
        var dateNow = new Date();
        const timeRemaining = claimDate - dateNow;
        if (timeRemaining <= 0) {
            setShowTimer(false);
            setDisabled(false);
        } else {
            setShowTimer(true);
            setDisabled(true);
        } 
        
        return () => {
            
        };
    }, [claimDate, buttonClicked]);

    const handleOnClick = async () => {
        if (await GetDailyBonus()) {
            setButtonText("Daily Bonus Claimed!")
        }
        setButtonClicked(!buttonClicked);
    }


    const Content = () => {
        return (
            <div className='daily-bonus-content-container'>
                <CurrencyInfoOne 
                    coin={DAILY_BONUS_COIN}
                    sweep={DAILY_BONUS_SWEEP}
                />
                { showTimer &&
                    <Countdown
                        eventDate={claimDate}
                        onEnd={() => {setDisabled(false)}}
                    />
                }
                <GreenButton className="daily-bonus-claim-button"
                            text={buttonText}
                            onClick={handleOnClick}
                            disabled={disabled}
                />
            </div>
        )
    }

    return (
        <TitledTextBox
            title={"Daily Bonus"}
            content={<Content />}
        />
    )
}

const WalletPopup = ( { open=false, closeFunc } ) => {
    const [openDeposit, setOpenDeposit] = useState(false);
    const [openRedeem, setOpenRedeem] = useState(false);
    const [openDaily, setOpenDaily] = useState(false);

    const onClickHandler = (openDepositBool, openRedeemBool, openDailyBool) =>
    {
        setOpenDeposit(openDepositBool);
        setOpenRedeem(openRedeemBool);
        setOpenDaily(openDailyBool);   
    }

    const Menu = () => {
        return (
            <BorderedContainer id='wallet-popup-container'>
                <DarkBackgroundContainer>
                    <div className='wallet-popup-header'>
                        <ActiveButton text={"Deposit"}
                                    onClick={() => onClickHandler(true, false, false)}
                                    active={openDeposit}/>
                        <ActiveButton text={"Redeem"}
                                    onClick={() => onClickHandler(false, true, false)}
                                    active={openRedeem}/>
                        <ActiveButton text={"Daily Bonus"}
                                    onClick={() => onClickHandler(false, false, true)}
                                    active={openDaily}/>
                    </div>
                    <div className='wallet-popup-sub-container'>
                        { openRedeem &&
                            <WalletOverview />
                        }
                        { openDeposit &&
                            <WalletOverview />
                        }
                        { openDaily &&
                            <CurrencyInfoOneDailyBonus />
                        }
                    </div>
                </DarkBackgroundContainer>
            </BorderedContainer>
        )
    }

    return (
        <>
            <Modal
                open={open}
                onClose={closeFunc}
                menu={<Menu/>}/>
        </>
  )
}

export default WalletPopup