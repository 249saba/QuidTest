import React from "react";
import { Dialog, DialogTitle } from "@mui/material";
import Style from "./popup.module.scss";
import { ReactComponent as Close } from "@src/assets/images/icons/x.svg";
import { Spinner } from "@shared/spinner/spinner";

interface IPopup {
  isOpen: boolean;
  handleClose: any;
  title?: string;
  width?: any;
  maxWidth?: any;
  isLoading?: boolean;
  borderRadius?: number;
  isFullScreen?: boolean;
  isShowHeader?: boolean;
  childClassName?: string;
  containerClassName?: string;
  children?: React.ReactNode;
}

const Popup = ({
  isOpen,
  handleClose,
  title = "",
  width = 475,
  maxWidth = 900,
  isLoading = false,
  borderRadius = 15,
  isFullScreen = false,
  isShowHeader = true,
  childClassName,
  containerClassName,
  children,
}: IPopup) => {
  const closePopup = () => {
    handleClose?.(true);
  };
  return (
    <div>
      <Dialog
        open={isOpen}
        // onClose={handleClose}
        fullScreen={isFullScreen}
        aria-describedby="alert-dialog-slide-description"
        className={Style.dialog}
        maxWidth={maxWidth}
        PaperProps={{
          style: {
            backgroundColor: "rgb(255 255 255 / 40%)",
            backdropFilter: "blur(1px)",
            width: width,
            minHeight: 150,
            borderRadius: borderRadius,
          },
        }}
      >
        <div className={`${Style.container} ${containerClassName}`}>
          {isShowHeader && (
            <DialogTitle>
              <div className={Style.title}>
                <div>{title}</div>
                {isLoading && (
                  <div className={`${Style.closeIcon} mt-3`}>
                    <Spinner />
                  </div>
                )}
                {!isLoading && (
                  <div
                    className={`${Style.closeIcon} mt-3`}
                    onClick={closePopup}
                  >
                    <Close height={15} />
                  </div>
                )}
              </div>
            </DialogTitle>
          )}
          <div className={`${Style.content} ${childClassName}`}>{children}</div>
        </div>
      </Dialog>
    </div>
  );
};

export default Popup;
