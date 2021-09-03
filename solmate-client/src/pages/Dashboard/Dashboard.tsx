import { useLocalStorage, useWallet } from "@solana/wallet-adapter-react";
import React from "react";
import { useEffect } from "react";
import shallow from "zustand/shallow";
import { Header } from "../../components/Header";
import { useWalletStore } from "../../store/wallet";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import connection from "../../config/web3";

export const Dashboard = () => {
  const { setPublicAddress } = useWalletStore((state) => state, shallow);
  const { adapter, publicKey } = useWallet();
  const [_, setLocalStorage] = useLocalStorage<string | undefined>(
    "solmate-pb",
    ""
  );
  useEffect(() => {
    if (adapter?.connected) {
      setLocalStorage(adapter?.publicKey?.toString());
      setPublicAddress(adapter?.publicKey?.toString());
    }
  }, [adapter?.connected]);
  // const accountInfo = connection
  //   .getAccountInfo(publicKey)
  //   .then((info) => console.log("infor", info));
  console.log("publicKey", publicKey.toString());
  return (
    <>
      <Header />
      <div className="content-wrapper content-wrapper-1">
        <div className="container-fluid px-4">
          <div className="row gx-5">
            <div className="col-lg-4 col-md-4 col-sm-6 col-12 mb-2 mt-4 ">
              <div className="">
                <div className="row row-bg">
                  <div
                    className="col-lg-3 col-md-4 col-sm-4 col-4 rideone"
                    style={{ margin: "auto" }}
                  >
                    <img
                      className="nft_1"
                      src={
                        require("../../assets/images/dashboard/couple-metric.png")
                          .default
                      }
                      alt="couple-metric"
                      width="100%"
                    />
                  </div>
                  <div className="col-lg-9 col-md-8 col-sm-8 col-8 fontsty">
                    <h2>1,024</h2>
                    <h4>Weddings registered</h4>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-4 col-sm-6 col-12 mb-2 mt-4">
              <div className="">
                <div className="row row-bg-1">
                  <div
                    className="col-lg-3 col-md-4 col-sm-4 col-4 ridetwo"
                    style={{ margin: "auto" }}
                  >
                    <img
                      className="nft_1"
                      src={
                        require("../../assets/images/dashboard/romantic-dinner.svg")
                          .default
                      }
                      alt="couple-metric"
                      width="100%"
                    />
                  </div>
                  <div className="col-lg-9 col-md-8 col-sm-8 col-8 fontsty">
                    <h2>2,048</h2>
                    <h4>NFTs Registered</h4>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-4 col-sm-6 col-12 mb-2 mt-4 ">
              <div className="">
                <div className="row row-bg-2">
                  <div
                    className="col-lg-3 col-md-4 col-sm-4 col-4 ridethree"
                    style={{ margin: "auto" }}
                  >
                    <img
                      className="nft_1"
                      src={
                        require("../../assets/images/dashboard/post-shared-metric.png")
                          .default
                      }
                      alt="couple-metric"
                      width="100%"
                    />
                  </div>
                  <div className="col-lg-9 col-md-8 col-sm-8 col-8 fontsty">
                    <h2>4,096</h2>
                    <h4>Posts Shared</h4>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-12">
              <div className="row py-5">
                <div className="col-xl-6 mb-3 ">
                  <div className="dash2-img banner-img">
                    <Link to="/wedding-details">
                      <p className="dash-text">
                        Register your Wedding{" "}
                        <FaArrowRight className="d-block" />
                      </p>
                    </Link>
                  </div>
                </div>
                <div className="col-xl-6 mb-3 ">
                  <div className="dash3-img banner-img">
                    <Link to="/nfts">
                      <p className="dash-text">
                        Create a memorable NFT{" "}
                        <FaArrowRight className="d-block" />
                      </p>
                    </Link>
                  </div>
                </div>
                <div className="col-xl-12 mb-3 pt-3 ">
                  <div
                    className="dash1-img banner-img "
                    style={{ height: "35vh" }}
                  >
                    <Link to="/solmate-social">
                      <p className="social-dash-text">
                        Solmate Social
                        <small className="social-dash-small">
                          Your social network on Solana
                        </small>
                        <FaArrowRight className="d-block" />
                      </p>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
