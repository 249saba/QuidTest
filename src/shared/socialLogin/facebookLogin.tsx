import { ReactComponent as Fb } from "@assets/icons/facebook_blue.svg";
import CustomButton from "../customButton";
import { LoginSocialFacebook } from "reactjs-social-login";

const clientId = "1110594273661919";

interface IGoogleAuth {
  handleAuthData?: (value: any) => void;
  className?: string;
  styleClass?:any;
  label?:string;
  handleButtonClick?:any;
  icon?:any
}

function FacebookAuth({ handleAuthData, className,styleClass,label,handleButtonClick,icon }: IGoogleAuth) {
  const responseGoogle = (res: any) => {
    console.log("facebook account detail ==", res);
    const _authData = {
      email: res?.email,
      social_media_token: res.id,
      social_media_platform: "facebook",
    };
    handleAuthData?.(_authData);
  };


  return (
    <div className={`w-full cursor-pointer ${className}`}>
      <LoginSocialFacebook
        appId={clientId || ""}
        fieldsProfile={
          "id,first_name,last_name,middle_name,name,name_format,picture,short_name,email,gender"
        }
        onResolve={({ provider, data }: any) => {
          responseGoogle(data);
        }}
        onReject={(err) => {
          console.log(err);
        }}
      >
         {icon ? (
          <Fb onClick={handleButtonClick} />
        ) : (
          <CustomButton
          icon={<Fb />}
        
          // label={label}
          handleButtonClick={handleButtonClick}
          labelClass="w-full sm:hidden text-sm font-medium"
          label="Facebook"
            type="button"
            styleClass="btn-white justify-start text-center  !rounded-lg w-full !border-gray-300 !border-[1px] !shadow-none"
          // styleClass={styleClass}
        />
        )}
      
      </LoginSocialFacebook>
    </div>
  );
}

export default FacebookAuth;
