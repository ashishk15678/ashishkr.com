import Image from "next/image";

export default function Page() {
  return (
    <div className=" h-full w-full">
      <div className="h-screen bg-linear-to-br from-white  to-[#39FF14]/20">
        <div className="w-full h-full items-center justify-center flex perspective-distant">
          <Image
            alt="skull image"
            src={"/skull-image.png"}
            width={900}
            height={800}
            className="aspect-square object-cover "
          />
        </div>
      </div>
    </div>
  );
}
