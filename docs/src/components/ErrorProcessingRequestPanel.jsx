import React from 'react'
import AccountActionsPanel from './AccountActionsPanel'

import RedX from '../assets/RedX.svg'

import '../styles/ErrorProcessingRequestPanel.css'

const ErrorProcessingRequestPanel = () => {
  return (
    <AccountActionsPanel
        headerImg={<img src={RedX} className='error-processing-panel-img'/>}
    >
      <h3>
        Error processing request
      </h3>
      <p>
        Please try again later
      </p>
    </AccountActionsPanel>

  )
}

export default ErrorProcessingRequestPanel