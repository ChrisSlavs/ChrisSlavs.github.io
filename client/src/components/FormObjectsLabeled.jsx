import React, { isValidElement } from 'react'

import '../styles/FormObjectsLabeled.css'

export const InputLabel = ( { htmlFor, type, containerClass, labelClass, inputClass, onChange=null, onBlur=null, value, label, autoComplete, required=false, name } ) => {
  return (
    <div className={`form-label-container ${containerClass || ""}`}>
        <label htmlFor={htmlFor} className={labelClass}>{label}</label>
        <input type={type} id={htmlFor} value={value} className={inputClass} name={name}
          onChange={onChange} onBlur={onBlur} autoComplete={autoComplete} required={required}/>
    </div>
  )
}

export const SelectLabel = ( { htmlFor, type, containerClass, labelClass, selectClass, onChange, onBlur, onClick, options, label } ) => {
  
  const GetOptions = () => {
    if (isValidElement(options)) {
      return (
        options
      )
    } else {
        return  (
          options.map(o => (
            <option key={o} value={o}>{o}</option>
        )))
    }
  }
  
  const o = GetOptions();
  return (
    <div className={`form-label-container ${containerClass || ""}`}>
        <label htmlFor={htmlFor} className={labelClass}>{label}</label>
        <select type={type} id={htmlFor} className={selectClass} onChange={onChange} onBlur={onBlur} onClick={onClick}>
          {o}
        </select>
    </div>
  )
}