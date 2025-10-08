import React from 'react';

import GameSelectionMenu from './GameSelectionMenu';
import AdBanner from './AdBanner';
import GameSearchBar from './GameSearchBar';
import GameCategorySelection from './GameCategorySelection';

import '../styles/CasinoHome.css';

import { BetterBetsGames, BetterBetsGames2 } from '../ClientGameRoutes';
const bBOriginals = BetterBetsGames;
const bb2 = BetterBetsGames2;

const CasinoHome = () => {
  return (
      <div className='casino-home'>
        <AdBanner />
          <div className='casino-home-games'>
            <GameSearchBar 
              wrapperId={'game-selection-menu-search-bar'}
            />
            <div className='casino-home-category-wrapper'>
              <GameCategorySelection />
            </div>
            <GameSelectionMenu 
              titleRouteIconList={bBOriginals}
            />
            <GameSelectionMenu 
              titleRouteIconList={bb2}
            />
          </div>
      </div>
  )
}

export default CasinoHome