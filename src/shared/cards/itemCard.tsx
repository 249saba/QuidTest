import LazyImage from "../lazyImage";
import CustomCard from "./customCard";

import StarYellow from "@assets/images/icons/star_yellow.png";

const ItemCard = ({ items, handleClick }: any) => {
  return (
    <CustomCard
      onClick={handleClick}
      styleClass="shadow-sm h-full cursor-pointer"
    >
      <div className="relative">
        <LazyImage
          src={items.item.icon}
          alt=""
          className="object-cover w-full h-[260px] rounded-t-xl "
        />
        <p
          className={`p-3 bg-red-100 text-white rounded-md py-1 absolute top-5 left-5 ${
            !items.discountPercent ? "hidden" : "block"
          }`}
        >
          {items.discountPercent}
        </p>
      </div>
      <div className="px-4 py-4 space-y-2">
        <p className="opacity-90 text-black-100 text-sm w-10/12 text-left ">
          {items.item.title}
        </p>
        {items.designation && (
          <p className="opacity-90 text-green-900 text-md w-10/12 text-left ">
            {items.designation}
          </p>
        )}
        {items.price && (
          <div className="flex items-center">
            <h4 className="text-red-100 text-left inline-flex  font-semibold">
              €{items.price}
            </h4>
            {items.was && (
              <h5 className="text-gray-900 pl-3 line-through">
                {" "}
                €{items.was}{" "}
              </h5>
            )}
          </div>
        )}

        <p className="text-right flex justify-end text-sm text-black-900 ">
          <LazyImage className="w-9/12 pt-[1px]" src={StarYellow} alt="" />
          {items.rating}
        </p>
      </div>
    </CustomCard>
  );
};

export default ItemCard;
