export const handleStringChange = (setterFunc) => (event) => {
    setterFunc(event.target.value);
}

export const handleFloatChange = (setterFunc) => (event) => {
    const val = event.target.value;
    setterFunc(val)
}

export const handleNumChange = (setterFunc) => (event) => {
    const val = parseInt(event.target.value); 
    setterFunc(isNaN(val) ? 0 : val);
}