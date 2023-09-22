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
      // plan_id:localStorage.getItem("plan_id"),
      // // plan_id:1,
      // module_id:localStorage.getItem("moduleId"),
      // apiType:"register"
    };
    handleAuthData?.(_authData1);
  };
console.log("plan_id",localStorage.getItem("plan_id"))
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
        labelClass="w-full sm:hidden text-sm font-medium"
        label="Google"
        type={"button"}
        styleClass="btn-white justify-start text-center  !rounded-lg w-full !border-gray-300 !border-[1px] !shadow-none"
      />
        )}

      </LoginSocialGoogle>
    </div>
  );
}

export default GoogleAuth;
