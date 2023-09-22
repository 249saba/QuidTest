import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/zoom";
import "swiper/css/effect-fade";
import SwiperCore, {
  Navigation,
  Pagination,
  EffectFade,
  Autoplay,
  Zoom,
} from "swiper";
import { useRef } from "react";
SwiperCore.use([Navigation, Pagination, EffectFade, Zoom, Autoplay]);

const SwiperCarousel = ({ children, settings }: any) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const sliderOptions = {
    pagination: true,
    navigation: false,
    loop: true,
    spaceBetween: 50,
    zoom: true,
    breakpoints: {
      340: {
        slidesPerView: 1,
        spaceBetween: 20,
      },
      660: {
        slidesPerView: 1,
        spaceBetween: 40,
      },
      1024: {
        slidesPerView: 1,
        spaceBetween: 50,
      },
    },
    // autoplay: {
    //  delay: 2000,
    //  disableOnInteraction: false,
    // },
    ...settings,
    // Uncomment autoply option then you can see the swiper play automatically
    // you can override setting options pass settings props to this component
  };

  return (
    <div className="carousel-container">
      {/* <div className="swiper-button" ref={prevRef}>
          prev
        </div> */}
      <Swiper modules={[Zoom]} className="w-full" {...sliderOptions}>
        {children}
      </Swiper>
      {/* <div className="swiper-button" ref={nextRef}>
  next
</div> */}
    </div>
  );
};

export { SwiperSlide as Slide };
export default SwiperCarousel;
