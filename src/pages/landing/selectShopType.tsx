import ContentContainer from "@src/containers/contentContainer";
import CustomCard from "@src/shared/cards/customCard";
import LazyImage from "@src/shared/lazyImage";
import Sale from "@assets/vendor/icons/sale.png";
import Store from "@assets/vendor/icons/store.png";
import CustomButton from "@src/shared/customButton";
import { BiCheck } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

const SelectShopType = () => {
  const navigate = useNavigate();
  const handleNavigation = () => {
    navigate("/signUp");
  };
  return (
    <ContentContainer styleClass="gap-12 sm:!h-full  h-screen login-gradient ">
      <div className="flex flex-col justify-center gap-8 mt-8">
        <h4 className="font-semibold">
          What Will Be Your Ecommerce Shop Type?
        </h4>
        <p className="text-gray-900 w-9/12 sm:w-full mx-auto">
          Please Select The Type Of Shop That Best Matches Your Business. This
          Will Help Us Understand Your Needs And Tailor Our Services To Provide
          The Best Possible Support For Your Ecommerce Journey.
        </p>
        <div className="flex gap-12 sm:gap-6 sm:flex-col justify-center">
          <CustomCard
            styleClass={`flex justify-center gap-8 sm:gap-4 items-center p-20 sm:p-8 !rounded-2xl border-[1px] border-blue-900 relative cursor-pointer  `}
          >
            <BiCheck
              size={22}
              className=" bg-black-900 rounded-full absolute right-5 top-5 "
            />
            <LazyImage src={Sale} className="w-9/12 mx-auto" />
            <h5 className="font-medium">Deals Listing</h5>
          </CustomCard>

          <CustomCard styleClass="flex justify-center gap-8 sm:gap-4 items-center p-20 sm:p-8 !rounded-2xl cursor-pointer ">
            <LazyImage src={Store} className="w-9/12 mx-auto" />
            <h5 className="font-medium">Online Shop</h5>
          </CustomCard>
        </div>

        <CustomButton
          handleButtonClick={handleNavigation}
          type={"button"}
          label="Next"
          labelClass="!font-medium"
          styleClass="btn-white !bg-transparent !rounded-md !border-[1px] w-1/5 sm:w-10/12   !mx-auto"
        />
      </div>
    </ContentContainer>
  );
};

export default SelectShopType;
