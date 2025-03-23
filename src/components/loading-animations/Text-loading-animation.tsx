const TextLoadingAnimation = ({
  height,
  width,
}: {
  height: string;
  width: string;
}) => {
  return (
    <span
      className={`animate-pulse rounded-md bg-gray-300 dark:bg-gray-500 block h-${
        height || "2"
      } w-${width || "10"}`}></span>
  );
};

export default TextLoadingAnimation;
