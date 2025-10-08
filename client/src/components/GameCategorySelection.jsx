import React from 'react'

import '../styles/GameCategorySelection.css'

const GameCategorySelection = ( { id } ) => {
  return (
    <div className='game-category-selection-wrapper' id={id}>
        <button className='game-category-button' id={'lobby-category'}>Lobby</button>
        <button className='game-category-button' id={'better-bets-category'}>Better Bets Originals</button>
        <button className='game-category-button' id={'tables-category'}>Tables</button>
        <button className='game-category-button' id={'other-category'}>Other</button>
        <button className='game-category-button' id={'new-category'}>New</button>
    </div>
  )
}

export default GameCategorySelection