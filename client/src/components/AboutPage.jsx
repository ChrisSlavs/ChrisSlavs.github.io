import React from 'react'
import DarkBackgroundContainer from './DarkBackgroundContainer'
import BorderedContainer from './BorderedContainer'
import { TitledTextBox } from './TitledTextBox'

import '../styles/About.css'
import { SITE_NAME } from '../GlobalVariables'

const AboutPage = () => {
  return (
    <DarkBackgroundContainer className={'about-page-container'}>
        <BorderedContainer className={'about-page-inner-container'}>
            <TitledTextBox
                title={"About"}
                content={<p>
                            Welcome to {SITE_NAME} - an innovative sweepstakes casino delivering premium gaming experiences exclusively to US players.
                            <h4 className='about-page-header'>Our Mission</h4>
                            We're dedicated to providing exceptional online entertainment in a safe, secure environment while continuously elevating the player experience through cutting-edge technology and engaging gameplay.
                            <h4 className='about-page-header'>What We Offer</h4>
                            As a US-focused sweepstakes casino, we combine the excitement of casino-style games with legal sweepstakes promotions, ensuring compliance across all jurisdictions where we operate. Our platform prioritizes quality gaming experiences that put players first.
                            <h4 className='about-page-header'>Growing With You</h4>
                            We're currently expanding our platform to bring you more premium games and enhanced features. While building our collection, we focus on quality over quantity - ensuring every game meets our high entertainment standards.
                            <p className='about-page-list-header'>Our development includes:</p>
                            <ul className='about-page-list'>
                                <li>Expanding game selection with popular slots and table games</li>
                                <li>Enhanced mobile compatibility and user experience</li>
                                <li>Innovative promotional campaigns and player rewards</li>
                                <li>Advanced player features and personalization</li>
                            </ul>
                            <h4 className='about-page-header' id="our-commitment">Our Commitment</h4>
                            <p className='about-page-commitments'><span>Player Experience First</span> - Every decision prioritizes your satisfaction, from game selection to customer support.</p>
                            <p className='about-page-commitments'><span>Security & Trust</span> - Industry-leading security measures protect your information and ensure fair play.</p>
                            <p className='about-page-commitments'><span>Responsible Gaming</span> - We promote healthy gaming habits and provide support resources.</p>
                            <h4 className='about-page-header'>Join Us</h4>
                            We're building something special - a gaming platform that truly puts players first. Thank you for being part of our journey.
                        </p>}
            />
        </BorderedContainer>
    </DarkBackgroundContainer>
  )
}
export default AboutPage