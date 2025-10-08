import React, { useState, useEffect, useContext } from 'react';
import { Modal } from './Modal.jsx';
import { TeeBetsTitle } from './TeeBetsTitles.jsx';
import { RegistrationDto } from '../Dtos/RegistrationDto.jsx';
import * as EmailValidator from 'email-validator';

import '../styles/RegisterSignIn.css';
import { LOGIN_ENPOINT, REGISTRATION_ENPOINT } from '../../ENDPOINTS.js';
import Spinner from './Spinner.jsx';
import { AuthContext } from './AuthProvider.jsx';
import { GreenButton, CloseButton } from './Buttons.jsx';
import DarkBackgroundContainer from './DarkBackgroundContainer.jsx'
import { TitledTextBox } from './TitledTextBox.jsx';
import { InputLabel, SelectLabel } from './FormObjectsLabeled.jsx';
import BorderedContainer from './BorderedContainer.jsx';
import TermsAndConditions from './TermsAndConditions.jsx';
import useScrollToBottom from '../hooks/useScrollToBottom.jsx';

export const RegisterSignInBase = ( { children, headerName, onSubmit, fetchRequest=null, closeFunction, buttonText, errorMsgs, buttonDisabled=false} ) => {
    const [submitted, setSubmitted] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false);
    
    const [data, setData] = useState(null);

    const [finished, setFinished] = useState(false);

    const handleOnSubmit = (e, callback) => {
        e.preventDefault();
        if (fetchRequest !== null) {
            setSubmitted(true);
            setShowSpinner(true)
        }
        callback(setData);
    }

    useEffect(() => {
        if (submitted && fetchRequest !== null) {
            fetchRequest(data, setFinished);
        }

        return () => {
            
        };
    }, [submitted]);

    useEffect(() => {
        if (finished) {
            setShowSpinner(false);
            setSubmitted(false);
            setFinished(false);
        }

        return () => {
            
        };
    }, [finished]);

    return (
        <BorderedContainer>
            <DarkBackgroundContainer>
                <div className='register-sign-in-form-wrapper'>
                    {showSpinner && 
                        <div className='spinner-container'>
                            <Spinner id={"register-sign-in-spinner"}></Spinner>
                        </div>}
                    
                    <RegisterSignInModalHeader 
                        closeFunction={closeFunction}
                    />
                    <div className='register-sign-in-form-inner-wrapper-content-wrapper'>
                        <TitledTextBox
                            title={headerName}
                            content={
                                <>
                                    <form className='register-sign-in-form' id='sign-in-form' onSubmit={e => handleOnSubmit(e, onSubmit)}>
                                        <ul className='error-list'>
                                            {errorMsgs.map((e, id) => 
                                                <li key={id}>{e}</li>  
                                            )}
                                        </ul>
                                        {children}
                                        <GreenButton 
                                            className="register-continue-button"
                                            text={buttonText}
                                            type="submit"
                                            disabled={buttonDisabled}
                                        />
                                    </form>
                                </>
                            }
                        />
                    </div>
                </div>
            </DarkBackgroundContainer>
        </BorderedContainer>
    )
}

const RegisterSignInInput = ( {htmlFor, type, label, inputValue, name, onBlur=null, onChange=null, error=false, autoComplete=null, required=true} ) => {
    return (
        <InputLabel 
                htmlFor={htmlFor}
                type={type} 
                label={label}
                name={name}
                inputValue={inputValue}
                labelClass={'register-sign-in-label'}
                inputClass={`register-sign-in-input${error ? " register-sign-in-input-error" : ""}`}
                onChange={onChange}
                onBlur={onBlur}
                autoComplete={autoComplete}
                required={required}
        />
    )
}

const RegisterSignInSelect = ( {htmlFor, label, onBlur, onChange, options, onClick, error=false} ) => {
    return (
        <SelectLabel 
            htmlFor={htmlFor}
            label={label}
            labelClass={'register-sign-in-label'}
            selectClass={`register-sign-in-input${error ? " register-sign-in-input-error" : ""}`}
            onChange={onChange}
            onBlur={onBlur}
            options={options}
            onClick={onClick}
        />
    )
}

export const SignInMenu = ({ closeFunction }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsgs, setErrorMsgs] = useState([]);

    const {loggedIn, setLoginStatus, fetchData, setFetchData} = useContext(AuthContext)

    const onSubmit = (setData) => {
        setData({email, password});
    }

    const fetchRequest = (data, setFinished) => {
        fetch(LOGIN_ENPOINT, 
            {
                method: 'POST',
                credentials: "include",
                headers: {
                    "Content-Type":"application/json",
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (!response.ok) {
                    if (response.status === 401) {
                        console.log("401")
                        setErrorMsgs(["Account not found. Check email and password."]);
                        return;
                    }
                    return response.json().then(r => {
                        const errors = r.errors;
                        var tempMsg = [];
                        for (const key in errors) {
                            tempMsg.push(errors[key]);
                        }
                        setErrorMsgs(tempMsg);
                    });
                } 
                else if (response.status === 200) {
                    setLoginStatus(true);
                    setFetchData(true);
                }
                console.log(response.status);
            })
            .catch(e => {
                console.log(e)
            })
            .finally(() => {
                setFinished(true);
            })
    };

    return (
        <RegisterSignInBase
            headerName="Sign In"  
            onSubmit={onSubmit}
            fetchRequest={fetchRequest}
            closeFunction={closeFunction}
            buttonText="Sign-in"
            errorMsgs={errorMsgs} 
        > 
            <RegisterSignInInput 
                htmlFor={"email"}
                type={"email"} 
                label={"Email"}
                name={"email"}
                inputValue={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete={"email"}
            />
            <RegisterSignInInput
                htmlFor={"password"}
                type={"password"} 
                label={"Password"}
                name={"password"}
                inputValue={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete={"current-password"}
            />
        </RegisterSignInBase>
    )
}

const RegisterSignInModalHeader = ( { closeFunction } ) => {
    return (
        <div className='sign-in-register-header-container'>
            <TeeBetsTitle
                id={'site-name'}
            />
            <CloseButton
                closeFunction={closeFunction}
            />
        </div>
    )
}

export const RegisterMenu = ({ closeFunction }) => {
    const [submitClicked, setSubmitClicked] = useState(false);
    const [validPassword, setValidPassword] = useState(false);
    const [validUsername, setValidUsername] = useState(false);
    const [validEmail, setValidEmail] = useState(false);
    const [validDOB, setValidDOB] = useState(false);
    const [validState, setValidState] = useState(false);

    const [validTC, setValidTC] = useState(false);
    const [showTCError, setShowTCError] = useState(false);

    const [usernameRequirementText, setUsernameRequirementText] = useState("");
    const [emailRequirementText, setEmailRequirementText] = useState("");
    const [DOBRequirementText, setDOBRequirementText] = useState("");
    const [passwordRequirementText, setPasswordRequirementText] = useState([]);
    const [stateRequirementText, setStateRequirementText] = useState("");

    const [usernameInteracted, setUsernameInteracted] = useState(false);
    const [pwordInteracted, setPwordInteracted] = useState(false);
    const [emailInteracted, setEmailInteracted] = useState(false);
    const [DOBInteracted, setDOBInteracted] = useState(false);
    const [stateInteracted, setStateInteracted] = useState(false);

    const [tCInteracted, setTCInteracted] = useState(false);

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userState, setUserState] = useState("AL");
    const [DOB, setDOB] = useState("");

    const [errorMsgs, setErrorMsgs] = useState([]);

    const PW_LENGTH = 8;
    const invalidStates = ["CT", "DE", "ID", "KY", "LA", "MD", "MI", "MT", 
                        "NJ", "NY", "NV", "PA", "RI", "VT", "WA", "WV"]
    
    const [refInit, setRefInit] = useState(true);
    const {divRef, atBottom} = useScrollToBottom(refInit);

    const [onPage2, setOnPage2] = useState(false);
    const [baseParams, setBaseParams] = useState({
        buttonText: null,
        onSubmit: null,
        fetchRequest: null
    });
    

    const checkEmail = (e) => {
        var check = true;
        setEmailRequirementText("")
        setValidEmail(check);
        if (!EmailValidator.validate(e))
        {
            check = false;
            setValidEmail(check);
            setEmailRequirementText("Please enter a valid email");
        }

        return check;
    }

    const checkSet = (v, check, setInteracted, setVal) => {
        check(v);
        setInteracted(true);
        setVal(v);
    }

    const checkDOB = (birthdate) => {
        const today = new Date();
        
        const [year, month, day] = birthdate.split('-').map(Number);

        // - 1 accounts for month being 0 indexed
        const birthDateObj = new Date(year, month - 1, day);
        
        let age = today.getFullYear() - birthDateObj.getFullYear();
        const monthDiff = today.getMonth() - birthDateObj.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
            age = age - 1;
        }
        
        const check = age >= 21;
        setValidDOB(check);
        
        if (!check) {
            setDOBRequirementText("Must be 21 or over");
        } else {
            setDOBRequirementText("");
        }

        return check;
    }

    const checkPassword = (p) => {
        var tempText = [];
        var check = true;
        setValidPassword(check);
        var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        
        if (!re.test(p)) {
            tempText.push("Must contain: ");
            tempText.push("Uppercase and lowercase");
            tempText.push("at least 1 number");
            tempText.push("at least 1 special character");
            check = false;
            setValidPassword(check);
        }

        const pLen = p.length;
        if (pLen < PW_LENGTH) {
            check = false;
            setValidPassword(check);
            tempText.push(`Must be at least ${PW_LENGTH}} characters`);
        } else if (pLen > 47) {
            tempText.push('Must be less than 48 characters');
            check = false;
            setValidPassword(check);
        }
        setPasswordRequirementText(tempText);
        return check;
    };

    const checkUsername = (u) => {
        var check = true;
        setValidUsername(true);
        setUsernameRequirementText("");
        if (u.length < 1) {
            check = false;
            setValidUsername(check);
            setUsernameRequirementText("Please enter a username.");
            return;
        }
        return check;
    }

    useEffect(() => {
        if (submitClicked) {
            checkUsername(username);
            checkPassword(password);
            checkDOB(DOB);
            checkEmail(email);
        }

        return () => {
            
        };
    }, [submitClicked]);

    const usernameBlurHandler = (event) => {
        checkSet(event.target.value, checkUsername, setUsernameInteracted, setUsername)
    }

    const emailBlurHandler = (event) => {
        checkSet(event.target.value, checkEmail, setEmailInteracted, setEmail)
    }

    const passwordBlurHandler = (event) => {
        checkSet(event.target.value, checkPassword, setPwordInteracted, setPassword)
    }

    const DOBChangeHandler = (event) => {
        checkSet(event.target.value, checkDOB, setDOBInteracted, setDOB)
    }

    const checkState = (state) => {
        var check = true;
        setValidState(check);
        setStateRequirementText("")
        if (invalidStates.includes(state)) {
            console.log("State false");
            check = false;
            setStateRequirementText(`Not available in this state`)
            setValidState(false);
        } 
        return check;
    }

    const stateChangeHandler = (event) => {
        const state = event.target.value
        setUserState(state);
        setStateInteracted(true);
        return checkState(state);
    }

    const onContinue = () => {

        if (checkDOB(DOB) &&
            checkEmail(email) && 
            checkPassword(password) &&
            checkState(userState) &&
            checkUsername(username)
        ) {
            setUsernameInteracted(true);
            setPwordInteracted(true);
            setEmailInteracted(true);
            setDOBInteracted(true);
            setOnPage2(true)
            setErrorMsgs([])
        } else {
            setErrorMsgs(["Please fill out registration form"])
        }
    }

    const onSubmit = (setData) => {
        if (validTC) {
            var d = new RegistrationDto();

            d.username = username;
            d.email = email;
            d.password = password;
            d.state = userState;
            d.dob = DOB;

            setData(d);
        }

    }

    const fetchRequest = async (data, setFinished) => {
        if (validTC) {
            setSubmitClicked(true);
                fetch(REGISTRATION_ENPOINT, {
                            method: 'POST',
                            headers: {
                                "Content-Type":"application/json"
                            },
                            body: JSON.stringify(data)
                })
                .then(response => {
                    if (!response.ok) {
                        response.json().then(async d => {
                            let tempMsgs = [];
                            const errors = d.errors;
                            console.log(errors);
                            let pwMsg = false;
                            for (const k in errors) { 
                                console.log(k)
                                if ((k === "PasswordTooShort" ||
                                    k === "PasswordRequiresNonAlphanumeric" ||
                                    k === "PasswordRequiresDigit" ||
                                    k === "PasswordRequiresUpper")) {
                                        if (!pwMsg) {
                                            tempMsgs.push("Invalid password")
                                            pwMsg = true;
                                            setValidPassword(false)
                                            continue;
                                        }
                                        continue;
                                }
                                if (k === "DuplicateEmail" || k == "IvalidEmail") {
                                    setValidEmail(false)
                                }
                                if (k === "DuplicateUsername" || k == "InvalidUserName") {
                                    setValidUsername(false);
                                }
                                tempMsgs.push(errors[k]);
                            }
                            setErrorMsgs(tempMsgs);
                        });
                    } else {
                        closeFunction();
                    }
                })
                .catch(e => {
                    console.log(e)
                })
                .finally(() => {
                    setFinished(true);
                });
        }
    }
    
    useEffect(() => {
        const BaseReigsterParams = {
            buttonText: "Continue",
            onSubmit: onContinue,
            fetchRequest: null
        }
        
        const BaseTCParams = {
            buttonText: "Register",
            onSubmit: onSubmit,
            fetchRequest: validTC ? fetchRequest : null
        }
        
        onPage2 ? setBaseParams(BaseTCParams) : setBaseParams(BaseReigsterParams);
    }, [onPage2, username, email, password, validPassword, validUsername, validEmail, validDOB, validTC]);

    const handleTCOnClick = () => {
        setTCInteracted(true);
        if ((!atBottom && tCInteracted) || !validTC) {
            setShowTCError(true);
        }
    }

    useEffect(() => {
        setRefInit(!refInit)

        return () => {
            
        };
    }, [onPage2]);

    return (
        <RegisterSignInBase
            headerName="Register"
            onSubmit={baseParams.onSubmit}
            fetchRequest={baseParams.fetchRequest}
            closeFunction={closeFunction}
            buttonText={baseParams.buttonText}
            errorMsgs={errorMsgs} 
        >
            { onPage2 ? 
            <div className='tc-content-container'>
                {showTCError && 
                    <div className={`tc-error-text`}>Please scroll to the bottom</div>
                }
                <div className='terms-conditions-wrapper' ref={divRef}>
                    <TermsAndConditions />
                </div>
                <div className='checkbox-container' onClick={!atBottom ? handleTCOnClick : () => setValidTC(true)}>
                    <input type='checkbox' className='tc-checkbox' checked={validTC}/>
                    <div>I Have read and agreed to the Terms and Conditions</div> 
                </div>
            </div>
                      : 
            <>
            <RegisterSignInInput
                onBlur={usernameBlurHandler}
                onChange={e => (setUsername(e.target.value))}
                value={username}
                error={!validUsername && (submitClicked || usernameInteracted)}
                type={"text"}
                htmlFor={"new-username"}
                label={"Username"}
                name={"new-username"}
                autoComplete={"new-username"}
            />
            <div className='requirement-wrapper'>
                <span className='requirement-text' >
                    {usernameRequirementText}
                </span>
            </div>
            <RegisterSignInInput
                onBlur={emailBlurHandler}
                onChange={e => (setEmail(e.target.value))}
                value={email}
                error={!validEmail && (submitClicked || emailInteracted)}
                type={"email"}
                htmlFor={"email"}
                label={"Email"}
                name={"email"}
                autoComplete={"new-email"}
            />
            <div className='requirement-wrapper'>
                <span className='requirement-text' >
                    {emailRequirementText}
                </span>
            </div>
            <RegisterSignInInput
                onBlur={passwordBlurHandler}
                onChange={e => (setPassword(e.target.value))}
                value={password}
                error={!validPassword && (submitClicked || pwordInteracted)}
                type={"password"}
                htmlFor={"password"}
                label={"Password"}
                name={"new-password"}
                autoComplete={"new-password"}
            />
            <div className='requirement-wrapper'>
                <ul className='error-list'>
                    {passwordRequirementText.map((m, key)=>
                        <li className='error-msg' key={key}>{m}</li>
                    )}
                </ul>
            </div>
            <RegisterSignInSelect 
                htmlFor={"state"}
                label={"State"}
                onChange={stateChangeHandler}
                value={userState}
                error={!validState && (submitClicked || stateInteracted)}
                options={
                    <>
                        <option value="AL">Alabama</option>
                        <option value="AK">Alaska</option>
                        <option value="AZ">Arizona</option>
                        <option value="AR">Arkansas</option>
                        <option value="CA">California</option>
                        <option value="CO">Colorado</option>
                        <option value="CT">Connecticut</option>
                        <option value="DE">Delaware</option>
                        <option value="DC">District Of Columbia</option>
                        <option value="FL">Florida</option>
                        <option value="GA">Georgia</option>
                        <option value="HI">Hawaii</option>
                        <option value="ID">Idaho</option>
                        <option value="IL">Illinois</option>
                        <option value="IN">Indiana</option>
                        <option value="IA">Iowa</option>
                        <option value="KS">Kansas</option>
                        <option value="KY">Kentucky</option>
                        <option value="LA">Louisiana</option>
                        <option value="ME">Maine</option>
                        <option value="MD">Maryland</option>
                        <option value="MA">Massachusetts</option>
                        <option value="MI">Michigan</option>
                        <option value="MN">Minnesota</option>
                        <option value="MS">Mississippi</option>
                        <option value="MO">Missouri</option>
                        <option value="MT">Montana</option>
                        <option value="NE">Nebraska</option>
                        <option value="NV">Nevada</option>
                        <option value="NH">New Hampshire</option>
                        <option value="NJ">New Jersey</option>
                        <option value="NM">New Mexico</option>
                        <option value="NY">New York</option>
                        <option value="NC">North Carolina</option>
                        <option value="ND">North Dakota</option>
                        <option value="OH">Ohio</option>
                        <option value="OK">Oklahoma</option>
                        <option value="OR">Oregon</option>
                        <option value="PA">Pennsylvania</option>
                        <option value="RI">Rhode Island</option>
                        <option value="SC">South Carolina</option>
                        <option value="SD">South Dakota</option>
                        <option value="TN">Tennessee</option>
                        <option value="TX">Texas</option>
                        <option value="UT">Utah</option>
                        <option value="VT">Vermont</option>
                        <option value="VA">Virginia</option>
                        <option value="WA">Washington</option>
                        <option value="WV">West Virginia</option>
                        <option value="WI">Wisconsin</option>
                        <option value="WY">Wyoming</option>
                    </>
                }
            />
            <div className='requirement-wrapper'>
                <span className='requirement-text' >
                    {stateRequirementText}
                </span>
            </div>
            <InputLabel
                onChange={DOBChangeHandler}
                value={DOB}
                inputClass={!validDOB && (submitClicked || DOBInteracted) ? 'register-sign-in-input-error' : 'register-sign-in-input'}
                type={"date"}
                htmlFor={"dob"}
                label={"Birthday"}
                labelClass={'register-sign-in-label'}
            />
            <div className='requirement-wrapper'>
                <span className='requirement-text' >
                    {DOBRequirementText}
                </span>
            </div>
            </>
            }
        </RegisterSignInBase>
    )
}

export const RegisterButton = () => {
    const [attempt, setAttempt] = useState(false);
    const [success, setSuccess] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const closeCallback = () => {
        setIsOpen(false);
    }

    useEffect(() => {
        if (!isOpen && !success) {
            setIsOpen(false);
        }

        return () => {
            
        };
    }, [attempt]);

    return (
        <>
            <button 
                className='sign-in-register-button' 
                id='register-button'
                onClick={() => setIsOpen(true)}
            >
                Register
            </button>
            <Modal
                menu={<RegisterMenu
                        closeFunction={closeCallback}
                        />}
                open={isOpen}
                onClose={closeCallback}
            />
        </>
    )
}

export const SignInButton = () => {
    const [attempt, setAttempt] = useState(false);
    const [success, setSuccess] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const closeCallback = () => {
        setIsOpen(false);
    }

    const handleSubmit = () => {
        setAttempt(!attempt);
    }

    useEffect(() => {
        if (!isOpen && !success) {
            setIsOpen(false);
        }

        return () => {
            
        };
    }, [attempt]);

    return (
        <>
            <button 
                className='sign-in-register-button' 
                id='sign-in-button'
                onClick={() => setIsOpen(true)}
            >
                Sign-In
            </button>
            <Modal  
                menu={<SignInMenu 
                    closeFunction={closeCallback}
                />}
                open={isOpen}
                onClose={closeCallback}
            />
        </>
    )
}
