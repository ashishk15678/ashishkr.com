import Image from "next/image";
import BackgroundHidden from "./background-hidden";

export default function Page() {
  return (
    <div className=" w-full h-full bg-linear-to-br bg-[#000]">
      <div className="h-2 w-full absolute top-0 left-0"></div>
      <div className="h-screen w-full ">
        <div className="absolute z-2 top-80 left-60 p-3 rounded-xl">
          <div
            // style={{
            //   background: `
            //     radial-gradient(circle at 20% 30%, rgba(120, 50, 255, 0.6), transparent),
            //     radial-gradient(circle at 80% 70%, rgba(50, 200, 255, 0.6), transparent)
            //   `,
            // }}
            className="absolute -inset-2  bg-zinc-300  rounded-[2rem] blur-3xl opacity-50 animate-glow"
            aria-hidden="true"
          />
          <Image
            src={"/template/dashboard.png"}
            alt="Dashboard"
            width={900}
            height={600}
            className="backdrop-blur-2xl rounded-3xl"
          />
        </div>
      </div>
      <BackgroundHidden />
    </div>
  );
}
