import React, { useState } from 'react'
import GameSelectionIcon from './GameSelectionIcon'
import ViewAllButton from './ViewAllButton'

import '../styles/GameSelectionMenu.css'

const GameSelectionMenu = ( { titleRouteIconList } ) => {
  const t = Object.keys(titleRouteIconList)[0];
  const games = Object.values(titleRouteIconList[t]);
  const [toggleViewAll, setViewAll] = useState(false);

  return (
    <div className='game-selection-wrapper'>
      <h1 className='game-selection-menu-title'>{t}</h1>
      <div className='game-selection-menu' id={toggleViewAll ? 'game-selection-menu-view-all' : 'game-selection-menu-view-all-false'}>
          {games.map((data, index) => (
            <GameSelectionIcon
              key={index}
              gameName={data["title"]}
              route={`../casino/games/${data["route"]}`}
              icon={data["icon"]}
            />
          ))}
      </div>
      <div id='game-selection-menu-view-all-button'>
        <ViewAllButton setViewAll={setViewAll} viewAll={toggleViewAll}/>
      </div>
    </div>
  )
}

export default GameSelectionMenu