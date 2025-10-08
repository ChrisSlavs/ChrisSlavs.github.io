import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import AccountActionsPanel from './AccountActionsPanel'
import ErrorProcessingRequestPanel from './ErrorProcessingRequestPanel'

import GreenCheck from '../assets/GreenCheck.svg'

import { UNSUBSCRIBE_ENDPOINT } from '../../ENDPOINTS'

import '../styles/UnsubscribePage.css';


const UnsubscribePage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [success, setSuccess] = useState(false);

    const SendUnsubscribeRequest = async () => {
        const email = searchParams.get("email");
        const params = new URLSearchParams({
          email
        });
        const response = await fetch(`${UNSUBSCRIBE_ENDPOINT}/?${params}`, {
          credentials:"include"
        });
        if (response.ok) {
          setSuccess(false);
        }
    }

    useEffect(() => {
      SendUnsubscribeRequest();
      return () => {
        
      };
    }, []);

    return (
      <>
        { success ? <AccountActionsPanel
                      headerImg={<img src={GreenCheck}
                                  className='unsubscribe-page-img'/>}>
                      <h3>You are now unsubscribed</h3>
                      <p>You are unsubscribed from the TeeBets mailing list</p>
                    </AccountActionsPanel>
                  : <ErrorProcessingRequestPanel />
        }
      </>
    )
}

export default UnsubscribePage