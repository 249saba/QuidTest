import React, { InputHTMLAttributes, memo } from "react";
import cn from "classnames";
import styles from "./checkbox.module.css";

export interface CheckBoxProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  label?: React.ReactNode;
  labelClass?: string;
  subLabel?: string;
  name: string;
  error?: string;
  disabled?: boolean;
  subLabelClass?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckBoxProps>(
  (
    {
      className,
      label,
      labelClass,
      name,
      subLabel,
      error,
      disabled,
      subLabelClass,
      ...rest
    },
    ref
  ) => {
    return (
      <div className={className}>
        <div className="flex items-center">
          <input
            id={name}
            name={name}
            type="checkbox"
            style={{ display: "none" }}
            ref={ref}
            className={styles.checkbox}
            disabled={disabled}
            {...rest}
          />

          <label htmlFor={name} className={cn("text-body text-sm", labelClass)}>
            {label}
          </label>
        </div>
        {subLabel && (
          <div
            className={`flex justify-start text-black ml-8 text-sm mt-2 ${subLabelClass}`}
          >
            {subLabel}
          </div>
        )}
        {error && <p className="my-2 text-xs text-end text-red-500">{error}</p>}
      </div>
    );
  }
);

export default memo(Checkbox);
