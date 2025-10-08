import React, { useEffect, useState } from 'react'

import Dashboard from './Dashboard'
import DarkBackgroundContainer from './DarkBackgroundContainer';

import { ACCOUNT_INFO, EXCLUDE_ENDPOINT, EXCLUDE_INFO_ENDPOINT, RESEND_CONFIRM_EMAIL_ENDPOINT, VERIFICATION_INFO } from '../../ENDPOINTS';

import '../styles/UserDashboard.css'
import ActiveLink from './ActiveLink';
import { Modal } from './Modal';
import BorderedContainer from './BorderedContainer';
import { TitledTextBox } from './TitledTextBox';
import { GradientBoxGreen, GradientBoxRed } from './GradientBox';
import { Button, CloseButton } from './Buttons';

export const PopupMenu = ( { open=false, closeFunc, menu } ) => {
    return (
        <>
            <Modal 
                open={open}
                onClose={closeFunc}
                menu={menu}
            />
        </>
    )
}

const UserDashboardButton = ( { onClick, text, id, disabled=false } ) => {

    return (
        <Button
            id={id}
            text={
                <GradientBoxGreen className={"user-dashboard-verify"}>
                    {text}
                </GradientBoxGreen>
            }
            onClick={onClick} 
            disabled={disabled}
        />   
    )
}

export const SelfExclusionPanel = () => {
    const [excluded, setExcluded] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        const checkExclusionStatus = async () => {
            const response = await fetch(EXCLUDE_INFO_ENDPOINT, {
                credentials:"include"
            });
            if (response.ok)
            {
                const data = await response.json()
                setExcluded(data.status)
            } else {
                throw Error(`status: ${response.status}`)
            }
        }

        checkExclusionStatus()

        return () => {
            
        };
    }, []);

    const SelfExcludeConfirmationPopup = () => {

        const Menu = () => {

            const Title = () => {
                return (
                    <div className='self-exclude-popup-title-container'>   
                        Self-Exclude
                        <CloseButton 
                            closeFunction={() => setShowPopup(false)}/>
                    </div>
                )
            }

            return (
                <BorderedContainer id={"self-exclude-popup-container"}>
                    <TitledTextBox 
                        title={<Title />}
                        content={<p>There is no reversing this action. To confirm self-exclusion, please click below.</p>}
                        />  
                    <div className='self-exclude-confirm-text-button-container'>
                        <UserDashboardButton 
                            text={"Confirm Exclusion"}
                            disabled={excluded}
                            onClick={handleSelfExclude}
                        />
                        { excluded && <span>Done</span>}
                    </div>
                </BorderedContainer>
            )
        }
        
        return (
            <Modal
                open={showPopup}
                onClose={() => setShowPopup(false)}
                menu={<Menu />}
            />
        )
    }

    const handleSelfExclude = async () => {
        const response = await fetch(EXCLUDE_ENDPOINT, {
            method:"POST",
            credentials:"include"
        });
        if (response.ok) {
            setExcluded(true);
        }
    }
    
    return (
        <>
            <h3>Self Exclusion</h3>
                <div className='content-wrapper-line-user-dashboard'>
                    <h4>
                        Exclusion
                    </h4>
                    <p>
                        If you feel you are at risk or currently are faced with social, financial, mental, or health issues 
                        you believe to be caused by gambling, you are able to exclude yourself from playing on this site. 
                        You will still be able to access your account to withdraw any funds. Any functionality relating
                        to playing or depositing more funds will be disabled. There is no reversing this action.
                    </p>
                </div>
                <div className='content-wrapper-flex-user-dashboard'>
                    <h4>Exclude</h4>
                    <UserDashboardButton 
                        text={"Confirm Exclusion"}
                        disabled={excluded}
                        onClick={() => setShowPopup(true)}
                    />
                    <SelfExcludeConfirmationPopup />
                </div>
        </>
    )
}

export const VerificationPanel = () => {
    const [verified, setVerified] = useState(false);

    useEffect(() => {
        const getData = async () => {
            const response = await fetch(VERIFICATION_INFO, {
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error(`status: ${response.status}`)
            }
            const d = await response.json();
            setVerified(d.user.verified);
        }

        getData();
        return () => {
            
        };
    }, []);

    return (
        <>
            <h3>ID Verification</h3>
            <div className='content-wrapper-line-user-dashboard'>
                <div className='content-wrapper-flex-user-dashboard'>
                    <h4>
                        Verification Status
                    </h4>
                    { verified  ? <GradientBoxGreen className={"user-dashboard-verify"}>
                                        Verified
                                  </GradientBoxGreen> 
                                  : <GradientBoxRed className={"user-dashboard-verify"}>
                                        Unverified
                                    </GradientBoxRed>
                    }
                </div>
                
            </div>
            <h4>Verify Now</h4>
            <div>Verify stuff....!</div>
        </>
    )
}

export const EmailPanel = () => {
    const [userEmail, setUserEmail] = useState("");
    const [verified, setVerified] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    useEffect(() => {
        const getData = async () => {
            const response = await fetch(ACCOUNT_INFO, {
                credentials:"include"
            });
            if (!response.ok) {
                throw new Error(`status: ${response.status}`)
            }
            const r = await response.json();
            setUserEmail(r.user.email);
            setVerified(r.user.verified)
        }

        getData();
        return () => {
            
        };
    }, []);

    const handleSendConfirmationEmail = async () => {
        const body = {
            email: userEmail
        };
        const response = await fetch(RESEND_CONFIRM_EMAIL_ENDPOINT, {
            method:"POST",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials:"include",
            body: JSON.stringify(body)
        });
        if (response.ok) {
            setEmailSent(true);
        }
    }

    return (
        <>
            <h3 className='user-dashboard-email-label'>
                Email
            </h3>
            <div className='content-wrapper-line-user-dashboard'>
                <h4>
                    Current Email
                </h4>
                <p className='user-dashboard-email-line'>
                    {userEmail}
                </p>
            </div>
            <div className='content-wrapper-flex-user-dashboard'>
                <h4>
                    Confirmation Status    
                </h4>
                {verified ? <GradientBoxGreen className={'user-dashboard-verify'}>Confirmed</GradientBoxGreen> :
                    <GradientBoxRed className={"user-dashboard-verify"}>Unconfirmed</GradientBoxRed>
                }
                <UserDashboardButton 
                    onClick={handleSendConfirmationEmail}
                    text={"Confirm Now"}
                    disabled={(verified || emailSent)}
                />
                {emailSent && <span>Sent!</span>}
            </div>
        </>
    )
}

const UserDashboard = ( { mainPanelContent } ) => {

    const Sidebar = () => {
        return (
            <div className='user-dashboard-sidebar'>
                <ActiveLink to='/account/email'>Email</ActiveLink>
                <ActiveLink to='/account/verification'>Verification</ActiveLink>
                <ActiveLink to='/account/exclusion'>Exclusion</ActiveLink>
            </div>
        )
    }

    return (
        <DarkBackgroundContainer>
            <Dashboard 
                mainPanel={<div className='user-dashboard-main-panel'>
                            {mainPanelContent}
                            </div>}
                sidebar={<Sidebar />}
                containerId={'user-dashboard-container'}
                sidePanelId={'user-dashboard-side-panel-override-id'}
                mainPanelId={'user-dashboard-main-panel-override-id'}
            />
        </DarkBackgroundContainer>
  )
}

export default UserDashboard