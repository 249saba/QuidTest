import { IconButton } from "@mui/material";
import cn from "classnames";

interface IStatusButton {
  label: string;
  className?: string;
}

const classes = {
  root: "!bg-green-600 !text-green-700",
  pending: "!bg-yellow-100 !text-yellow-100 !bg-opacity-20",
  completed: "!bg-green-600 !text-green-700",
};

const StatusButton = ({ label = "pending", className }: IStatusButton) => {
  const rootClassName = cn(
    classes.root,
    {
      [classes.pending]: label === "pending",
      [classes.completed]: label === "completed",
    },
    className
  );
  return (
    <IconButton
      aria-label="fingerprint"
      size="small"
      className={`!rounded-md !text-xs !px-3 ${rootClassName} ${className}  `}
    >
      {label}
    </IconButton>
  );
};

export default StatusButton;
