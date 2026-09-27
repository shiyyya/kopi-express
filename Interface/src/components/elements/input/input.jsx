// import './input.css';

// function Input({
//     type = "text",
//     name,
//     value,
//     onChange,
//     placeholder,
//     className = "",
//     disabled = false,
// }) {
//     return (
//         <input
//             type={type}
//             name={name}
//             value={value}
//             onChange={onChange}
//             placeholder={placeholder}
//             className={className}
//             disabled={disabled}
//         />
//     );
// }

// export default Input;

import './input.css';

function Input({
    type = "text",
    name,
    value,
    onChange,
    placeholder,
    className = "",
    disabled = false,
    ...rest
}) {
    return (
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`input ${className}`.trim()}
            disabled={disabled}
            {...rest}
        />
    );
}

export default Input;