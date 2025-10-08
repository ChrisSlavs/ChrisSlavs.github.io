import React from 'react'

import '../styles/Ad2Blocks.css';

const Ad2Blocks = ( { adWrapperId, block1Id, block2Id } ) => {
  return (
    <div className='ad-2-blocks' id={adWrapperId}>
        <div className='ad-block-1' id={block1Id}></div>
        <div className='ad-block-2' id={block2Id}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis atque voluptatibus laborum iste, magni a, laboriosam odio veniam esse enim, unde voluptatum placeat ratione ipsa sit temporibus quod minus itaque.</div>
    </div>
    
  )
}

export default Ad2Blocks