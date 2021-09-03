import moment from "moment";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import shallow from "zustand/shallow";
import { Header } from "../../components/Header";
import { useTimer } from "../../hooks/useTimer";
import { useNftStore } from "../../store/nft";
export const DateNFT = () => {
  const { state } = useLocation<{ datetime: any; nftAddress: string }>();
  const timer = useTimer(state.datetime);
  const generatedFile = useNftStore((state) => state.generated, shallow);
  const [imageBlob, setImageBlob] = useState<string | undefined>();
  useEffect(() => {
    if (!!generatedFile) {
      const blob = URL.createObjectURL(generatedFile);
      setImageBlob(blob);
    }
  }, [generatedFile]);
  console.log("timer", timer);
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
                <div className="row">
                  <div className="col-xl-12 mb-3 nft-img banner-img">
                    <p>Date NFT...</p>
                  </div>
                  <div className="col-xl-12 my-3 text-center text-white">
                    <p className=" font-family-Man m-0">
                      Your wedding date is :{" "}
                    </p>
                    <p className=" date-text-lg">
                      {moment(state.datetime).format("DD MMM, YYYY hh:mm a")}
                    </p>
                    <p className=" font-family-Man m-0">
                      {timer.isFuture
                        ? "Your marriage is after"
                        : "You have been married for"}{" "}
                      :{" "}
                    </p>
                    <p className="date-text-lg" style={{ color: "#FFB6BD" }}>
                      {timer.years}y {timer.months}mo {timer.days}d{" "}
                      {timer.hours}h {timer.minutes}m {timer.seconds}s
                    </p>
                    <p className=" font-family-Man m-0">Preview your NFT : </p>
                  </div>
                  <div className="col-xl-12 my-1 text-center text-white">
                    <img
                      className="nft-preview-img"
                      alt="generated"
                      src={imageBlob}
                    />
                  </div>
                  <div className="col-xl-3 my-1 text-center text-white"></div>
                  <div className="col-xl-6 my-1 text-center text-white">
                    <br></br>
                    <button
                      type="button"
                      className="btn py-2 bg-purple-gradient text-white rounded-pill font-weight-bold w-100"
                    >
                      NFT address : {state.nftAddress}
                    </button>
                  </div>
                  <div className="col-xl-3 my-1 text-center text-white"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
