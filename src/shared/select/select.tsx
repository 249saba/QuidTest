import React, { memo } from "react";
import ReactSelect, { Props, StylesConfig } from "react-select";
import { generalSelectStyle } from "./general.styles";
export interface SelectProps extends Props {
  // eslint-disable-next-line
  style?: StylesConfig<any, any, any>;
}

// eslint-disable-next-line
const Select = React.forwardRef<any, SelectProps>((props: SelectProps, ref) => (
  <ReactSelect
    styles={{ ...generalSelectStyle, ...(props?.style ?? {}) }}
    {...props}
    ref={ref}
    menuPortalTarget={document.body}
    menuPosition={'fixed'} 
  />
));
export default memo(Select);
