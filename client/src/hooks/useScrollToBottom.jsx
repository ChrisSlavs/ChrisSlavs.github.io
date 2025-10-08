import React, { useRef, useState, useEffect, useCallback } from 'react'

const useScrollToBottom = (init=true) => {
    const divRef = useRef(null);
    const [atBottom, setAtBottom] = useState(false);

    const handleScroll = useCallback(() => {
        if (divRef.current) {
            const {scrollHeight, scrollTop, clientHeight} = divRef.current;
            
            if (scrollHeight - scrollTop <= clientHeight + 4) {
                setAtBottom(true);
            } else {
                setAtBottom(false);
            }
        }
    }, []);

    useEffect(() => {
        const curDiv = divRef.current;
        if (curDiv) {
            curDiv.addEventListener("scroll", handleScroll);
        }

        return () => {
            if (curDiv) {
                curDiv.removeEventListener("scroll", handleScroll);
            }
        };
    }, [handleScroll, init]);
  
    return { divRef, atBottom };
};
export default useScrollToBottom