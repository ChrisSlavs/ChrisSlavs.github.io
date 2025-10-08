import React from 'react'
import '../styles/Buttons.css'
import { GradientBoxGreen } from './GradientBox'

export const Button = ( { className, id, onClick, type, text, disabled=false } ) => {
  return (
    <button className={`premade-button ${className || ""}`}
            id={id}
            type={type}
            onClick={onClick}
            disabled={disabled}>
            {text}
    </button>
  )
}

export const GreenButton = ( { className, id, onClick, type, text, disabled=false  } ) => {
  
  return (
    <Button 
      className={`green-button ${className || ""}`} 
      id={id} 
      onClick={onClick} 
      type={type} 
      text={text} 
      disabled={disabled}
    />
  )
}

export const GoldButton = ( { className, id, onClick, type, text, disabled=false  } ) => {
  return (
    <Button 
      className={`gold-button ${className || ""}`}  
      id={id} 
      onClick={onClick} 
      type={type} 
      text={text} 
      disabled={disabled}
    />
  )
}

export const CloseButton = ( { closeFunction } ) => {
  return (
    <Button className={'close-button'} 
            onClick={closeFunction}
            text={"X"}/>
  )
}