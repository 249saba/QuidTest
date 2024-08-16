import { ReactNode } from "react";
import home from "@assets/icons/home.jpg";
interface ContentProps {
  children: ReactNode;
  styleClass?: string;
}

const ContentContainer = ({ styleClass, children }: ContentProps) => {
  return (
    <div className={`flex   pt-32 pb-8 px-16 sm:px-6 ${styleClass}`}>
      {children}
    </div>
  );
};

export default ContentContainer;
