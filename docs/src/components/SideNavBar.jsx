import { useState } from 'react';
import { Link } from 'react-router-dom';

import HamburgerMenu from './HamburgerMenu';

import playButton from '../assets/playbutton.svg';
import '../styles/SideNavBar.css';
import homeIcon from '../assets/house.svg';
import pokerChipIcon from '../assets/pokerchip.svg';
import aboutIcon from '../assets/about.svg';

export const LinkWithIcon = ( {to, imgSrc, altText, text, id, imgId, imgClass, className=null} ) => {
    return (
        <Link to={to} id={id} className={className===null ? 'link-with-icon' : className}>
            <img src={imgSrc} alt={altText} id={imgId} className={imgClass}/>
            {text}
        </Link>
    )
}

const SideNavBar = ( { hamburgerId } ) => {
    const [isNavbarOpen, setIsNavbarOpen] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    return (
        <>
            <div className='hamburger-wrapper'>
                <HamburgerMenu 
                    id={isNavbarOpen ? 'side-nav-bar-hamburger-arrow' : 'side-nav-bar-hamburger'}
                    onClick={() => {setIsNavbarOpen(!isNavbarOpen)
                                    }
                            }
                />
            </div>
            { (isNavbarOpen || isAnimating ) && 
                <nav className='side-nav-bar-container' 
                     id={isNavbarOpen ? 'opened' : 'closed'}
                     onAnimationEnd={() => setIsAnimating(!isAnimating)}
                >
                    <Link to='/casino/home' id='side-nav-bar-play-button'>
                            <img src={playButton} alt="Play Now" className='side-nav-bar-play-button-img' />
                            <div className='sidebar-play-text'>PLAY</div>
                    </Link>
                    <div className='side-nav-bar-link-list-wrapper'>
                        <ul className='side-nav-bar-ul'>
                            <li className='navbar-link' id='navbar-link-casino'>
                                <LinkWithIcon 
                                    to='/casino/home' 
                                    imgSrc={pokerChipIcon} 
                                    altText={"casino button"}
                                    text={"Casino"}
                                />
                                
                            </li>
                            <li className='navbar-link' id='navbar-link-home'>
                                <LinkWithIcon 
                                    to="/"
                                    imgSrc={homeIcon}
                                    altText={"home button"}
                                    text={"Home"}
                                />
                            </li>
                            <li className='navbar-link'>
                                <LinkWithIcon 
                                    to={'/about'}
                                    imgSrc={aboutIcon}
                                    altText={"about button"}
                                    text={"About"}
                                />
                            </li>
                        </ul>
                    </div>
                </nav>
            }
        </>
    )
}       

export default SideNavBar