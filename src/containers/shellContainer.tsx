import { ReactNode } from "react";

interface ShellProps {
  children: ReactNode;
  className?: string;
}

const ShellContainer = ({ className, children }: ShellProps) => {
  return (
    <div
      className={`flex flex-col  pt-24 pb-6 px-6 login-bg-gradient h-screen  ${className}`}
    >
      {children}
    </div>
  );
};

export default ShellContainer;
