import React from 'react'

import '../styles/TeeBetsTitles.css';
import { SITE_NAME, SITE_NAME_SHORT } from '../GlobalVariables';

export const TeeBetsTitle = ( { id } ) => {
  return (
    <h1 className='header-menu-site-name' id={id}>{SITE_NAME}</h1>
  )
}

export const TeeBetsTitleLink = ( { id } ) => {
    return (
      <a className='header-menu-site-name' id={id}>{SITE_NAME}</a>
  )
}

export const TeeBetsAbbreviated = ( { id } ) => {
  return (
    <a className='header-menu-site-name' id={id}>{SITE_NAME_SHORT}</a>
  )
  
}