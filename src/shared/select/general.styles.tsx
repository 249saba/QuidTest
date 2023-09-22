export const generalSelectStyle = {
  control: (defaultStyle: any, state: any) => ({
    display: "flex",
    alignItems: "center",
    borderRadius: 4,
    border: state.isFocused ? "1px solid #989898" : "1px solid #989898",
    backgroundColor: "#FFFFFF",
    height: 48,
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    fontSize: "0.875rem",
    color: "#989898",
    paddingLeft: 12,
    paddingRight: 16,
    paddingTop: 12,
    paddingBottom: 12,
    cursor: "pointer",
    borderBottom: "1px solid #FBFBFB",
    backgroundColor: state.isSelected
      ? "#E5E7EB"
      : state.isFocused
      ? "#F9FAFB"
      : "#ffffff",
    "&:active": {
      backgroundColor: "transparent",
    },
  }),
  placeholder: (defaultStyle: any) => ({
    ...defaultStyle,
    color: "#989898",
    fontSize: 12,
  }),
  input: (defaultStyle: any) => ({
    ...defaultStyle,
    color: "#051917",
    fontSize: 12,
  }),
  singleValue: (defaultStyle: any) => ({
    ...defaultStyle,
    color: "#2d3748",
    fontSize: 12,
    fontWeight: "450",
  }),
};
