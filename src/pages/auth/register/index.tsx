import ContentContainer from "@src/containers/contentContainer";
import { useNavigate } from "react-router-dom";
import Header from "@src/shared/navbar";
import CustomButton from "@src/shared/customButton";
import {useAuth } from "@src/shared/guards/AuthContext";
const SignUp = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const handleLogOut = () => {
    logout();
    navigate("/");
  };
  return (
    <>
      {" "}
      <Header isShow={true} />
      <ContentContainer styleClass="login-bg-gradient min-h-screen  !h-full gap-20  ">
        <div className=" w-1/2 mx-auto sm:w-full flex flex-col gap-7">
          <div>
            <h4>Welcome, {user}!</h4>

            <div className="w-9/12 mx-auto">
              <CustomButton
              type={"button"}
                label="Log out"
                labelClass="font-semibold"
                styleClass="btn-black !bg-[#30d4a3]   !rounded-lg w-full mt-5"
                handleButtonClick={handleLogOut}
              />
            </div>
          </div>
        </div>
      </ContentContainer>
    </>
  );
};
export default SignUp;
