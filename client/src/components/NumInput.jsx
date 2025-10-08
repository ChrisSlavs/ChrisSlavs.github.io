import React from 'react'
import { handleFloatChange, handleNumChange } from './HandleChange'

/**
 * @param { placeholder, step } props 
 * @returns 
 */
export function FloatInput( {placeholder, step, value, setValue, id, onBlur} ) {    
  return (
    <input id={id} 
          type="number" 
          value={value} 
          placeholder={placeholder} 
          step={step}
          onBlur={onBlur} 
          onChange={handleFloatChange(setValue)}
          /> 
  )
}

export function NumInput( {placeholder, step, value, setValue, id} ) {    
  return (
    <input id={id} 
          type="number" 
          value={value} 
          placeholder={placeholder} 
          step={step} 
          onChange={handleNumChange(setValue)}
          /> 
  )
}