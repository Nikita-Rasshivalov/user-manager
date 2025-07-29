import React from "react";

type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement>;

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = "", ...props }, ref) => (
    <input
      type="checkbox"
      ref={ref}
      {...props}
      className={`
        form-checkbox 
        h-5 w-5 
        text-blue-600 
        rounded 
        transition 
        duration-200 
        ease-in-out 
        focus:ring-2 
        focus:ring-blue-400 
        focus:outline-none
        ${className}
      `}
    />
  )
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
