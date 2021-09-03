import { useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import shallow from "zustand/shallow";
import { Header } from "../../components/Header";
import { apiEndPoint } from "../../config/constants";
import { useNftStore } from "../../store/nft";
import { useWalletStore } from "../../store/wallet";
export const PreviewNFT = () => {
  const history = useHistory();
  const generatedFile = useNftStore((state) => state.generated, shallow);
  const idnft = useNftStore((state) => state.idnft, shallow);
  const publicAddress = useWalletStore((state) => state.publicAddress, shallow);
  const [imageBlob, setImageBlob] = useState<string | undefined>();
  useEffect(() => {
    if (!!generatedFile) {
      const blob = URL.createObjectURL(generatedFile);
      setImageBlob(blob);
    }
  }, [generatedFile]);
  const { state } = useLocation<{ nftAddress: string; idnft: string }>();
  const shareNftSocial = () => {
    axios
      .post(`${apiEndPoint}/social`, {
        public_key: publicAddress,
        idnft: idnft,
      })
      .then((res) => {
        toast.success("NFT shared on SolMate social");
        history.push("/solmate-social");
      })
      .catch((error) => {});
  };
  console.log("state", state);
  console.log("state", idnft);
  return (
    <>
      <div
        className="container-fluid  bg-dark-grey w-100"
        style={{ minHeight: "100vh" }}
      >
        <div className="row">
          <div className="col-md-12">
            <Header />
          </div>
          <div className="col-md-12">
            <div className="content-wrapper">
              <div className="container-fluid">
                <div className="row pb-5 ">
                  <div className="col-xl-12 mb-3 nft-img banner-img">
                    <p>Your NFT...</p>
                  </div>
                  <div className="col-xl-12 my-1 text-center text-white">
                    <img
                      className="nft-preview-img"
                      alt="generated"
                      src={imageBlob}
                    />
                  </div>
                  <div
                    className="col-md-12 text-center"
                    style={{ paddingTop: "1.5rem" }}
                  >
                    <p className="p-text font-family-Man m-0 text-white ">
                      Your NFT has been published at this address:{" "}
                    </p>
                    <p
                      className=" date-text-lg"
                      style={{ fontSize: "17px", paddingBottom: "1.1rem" }}
                    >
                      {state?.nftAddress}
                    </p>
                  </div>
                  <div className="col-md-12 shareModal">
                    <div className="row">
                      <div className="col-md-3"></div>
                      <div
                        className="col-md-6 rounded"
                        style={{ background: "#F9B6BD !importanr" }}
                      >
                        <div
                          style={{ background: "#fff", borderRadius: "20px" }}
                          className="text-center"
                        >
                          <div className="modal-body">
                            <img
                              alt="share"
                              className="py-3"
                              width="20%"
                              src={
                                require("../../assets/images/social-solmate.png")
                                  .default
                              }
                            />
                            <p
                              className="alert-text"
                              style={{ color: "#484848" }}
                            >
                              SHARE YOUR NFT
                            </p>
                          </div>
                          <div className="share-icon-row">
                            {idnft.toString().length > 0 && (
                              <img
                                onClick={() => shareNftSocial()}
                                style={{ cursor: "pointer" }}
                                alt="solana home"
                                className="py-3 px-1"
                                width="25%"
                                src={
                                  require("../../assets/images/solmate-social-icon.png")
                                    .default
                                }
                              />
                            )}
                            <img
                              style={{ cursor: "pointer" }}
                              alt="fb-share"
                              className="py-3  px-1"
                              width="15%"
                              src={
                                require("../../assets/images/facebook 1.png")
                                  .default
                              }
                            />
                            <img
                              style={{ cursor: "pointer" }}
                              alt="instagram-share"
                              className="py-3  px-1"
                              width="15%"
                              src={
                                require("../../assets/images/instagram 1.png")
                                  .default
                              }
                            />
                            <img
                              alt="twitter-share"
                              className="py-3  px-1"
                              width="15%"
                              src={
                                require("../../assets/images/twitter 1.png")
                                  .default
                              }
                            />
                            <br></br>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3"></div>
                    </div>
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
