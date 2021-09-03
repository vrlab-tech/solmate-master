import { useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import Loader from "react-loader-spinner";
import { useHistory } from "react-router-dom";
import { Header } from "../../components/Header";
import { apiEndPoint } from "../../config/constants";
export const Social = () => {
  const [socialFeed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const { publicKey } = useWallet();
  console.log("public ", publicKey.toString());
  useEffect(() => {
    axios
      .get(`${apiEndPoint}/social`)
      .then((res) => {
        console.log("res", res.data);
        setFeed(res.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  }, []);
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
                <div className="row py-1 ">
                  <div
                    className="col-md-12 text-center"
                    // style={{ paddingTop: "1.5rem" }}
                  >
                    <img
                      alt="solana home"
                      className=""
                      src={
                        require("../../assets/images/solmate-social-icon.png")
                          .default
                      }
                    />
                    <p
                      className="text-white my-2"
                      style={{ fontSize: "23px", paddingBottom: "1.1rem" }}
                    >
                      Social Feed
                    </p>
                  </div>
                  {loading ? (
                    <div className="col-lg-12 d-flex justify-content-center">
                      {" "}
                      <Loader type="TailSpin" color="#fff" />
                    </div>
                  ) : Array.isArray(socialFeed) && socialFeed.length > 0 ? (
                    <div>
                      {socialFeed.map((feed, index) => {
                        return <SocialFeedCard feed={feed} key={index} />;
                      })}
                    </div>
                  ) : (
                    <div className="col-lg-12 d-flex text-white text-center justify-content-center flex-column">
                      <p>No feed</p>
                      <button
                        onClick={() => history.push("/nfts")}
                        className="create_btn text-uppercase w-25 align-self-center"
                      >
                        CREATE your own nft
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
interface ISocialFeedCard {
  feed: {
    created_at: number;
    idsocial: number;
    image: string;
    likes: number;
    nft_address: string;
    shares: number;
    updated_at: number;
  };
}
const SocialFeedCard = (props: ISocialFeedCard) => {
  const { feed } = props;
  return (
    <div className="row d-flex justify-content-center">
      <div
        className="col-xl-6 my-1 text-white p-4 rounded"
        style={{ background: " rgba(0, 19, 24, 0.33)" }}
      >
        <div className="text-left ">
          <div className="d-flex align-items-center">
            <div className="mx-2">
              <p className="tx-11 text-muted">
                {moment(new Date()).diff(feed.updated_at, "hours") < 1
                  ? `${moment(feed.updated_at).diff(
                      new Date(),
                      "minutes"
                    )} min ago`
                  : `${moment(new Date()).diff(
                      feed.updated_at,
                      "hours"
                    )} hours ago`}{" "}
              </p>
            </div>
          </div>
        </div>
        <div className="text-center py-3">
          <img alt="solana home" className="" width="80%" src={feed.image} />
        </div>
        <div className="d-flex post-actions">
          <a
            href="#"
            className="d-flex align-items-center text-muted mr-4  text-decoration-none"
          >
            <img
              alt="solana home"
              className=""
              src={require("../../assets/images/like.png").default}
            />
            <p
              className="d-none d-md-block ml-2  my-0"
              style={{
                color: "#DD3E72",
                marginLeft: "6px",
              }}
            >
              {feed.likes}
            </p>
          </a>

          <a
            href="#"
            className="d-flex align-items-center text-muted mx-3 text-decoration-none"
          >
            <img
              alt="solana home"
              className=""
              src={require("../../assets/images/share.png").default}
            />
            <p
              className="d-none d-md-block ml-2 my-0"
              style={{
                color: "#0094FF",
                marginLeft: "6px",
              }}
            >
              Share
            </p>
          </a>
        </div>
      </div>
    </div>
  );
};
