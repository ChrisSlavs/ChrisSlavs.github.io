import React, { useContext, useState } from "react";

import '../styles/PlayButton.css'
import { GoldButton } from './Buttons'
import { AuthContext } from "./AuthProvider";

import { Modal } from "./Modal";
import { SignInMenu } from "./RegisterSignIn";

function PlayButton( { onClick, className } ) {
  const { loggedIn, 
          setLoginStatus, 
          fetchData, 
          setFetchData,
          allowedPlay } = useContext(AuthContext)

  const [open, setOpen] = useState(false);

  const handleNotAllowedPlay = () => {
        setOpen(true);
  }

  return (
    <>
      <GoldButton 
        text={"Play"}
        type={"submit"}
        className={`play-button ${className}`}
        id={'play-button'}
        onClick={allowedPlay ? onClick : handleNotAllowedPlay}
      />
      <Modal 
        open={open}
        onClose={() => setOpen(false)}
        menu={<SignInMenu
          closeFunction={() => setOpen(false)}
        />}
      />
    </>
  )
}

export default PlayButton