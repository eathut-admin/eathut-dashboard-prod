const ButtonLoadingAnimation = ({ text }: { text: string }) => {
  return (
    <span className="flex justify-center items-center">
      <svg
        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24">
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12c0-4.418 3.582-8 8-8 1.75 0 3.375.5 4.748 1.355l-1.304 1.304C13.697 6.032 12.0 6 12 6c-3.313 0-6 2.687-6 6s2.687 6 6 6c0 0 .697-.032 1.444-.062l1.304 1.304C15.375 19.5 13.75 20 12 20c-4.418 0-8-3.582-8-8z"></path>
      </svg>
      {text}
    </span>
  );
};

export default ButtonLoadingAnimation;
