import { ReactComponent as Googleblue } from "@assets/icons/google_blue.svg";
import CustomButton from "../customButton";
import { LoginSocialGoogle, LoginSocialFacebook } from "reactjs-social-login";

const clientId =
  "1079415982155-1i243aabstjgvf4gg9a5e0mv2etqeb0p.apps.googleusercontent.com";

interface IGoogleAuth {
  handleAuthData?: (value: any) => void;
  className?: string;
  handleButtonClick?:any;
  styleClass?:any;
  label?:string;
  icon?:any
}

function GoogleAuth({ handleAuthData, className,handleButtonClick,icon,label,styleClass }: IGoogleAuth) {
  const responseGoogle = (res: any) => {
    console.log("google account detail ==", res);
    const _authData1 = {
      email: res?.email,
      social_media_token: res.sub,
      social_media_platform: "google",
  
    };
    handleAuthData?.(_authData1);
  };

  return (
    <div className={`w-full cursor-pointer ${className}`}>
      <LoginSocialGoogle
        client_id={clientId || ""}
        scope="openid profile email"
        discoveryDocs="claims_supported"
        access_type="offline"
        onResolve={({ provider, data }: any) => {
          responseGoogle(data);
        }}
        onReject={(err) => {
          console.log(err);
        }}
      >
        {icon ? (
          <Googleblue onClick={handleButtonClick} />
        ) : (
         
        <CustomButton
        icon={<Googleblue />}
        handleButtonClick={handleButtonClick}
        labelClass=" text-sm font-medium"
        label="Sign in with Google"
        type={"button"}
        styleClass="btn-white justify-center items-center !rounded-lg w-full !border-gray-300 !border-[1px] !shadow-none gap-2"
      />
        )}

      </LoginSocialGoogle>
    </div>
  );
}

export default GoogleAuth;
