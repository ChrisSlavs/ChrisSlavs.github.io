import React from 'react'
import { NavLink } from 'react-router-dom'

import '../styles/ActiveLink.css'

const ActiveLink = ( { children, to } ) => {
  return (
    <NavLink 
        className={({ isActive }) => isActive ? 'active-link' : 'inactive-link'} 
        to={to}>
            <span>
                {children}
            </span>
    </NavLink>
  )
}

export default ActiveLink