import Image from "next/image";

export function AppleDashboard() {
  const images = [
    "/switch/switch_dashboard.png",
    "/switch/switch_dashboard_2.png",
  ];
  return (
    <>
      <div className="bg-red-500">
        {images.map((image) => {
          <Image src={image} alt="" />;
        })}
      </div>
    </>
  );
}
