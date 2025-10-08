import React from 'react';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

import Dashboard from './Dashboard';
import Plinko from './Plinko'


import { HIGH_RISK, LOW_RISK, MEDIUM_RISK, PLINKO_ROW_MINIMUM } from '../GlobalVariables';
import PlayButton from './PlayButton';
import { PostNewPlinkoRoundtoApi } from './GameApiHandler';
import { PlinkoRoundDto } from '../Dtos/PlinkoRound';
import { InputLabel, SelectLabel } from './FormObjectsLabeled';

import '../styles/PlinkoDashboard.css';

const RiskDropdown = ( { setRisk } ) => {
    return (
        <SelectLabel
            htmlFor={"risk"}
            label={"Risk"}
            options={[
                LOW_RISK,
                MEDIUM_RISK,
                HIGH_RISK
            ]}
            onChange={setRisk}
            selectClass={"game-option-input-select"}
        />
    )
}

const WagerInput = ( { wager, setWager } ) => {
    const [blur, setBlur] = useState(true);
    useEffect(() => {
        setWager(parseFloat(wager).toFixed(2));    
        setBlur(false);
        return () => {
            
        };
    }, [blur]);
    

    const handleOnBlur = ( ) => {
        if (wager === '' || isNaN(wager)) {
          setWager(parseFloat(0).toFixed(2));
        } else {
          setWager(parseFloat(wager).toFixed(2));
        }
        setBlur(true);
    }

    const HalfButton = () => {
        return (
            <button className='wager-change-button' id='half-button'>
                <div id='half-button-1'>1</div>
                <div id='half-button-slash'>/</div>
                <div id='half-button-2'>2</div>
            </button>
        )
    }

    const DoubleButton = () => {
        return (
            <button className='wager-change-button' id='double-button'>
                <div id='double-button-2'>2</div>
                <div id='double-button-x'>x</div>
            </button>
        )
    }

    return (
        <div className='wager-wrapper'>
            <InputLabel
                htmlFor={"wager"}
                type={"number"}
                onBlur={handleOnBlur}
                label={"Bet Amount"}
                value={wager}
                onChange={e => setWager(e.target.value)}
                inputClass={'game-option-input-select wager-input'}
                containerClass={'wager-input-label-container'}
            />
            <div className='wager-buttons-wrapper'>
                <DoubleButton />
                <HalfButton />
            </div>
        </div>
    )
}

const RowDropdown = ( {setRows} ) => {
    return (
        <SelectLabel
            htmlFor={"rows"}
            label={"Rows"}
            options={[
                8,9,10,11,12,13,14,15,16
            ]}
            onChange={setRows}
            selectClass={"game-option-input-select"}
        />
    )
}

const PlinkoSidebar = ( {setRisk, setRows} ) => {
    return (
        <>
            <RiskDropdown 
                setRisk={setRisk}
            />
            <RowDropdown 
                setRows={setRows}
            />
        </>
    )
}

const GameSideBar = ( { sidebarContent, id, wager, setWager, sendPost } ) => {
    return (
        <div className='game-sidebar' id={id}>
            <WagerInput 
                wager={wager}
                setWager={setWager}
            />
            {...sidebarContent}
            <PlayButton 
                onClick={sendPost}
                className={"game-sidebar-playbutton"}
            />
        </div>
    )
}

const PlinkoDashboard = () => {
    const [wager, setWager] = useState(0);
    const [risk, setRisk] = useState(LOW_RISK);
    const [rows, setRows] = useState(PLINKO_ROW_MINIMUM);

    const [validPlay, setValidPlay] = useState(true);
    const [playResponse, setPlayResponse] = useState(null);

    const handlePlay = async () => {
        const selectedCurrency = Cookies.get("currency");
        if (validPlay) {
            const d = await PostNewPlinkoRoundtoApi(
                new PlinkoRoundDto( 
                                    rows, 
                                    risk, 
                                    wager, 
                                    selectedCurrency
                                ));
            // redo call
            if (d !== null) {
                setPlayResponse(d);
            } else {
                console.error(new Error("Cannot Play!"));
            }
        } else {
            console.error( new Error("Cannot Play!"));
        }
    }
    
    useEffect(() => {
        return () => {
            
        };

    }, [risk, rows]);

    return (
        <>
            <Dashboard 
                mainPanel={ <Plinko 
                            rows={rows}
                            risk={risk}
                            position={playResponse == null ? 0 : playResponse.dropPosition}
                            multiplier={playResponse == null ? 0 : playResponse.multiplier}
                            winAmount={playResponse == null ? 0 : playResponse.result}
                            wager={wager}
                            setValidPlay={setValidPlay}
                        /> }
                sidebar={<GameSideBar
                            sidebarContent={[<PlinkoSidebar 
                                                risk={risk}
                                                setRisk={e => setRisk(e.target.value)}
                                                rows={rows}
                                                setRows={e => setRows(e.target.value)}
                                            />]}
                            wager={wager}
                            setWager={setWager}
                            sendPost={handlePlay}
                        />}
                sidePanelId={"game-dashboard-side-panel"}
                containerId={"game-dashboard-container"}
            />
        </>
  )
}

export default PlinkoDashboard