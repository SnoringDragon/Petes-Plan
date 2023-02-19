import { FC, InputHTMLAttributes } from "react";

interface InputVals extends InputHTMLAttributes<HTMLInputElement> {
    name: string;
    label: string;
}

/* source: https://dev.to/giselamd/creating-a-react-input-component-in-typescript-hai */ 
const Input: FC<InputVals> = ({ name, label, ...rest }) =>
    {
        return (
            <div className="input-wrapper">
                <label htmlFor={name}>{label}</label>
                <input id={name} {...rest}></input>
            </div>
        );
    };

export default Input;