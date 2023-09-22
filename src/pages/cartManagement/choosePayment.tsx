import CustomCard from "@src/shared/cards/customCard";
import CustomButton from "@src/shared/customButton";
import Radio from "@src/shared/radio/radio";
import MasterCard from "@assets/images/icons/masterCard.svg";
// import CircleTick from "@assets/images/icons/tickCircle.png";
import CircleTick from "@assets/images/icons/circle_tick.png";
import LazyImage from "@src/shared/lazyImage";
import PencilEditIcon from "@src/shared/icons/pencil-edit";
import SeperatorDashed from "@src/shared/seperator/seperatorDashed";
import Popup from "@src/shared/popup/popup";
import { useState } from "react";

const ChoosePayment = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleConfirmAppointemnt = () => {
    setIsOpen(true);
  };
  return (
    <div className="flex sm:flex-col items-start gap-8 justify-between pl-6 sm:pl-0">
      <div className="space-y-8 w-full">
        <CustomCard styleClass="text-left py-6">
          <h4 className="pl-6">Personal Details</h4>
          <SeperatorDashed />

          <div className="mt-5 flex justify-around items-center md:px-3">
            <div className="space-y-4">
              <h6 className="font-medium"> Name:</h6>
              <h6 className="font-medium"> Address:</h6>
              <h6 className="font-medium"> Phone Number:</h6>
            </div>

            <div className="space-y-4">
              <h6 className="font-light"> William</h6>
              <h6 className="font-light"> Street ABC, City XYZ</h6>
              <h6 className="font-light"> 09123456789</h6>
            </div>
          </div>
        </CustomCard>
        <CustomCard styleClass="text-left py-6">
          <h4 className="pl-6">Payment Method</h4>
          <SeperatorDashed />
          <div className="mt-5 flex flex-col justify-between items-start gap-5 px-6 sm:px-2">
            <div className="flex items-center  bg-gray-800 rounded-lg w-full p-4 gap-3">
              <Radio
                name="masterCard"
                id="masterCard"
                labelClassName="block -top-3"
              />
              <div className="flex gap-3">
                <LazyImage width="60px" height="100%" src={MasterCard} />
                <div className="space-y-2">
                  <p className="text-sm text-black-900">Mastercard</p>
                  <h6 className="text-gray-900">**** 4466</h6>
                </div>
              </div>

              <div className="ml-auto">
                <PencilEditIcon className="w-10" />
              </div>
            </div>
          </div>
          <div className="mt-3 flex flex-col justify-between items-start gap-5 px-6 sm:px-2">
            <div className="flex items-center  bg-gray-800 rounded-lg w-full p-4 gap-3">
              <Radio
                name="masterCard"
                id="masterCard"
                labelClassName="block -top-3"
              />
              <div className="flex gap-3">
                <LazyImage width="60px" height="100%" src={MasterCard} />
              </div>

              <div className="ml-auto">
                <p className="text-xs text-blue-900">+ Add new card</p>
              </div>
            </div>
          </div>
        </CustomCard>
      </div>
      <div className="space-y-16  w-[70%] sm:w-full">
        <CustomCard styleClass="text-left py-6 pb-16 !bg-green-800 !bg-opacity-10 !shadow-none">
          <div className="flex justify-evenly  ">
            <h6 className="text-green-700 font-semibold">Order Id</h6>{" "}
            <h6 className="text-green-700 font-semibold">#487895566</h6>
          </div>
          <SeperatorDashed />
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-1 md:grid-cols-1  justify-between items-center  gap-8 px-16 md:px-6 sm:px-6">
            <div>
              <h6 className=" font-bold"> Date: </h6>
              <h6 className="font-light">Wednesday, 11 Jan 2022</h6>
            </div>
            <div>
              <h6 className="font-bold"> Time: </h6>
              <h6 className="font-light">07:30 PM</h6>
            </div>

            <div>
              <h6 className=" font-bold"> Price: </h6>
              <h6 className="font-light">$80</h6>
            </div>
          </div>
        </CustomCard>

        <div className="w-full flex  px-4 gap-6">
          <CustomButton
            label={"Back"}
            type={"button"}
            variant={"outlined"}
            styleClass={"btn-gray w-[40%]  !rounded-xl !font-medium "}
          />
          <CustomButton
            handleButtonClick={handleConfirmAppointemnt}
            label={"Confirm Appointment"}
            type={"button"}
            variant={"outlined"}
            styleClass={"btn-black w-full  !rounded-xl !font-medium "}
          />
        </div>
      </div>

      <Popup
        isOpen={isOpen}
        handleClose={() => setIsOpen(false)}
        isShowHeader={true}
      >
        <div className="flex flex-col justify-center items-center gap-3">
          <LazyImage src={CircleTick} className="h-[220px] mt-6" />
          <h5 className="font-semibold mt-5">Your order is placed</h5>
          <h6 className="font-semibold">ORDER #15683</h6>
          <p className="text-normal text-black-900">
            You can track your order in{" "}
            <span className="font-semibold">My Orders</span> section
          </p>
          <div className="space-y-3 mt-8">
            <CustomButton
              label={"Track Order"}
              type={"button"}
              variant={"outlined"}
              styleClass={"btn-black w-full  !rounded-xl !font-medium "}
            />
            <CustomButton
              handleButtonClick={() => setIsOpen(false)}
              label={"Close"}
              type={"button"}
              variant={"outlined"}
              styleClass={"btn-white w-full  !rounded-xl !font-medium "}
            />
          </div>
        </div>
      </Popup>
    </div>
  );
};

export default ChoosePayment;
