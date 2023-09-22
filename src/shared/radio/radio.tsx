import React, { InputHTMLAttributes, memo } from "react";
import styles from "./radio.module.css";

export interface Props extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  label?: string;
  name: string;
  id?: string;
  error?: string;
  labelClassName?: string;
}

const Radio = React.forwardRef<HTMLInputElement, Props>(
  ({ className, labelClassName, label, name, id, error, ...rest }, ref) => {
    return (
      <div className={className}>
        <div className="flex items-center">
          <input
            id={id}
            name={name}
            type="radio"
            ref={ref}
            className={styles.radio_input}
            {...rest}
          />

          <label
            htmlFor={id}
            className={`text-black-900 text-sm ${labelClassName}`}
          >
            {label}
          </label>
        </div>

        {error && <p className="my-2 text-xs text-end text-red-500">{error}</p>}
      </div>
    );
  }
);

export default memo(Radio);
