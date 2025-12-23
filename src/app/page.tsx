import Navbar from "@/components/home/Navbar";

export default function Home() {
  return (
    <div className="h-screen w-full flex flex-col pt-10 overflow-hidden max-[995px]:h-auto">
      <Navbar />
      <div className="h-10 w-full"></div>
      <div className="h-10 w-full flex">
        <div className="h-screen w-1/2 text-bold text-black bg-blue-300 text-center">
          <h1>welcum</h1>
        </div>
        <div className="h-screen w-1/2 bg-yellow-300">
          
        </div>
      </div>
    </div>
  );
}
