import { useState, useRef, useEffect } from 'react';
import { ReactComponent as IconRight } from '@assets/icons/arrow_left.svg'
import { ReactComponent as IconLeft } from '@assets/icons/arrow_right.svg'
// Data

const Carousel = ({ data, children }: any) => {
    const maxScrollWidth = useRef(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const carousel: any = useRef(null);

    const movePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prevState) => prevState - 1);
        }
    };

    const moveNext = () => {
        if (
            carousel.current !== null &&
            carousel.current.offsetWidth * currentIndex <= maxScrollWidth.current
        ) {
            setCurrentIndex((prevState) => prevState + 1);
        }
    };

    const isDisabled = (direction: string) => {
        if (direction === 'prev') {
            return currentIndex <= 0;
        }

        if (direction === 'next' && carousel.current !== null) {
            return (
                carousel.current.offsetWidth * currentIndex >= maxScrollWidth.current
            );
        }

        return false;
    };
    // 
    useEffect(() => {
        if (carousel !== null && carousel.current !== null) {
            carousel.current.scrollLeft = carousel.current.offsetWidth * currentIndex;
        }
    }, [currentIndex]);

    useEffect(() => {
        maxScrollWidth.current = carousel.current
            ? carousel.current.scrollWidth - carousel.current.offsetWidth
            : 0;
    }, []);

    return (
        // <div className="carousel relative">

        //     <div className=" overflow-hidden">
        //         <div className="flex justify-between absolute top left w-full h-full">
        <div className="carousel relative  ">

            <div className=" overflow-hidden">
                <div className="flex justify-between absolute top left w-full h-full">
                    <button
                        // style={{ position: 'relative', left: '-30px' }}
                        onClick={movePrev}
                        className="sm:right-4 right-8 relative h-full text-center opacity-75 hover:opacity-100 disabled:opacity-25 disabled:cursor-not-allowed z-10 p-0 m-0 transition-all ease-in-out duration-300"
                        disabled={isDisabled('prev')}
                    >
                        <IconLeft className="sm:w-8" />
                        <span className="sr-only">Prev</span>
                    </button>
                    <button
                        // style={{ position: 'relative', right: '-30px' }}
                        onClick={moveNext}
                        className="sm:left-3 left-4 relative  h-full text-center opacity-75 hover:opacity-100 disabled:opacity-25 disabled:cursor-not-allowed z-10 p-0 m-0 transition-all ease-in-out duration-300"
                        disabled={isDisabled('next')}
                    >
                        <IconRight className="sm:w-8" />
                        <span className="sr-only">Next</span>
                    </button>
                </div>
                <div
                    ref={carousel}
                    className="carousel-container relative flex gap-4   overflow-hidden scroll-smooth snap-x snap-mandatory touch-pan-x z-0"

                // className="carousel-container relative flex w-full gap-4  overflow-hidden scroll-smooth snap-x snap-mandatory touch-pan-x z-0"
                >
                    {children}
                    {/* {data.map((elem: any, index: any) => {
                        return (
                            <div
                                key={index}
                                className="carousel-item flex  text-center relative snap-start w-full"
                            >
                                <div className="p-6 space-y-4 bg-white w-80   rounded-2xl card-shadow ">
                                    {elem.icon}
                                    <h5 className="mb-2 font-bold tracking-tight text-center text-black  max-w-xs">{elem.text}</h5>
                                </div>
                            </div>
                        );
                    })} */}
                </div>
            </div>
        </div>
    );
};

export default Carousel;
