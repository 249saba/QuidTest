import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const handleToastMessage = (type: any, message: any) => {
  const toastOptions: any = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  };

  switch (type) {
    case "info":
      toast.info(message, toastOptions);
      break;
    case "success":
      toast.success(message, toastOptions);
      break;
    case "warn":
      toast.warn(message, toastOptions);
      break;
    case "error":
      toast.error(message, toastOptions);
      break;
    default:
      break;
  }
};
