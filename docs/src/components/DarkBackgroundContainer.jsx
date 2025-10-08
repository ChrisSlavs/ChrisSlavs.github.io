import React from 'react'

import '../styles/DarkBackgroundContainer.css'

const DarkBackgroundContainer = ( {className, id, children} ) => {
  return (
    <div className={`dark-background-container ${className || ""}`}
          id={id}>
        {children}
    </div>
  )
}

export default DarkBackgroundContainer