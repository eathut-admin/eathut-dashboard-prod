import Image from "next/image";

const DashboardTableLoadingAnimation = () => {
  return (
    <div className="grid place-items-center">
      <Image
        src={"/table-loading-animation/table-loading.gif"}
        alt="Error Animation"
        width={200}
        height={200}></Image>
    </div>
  );
};

export default DashboardTableLoadingAnimation;
