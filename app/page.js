import Image from "next/image";
import Link from "next/link";
import heroImage from "../public/hero.png";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Image
        src={heroImage}
        width="450"
        height="600"
        alt="Hero Image"
        className="mb-12"
      />
      <h1 className="text-5xl font-[500] mb-2 text-center">ALL YOUR REPORTS</h1>
      <h2 className="text-3xl font-[400] mb-8 text-center">IN ONE PLACE</h2>
      <p className=" text-xl text-center mb-8">No more searching the drawers for reports!
        <br></br>
      Get all your reports organized like never before.
      <br></br>
      Create, edit, download pdf or share,
      <br></br>
      it's all just a click away!</p>
      <Link href="/login" className="bg-[#834CFF] px-4 py-2 rounded-sm text-white font-[400] text-xl text-center">GET STARTED</Link>
    </div>
  );
}
