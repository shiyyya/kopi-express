import "./button.css";
function Button({
    children,
    onClick,
    type = "button",
    className = "",
    disabled = false,
    ...rest
}) {
    return (
        <button
            type={type}
            className={className}
            onClick={onClick}
            disabled={disabled}
            {...rest}
        >
            {children}
        </button>
    );
}
export default Button;