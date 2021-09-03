import React from "react";
import { useHistory } from "react-router-dom";
import "../../assets/css/home.css";

const Home = () => {
  const history = useHistory();
  console.log("p", process.env);

  return (
    <div>
      <div className="weding_img">
        <img
          src={require("../../assets/images/weding.png").default}
          alt="weding"
          width="100%"
        />

        <img
          src={require("../../assets/images/brandlogo.png").default}
          alt="weding"
          width="100%"
          className="brand_logo"
        />

        <img
          src={require("../../assets/images/Blockchain_text.png").default}
          alt="weding"
          className="blockchain_text"
        />

        <p className="register_text">REGISTER Your wedding on the blockchain</p>

        <button onClick={() => history.push("/login")} className="register_btn">
          REGISTER NOW
        </button>
      </div>

      <div className="nft_img_container">
        <div>
          <img
            src={require("../../assets/images/nft_img.png").default}
            alt="nft"
            className="nft_img"
          />
        </div>
        <div className="img_desc_text_container">
          <p className="img_desc_text">
            Solmate allows you to{" "}
            <span style={{ color: "#FA367D" }}>
              register yourself on Solana
            </span>{" "}
            and create a permanent profile on the blockchain
          </p>
          <div className="horizontal_line" />
        </div>
      </div>

      <div className="nft_ring_img_container">
        <div className="img_desc_text_container">
          <p className="img_desc_text">
            <span style={{ color: "#FA367D" }}>Create NFTs</span> (images on the
            blockchain) and share to seal the deal forever.
          </p>
          <div className="horizontal_line" />
        </div>
        <div>
          <img
            src={require("../../assets/images/nft_ring.png").default}
            alt="nft"
            className="nft_ring_img"
          />
        </div>
      </div>

      <div className="d-flex align-items-center flex-column my-5">
        <p className="img_desc_text mb-0">Let the friends and family know by</p>
        <p className="img_desc_text" style={{ color: "#FA367D" }}>
          sharing your Nfts on Solmate Social.
        </p>
      </div>

      <div className="footer mt-3">
        <div className="d-flex justify-content-center">
          <p className="footer-text">© Solmate | Terms & Conditions</p>
        </div>
        <div className="d-flex justify-content-center">
          <div className="col-lg-6 justify-content-evenly d-flex">
            <img
              src={require("../../assets/images/fbicon.png").default}
              alt="socials"
              className="socials_img"
            />
            <img
              src={require("../../assets/images/instagramicon.png").default}
              alt="socials"
              className="socials_img"
            />
            <img
              src={require("../../assets/images/yticon.png").default}
              alt="socials"
              className="socials_img"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
