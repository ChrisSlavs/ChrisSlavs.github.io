import React from 'react'

import '../styles/ViewAllButton.css'
import DownArrow from './DownArrow'

const ViewAllButton = ( { viewAll, setViewAll } ) => {
  return (
    <button className='view-all-button' onClick={() => setViewAll(!viewAll)}>
        <DownArrow arrowId={"view-all-arrow"}/>
        <div id='view-all-button-text'>view all</div>
    </button>
  )
}

export default ViewAllButton