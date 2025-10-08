import React from "react"

import '../styles/TitledTextBox.css'

export const TitledTextBox = ( { title, content} ) => {
    return (
        <div className='titled-text-box-container'>
            <h3 className='titled-text-box-header'>
                {title}
            </h3>
            {content}
        </div>
    )
}