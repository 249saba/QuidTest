import SwiperCarousel, { Slide } from "@src/shared/swiperCarousel";
import NewArrival1 from "@assets/images/new-arrival.png";
import Banner from "@assets/images/banner2.png";

import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { useNavigate } from "react-router-dom";
import LazyImage from "@src/shared/lazyImage";

const cardData = [
  {
    id: 1,
    src: NewArrival1,
  },
  {
    id: 2,
    src: Banner,
  },
  {
    id: 3,
    src: NewArrival1,
  },
  {
    id: 4,
    src: NewArrival1,
  },
  {
    id: 5,
    src: NewArrival1,
  },
];

const CategoriesSlider = () => {
  const navigate = useNavigate();
  const routeTo = (link: string) => {
    navigate(link);
  };
  return (
    // <BackroundImage
    //   url={SectionWorkNow}
    //   classes="relative bg-cover sm:bg-cover md:bg-cover bg-center bg-no-repeat h-full "
    // >
    <div className="  text-center  w-full  ">
      <SwiperCarousel
        settings={{
          navigation: true,
          zoom: true,
        }}
      >
        {cardData.map((elem, index: any) => (
          <>
            <Slide className="max-h-[450px]" key={elem.id ? elem.id : index}>
              <LazyImage src={elem.src} alt="" />

              {/* <img
                className=" object-cover h-full  w-full"
                src={elem.src}
                alt="image"
              /> */}
            </Slide>
          </>
        ))}
      </SwiperCarousel>
    </div>
    // </BackroundImage>
  );
};

export default CategoriesSlider;
