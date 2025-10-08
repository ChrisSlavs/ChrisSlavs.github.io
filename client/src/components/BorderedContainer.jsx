import React from 'react'

import "../styles/BorderedContainer.css"

const BorderedContainer = ( { children, className, id } ) => {
  return (
    <div className={`bordered-container ${className || ""}`} id={id}>{children}</div>
  )
}

export default BorderedContainer