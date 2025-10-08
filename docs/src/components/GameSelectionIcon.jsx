import React from 'react'
import { Link } from 'react-router-dom'

import "../styles/GameSelectionIcon.css"

const GameSelectionIcon = ( { gameName, route, icon } ) => {
  return (
      <Link to={route} className='game-selection-icon-wrapper-link'>
        <img src={icon} alt={gameName} className='game-selection-icon'/>
        <h2 className='game-selection-icon-header' >{gameName}</h2>
      </Link>
  )
}

export default GameSelectionIcon