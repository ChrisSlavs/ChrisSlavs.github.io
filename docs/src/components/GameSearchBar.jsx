import React, { useState, useEffect } from 'react'

import searchIcon from '../assets/SearchIcon.svg';
import GameSelectionIcon from './GameSelectionIcon';

import '../styles/GameSearchBar.css';

import { GAMES_LIST } from '../ClientGameRoutes';

import { Modal } from './Modal'

const GameSearchBar = ( { wrapperId, searchBarId, resultsId } ) => {
    const [showResults, setShowResults] = useState(false);
    const [results, setResults] = useState([]);
    const [gameList, setGameList] = useState([]);
    const [searchVal, setSearchVal] = useState('');

    useEffect(() => {
        const gListTemp = [];
        GAMES_LIST.forEach(elements => {
            for (const e in elements) {
                // console.log(elements[e]);
                for (const g in elements[e]) {
                    const data = elements[e][g];
                    const title = data['title'];
                    const icon = data['icon'];
                    const route = data['route'];
                    gListTemp.push({'title': title, 'icon':icon, 'route':route});
                }
            }
        });
        setGameList(gListTemp);
        return () => {
            
        };
    }, [GAMES_LIST]);

    const handleInput = (event) => {
        setSearchVal(event.target.value.toLowerCase());

        if (searchVal.length >= 3) {
            toggleShowMenu();
            const res = [];
            gameList.forEach(data => {
                let match = true;
                const t = data['title'];
                for (let i = 0; i < searchVal.length; i++) {
                    if (searchVal[i] === t[i].toLowerCase()) {
                        continue;
                    }
                    else {
                        match = false;
                        break;
                    }
                }
                if (match) {
                    res.push([t, data['icon'], data['route']])
                }
            });
            setResults(res);
        }
        return;
    }

    const toggleShowMenu = () => {
        setShowResults(true);
    }

    const handleClose = () => {
        setShowResults(false);
    }

    const SearchResultsMenu = () => {
        return (
            <div className='search-results-wrapper' id={resultsId}
                >
                {results.map((data, i=0) => 
                        <GameSelectionIcon 
                            gameName={data[0]}
                            icon={data[1]}
                            route={`../casino/games/${data[2]}`}
                            key={i++} />
                )}
            </div>
        )
    }

    return (
        <>
            <div className='search-bar-wrapper' 
                id={wrapperId} 
                style={{zIndex: showResults ? 2 : ""}}>
                <input type="text" placeholder='Search...' className='search-bar' id={searchBarId} 
                    autoComplete='off'
                    value={searchVal}
                    onChange={(event) => {handleInput(event)}}
                    onBlur={() => setSearchVal('')}
                    />
                <img  className='search-bar-icon' src={searchIcon} alt="search bar" />
            </div>
            <Modal
                menu={SearchResultsMenu()}
                open={showResults}
                onClose={handleClose}
            />
        </>
    )
}

export default GameSearchBar