import cn from "classnames";
import { ReactNode, useRef } from "react";
import { FileUploader } from "react-drag-drop-files";
import heic2any from "heic2any";

type VideoPickerProps = {
  title?: string;
  className?: string;
  onChange?: (file: any) => void;
  error?: string;
  touched?: boolean;
  value?: any;
  resetValue?: () => void;
  removeImage?: (id: any) => void;
  onSizeError?: (obj: any) => void;
  children?: ReactNode;
  index?:number|0;
};

const fileTypes = ["MP4"];

const VideoPicker = ({
  title,
  className,
  onChange,
  error,
  touched,
  value,
  resetValue,
  removeImage,
  onSizeError,
  children,
  index,
}: VideoPickerProps) => {
  const hiddenFileInput: any = useRef(null);

  const handleClick = () => {
    hiddenFileInput && hiddenFileInput?.current?.click();
  };

  const handleChange = (files: any) => {
    let _videos: any = [];
    Object.entries(files).forEach((file: any) => {
      if (file[1]?.type?.toLowerCase().includes("heic")) {
        var blob = file[1]; //ev.target.files[0];
        heic2any({
          blob: blob,
          toType: "video/mp4",
        })
          .then(function (resultBlob: any) {
            let jpgFile = new File([resultBlob], "heic" + ".png", {
              type: "video/mp4",
              lastModified: new Date().getTime(),
            });
            _videos.push(jpgFile);
          })
          .catch(function (x) {});
      } else {
        _videos.push(file[1]);
      }
    });

    setTimeout(() => {
      onChange?.(_videos);
    }, 1000);
  };
  return (
    <div className={cn("mb-2", className)}>
      {title && <h5 className="text-sm font-semibold mb-3"> {title}</h5>}
      <div>
        <FileUploader
          handleChange={handleChange}
          name={`file_${index}`}
          types={fileTypes}
          multiple
          maxSize={17}
          onSizeError={onSizeError}
          classes="!h-[100px]"
        >
          {children}
        </FileUploader>
      </div>
      {touched && error && (
        <p className="my-2 text-xs text-start text-red-100">{error}</p>
      )}
    </div>
  );
};
export default VideoPicker;
