import React from 'react'

import DropDownMenu from './DropdownMenu';
import { LinkWithIcon } from './SideNavBar';

import userButtonIcon from '../assets/UserButtonIcon.svg';
import accountButtonIcon from '../assets/User2.svg';
import walletIcon from '../assets/wallet.svg';
import logoutIcon from '../assets/logout.svg';
import '../styles/UserButton.css';



const UserButton = () => {
  const iClassName = "dropdown-menu-item"
  const menuItems=[
    <LinkWithIcon 
      to={"/account/email"}
      imgSrc={accountButtonIcon}
      altText={"Account"}
      text={"Account"}
      id={"dropdown-account"}
      imgId={"dropdown-account-img"}
      imgClass={"dropdown-img"}
      className={iClassName}
    />,
    <LinkWithIcon
      to={"user/wallet"}
      imgSrc={walletIcon}
      altText={"Wallet"}
      text={"Wallet"}
      id={"dropdown-wallet"}
      imgId={"dropdown-wallet-img"}
      className={iClassName}
      imgClass={"dropdown-img"}
    />,
    <div onClick={() => null}>
      <LinkWithIcon 
        to={"/"}
        imgSrc={logoutIcon}
        altText={"Logout"}
        text={"Logout"}
        id={"dropdown-logout"}
        imgId={"dropdown-logout-img"}
        className={iClassName}
        imgClass={"dropdown-img"}
      />
    </div>
  ]
  
  return (
    <DropDownMenu
      Button={
          <button className='user-button'>
            <div className='inside-square'>
              <img src={userButtonIcon} alt="user" className='user-button-image'/>
            </div>
          </button>
        }
        menuItems={menuItems}
        triangleId={'dropdown-triangle-align-left'}
        />
  )
}



export default UserButton