import React, { useState, useEffect } from "react";

import '../styles/Modal.css';

export const ModalBackground = ( { onClose, id} ) => {
    return (
            <div className='modal-background' id={id} onClick={onClose} />
        )
}

export const Modal = ( { open, onClose, menu, backgroundId } ) => {
    
    return (
        <>
            {open &&
                <div className="modal-container">
                    <ModalBackground
                        onClose={onClose}
                        id={backgroundId}
                    />
                    {menu}
                </div>
            }
        </>
    )
}