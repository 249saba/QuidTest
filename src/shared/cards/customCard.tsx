import { Card } from "@material-tailwind/react";
import { ReactNode } from "react";

interface styleClass {
  children: ReactNode;
  styleClass?: string;
  onClick?: () => void;
}

const CustomCard = ({ onClick, children, styleClass }: styleClass) => {
  return (
    <Card onClick={onClick} className={`${styleClass} `}>
      {children}
    </Card>
  );
};

export default CustomCard;
