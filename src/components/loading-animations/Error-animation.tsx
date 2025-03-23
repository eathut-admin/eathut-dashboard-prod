import Image from "next/image";

const ErrorAnimation = ({ massage }: { massage: string }) => {
  return (
    <div className="grid place-items-center gap-3">
      <div className="h-40 w-56">
        <Image
          src="/error/error.svg"
          alt="error"
          width={150}
          height={100}
          className="h-full w-full object-fill"></Image>
      </div>
      <div>{massage || "Something went wrong"}</div>
    </div>
  );
};

export default ErrorAnimation;
