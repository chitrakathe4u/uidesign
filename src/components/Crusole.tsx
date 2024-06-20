import { useEffect, useState } from "react";
import Logo from "../assets/images/bag1.jpeg";
import shoe from "../assets/images/slide.jpg";
import shoe1 from "../assets/images/shoe1.jpeg";
import shoe2 from "../assets/images/women shoe.jpeg";
import shoe3 from "../assets/images/shoe2.jpeg";

function Crusole() {
  const autoPlayInterval = 3000;
  const images = [Logo, shoe, shoe2, shoe3, shoe1];

  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const showItem = (index: number) => {
    const carousel = document.getElementById("default-carousel");
    if (carousel) {
      const items = carousel.querySelectorAll("[data-carousel-item]");

      items.forEach((item, i) => {
        if (i === index) {
          item.classList.remove("hidden");
        } else {
          item.classList.add("hidden");
        }
      });
    }
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    showItem(index);
  };

  useEffect(() => {
    const carousel = document.getElementById("default-carousel");

    if (carousel) {
      const prevButton = carousel.querySelector("[data-carousel-prev]");
      const nextButton = carousel.querySelector("[data-carousel-next]");

      const goToPrevSlide = () => {
        if (currentIndex > 0) {
          goToSlide(currentIndex - 1);
        } else {
          goToSlide(images.length - 1);
        }
      };

      const goToNextSlide = () => {
        if (currentIndex < images.length - 1) {
          goToSlide(currentIndex + 1);
        } else {
          goToSlide(0);
        }
      };

      // Check if prevButton and nextButton exist before adding event listeners
      prevButton && prevButton.addEventListener("click", goToPrevSlide);
      nextButton && nextButton.addEventListener("click", goToNextSlide);

      // Initial setup
      showItem(currentIndex);
      const autoPlay = () => {
        if (currentIndex < images.length - 1) {
          goToSlide(currentIndex + 1);
        } else {
          goToSlide(0);
        }
      };

      const intervalId = setInterval(autoPlay, autoPlayInterval);

      // Clear the interval and remove event listeners when the component unmounts
      return () => {
        clearInterval(intervalId);
        prevButton && prevButton.removeEventListener("click", goToPrevSlide);
        nextButton && nextButton.removeEventListener("click", goToNextSlide);
      };
    }
  }, [currentIndex, images, autoPlayInterval]);

  return (
    <>
      <div
        id="default-carousel"
        className="relative w-full"
        data-carousel="slide"
      >
        <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
          {images.map((image, index) => (
            <div
              key={index}
              className="hidden duration-700 ease-in-out"
              data-carousel-item
            >
              <img
                src={image}
                className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                alt="..."
              />
            </div>
          ))}
        </div>

        <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
          {images.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`w-3 h-3 rounded-full ${
                index === currentIndex ? "bg-blue-500" : "bg-gray-300"
              }`}
              aria-current={index === currentIndex}
              aria-label={`Slide ${index + 1}`}
              data-carousel-slide-to={index}
              onClick={() => goToSlide(index)}
            ></button>
          ))}
        </div>

        <button
          type="button"
          className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
          data-carousel-prev
        >
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
            <svg
              className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 1 1 5l4 4"
              />
            </svg>
            <span className="sr-only">Previous</span>
          </span>
        </button>
        <button
          type="button"
          className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
          data-carousel-next
        >
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
            <svg
              className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 9 4-4-4-4"
              />
            </svg>
            <span className="sr-only">Next</span>
          </span>
        </button>
      </div>
    </>
  );
}

export default Crusole;
