import Link from "next/link";
import Image from "next/image";
import tw from "../../assets/twitter_w.png";
import tg from "../../assets/tg.png";
import insta from "../../assets/instagram.png";
import fb from "../../assets/facebook.png";
import nft from "../../assets/nft.png";
import coin from "../../assets/mainsite.png";
import logo from "../../assets/mainsite.png";

function Footer() {
  return (
    <footer className="bg-[#0A3975] desktop:py-8 desktop:px-14 mobile:py-8 mobile:px-2">
      <div className="flex justify-center pb-4">
        <Image src={logo} className="w-20" alt="logo" />
      </div>

      <div className="flex justify-center gap-x-4 text-white hover:cursor-pointer items-center pb-4">
        <a
          href="https://twitter.com/MillenniumCoin_?t=-tyzE8j9fH_ClQbzzH9pvQ&s=09"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image src={tw} className="w-6" alt="twitter" title="twitter" />
        </a>

        <a
          href="https://t.me/millennium_coin"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image src={tg} className="w-6" alt="telegram" title="telegram" />
        </a>

        <a
          href="https://www.instagram.com/reel/ChSa8IZj9DS/?igshid=YmMyMTA2M2Y="
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src={insta}
            className="w-6"
            alt="instagram"
            title="instagram"
          />
        </a>

        <a
          href="https://www.facebook.com/MillenniumCoinMLX"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image src={fb} className="w-7" alt="facebook" title="facebook" />
        </a>
        <a
          href="https://www.mlxcoin.com/marketplace"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image src={nft} className="w-7" alt="nft" title="nft marketplace" />
        </a>
        <a
          href="https://www.mlxcoin.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image src={coin} className="w-7" alt="main" title="mlx" />
        </a>
      </div>

      <p className="text-center text-white">© MLX. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
