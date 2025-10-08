import React from 'react'
import chatBubbleIcon from '../assets/ChatBubble.svg' 

import '../styles/ChatButton.css';

const ChatButton = () => {
  return (
    <button className='chat-button'>
        <img src={chatBubbleIcon} alt="chat" className='chat-button-image'/>
    </button>
  )
}

export default ChatButton