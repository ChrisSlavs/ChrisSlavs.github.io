import React, { useState } from 'react';
import { Button } from './Buttons'
import TriangleUp from './TriangleUp'
import DarkBackgroundContainer from './DarkBackgroundContainer'
import BorderedContainer from './BorderedContainer';
import { TitledTextBox } from './TitledTextBox'
import ClickAwayListener from './ClickAwayListener';
import '../styles/GameCanvas.css';

/**
 * 
 * @param {odds} formatted as {Results:[], Probabilities:[]} 
 * @returns 
 */
const GameCanvasReact = ( { canvasRef, id, odds=null } ) => {
  const [openOddsMenu, setOpenOddsMenu] = useState(false);

  const OddsMenu = () => {
    

    const OddsMenuItem = ( {result, probability} ) => {
      return (  
        <div className='odds-menu-container'>
          <span className='results-container'>
              {result + "x"}
          </span>
          <span className='probs-container'>
              {probability}
          </span>
        </div>
      )
    }
    
    const Content = () => {
      return (
        <div className='odds-menu-content-container'>
          {odds.Results.map((result, index) => (
            <OddsMenuItem
              key={index}
              result={result}
              probability={(parseFloat(odds.Probabilities[index]) * 100).toFixed(4) + "%"} />
          ))}
        </div>
      )
    }


    return (
      <>
        <TriangleUp id={"odds-menu-triangle"}/>
          <BorderedContainer className='odds-menu-border'>
            <DarkBackgroundContainer className='odds-menu'>
              <TitledTextBox
                title={<div className='odds-menu-title'>
                          <span>Result</span>
                          <span>Probability</span>
                      </div>}
                content={<Content />}>
              </TitledTextBox>
            </DarkBackgroundContainer>
          </BorderedContainer>
      </>
    )
  }

  return (
    <div className='game-canvas-assets-container'>
      { odds !== null 
                ? <ClickAwayListener onClickAway={() => setOpenOddsMenu(false)}>
                    <div className='odds-button-menu-container'>
                      <Button className='odds-menu-button' text={"?"}
                        onClick={() => setOpenOddsMenu(!openOddsMenu)}
                      />
                      { openOddsMenu && <OddsMenu />}
                    </div>
                  </ClickAwayListener>
                : null}
      <canvas ref={canvasRef} className='game-canvas' id={id}/>
    </div>
    
  )
}

export default GameCanvasReact