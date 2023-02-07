import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Navbar from "../components/Navbar/Navbar";
import Staking from "../components/Staking/Staking";
import Footer from "../components/Footer/Footer";

const Home: NextPage = () => {
  return (
    <div className="">
      <Head>
        <title>MLX Staking</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="">
        <Navbar />
        <Staking />
        <Footer />
      </div>
    </div>
  );
};

export default Home;
