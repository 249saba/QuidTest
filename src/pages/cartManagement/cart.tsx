import { CartItemsModel } from "@src/shared/models";
import ClarksIcon from "@assets/images/icons/clarks.png";
import Burger_rectangle from "@assets/images/food/burger_rectangle.png";
import CustomCard from "@src/shared/cards/customCard";
import Checkbox from "@src/shared/checkbox/checkbox";
import CustomButton from "@src/shared/customButton";
import Seperator from "@src/shared/seperator/seperatorDashed";
import LazyImage from "@src/shared/lazyImage";
import DeliveryIcon from "@assets/images/icons/delivery_icon.png";
import CartButtons from "@src/shared/cartButtons";
import SeperatorDashed from "@src/shared/seperator/seperatorDashed";
import SeperatorLine from "@src/shared/seperator/seperatorLine";
import { useNavigate } from "react-router-dom";

const cartItems: any = CartItemsModel.adapt([
  {
    id: 1,
    title: "Food",
    items: [
      {
        id: 1,
        title: "Zinger Burger With Cheez",
        dealType: "combo",
        price: 60,
        brandIcon: ClarksIcon,
        location: "Berlin, Germany",
        restaurantName: "kfc",
        pickupType: "delivery",
        items: 2,
        itemImage: Burger_rectangle,
      },
      {
        id: 2,
        title: "Zinger Burger With fries",
        dealType: "combo",
        price: 50,
        brandIcon: ClarksIcon,
        location: "Berlin, Germany",
        restaurantName: "kfc",
        pickupType: "delivery",
        items: 2,
        itemImage: Burger_rectangle,
      },
    ],
  },
  {
    id: 2,
    title: "e-commerce",
    items: [
      {
        id: 1,
        title: "Zinger Burger With Cheez",
        dealType: "combo",
        price: 60,
        brandIcon: ClarksIcon,
        location: "Berlin, Germany",
        restaurantName: "kfc",
        pickupType: "delivery",
        items: 2,
        itemImage: Burger_rectangle,
      },
    ],
  },
]);

const Cart = () => {
  const navigate = useNavigate();
  return (
    <div className="flex md:flex-col sm:flex-col gap-8  items-start">
      <div className="flex flex-col w-full gap-8">
        <CustomCard styleClass="p-6">
          <div className="flex items-center">
            <Checkbox name="selected_items" />
            <h5> Selected Items (2)</h5>
          </div>
        </CustomCard>

        {cartItems.map((item: CartItemsModel, index: number) => (
          <div className="flex flex-col gap-8">
            <CustomCard styleClass="p-6 ">
              <div className="flex flex-col gap-4">
                <div className="flex items-center">
                  <Checkbox
                    id={String(item.id)}
                    key={index}
                    name={String(item.id)}
                  />
                  <h5 className=" capitalize">{item.title} Items</h5>
                  <CustomButton
                    label="Delete"
                    styleClass="btn-red !rounded-md !h-auto !py-2  ml-auto"
                    type={"button"}
                  />
                </div>
                <Seperator className="mt-0" />
                {item.items.map((itemDetail: any, index: number) => (
                  <div className="flex flex-col gap-4 ">
                    <div className="flex sm:flex-col ">
                      <div className="flex sm:flex-col items-start gap-3">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            id={String(itemDetail.title)}
                            key={index}
                            name={String(itemDetail.title)}
                          />
                          <LazyImage
                            className="w-[120px] h-[130px] sm:[w-80px] sm:h-[80px] rounded-lg"
                            src={Burger_rectangle}
                          />
                        </div>
                        <div>
                          <div className="flex text-left flex-col items-start">
                            <h6 className="font-medium">
                              Zinger Burger With Cheez
                            </h6>
                            <p className="text-gray-900">Combo</p>
                            <h5 className="mt-2 font-medium">$60</h5>
                            <div className="flex  items-start  gap-2 mt-2">
                              <LazyImage
                                className="w-[20px] h-[20px]"
                                src={ClarksIcon}
                              />
                              <p className="font-medium text-black-900 flex items-center gap-2">
                                KFC |
                                <p className="font-normal text-xs text-gray-900">
                                  Berlin, Germany
                                </p>{" "}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end ml-auto sm:mt-3">
                        <div className=" bg-light-green-100 w-max rounded-lg items-center  flex p-3 py-1 gap-1 ">
                          <LazyImage
                            src={DeliveryIcon}
                            alt=""
                            className="object-cover rounded-t-xl "
                          />
                          <span className="text-xs text-green-900 ">
                            Delivery
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm mt-4 sm:mt-2">
                          <p className="font-medium text-black-900">
                            Estimated Delivery
                          </p>
                          <p className="text-blue-900"> 40 Min</p>
                        </div>
                        <CartButtons className="mt-5 sm:mt-2" noOfItems={1} />
                      </div>
                    </div>
                    {index !== item?.items?.length - 1 && (
                      <SeperatorLine className="!mt-0 mb-2" />
                    )}
                  </div>
                ))}
              </div>
            </CustomCard>
          </div>
        ))}
      </div>

      <div className="w-[70%] sm:w-full">
        <CustomCard styleClass="text-left py-6">
          <h6 className="text-center text-green-700 font-medium py-2">
            Payment Details
          </h6>
          <SeperatorDashed />

          <div className="mt-5 flex justify-between px-6 items-center md:px-3">
            <div className="space-y-4">
              <h6 className="font-medium">Sub-Total</h6>
              <h6 className="font-medium"> Delivery Fee</h6>
              <h6 className="font-medium"> GST</h6>
            </div>

            <div className="space-y-4">
              <h6 className="font-light">$60</h6>
              <h6 className="font-light"> $12</h6>
              <h6 className="font-light"> $80</h6>
            </div>
          </div>

          <SeperatorDashed className="mt-4" />

          <div className="mt-5 flex justify-between px-6 items-center md:px-3">
            <h5 className="font-bold">Total</h5>

            <h5 className="font-bold">$80</h5>
          </div>

          <CustomButton
            label="Confirm Payment"
            styleClass="btn-black !rounded-lg font-medium w-[90%] mt-12  mx-auto"
            type={"button"}
            handleButtonClick={() => {
              navigate("/cartManagement/choosePayment");
            }}
          />
        </CustomCard>
      </div>
    </div>
  );
};

export default Cart;
