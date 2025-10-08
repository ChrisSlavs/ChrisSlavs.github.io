import React from 'react'

import Ad2Blocks from './Ad2Blocks';

import '../styles/AdBanner.css';

const AdBanner = () => {
  return (
    <div className='ad-banner'>
      <div className='ad-container'>
          <Ad2Blocks 
              adWrapperId={'ad-block-1'} 
              block1Id={'ad-block-1-block-1'} 
              block2Id={'ad-block-1-block-2'}
          />
          <Ad2Blocks 
              adWrapperId={'ad-block-2'} 
              block1Id={'ad-block-2-block-1'} 
              block2Id={'ad-block-2-block-2'}
          />
        </div>
    </div>
  )
}

export default AdBanner