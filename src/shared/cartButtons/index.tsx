import { IconButton } from "@mui/material";

interface ICartButton {
  className?: string;
  btnClass?: string;
  noOfItems?: number | undefined;
}
const CartButtons = (props: ICartButton) => {
  return (
    <div className={`flex items-center gap-3 ${props.className}`}>
      <IconButton
        aria-label="fingerprint"
        size="small"
        className={` !w-[35px] !h-[35px] !p-3 !bg-blue-100 ${props.btnClass}`}
      >
        +
      </IconButton>
      <h5 className="font-medium">{props?.noOfItems || 0}</h5>
      <IconButton
        aria-label="fingerprint"
        size="small"
        className={` !w-[35px] !h-[35px] !p-3 !bg-blue-100 ${props.btnClass}`}
      >
        -
      </IconButton>
    </div>
  );
};

export default CartButtons;
