import { ReactNode } from "react";

declare type IRoute = {
  path?: string;
  children?: IRoute[];
  component?: ReactNode;
  protectedPath?: boolean;
};
