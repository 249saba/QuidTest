import { IconButton } from "@material-tailwind/react";
import cn from "classnames";
import React, { InputHTMLAttributes, memo } from "react";
import CustomCard from "./cards/customCard";
import { ReactComponent as SearchIcon } from "@assets/icons/Search-filled.svg";

export interface Props extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  placeholder?: string;
  label?: string;
  note?: string;
  name: string;
  error?: any;
  type?: string;
  shadow?: boolean;
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  touched?: any;
  handldChange?: any;
  containerClass?: string;
  variant?: "normal" | "solid" | "outline" | "base";
  children?: React.ReactNode;
}
const classes = {
  root: "pl-4 pr-9 h-12 flex items-center w-full rounded appearance-none transition duration-300 ease-in-out text-black-900 placeholder:text-gray-900 placeholder:font-normal text-base font-normal focus:outline-none",
  normal: "bg-white border border-white focus:outline-transparent rounded-lg",
  solid: "bg-lightGrey",
  outline:
    "border border-solid border-blue-placeholder focus:border-blue-cta focus:border-[3px]",
  base: "h-11 bg-blue-10 border border-blue-450 text-sharpBlue placeholder:text-sharpBlue font-normal !text-base",
  error: "border border-red",
  shadow: "focus:shadow",
};
const SearchSuggestion = React.forwardRef<HTMLInputElement, Props>(
  (
    {
      className,
      label,
      touched,
      note,
      name,
      error,
      variant = "normal",
      shadow = false,
      type = "text",
      inputClassName,
      labelClassName,
      containerClass,
      rightIcon,
      leftIcon,
      children,
      handldChange,
      ...rest
    },
    ref
  ) => {
    const rootClassName = cn(
      classes.root,
      {
        [classes.normal]: variant === "normal",
        [classes.solid]: variant === "solid",
        [classes.outline]: variant === "outline",
        [classes.base]: variant === "base",
      },
      {
        [classes.shadow]: shadow,
      },
      inputClassName
    );
    const _labelClassName = "mb-2 text-sm font-semibold inline-block";
    return (
      <div className={className}>
        {label && (
          <label htmlFor={name} className={cn(_labelClassName, labelClassName)}>
            {label}
          </label>
        )}
        <div className={cn(`relative flex items-center`, containerClass)}>
          <input
            id={name}
            name={name}
            type={type}
            ref={ref}
            className={`${rootClassName} ${leftIcon ? "!pl-16" : ""} ${
              error && touched ? classes.error : ""
            }`}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            aria-invalid={error ? "true" : "false"}
            onChange={handldChange}
            {...rest}
          />
          <div className="absolute right-3">{rightIcon}</div>
          <div className="absolute left-7">{leftIcon}</div>
          {children}
        </div>
        {note && <p className="mt-2 text-xs text-body">{note}</p>}
        {touched && error && (
          <p className="my-2 text-xs text-start text-red">{error}</p>
        )}
      </div>
    );
  }
);

export default memo(SearchSuggestion);
