import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import axios from "axios";
import html2canvas from "html2canvas";
import moment from "moment";
import React, { useState } from "react";
import { BlockPicker, ColorResult } from "react-color";
import Loader from "react-loader-spinner";
import { useHistory } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import shallow from "zustand/shallow";
import { Header } from "../../components/Header";
import { apiEndPoint } from "../../config/constants";
import connection from "../../config/web3";
import { useNftStore } from "../../store/nft";
import { Creator, extendBorsh } from "../../utils/customNFT/metaplex/metadata";
import mintNFT from "../../utils/customNFT/mintNFT";

export const BuildDateNft = () => {
  const { adapter, wallet, signTransaction } = useWallet();
  const history = useHistory();

  const [loader, setLoader] = useState(false);
  const [frameColor, setFrameColor] = useState("#111");
  const [nftText, setNftText] = useState<string>("");
  const [show, setShow] = useState(false);
  const { setGeneratedFile } = useNftStore((state) => state, shallow);

  const [previewLoader, setPreviewLoader] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | undefined>();
  const handlePhoto = (e: any) => {
    setPreviewLoader(true);
    e.preventDefault();
    const file = e?.currentTarget?.files?.[0];
    var img = new Image();
    img.src = window.URL.createObjectURL(file);
    img.addEventListener("load", () => {
      console.log("h", img.height);
      console.log("w", img.width);
    });
    if (file.size > 4194304) {
      toast.error("Please upload image less than 4 MB");
    } else {
      setSelectedImage(URL.createObjectURL(file));
      setTimeout(() => {
        setPreviewLoader(false);
      }, 1000);
    }
  };

  const onFrameColorSelect = (color: ColorResult) => {
    setPreviewLoader(true);
    setFrameColor(color.hex);
    setTimeout(() => {
      setPreviewLoader(false);
    }, 1000);
  };
  const ref = React.useRef() as React.MutableRefObject<HTMLInputElement>;
  const handleNFTText = (e: any) => {
    setPreviewLoader(true);
    console.log("value", e.target.value);
    setNftText(e.target.value);
    setTimeout(() => {
      setPreviewLoader(false);
    }, 1000);
  };
  const onButtonClick = () => {
    setShow(false);
    setLoader(true);

    html2canvas(document.querySelector("#nft-date-container-preview")).then(
      async function (canvas) {
        var dataUrl = canvas.toDataURL("image/png", 1.0);
        var file = await dataURLtoFile(
          dataUrl,
          nftText.length === 0 ? "preview.png" : `${nftText.toString()}.png`
        );
        setGeneratedFile(file);
        create(file);
      }
    );
  };
  const dataURLtoFile = (dataurl, filename) => {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  };
  const create = async (file) => {
    extendBorsh();
    const metadata = {
      animation_url: undefined,
      creators: [
        new Creator({
          address: new PublicKey(
            "BfLqm23Ee3feXzWGoVkoXDq2ax6vs57WiUsJFjhUFsdU"
          ),
          verified: false,
          share: 5,
        }),
        new Creator({
          address: new PublicKey(adapter?.publicKey.toString()),
          verified: true,
          share: 95,
        }),
      ],
      description: "",
      external_url: "",
      image: file.name,
      name: nftText,
      symbol: "",
      sellerFeeBasisPoints: 15,
      properties: {
        category: "image",
        files: [{ type: file.type, uri: file.name }],
      },
    };
    try {
      const wallet = {
        publicKey: adapter?.publicKey,
        signTransaction: signTransaction,
      };
      const { metadataAccount, mintKey, nftAddress } = await mintNFT(
        connection,
        wallet,
        [file],
        metadata
      );
      const formData = new FormData();
      formData.append("image", file);
      formData.append("metadata_account_address", metadataAccount.toString());
      formData.append("minted_token_address", mintKey.toString());
      formData.append("nft_address", nftAddress);
      formData.append("public_key", adapter?.publicKey.toString());
      formData.append("datetime", moment(nftText).format("YYYY-MM-DD HH:mm"));
      axios
        .post(`${apiEndPoint}/nft`, formData)
        .then((res) => {
          toast.success(`NFT created with address ${nftAddress}`);
        })
        .catch((error) => {
          console.log("add error", error);
        });

      setTimeout(() => {
        history.push("/date-nft", {
          datetime: nftText,
          nftAddress,
        });
        setLoader(false);
      }, 1500);
    } catch (error) {
      console.error("create callback error", error);
      setLoader(false);
    }
  };
  return (
    <>
      <div
        style={{ minHeight: "100vh" }}
        className="container-fluid bg-dark-grey"
      >
        {loader ? (
          <div className="loading">
            <button className="btn  btn-loader" type="button" disabled>
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
              <span className="sr-only p-2">
                Creating your personized NFT. Please do not press back or
                refresh button...
              </span>
            </button>
          </div>
        ) : null}
        <div className="row">
          <div className="col-md-12">
            <Header />
          </div>
          <div className="col-md-12">
            <div className="content-wrapper">
              <div className="container-fluid">
                <div className="row pb-5 ">
                  <div className="nft_1_image_container">
                    <img
                      className="nft_1"
                      src={
                        require("../../assets/images/wedding-day-couple.png")
                          .default
                      }
                      alt="wedding-day-couple"
                      width="100%"
                      height="284px"
                    />
                    <p className="create_and_share_text">DATE NFT</p>
                  </div>
                </div>
                <div className="row text-white col-lg-12">
                  <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                    <div className="py-3">
                      <input
                        disabled
                        checked={!!selectedImage}
                        type="checkbox"
                        className="checkbox-round"
                      />
                      <label className="cursor-pointer font-italic  custom-control-label mx-2">
                        <h2>Upload Image</h2>
                      </label>
                      <small className="d-block">
                        Upload your NFT IMAGE by clicking the button
                      </small>
                      <form className="img-upload-container my-3">
                        <input
                          onChange={handlePhoto}
                          id="bg-image"
                          type="file"
                          name="bg-image"
                        />
                        <label htmlFor="bg-image">
                          <img
                            alt="upload-icon"
                            className="upload-icon"
                            src={
                              require("../../assets/images/addimage.png")
                                .default
                            }
                          />
                        </label>
                        <small className="mx-3">
                          Max 4 MB (.png, .jpg, .jpeg)
                        </small>
                      </form>
                    </div>
                    <div className="py-3">
                      <input
                        onChange={(e) => {}}
                        checked={frameColor.length > 0}
                        type="checkbox"
                        className="checkbox-round"
                      />
                      <label className="cursor-pointer font-italic  custom-control-label mx-2">
                        {" "}
                        <h2>Select Frame Color:</h2>
                      </label>
                      <small className="d-block">
                        Select the color of your frame
                      </small>
                      <BlockPicker
                        color={frameColor}
                        onChangeComplete={(color, e) => {
                          onFrameColorSelect(color);
                        }}
                        onChange={(color, e) => {}}
                        triangle="hide"
                      />
                    </div>
                  </div>
                  <div className="col-lg-6 text-center img-preview">
                    <p>
                      <small>PREVIEW</small>
                    </p>
                    {typeof selectedImage ===
                    "undefined" ? null : previewLoader ? (
                      <div className="py-5">
                        <Loader
                          type="TailSpin"
                          color="#F26523"
                          height={100}
                          width={100}
                        />
                        <p className="mt-5">Generating Preview...</p>
                      </div>
                    ) : (
                      <PreviewDateImage
                        ref={ref}
                        frameColor={frameColor}
                        selectedImage={selectedImage}
                        nftText={nftText}
                      />
                    )}
                  </div>
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-white">
                  <div className="py-3">
                    <input
                      disabled
                      checked={nftText.length > 0}
                      type="checkbox"
                      className="checkbox-round"
                    />
                    <label className="cursor-pointer font-italic  custom-control-label mx-2">
                      <h2>Your Wedding Date</h2>
                    </label>
                    <small className="d-block">
                      Select your Wedding Date and Time
                    </small>
                    <form className="img-upload-container my-3">
                      <input
                        type="datetime-local"
                        className="form-control d-block w-25"
                        id="preview-text"
                        aria-describedby=""
                        onChange={handleNFTText}
                      />
                    </form>
                  </div>
                </div>
                <div
                  style={{ marginTop: "50px" }}
                  className="col-lg-12 pb-5 text-center text-white"
                >
                  <p style={{ fontWeight: "normal" }}>
                    NFTs once published are public on the blockchain. By
                    publishing this NFT you agree to share your image on the
                    Solana Blockchain.{" "}
                  </p>
                  <button
                    type="button"
                    className="btn py-2 bg-pink-gradient text-white rounded-pill font-weight-bold w-50"
                    onClick={() => {
                      if (!!selectedImage && nftText.length > 0) setShow(true);
                      else if (nftText.length === 0) {
                        toast.error("Please enter date");
                        window.scrollTo(0, 0);
                      } else {
                        toast.error("Please select image.");
                        window.scrollTo(0, 0);
                      }
                    }}
                  >
                    FINALIZE NFT{" "}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
      {show ? (
        <div className="modal" role="dialog" style={{ display: "block" }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-body text-center">
                <img
                  alt="solana home"
                  className="py-3"
                  src={require("../../assets/images/heart-lock1.png").default}
                />
                <p className="alert-text">
                  Are you sure you want to create the NFT?{" "}
                </p>
                <p style={{ color: "#FF6093" }}>
                  PLEASE NOTE: ONCE SUBMITTED, THESE DETAILS CANNOT BE EDITED.{" "}
                </p>
              </div>
              <div className="modal-footer">
                <button
                  onClick={onButtonClick}
                  type="button"
                  className="btn btn-primary modal-yes-btn py-3"
                >
                  Yes
                </button>
                <button
                  type="button"
                  className="btn btn-secondary modal-no-btn py-3"
                  data-dismiss="modal"
                  onClick={() => setShow(false)}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};
interface IPreviewImage {
  frameColor: string;
  selectedImage: string;
  nftText: string;
}

const PreviewDateImage = React.forwardRef(
  (props: IPreviewImage, ref: React.Ref<HTMLDivElement>) => {
    const { frameColor, selectedImage, nftText } = props;
    return (
      <div
        ref={ref}
        id="nft-date-container-preview"
        className="nft-image-container-preview"
      >
        <img
          style={{
            borderWidth: frameColor.length > 0 ? 20 : 0,
            borderColor: frameColor,
            borderStyle: "solid",
            zIndex: -1,
            height: "60vh",
            width: "100%",
            display: "block",
            objectFit: "cover",
          }}
          src={selectedImage}
        />
        {nftText.length > 0 && (
          <div className="nft-text-centered my-4">
            {moment(nftText).format("DD MMM, YYYY hh:mm a")}
          </div>
        )}
      </div>
    );
  }
);
