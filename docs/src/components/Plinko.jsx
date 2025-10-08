import React, { useRef, useEffect, useState } from 'react';
import { Game, GameCanvas } from '../games/Plinko/Plinko.js';
import GameCanvasReact from './GameCanvasReact.jsx';
import { GetPlinkoOddsItems } from '../../libraries/CasinoLib/CasinoFunctions.js';
import "../styles/PlinkoGameCanvas.css" 
import { GAME_CANVAS_HEIGHT, GAME_CANVAS_WIDTH, HIGH_RISK, LOW_RISK, MEDIUM_RISK, PLINKO_ROW_MAXIMUM, PLINKO_ROW_MINIMUM } from '../GlobalVariables.js';

const Plinko = ( { rows, risk, position, multiplier, winAmount, wager, setValidPlay } ) => {
  const canvasRef = useRef(null);
  const gameRef = useRef(null);
  const [odds, setOdds] = useState([]);

  useEffect(() => { 
    setValidPlay(true);

    if (canvasRef.current && 
        (rows >= PLINKO_ROW_MINIMUM && rows <= PLINKO_ROW_MAXIMUM) &&
        (risk == LOW_RISK || risk == MEDIUM_RISK || risk == HIGH_RISK)) {
      if (!gameRef.current) {
        const context = canvasRef.current.getContext('2d');
        window.devicePixelRatio = 2 || 1;
        const dpr = window.devicePixelRatio;
  
        canvasRef.current.style.width = GAME_CANVAS_WIDTH;
        canvasRef.current.style.height = GAME_CANVAS_HEIGHT;
  
        canvasRef.current.width = GAME_CANVAS_WIDTH * dpr;
        canvasRef.current.height = GAME_CANVAS_HEIGHT * dpr;
        context.scale(dpr, dpr);
  
        const canvas = new GameCanvas(context);

        gameRef.current = new Game(canvas, risk, rows);
      } else {
        gameRef.current.kill();
        gameRef.current.initAll(risk, rows);
      }
      gameRef.current.run();
    }

    return () => {
      gameRef.current.kill();
      gameRef.current = null;
    };

  }, [rows, risk]);

  useEffect(() => {
    if (position && multiplier) {
      gameRef.current.dropChip(position, multiplier, winAmount, wager);
    }
  }, [position]);

  useEffect(() => {
    const getOdds = async () => {
      const d = await GetPlinkoOddsItems("/src/games/Plinko/PlinkoData.json", rows, risk);
      setOdds(d);
    }
    getOdds();

  return () => {
      
    };
  }, [rows, risk]);

  return ( 
    <GameCanvasReact 
      canvasRef={canvasRef} 
      id={"plinko-game-canvas"}
      odds={odds}
    />
  )
}

export default Plinko