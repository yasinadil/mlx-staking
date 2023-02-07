import Link from "next/link";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import logo from "../../assets/logo.png";

function Navbar() {
  return (
    <div className="navbar bg-[#0A3975] desktop:py-3 desktop:px-14 mobile:py-8 mobile:px-2">
      <div className="flex-1">
        <Link href="/" className="title desktop:text-4xl mobile:text-3xl">
          <Image
            src={logo}
            className=""
            style={{ width: "6vh" }}
            alt="logo"
            priority={true}
          />
        </Link>
      </div>
      <ConnectButton />
    </div>
  );
}

export default Navbar;
