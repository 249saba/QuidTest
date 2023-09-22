import cn from "classnames";
import { ReactNode, useRef } from "react";
import { FileUploader } from "react-drag-drop-files";
import heic2any from "heic2any";
import { handleToastMessage } from "@src/shared/toastify";

type ImagePickerProps = {
  title?: string;
  className?: string;
  onChange?: (file: any) => void;
  error?: string;
  touched?: boolean;
  value?: any;
  size?: number;
  resetValue?: () => void;
  removeImage?: (id: any) => void;
  onSizeError?: (obj: any) => void;
  // onSizeError?:()=>;
  children?: ReactNode;
  index?: number | 0;
};

const fileTypes = ["JPG", "JPEG", "SVG", "PNG", "HEIC"];

const ImagePicker = ({
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
  size,
}: ImagePickerProps) => {
  const hiddenFileInput: any = useRef(null);

  const handleClick = () => {
    hiddenFileInput && hiddenFileInput?.current?.click();
  };

  const handleChange = (files: any) => {
    let _images: any = [];
    console.log("blob", files[0]);
    console.log("blob", files[0].size);
    console.log("blob", size);
    if (size == 5) {
      if (files[0].size > 4194587) {
        handleToastMessage(
          "error",
          "please select image of size less than 4mb"
        );
      } else {
        Object.entries(files).forEach((file: any) => {
          if (file[1]?.type?.toLowerCase().includes("heic")) {
            var blob = file[1]; //ev.target.files[0];

            heic2any({
              blob: blob,
              toType: "image/jpg",
            })
              .then(function (resultBlob: any) {
                let jpgFile = new File([resultBlob], "heic" + ".png", {
                  type: "image/png",
                  lastModified: new Date().getTime(),
                });
                _images.push(jpgFile);
              })
              .catch(function (x) {});
          } else {
            _images.push(file[1]);
          }
        });

        setTimeout(() => {
          onChange?.(_images);
        }, 1000);
      }
    }
    if (size != 5) {
      if (files[0].size > 10534243)
        handleToastMessage(
          "error",
          "please select image of size less than 10mb"
        );
      else {
        Object.entries(files).forEach((file: any) => {
          if (file[1]?.type?.toLowerCase().includes("heic")) {
            var blob = file[1]; //ev.target.files[0];

            heic2any({
              blob: blob,
              toType: "image/jpg",
            })
              .then(function (resultBlob: any) {
                let jpgFile = new File([resultBlob], "heic" + ".png", {
                  type: "image/png",
                  lastModified: new Date().getTime(),
                });
                _images.push(jpgFile);
              })
              .catch(function (x) {});
          } else {
            _images.push(file[1]);
          }
        });

        setTimeout(() => {
          onChange?.(_images);
        }, 1000);
      }
    }
  };
  return (
    <div className={cn("mb-0", className)}>
      {title && <h5 className="text-sm font-semibold mb-3"> {title}</h5>}
      <div>
        <FileUploader
          handleChange={handleChange}
          name={`file_${index}`}
          types={fileTypes}
          multiple
          // maxSize={size?size:"10.1Mb"}
          // maxSize={size?size:10}
          onSizeError={onSizeError}
          classes="!h-[100px]"
        >
          {children}
        </FileUploader>
      </div>
      {touched && error && (
        <p className="my-2 text-xs text-start text-red-100">{error}</p>
      )}
      {/* {value.length > 0 && (
        <div className="flex gap-6 py-4  px-4">
          {value?.map((image: any, index: any) => {
            let prev_url = URL.createObjectURL(image);
            return (
              <div key={index} className="relative group">
                <img
                  onClick={() => removeImage?.(index)}
                  alt=""
                  className="h-[100px] w-[100px] object-cover"
                  src={prev_url ?? ""}
                />
              </div>
            );
          })}
        </div>
      )} */}
    </div>
  );
};
export default ImagePicker;
