import React from 'react'

import { Modal } from './Modal'
import BorderedContainer from './BorderedContainer'
import DarkBackgroundContainer from './DarkBackgroundContainer'
import { TitledTextBox } from './TitledTextBox'

import Construction from '../assets/Construction.svg'

import '../styles/UnderConstructionModal.css'

const UnderConstructionModal = () => {
    const Menu = () => {
        return (
            <BorderedContainer className={"under-construction-outer-container"}>
                <DarkBackgroundContainer className={"under-construction-content-container"}>
                    <TitledTextBox
                        title={"Under Construction"}
                        content={                    
                            <div className='under-construction-text-container'>
                                <img src={Construction}/>
                                <div>Sorry, this website is still under construction.</div>
                            </div>}
                    />
                </DarkBackgroundContainer>
            </BorderedContainer>
        )
    }

    // open always true to prevent closure
  return (
    <Modal 
        open={true}
        menu={<Menu />}/>
  )
}

export default UnderConstructionModal