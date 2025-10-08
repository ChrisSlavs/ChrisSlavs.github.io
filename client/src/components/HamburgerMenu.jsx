import React, { useRef } from 'react'

import '../styles/HamburgerMenu.css'

const HamburgerMenu = ( { id, onClick, onAnimationEnd } ) => {
  const hamburgerRef = useRef(null);
  
  return (
    <button className='hamburger-button' ref={hamburgerRef} id={id} onClick={onClick} onAnimationEnd={onAnimationEnd}>
        <span className='hamburger-lines' id='line-1'></span>
        <span className='hamburger-lines' id='line-2'></span>
        <span className='hamburger-lines' id='line-3'></span>
    </button>
  )
}

export default HamburgerMenu