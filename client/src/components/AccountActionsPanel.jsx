import React from 'react'

import BorderedContainer from './BorderedContainer'
import DarkBackgroundContainer from './DarkBackgroundContainer'

import '../styles/AccountActionsPanel.css'

const AccountActionsPanel = ( { children, headerImg } ) => {
  
    return (
        <DarkBackgroundContainer>
            <BorderedContainer id={"account-actions-panel"}>
                <div className='account-actions-img-wrapper'>
                    {headerImg}
                </div>
                {children}
            </BorderedContainer>
        </DarkBackgroundContainer>
    )
}



export default AccountActionsPanel