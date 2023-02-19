import React from "react";
import { PropsWithChildren } from 'react';

interface Options {
  border: string;
  color: string;
  children?: React.ReactNode;
  height: string;
  onClick: () => void;
  radius: string;
  width: string;
  padding: string;
  top: string;
  left: string;
}

/*code source: https://www.twilio.com/blog/intro-custom-button-component-typescript-react*/
const Button: React.FC<Options> = ({ 
    border,
    color,
    children,
    height,
    onClick, 
    radius,
    width,
    padding,
    top,
    left
  }) => { 
  return (
    <button 
      onClick={onClick}
      style={{
         backgroundColor: color,
         border,
         borderRadius: radius,
         height,
         width,
         marginBottom: padding,
         marginTop: top,
         marginLeft: left
      }}
    >
    {children}
    </button>
  );
}

export default Button;