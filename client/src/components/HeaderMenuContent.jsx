import React, { useContext, useState, useEffect } from 'react'

import HeaderWallet from './HeaderWallet';
import ChatButton from './ChatButton';
import UserButton from './UserButton';
import GameSearchBar from './GameSearchBar';
import { TeeBetsAbbreviated, TeeBetsTitleLink } from './TeeBetsTitles';
import { RegisterButton, SignInButton } from './RegisterSignIn';
import { AuthContext } from './AuthProvider';

import '../styles/HeaderMenuContent.css';

const HeaderMenuContent = ( {} ) => {
  const { loggedIn } = useContext(AuthContext)

  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      { width <= 768 ?  <TeeBetsAbbreviated 
                        id="header-title"
                        /> :
                        <TeeBetsTitleLink
                        id="header-title"
                        /> 
}

        { loggedIn &&
          <>
            <HeaderWallet/>
            <div className='header-menu-icon-search-wrapper'>
              <ChatButton
              />
              <UserButton
              />
              <GameSearchBar 
                  wrapperId={'search-wrap'}
                  searchBarId={'search-bar'}
                  resultsId={"results-id"}
              />
            </div>
          </>
        }
      { !loggedIn && 
          <div className='register-sign-in-buttons-wrapper'>
              <SignInButton />
              <RegisterButton />
          </div>

      }

    </>
  )
}

export default HeaderMenuContent