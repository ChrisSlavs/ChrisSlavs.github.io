import React, { useState, useEffect } from 'react'

import '../styles/Countdown.css'

const Countdown = ( { eventDate, onEnd=() => null } ) => {
    const [totalSeconds, setTotalSeconds] = useState(0);

    useEffect(() => {
        
        const timerFunc = () => {
            const curTime = new Date().getTime();
            const eventTime = new Date(eventDate).getTime();
            const remainingTime = (eventTime - curTime);
            
            if (remainingTime <= 0) {
                setTotalSeconds(0);
                onEnd();
                return;
            }
            setTotalSeconds(remainingTime);
        }

        const interval = setInterval(timerFunc, 1000);

        return () => {
            clearInterval(interval);
        };

    }, [totalSeconds]);



    const NumberUnitBox = ( { number, unit } ) => {
        return (
            <div className='number-unit-box'>
                <span className='number-span'>{number}</span>
                <span className='unit-span'>{unit}</span>
            </div>
        )
    }

    const TimerBoxes = ( {} ) => {

        const timeFormatted = () => {
            const seconds = Math.floor((totalSeconds / 1000) % 60);
            // (totalSeconds / (1000 * 60)) % 60
            const minutes = Math.floor((totalSeconds / 60000) % 60);
            // (totalSeconds / (1000 * 60 * 60)) % 24
            const hours = Math.floor((totalSeconds / 3600000) % 24);

            return {
                seconds,
                minutes,
                hours
            }
        }

        const formattedTime = timeFormatted();

        return (
            <>
                <NumberUnitBox 
                    number={formattedTime.hours}
                    unit={"Hours"}
                />
                <NumberUnitBox 
                    number={formattedTime.minutes}
                    unit={"Minutes"}
                />
                <NumberUnitBox 
                    number={formattedTime.seconds}
                    unit={"Seconds"}
                />
            </>
        )
    }

  return (
    <div className='countdown-container'>
        <TimerBoxes />
    </div>
  )
}

export default Countdown