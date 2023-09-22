import ClarksIcon from "@assets/images/icons/clarks.png";
import Burger_rectangle from "@assets/images/food/burger_rectangle.png";
import CustomCard from "@src/shared/cards/customCard";
import Checkbox from "@src/shared/checkbox/checkbox";
import LazyImage from "@src/shared/lazyImage";
import HeartIcon from "@assets/images/icons/heart.png";
import { useNavigate } from "react-router-dom";

const FavouritesList = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col  gap-8  items-start">
      <CustomCard styleClass="p-6 w-full">
        <div className="flex flex-col gap-4 ">
          <div className="flex sm:flex-col ">
            <div className="flex sm:flex-col items-start gap-3">
              <div className="flex items-start gap-3">
                <Checkbox id="1" key={1} name="1" />
                <LazyImage
                  className="w-[200px] h-[200px] sm:[w-60px] sm:h-[120px] rounded-lg object-cover"
                  src={Burger_rectangle}
                />
              </div>
              <div>
                <div className="flex text-left flex-col items-start">
                  <h5 className="font-medium">
                    Black Shoes, Pure Leather Made
                  </h5>
                  <h3 className="mt-2 font-medium">$60</h3>
                  <div className="flex  items-start  gap-2 mt-2 absolute md:bottom-7 lg:bottom-7 sm:bottom-4">
                    <LazyImage className=" h-[30px]" src={ClarksIcon} />
                    <h5 className="font-medium text-black-900 flex items-center gap-2">
                      Clarks |
                      <p className="font-normal text-sm text-gray-900">
                        Berlin, Germany
                      </p>
                    </h5>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end ml-auto sm:mt-6">
              <LazyImage
                src={HeartIcon}
                className="object-cover rounded-t-xl w-10 h-full sm:w-6 "
              />
            </div>
          </div>
        </div>
      </CustomCard>
      <CustomCard styleClass="p-6 w-full">
        <div className="flex flex-col gap-4 ">
          <div className="flex sm:flex-col ">
            <div className="flex sm:flex-col items-start gap-3">
              <div className="flex items-start gap-3">
                <Checkbox id="1" key={1} name="1" />
                <LazyImage
                  className="w-[200px] h-[200px] sm:[w-60px] sm:h-[120px] rounded-lg object-cover"
                  src={Burger_rectangle}
                />
              </div>
              <div>
                <div className="flex text-left flex-col items-start">
                  <h5 className="font-medium">
                    Black Shoes, Pure Leather Made
                  </h5>
                  <h3 className="mt-2 font-medium">$60</h3>
                  <div className="flex  items-start  gap-2 mt-2 absolute md:bottom-7 lg:bottom-7 sm:bottom-4">
                    <LazyImage className=" h-[30px]" src={ClarksIcon} />
                    <h5 className="font-medium text-black-900 flex items-center gap-2">
                      Clarks |
                      <p className="font-normal text-sm text-gray-900">
                        Berlin, Germany
                      </p>
                    </h5>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end ml-auto sm:mt-6">
              <LazyImage
                src={HeartIcon}
                className="object-cover rounded-t-xl w-10 h-full sm:w-6 "
              />
            </div>
          </div>
        </div>
      </CustomCard>
      <CustomCard styleClass="p-6 w-full">
        <div className="flex flex-col gap-4 ">
          <div className="flex sm:flex-col ">
            <div className="flex sm:flex-col items-start gap-3">
              <div className="flex items-start gap-3">
                <Checkbox id="1" key={1} name="1" />
                <LazyImage
                  className="w-[200px] h-[200px] sm:[w-60px] sm:h-[120px] rounded-lg object-cover"
                  src={Burger_rectangle}
                />
              </div>
              <div>
                <div className="flex text-left flex-col items-start">
                  <h5 className="font-medium">
                    Black Shoes, Pure Leather Made
                  </h5>
                  <h3 className="mt-2 font-medium">$60</h3>
                  <div className="flex  items-start  gap-2 mt-2 absolute md:bottom-7 lg:bottom-7 sm:bottom-4">
                    <LazyImage className=" h-[30px]" src={ClarksIcon} />
                    <h5 className="font-medium text-black-900 flex items-center gap-2">
                      Clarks |
                      <p className="font-normal text-sm text-gray-900">
                        Berlin, Germany
                      </p>
                    </h5>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end ml-auto sm:mt-6">
              <LazyImage
                src={HeartIcon}
                className="object-cover rounded-t-xl w-10 h-full sm:w-6 "
              />
            </div>
          </div>
        </div>
      </CustomCard>
      <CustomCard styleClass="p-6 w-full">
        <div className="flex flex-col gap-4 ">
          <div className="flex sm:flex-col ">
            <div className="flex sm:flex-col items-start gap-3">
              <div className="flex items-start gap-3">
                <Checkbox id="1" key={1} name="1" />
                <LazyImage
                  className="w-[200px] h-[200px] sm:[w-60px] sm:h-[120px] rounded-lg object-cover"
                  src={Burger_rectangle}
                />
              </div>
              <div>
                <div className="flex text-left flex-col items-start">
                  <h5 className="font-medium">
                    Black Shoes, Pure Leather Made
                  </h5>
                  <h3 className="mt-2 font-medium">$60</h3>
                  <div className="flex  items-start  gap-2 mt-2 absolute md:bottom-7 lg:bottom-7 sm:bottom-4">
                    <LazyImage className=" h-[30px]" src={ClarksIcon} />
                    <h5 className="font-medium text-black-900 flex items-center gap-2">
                      Clarks |
                      <p className="font-normal text-sm text-gray-900">
                        Berlin, Germany
                      </p>
                    </h5>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end ml-auto sm:mt-6">
              <LazyImage
                src={HeartIcon}
                className="object-cover rounded-t-xl w-10 h-full sm:w-6 "
              />
            </div>
          </div>
        </div>
      </CustomCard>
    </div>
  );
};
export default FavouritesList;
