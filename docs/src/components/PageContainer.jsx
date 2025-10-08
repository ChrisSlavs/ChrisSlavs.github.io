import React, { useContext } from 'react'
import { Outlet } from 'react-router-dom';

import HeaderMenuContent from './HeaderMenuContent';
import SideNavBar from './SideNavBar';

import '../styles/PageContainer.css';
import { AuthContext } from './AuthProvider';
import UnderConstructionModal from './UnderConstructionModal';

const PageContainer = () => {  
  const { loggedIn } = useContext(AuthContext);

  return (
    
    <div className='page-container'>
      <SideNavBar 
        hamburgerId={'page-container-side-nav-hamburger'}
      />
      <div className='header-menu-background'>
        <div className='page-container-header-menu-content-wrapper'
          id={loggedIn ? '' : "page-container-header-menu-content-wrapper-logged-out"}>
          <HeaderMenuContent />
        </div>
      </div>
      <div id='page-spacer' />
      <div className='main-panel'>
        <div className='main-panel-content-wrapper'>
          <Outlet />
        </div>
      </div>

      {/* {<UnderConstructionModal/>} */}
    </div>
  )
}

export default PageContainer