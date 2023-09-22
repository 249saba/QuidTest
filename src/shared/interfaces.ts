import { ReactNode } from "react";

export interface ButtonProps {
  label?: string;
  type: any;
  isLoading?: boolean;
  color?: any;
  disabled?: boolean;
  variant?: any;
  styleClass?: string;
  icon?: any;
  handleButtonClick?: any;
  leftIconClass?: string;
  labelClass?: string;
}

// export interface CardProps {
//   id: number;
//   heading: string;
//   meta: cardMeta[];
//   applicatants: string;
// }

// export interface cardMeta {
//   icon: any;
//   text: string;
// }

export interface StorageI {
  data: Object;
  userType?: string;
  token?: string;
  meta?: any;
}

export interface CustomDialogProps {
  title?: string;
  size?: any;
  isOpen?: any;
  handleClose?: any;
  handleSubmit?: any;
  children?: ReactNode;
  isShowCloseIcon?: boolean;
}

export interface ICrumbs {
  title: string;
  link: string;
}

export interface Ifilters {
  searchValue?: string;
  offset?: number;
  limit?: number;
  order?: string;
}
