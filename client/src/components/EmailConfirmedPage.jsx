import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import AccountActionsPanel from './AccountActionsPanel'
import GreenCheck from "../assets/GreenCheck.svg"
import { CONFIRM_EMAIL_ENDPOINT } from '../../ENDPOINTS'
import '../styles/EmailConfirmedPage.css'
import ErrorProcessingRequestPanel from './ErrorProcessingRequestPanel'

const EmailConfirmedPage = () => {
    const [confirmed, setConfirmed] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();

    const ConfirmationSucceeded = () => {
        return (
            <>
                <h3>
                    Thank you for confirming your email
                </h3>
                <h3>
                    Please sign in to play!
                </h3>
                <Link className='email-confirmed-play-button' to={'/'}>Continue</Link>
            </>
        )
    }

    useEffect(() => {
        const fetchData = async () => {
            const userId = searchParams.get("userId");
            const code = searchParams.get("code");

            console.log
            const params = new URLSearchParams({
                userId,
                code
            })
            const response = await fetch(`${CONFIRM_EMAIL_ENDPOINT}/?${params}`, {
                credentials:"include"
            });
            if (response.ok)
            {
                setConfirmed(true);
            }
            else {
                setConfirmed(false);
            }
        }

        fetchData();
        return () => {
            
        };
    }, []);

  return (
    <>
        {confirmed ?    <AccountActionsPanel
                            headerImg={<img className="email-confirmed-page-check" src={GreenCheck}/>}
                            >
                            <ConfirmationSucceeded />
                        </AccountActionsPanel>  
                    :   <ErrorProcessingRequestPanel />
        }
    </>
  )
}

export default EmailConfirmedPage