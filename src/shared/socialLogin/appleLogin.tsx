import Apple from "@assets/vendor/icons/apple.png";
import CustomButton from "../customButton";
import { LoginSocialApple } from "reactjs-social-login";

const clientId =
  "1079415982155-1i243aabstjgvf4gg9a5e0mv2etqeb0p.apps.googleusercontent.com";

interface IGoogleAuth {
  handleAuthData?: (value: any) => void;
  className?: string;
  icon?:any;
  handleButtonClick?:any
}

function AppleAuth({ handleAuthData, className,icon,handleButtonClick }: IGoogleAuth) {
  const responseGoogle = (res: any) => {
    console.log("apple account detail ==", res);
    const _authData = {
      email: res?.email,
      social_media_token: res.sub,
      social_media_platform: "apple",
    };
    handleAuthData?.(_authData);
  };

  return (
    <div className={`w-full cursor-pointer ${className}`}>
      <LoginSocialApple
        client_id={clientId || ""}
        scope={"name email"}
        onResolve={({ provider, data }: any) => {
          responseGoogle(data);
        }}
        onReject={(err) => {
          console.log(err);
        }}
      >
              {icon ? (
          // <Fb onClick={handleButtonClick} />
          <img loading="lazy" src={Apple} alt="apple" onClick={handleButtonClick} />
        ) : (
          <CustomButton
          icon={<img loading="lazy" src={Apple} alt="apple" />}
          labelClass="w-full sm:hidden text-sm font-medium"
          label="Apple"
          type={"submit"}
          styleClass="btn-white justify-start text-center !rounded-lg w-full !border-gray-300 !border-[1px] !shadow-none"
        />
        )}
    
      </LoginSocialApple>
    </div>
  );
}

export default AppleAuth;
