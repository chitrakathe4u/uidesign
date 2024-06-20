import { useState } from "react";

interface AlertProps {
  msg: string;
}

const SimpleAlert: React.FC<AlertProps> = ({ msg }) => {
  const [isVisible, setIsVisible] = useState(true);

  const dismissAlert = () => {
    setIsVisible(false);
  };

  return (
    isVisible && (
      <div
        role="alert"
        className="fixed z-50 bottom-30 left-1/2 transform -translate-x-1/2 flex items-between justify-between w-80 px-4 py-2 text-base text-white bg-gray-900 rounded-lg shadow-lg font-regular"
        data-dismissible="alert"
      >
        <div className="mr-2 p-4">{msg}.</div>
        <button
          onClick={dismissAlert}
          data-dismissible-target="alert"
          className="h-6 w-6 text-white hover:bg-white/10 active:bg-white/30"
          type="button"
        >
          <span className="sr-only">Dismiss</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>
    )
  );
};

export default SimpleAlert;
