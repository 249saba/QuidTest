import { ReactNode } from "react";

interface ContentProps {
  children: ReactNode;
  styleClass?: string;
}

const ContentContainer = ({ styleClass, children }: ContentProps) => {
  return (
    <div className={`flex flex-col  pt-32 pb-8 px-16 sm:px-6   ${styleClass}`}>
      {children}
    </div>
  );
};

export default ContentContainer;
