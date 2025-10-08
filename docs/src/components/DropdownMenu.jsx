import React, { useState } from 'react';

import '../styles/DropDownMenu.css';
import ClickAwayListener from './ClickAwayListener';

import TriangleUp from './TriangleUp';

const DropDownMenu = ( {Button, menuItems, menuId, triangleId} ) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuOptions = menuItems.map((option, i=0) => 
            <li className='dropdown-menu-item' key={i++}>{option}</li>)
  
  return  (
    <ClickAwayListener onClickAway={() => setIsOpen(false)}>
      <div className='dropdown-container'>
        <div onClick={() => setIsOpen(true)}>
          {Button}
        </div>
        {isOpen &&
            <div className='dropdown-menu-container'>
                <TriangleUp 
                    id={triangleId}
                />
                <ul className='dropdown-menu' id={menuId}>
                    {menuOptions}
                </ul>
            </div>
        } 
      </div>
    </ClickAwayListener>
  )
}

export default DropDownMenu