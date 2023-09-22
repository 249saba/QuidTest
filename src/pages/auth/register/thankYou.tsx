import ContentContainer from "@src/containers/contentContainer";

import DrawBoard from "@assets/vendor/images/undraw_done_re_oak4.png";
import GreenTick from "@assets/vendor/icons/green_tick.png";
import LazyImage from "@src/shared/lazyImage";
import CustomButton from "@src/shared/customButton";
import { useNavigate } from "react-router-dom";
import Header from "@src/shared/navbar";
const ThankYou = () => {
  const navigate = useNavigate();
  const handleBtnClick = () => {
    navigate("/");
  };
  return (
    <><Header isShow={true} />
      <ContentContainer styleClass="login-bg-gradient  min-h-screen  !h-full gap-20  ">
      <div className="flex flex-col items-center justify-center gap-3 w-1/2 sm:w-full mx-auto">
        <LazyImage src={DrawBoard} />

        <h5 className="font-medium flex flex-wrap sm:justify-center gap-1 items-center">
          <LazyImage
            className="w-[40px] h-[40px] sm:h-[40px] sm:w-auto"
            src={GreenTick}
          />{" "}
          Registration Successfully
        </h5>

        <h6 className="text-gray-900 font-normal">
        You Have Successfully Registered Yourself With Us. Please Go To Your Email And Verify Your Email Address In Order To Continue With Us."
        </h6>

        <CustomButton
          handleButtonClick={handleBtnClick}
          type={"button"}
          label="Sign In"
          labelClass="font-medium"
          styleClass="btn-black !rounded-md mt-10 w-[50%] sm:w-full"
        />
      </div>
    </ContentContainer>
    </>
  
  );
};
export default ThankYou;
