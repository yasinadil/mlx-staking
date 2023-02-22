import { useEffect, useState } from "react";
import { ethers, BigNumber } from "ethers";
import { useAccount, useBalance } from "wagmi";
import { useRouter } from "next/router";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  mlxStakingContractAddress,
  bnbStakingContractAddress,
  mlxTokenAddress,
} from "../../Config";
import BNB from "../../assets/bnb.png";
import MLX from "../../assets/mlx.png";
import { useNetwork } from "wagmi";

const bnbStakeABI = require("../../components/ABI/bnbStakeABI.json");
const mlxStakeABI = require("../../components/ABI/mlxStakeABI.json");
const mlxTokenABI = require("../../components/ABI/mlxTokenABI.json");

function Staking() {
  const [isActivebnb, setActiveBNB] = useState(true);
  const [isActivemlx, setActiveMlx] = useState(false);
  const [coinSelected, setCoinSelected] = useState("BUSD");
  const [approved, setApproved] = useState(false);
  const [mlxBalance, setMlxBalance] = useState("0");
  const [bnbBalance, setBnbBalance] = useState("0");
  const [bnbAmount, setBnbAmount] = useState("0");
  const [mlxAmount, setMlxAmount] = useState("0");
  const [mlxAPR, setMlxAPR] = useState(0);
  const [bnbAPR, setBnbAPR] = useState(0);
  const [estMlx, setEstMlx] = useState(0);
  const [estBnb, setEstBnb] = useState(0);
  const [mlxRefAmount, setMlxRefAmount] = useState("0");
  const [mlxRefReward, setMlxRefReward] = useState("0");
  const [bnbRefAmount, setBnbRefAmount] = useState("0");
  const [bnbRefReward, setBnbRefReward] = useState("0");
  const [refwallet, setRefWallet] = useState(
    "0x0000000000000000000000000000000000000000"
  );
  const [stakingRewards, setStakingRewards] = useState("0");
  const [stakingRewardsFromBNB, setStakingRewardsFromBNB] = useState("0");
  const [reflink, setRefLink] = useState("");
  const { address, isConnected } = useAccount();
  const { chain, chains } = useNetwork();
  const providerUrl = process.env.NEXT_PUBLIC_QN_API;

  var router = useRouter();

  useEffect(() => {
    async function getChainId() {
      const provider = new ethers.providers.JsonRpcProvider(providerUrl);
      const { chainId } = await provider.getNetwork();
      if (chain != undefined) {
        if (isConnected && chainId == chain.id) {
          loadMlxBalance();
          loadBNBBalance();
          loadMlxRefRewards();
          loadBnbRefRewards();
          const url =
            window.location.protocol +
            "//" +
            window.location.host +
            "?ref=" +
            address;
          console.log(url);
          setRefLink(url);
        } else {
          const url =
            window.location.protocol +
            "//" +
            window.location.host +
            "?ref=" +
            "0x0000000000000000000000000000000000000000";
          console.log("No referral");
          setRefLink(url);
        }
      }
    }

    getChainId();
    const queryParams = new URLSearchParams(window.location.search);
    const ref = queryParams.get("ref");
    console.log(ref);
    // var ref = router.query["ref"];

    // console.log(ref);

    if (ref != null) {
      setRefWallet(ref);
      console.log(ref);
    }
  }, [isConnected, chain]);

  const toggleClassBNB = () => {
    setActiveBNB(!isActivebnb);
    setActiveMlx(false);
    setCoinSelected("BNB");
    setApproved(true);
  };

  const toggleClassMLX = () => {
    setActiveMlx(!isActivemlx);
    setActiveBNB(false);
    setCoinSelected("BUSD");
    setApproved(false);
  };

  useEffect(() => {
    loadMlxStakeInfo();
    loadBnbStakeInfo();
  }, []);

  // async function getStakers() {
  //   const provider = new ethers.providers.Web3Provider(window.ethereum as any);
  //   const signer = provider.getSigner();

  //   const mlxStakeContract = new ethers.Contract(
  //     mlxStakingContractAddress,
  //     mlxStakeABI,
  //     signer
  //   );
  //   let stakers = [];
  //   let balances = [];
  //   let lastActionTime = [];
  //   let swapLock = [];
  //   let depositTime = [];
  //   for (let i = 0; i < 11; i++) {
  //     const response = await mlxStakeContract.stakerList(i);
  //     stakers.push(response);
  //     const bal = await mlxStakeContract.balances(response);
  //     balances.push(bal.toString());
  //     const lastTime = await mlxStakeContract.lastActionTime(response);
  //     lastActionTime.push(lastTime.toString());
  //     const swaplock = await mlxStakeContract.swaplock(response);
  //     const timeswap = swaplock.time;
  //     swapLock.push(swaplock.toString());
  //     const depTime = await mlxStakeContract.depositTime(response);
  //     depositTime.push(depTime.toString());
  //   }

  //   console.log(stakers);
  //   console.log(balances);
  //   console.log(lastActionTime);
  //   console.log(swapLock);
  //   console.log(depositTime);
  // }

  async function approveMLX() {
    const provider = new ethers.providers.Web3Provider(window.ethereum as any);
    const signer = provider.getSigner();

    const mlxContract = new ethers.Contract(
      mlxTokenAddress,
      mlxTokenABI,
      signer
    );

    try {
      const response = await mlxContract.approve(
        mlxStakingContractAddress,
        mlxAmount
      );
      const wait = await provider.waitForTransaction(response.hash);
      setApproved(true);
      toast.success("Tokens Approved", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error: any) {
      let message = error.reason;
      toast.error(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  }

  async function stakeMLX() {
    const provider = new ethers.providers.Web3Provider(window.ethereum as any);
    const signer = provider.getSigner();

    const mlxStakeContract = new ethers.Contract(
      mlxStakingContractAddress,
      mlxStakeABI,
      signer
    );

    try {
      const response = await mlxStakeContract.deposit(refwallet, mlxAmount);
      const wait = await provider.waitForTransaction(response.hash);
      toast.success("Tokens Staked", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error: any) {
      let message = error.reason;
      toast.error(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  }

  async function stakeBNB() {
    const provider = new ethers.providers.Web3Provider(window.ethereum as any);
    const signer = provider.getSigner();

    const bnbStakeContract = new ethers.Contract(
      bnbStakingContractAddress,
      bnbStakeABI,
      signer
    );

    try {
      // console.log(Number(ethers.utils.parseEther(bnbBalance)));
      if (Number(ethers.utils.parseEther(bnbBalance)) < Number(bnbAmount)) {
        toast.error("You do not have the funds for this transaction.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
      const response = await bnbStakeContract.deposit(refwallet, {
        value: BigNumber.from(bnbAmount),
      });
      const wait = await provider.waitForTransaction(response.hash);
      toast.success("Tokens Staked", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error: any) {
      let message = error.reason;
      toast.error(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  }

  async function claimMLX() {
    const provider = new ethers.providers.Web3Provider(window.ethereum as any);
    const signer = provider.getSigner();

    const mlxStakeContract = new ethers.Contract(
      mlxStakingContractAddress,
      mlxStakeABI,
      signer
    );

    try {
      const response = await mlxStakeContract.claimReward();
      const wait = await provider.waitForTransaction(response.hash);
      toast.success("Rewards Claimed", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error: any) {
      let message = error.reason;
      toast.error(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  }

  async function claimBNB() {
    const provider = new ethers.providers.Web3Provider(window.ethereum as any);
    const signer = provider.getSigner();

    const bnbStakeContract = new ethers.Contract(
      bnbStakingContractAddress,
      bnbStakeABI,
      signer
    );

    try {
      const response = await bnbStakeContract.claimReward();
      const wait = await provider.waitForTransaction(response.hash);
      toast.success("Rewards Claimed", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error: any) {
      let message = error.reason;
      toast.error(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  }

  async function withdrawBNB() {
    const provider = new ethers.providers.Web3Provider(window.ethereum as any);
    const signer = provider.getSigner();

    const bnbStakeContract = new ethers.Contract(
      bnbStakingContractAddress,
      bnbStakeABI,
      signer
    );

    try {
      const response = await bnbStakeContract.withdrawCapital();
      const wait = await provider.waitForTransaction(response.hash);
      toast.success("Withdrew Capital", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error: any) {
      let message = error.reason;
      toast.error(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  }

  async function withdrawMLX() {
    const provider = new ethers.providers.Web3Provider(window.ethereum as any);
    const signer = provider.getSigner();

    const mlxStakeContract = new ethers.Contract(
      mlxStakingContractAddress,
      mlxStakeABI,
      signer
    );

    try {
      const response = await mlxStakeContract.withdrawCapital();
      const wait = await provider.waitForTransaction(response.hash);
      toast.success("Withdrew Capital", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error: any) {
      let message = error.reason;
      toast.error(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  }

  async function loadMlxStakeInfo() {
    const provider = new ethers.providers.JsonRpcProvider(providerUrl);

    const mlxStakeContract = new ethers.Contract(
      mlxStakingContractAddress,
      mlxStakeABI,
      provider
    );

    const aprRaw = await mlxStakeContract.aprLevel1();
    setMlxAPR(Number(aprRaw) / 1000 / 52);
  }

  async function loadBnbStakeInfo() {
    const provider = new ethers.providers.JsonRpcProvider(providerUrl);

    const bnbStakeContract = new ethers.Contract(
      bnbStakingContractAddress,
      bnbStakeABI,
      provider
    );

    const aprRaw = await bnbStakeContract.aprLevel1();
    setBnbAPR(Number(aprRaw) / 1000 / 52);
  }

  async function loadBnbRefRewards() {
    const provider = new ethers.providers.JsonRpcProvider(providerUrl);

    const bnbStakeContract = new ethers.Contract(
      bnbStakingContractAddress,
      bnbStakeABI,
      provider
    );

    const refInfo = await bnbStakeContract.referralRewards(address);
    const refamount = refInfo.amount;
    setBnbRefAmount(refamount.toString());
    setBnbRefReward(
      Number(ethers.utils.formatEther(BigNumber.from(refInfo.reward))).toFixed(
        2
      )
    );
    const stakingReward = await bnbStakeContract.getRewardInfo(address);
    setStakingRewardsFromBNB(
      Number(
        ethers.utils.formatEther(BigNumber.from(stakingReward[2]))
      ).toFixed(2)
    );
  }

  async function loadMlxRefRewards() {
    const provider = new ethers.providers.JsonRpcProvider(providerUrl);

    const mlxStakeContract = new ethers.Contract(
      mlxStakingContractAddress,
      mlxStakeABI,
      provider
    );

    const refInfo = await mlxStakeContract.referralRewards(address);
    const refamount = refInfo.amount;
    setMlxRefAmount(refamount.toString());
    setMlxRefReward(
      Number(ethers.utils.formatEther(BigNumber.from(refInfo.reward))).toFixed(
        2
      )
    );

    const stakingReward = await mlxStakeContract.getRewardInfo(address);
    setStakingRewards(
      Number(
        ethers.utils.formatEther(BigNumber.from(stakingReward[2]))
      ).toFixed(2)
    );
  }

  async function loadMlxBalance() {
    const provider = new ethers.providers.Web3Provider(window.ethereum as any);
    const signer = provider.getSigner();

    const mlxContract = new ethers.Contract(
      mlxTokenAddress,
      mlxTokenABI,
      signer
    );

    const balance = await mlxContract.balanceOf(address);
    const value = BigNumber.from(balance);
    const formatBalance = ethers.utils.formatEther(value);
    let formattedBalance = Number(formatBalance).toFixed(2);
    setMlxBalance(formattedBalance.toString());
  }

  async function loadBNBBalance() {
    const provider = new ethers.providers.Web3Provider(window.ethereum as any);
    const signer = provider.getSigner();
    if (address != undefined) {
      provider.getBalance(address).then((balance) => {
        const balanceInEth = ethers.utils.formatEther(balance);
        setBnbBalance(Number(balanceInEth).toFixed(3));
      });
    }
  }

  return (
    <div className="hero min-h-screen bg-base-200">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="hero-content text-center">
        <div className="">
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3">
            <div></div>
            <div className="bg-[#0A3975] py-2 p-2 flex justify-between rounded-md">
              <span className="text-white font-bold my-auto mx-auto">
                Referral:{" "}
              </span>
              <input
                value={reflink}
                className="bg-transparent outline-none text-white w-full text-center pl-2"
                readOnly
              />
              {/* <button
                className="py-1 px-6 text-m md:flex bg-white  rounded shadow-lg text-black font-bold transition ease-in-out delay-100 hover:-translate-y-1"
                onClick={() => {
                  navigator.clipboard.writeText(reflink);
                }}
              >
                COPY
              </button> */}
            </div>
            <div></div>
          </div>
          <div className="grid desktop:grid-cols-4 mobile:grid-cols-1 gap-5 desktop:pt-8 mobile:py-6 desktop:mx-48 mobile:mx-0 text-center">
            <div className="desktop:py-6 mobile:py-1 font-bold text-[#0A3975]">
              <h2 className="text-xl">Weekly ROI</h2>
              <span>
                {isActivebnb
                  ? Number(bnbAPR).toFixed(2)
                  : Number(mlxAPR).toFixed(3)}
                %
              </span>
            </div>
            <div className="desktop:py-6 mobile:py-1 font-bold text-[#0A3975]">
              <h2 className="text-xl">Staking Rewards</h2>
              <span>
                {isActivebnb ? (
                  <>{stakingRewardsFromBNB} MLT</>
                ) : (
                  <>{stakingRewards} MLT</>
                )}
              </span>
            </div>
            <div className="desktop:py-6 mobile:py-1 font-bold text-[#0A3975]">
              <h2 className="text-xl">Referral Rewards</h2>
              <p>
                {isActivebnb ? (
                  <>{bnbRefReward} BNB</>
                ) : (
                  <>{mlxRefReward} MLX</>
                )}
              </p>
            </div>
            <div className="desktop:py-6 mobile:py-1 font-bold text-[#0A3975]">
              <h2 className="text-xl">Referral Count</h2>
              <span>
                {isActivebnb ? <>{bnbRefAmount}</> : <>{mlxRefAmount}</>}
              </span>
            </div>
          </div>

          <div className="desktop:mt-8 mobile:mt-4">
            <p className="text-center text-[#0A3975] font-extrabold text-4xl mb-4">
              MLX Staking{" "}
            </p>
            <p className="text-center text-[#0A3975] font-semibold">
              Select coin for staking{" "}
            </p>
            <div className="flex justify-center mb-6">
              <div className="form-control">
                <div className="text-center mt-2">
                  <button className="mx-3">
                    <Image
                      className={
                        isActivebnb
                          ? "w-12 inline-block p-2 border-1 border-[#4389e6] bg-[#4389e6]"
                          : "w-12 inline-block p-2"
                      }
                      src={BNB}
                      alt="bnb"
                      onClick={toggleClassBNB}
                    />
                  </button>
                  <button className="mx-3">
                    <Image
                      className={
                        isActivemlx
                          ? "w-12 inline-block p-2 border-1 border-[#4389e6] bg-[#4389e6]"
                          : "w-12 inline-block p-2"
                      }
                      src={MLX}
                      alt="bnb"
                      onClick={toggleClassMLX}
                    />
                  </button>
                </div>
                {isActivebnb && (
                  <>
                    <label className="label">
                      <span className="label-text text-[#0A3975] font-semibold">
                        Enter amount
                      </span>
                    </label>
                    <label className="input-group">
                      <input
                        type="text"
                        className="input input-bordered bg-[#0A3975] text-white"
                        placeholder="Enter amount"
                        onChange={(e) => {
                          if (
                            e.target.value != "" &&
                            Number(e.target.value) > 0
                          ) {
                            const val = e.target.value;
                            const est = Number(val) * (bnbAPR / 100);
                            setEstBnb(est);
                            const valBig = ethers.utils.parseEther(val);
                            setBnbAmount(valBig.toString());
                          }
                        }}
                      />
                      <span className="font-semibold">BNB</span>
                    </label>
                    <label className="label">
                      <span className="label-text-alt">
                        Balance: {bnbBalance} BNB
                      </span>
                    </label>
                    <div className="text-base font-semibold mt-4">
                      <span>Est. weekly earning: </span>
                      <span className="float-right">
                        {" "}
                        {Number(estBnb).toFixed(3)} MLT
                      </span>
                    </div>
                    <button
                      className="btn hover:bg-white hover:text-[#0A3975] bg-[#0A3975] mt-6"
                      onClick={stakeBNB}
                    >
                      Stake
                    </button>

                    <button
                      className="btn hover:bg-white hover:text-[#0A3975] bg-[#0A3975] mt-3"
                      onClick={claimBNB}
                    >
                      Claim Rewards
                    </button>
                    <button
                      className="btn hover:bg-white hover:text-[#0A3975] bg-[#0A3975] mt-3"
                      onClick={withdrawBNB}
                    >
                      Withdraw Capital
                    </button>
                  </>
                )}
                {isActivemlx && (
                  <>
                    <label className="label">
                      <span className="label-text text-[#0A3975] font-semibold">
                        Enter amount
                      </span>
                    </label>
                    <label className="input-group">
                      <input
                        type="text"
                        placeholder="Enter amount"
                        className="input input-bordered bg-[#0A3975] text-white"
                        onChange={(e) => {
                          if (
                            e.target.value != "" &&
                            Number(e.target.value) > 0
                          ) {
                            const val = e.target.value;
                            const est = Number(val) * (mlxAPR / 100);
                            setEstMlx(est);
                            const valBig = ethers.utils.parseEther(val);
                            setMlxAmount(valBig.toString());
                          }
                        }}
                      />
                      <span className="font-semibold">MLX</span>
                    </label>
                    <label className="label">
                      <span className="label-text-alt">
                        Balance: {mlxBalance} MLX
                      </span>
                    </label>
                    <div className="text-base font-semibold mt-4">
                      <span>Est. weekly earning: </span>
                      <span className="float-right">
                        {" "}
                        {Number(estMlx).toFixed(3)} MLT
                      </span>
                    </div>
                    {approved ? (
                      <button
                        className="btn hover:bg-white hover:text-[#0A3975] bg-[#0A3975] mt-6"
                        onClick={stakeMLX}
                      >
                        Stake MLX
                      </button>
                    ) : (
                      <button
                        className="btn hover:bg-white hover:text-[#0A3975] bg-[#0A3975] mt-6"
                        onClick={approveMLX}
                      >
                        Approve MLX
                      </button>
                    )}
                    <button
                      className="btn hover:bg-white hover:text-[#0A3975] bg-[#0A3975] mt-3"
                      onClick={claimMLX}
                    >
                      Claim Rewards
                    </button>
                    <button
                      className="btn hover:bg-white hover:text-[#0A3975] bg-[#0A3975] mt-3"
                      onClick={withdrawMLX}
                    >
                      Withdraw Capital
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Staking;
