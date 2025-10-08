import '../styles/GradientBox.css'

export const GradientBoxGreen = ( { children, className } ) => {
    return (
        <div className={`gradient-box gradient-green ${className || ""}`}>{children}</div>
    )
}

export const GradientBoxRed = ( { children, className } ) => {
    return (
        <div className={`gradient-box gradient-red ${className || ""}`}>{children}</div>
    )
}