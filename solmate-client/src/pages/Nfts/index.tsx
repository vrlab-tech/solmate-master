import { useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import "../../assets/css/nft.css";
import { Header } from "../../components/Header";
import { apiEndPoint } from "../../config/constants";

export const Nfts = () => {
  const history = useHistory();
  const { adapter, publicKey } = useWallet();
  const [data, setData] = useState([]);
  useEffect(() => {
    axios
      .get(`${apiEndPoint}/nft?public_key=dfddfdfdfdf`)
      // .get(`${apiEndPoint}/nft?public_key=${publicKey}`)
      .then((res) => {
        if (!!res.data && Array.isArray(data)) setData(res.data);
      })
      .catch((error) => {});
  }, []);
  return (
    <div
      className="container-fluid  bg-dark-grey w-100"
      style={{ minHeight: "100vh" }}
    >
      <div className="row">
        <div className="col-md-12">
          <Header />
        </div>
        <div className="col-md-12 p-0">
          <div className="content-wrapper">
            <div className="container-fluid">
              <div className="nft">
                <div className="nft_1_image_container">
                  <img
                    className="nft_1"
                    src={require("../../assets/images/nfts/nft_1.png").default}
                    alt=""
                    width="100%"
                    height="284px"
                  />

                  <p className="create_and_share_text">
                    Create and share <br /> custom memorable NFTs
                  </p>
                </div>
                {Array.isArray(data) && data.length > 0 ? (
                  <div>
                    <p className="create_an_nft_text">Your NFT's</p>
                    <div className="cards-wrapper">
                      <div className="grid-row">
                        {data.map((item, index) => {
                          return (
                            <div key={index} className="grid-item">
                              {/* <span className="status-badge">
                                Upcoming Campaign
                              </span> */}
                              <img className="grid-img" src={item.image} />
                              <p className="text-white my-2">
                                {item.nft_address}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : null}

                <div className="">
                  <p className="create_an_nft_text">
                    Create an NFT on solana and make your wedding memorable
                  </p>
                </div>

                <div className="row">
                  <div className="col">
                    <div className="nft_2_image_container">
                      <img
                        className="nft_2"
                        src={
                          require("../../assets/images/nfts/nft_2.png").default
                        }
                        style={{ objectFit: "contain" }}
                        alt=""
                        width="100%"
                        height="600px"
                      />

                      <p className="date_nft_text">DATE NFT</p>
                      <p className="text">
                        NFT that counts the DAYS SINCE YOU GOT married
                      </p>

                      <div
                        onClick={() => history.push("/build-date-nft")}
                        className="d-flex justify-content-center"
                      >
                        <button className="create_btn">CREATE</button>
                      </div>
                    </div>
                  </div>

                  <div className="col">
                    <div className="nft_3_image_container">
                      <img
                        className="nft_3"
                        src={
                          require("../../assets/images/nfts/nft_3.png").default
                        }
                        alt=""
                        width="100%"
                        height="600px"
                        style={{ objectFit: "contain" }}
                      />

                      <p className="custom_nft_text">CUSTOM NFT</p>
                      <p className="text">
                        NFT that you create with our custom builder
                      </p>

                      <div className="d-flex justify-content-center">
                        <button
                          onClick={() => history.push("/build-nft")}
                          className="create_btn"
                        >
                          CREATE
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
