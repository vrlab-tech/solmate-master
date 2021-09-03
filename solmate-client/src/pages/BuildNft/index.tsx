import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import axios from "axios";
// import { toPng } from "html-to-image";
import html2canvas from "html2canvas";
import React, { useState } from "react";
import { BlockPicker, ColorResult, RGBColor } from "react-color";
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
export const BuildNft = () => {
  const history = useHistory();
  const { adapter, wallet, signTransaction } = useWallet();
  const { setGeneratedFile } = useNftStore((state) => state, shallow);
  const [previewLoader, setPreviewLoader] = useState(false);
  const [frameColor, setFrameColor] = useState("#111");
  const [selectedImage, setSelectedImage] = useState<string | undefined>();
  const [grad1, setGradient1] = useState<string>("");
  const [grad2, setGradient2] = useState<string>("");
  const [nftText, setNftText] = useState<string>("");
  const [applyGrad, toggleGrad] = useState<boolean>(true);
  const [gradDir, setDir] = useState("right");
  const [framePath, setFramePath] = useState<any>();
  const [show, setShow] = useState(false);
  const [loader, setLoader] = useState(false);

  const handleNFTText = (e: any) => {
    setPreviewLoader(true);
    setNftText(e.target.value);
    setTimeout(() => {
      setPreviewLoader(false);
    }, 1000);
  };
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
    console.log("file", file);
    if (file.size > 4194304) {
      toast.error("Please upload image less than 4 MB");
    } else {
      setSelectedImage(URL.createObjectURL(file));
      setTimeout(() => {
        setPreviewLoader(false);
      }, 1000);
    }
  };
  const onGradColorSelect = (pos: number, color: RGBColor) => {
    setPreviewLoader(true);
    let rgbVal = `rgba(${color.r.toString()}, ${color.g.toString()}, ${color.b.toString()}, 0.5)`;
    if (pos === 0) {
      setGradient1(rgbVal);
    } else {
      setGradient2(rgbVal);
    }
    if (
      typeof selectedImage !== "undefined" &&
      typeof grad1 === "string" &&
      typeof grad2 === "string" &&
      applyGrad
    ) {
      applyCss();
    }
  };
  const applyCss = () => {
    document.documentElement.style.setProperty(
      "--nftGradient",
      `linear-gradient(to ${gradDir}, ${grad1}, ${grad2}) 0% 0% / contain no-repeat`
    );
    setTimeout(() => {
      setPreviewLoader(false);
    }, 1500);
  };
  const onGradientDirectionSelect = (dir: string) => {
    setPreviewLoader(true);
    setDir(dir);
    if (
      typeof selectedImage !== "undefined" &&
      typeof grad1 === "string" &&
      typeof grad2 === "string" &&
      applyGrad
    ) {
      applyCss();
    } else setPreviewLoader(false);
  };
  const onFrameSelect = (framePath: string) => {
    setPreviewLoader(true);
    setFramePath(framePath);
    window.scrollTo(0, 0);
    setTimeout(() => {
      setPreviewLoader(false);
    }, 1000);
  };
  const onFrameColorSelect = (color: ColorResult) => {
    setPreviewLoader(true);
    setFrameColor(color.hex);
    setTimeout(() => {
      setPreviewLoader(false);
    }, 1000);
  };
  const ref = React.useRef() as React.MutableRefObject<HTMLInputElement>;

  const onButtonClick = () => {
    setShow(false);
    setLoader(true);

    html2canvas(document.querySelector("#nft-image-container-preview")).then(
      async function (canvas) {
        var dataUrl = canvas.toDataURL("image/png", 1.0);
        var file = await dataURLtoFile(
          dataUrl,
          nftText.length === 0 ? "preview.png" : `${nftText}.png`
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
      axios
        .post(`${apiEndPoint}/nft`, formData)
        .then((res) => {
          toast.success(`NFT created with address ${nftAddress}`);
        })
        .catch((error) => {
          console.log("add error", error);
          setLoader(false);
        });

      setTimeout(() => {
        history.push("/preview-nfts", { nftAddress });
        setLoader(false);
      }, 1000);
    } catch (error) {
      console.error("create callback error", error);
      setLoader(false);
    }
  };
  return (
    <>
      <div
        className="container-fluid  bg-dark-grey w-100"
        style={{ minHeight: "100vh" }}
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
                    <p className="create_and_share_text">BUILD YOUR NFT</p>
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
                      <PreviewImage
                        ref={ref}
                        frameColor={frameColor}
                        selectedImage={selectedImage}
                        framePath={framePath}
                        nftText={nftText}
                      />
                    )}
                  </div>
                </div>

                <div className="col-lg-12 py-2 text-white gradient-picker">
                  <input
                    checked={applyGrad}
                    type="checkbox"
                    className="checkbox-round"
                    onChange={(e) => {
                      setPreviewLoader(true);
                      if (e.target.checked) {
                        applyCss();
                      } else {
                        document.documentElement.style.setProperty(
                          "--nftGradient",
                          `#222D64`
                        );
                        setTimeout(() => {
                          setPreviewLoader(false);
                        }, 1000);
                      }
                      toggleGrad(e.target.checked);
                    }}
                  />
                  <label className="cursor-pointer font-italic  custom-control-label mx-2">
                    <h2>Select Gradient Color:</h2>
                  </label>
                  <small className="d-block">
                    Select Color 1 and Color 2 for your image gradient{" "}
                  </small>
                  <div className="d-flex flex-row align-items-center">
                    <div>
                      <BlockPicker
                        color={grad1}
                        onChangeComplete={(color, e) => {
                          onGradColorSelect(0, color.rgb);
                        }}
                        onChange={(color, e) => {}}
                        triangle="hide"
                      />
                      <p className="text-center">
                        <small>Color 1</small>
                      </p>
                    </div>
                    <div className="mx-3">
                      <BlockPicker
                        color={grad2}
                        onChangeComplete={(color, e) => {
                          onGradColorSelect(1, color.rgb);
                        }}
                        onChange={(color, e) => {}}
                        triangle="hide"
                      />
                      <p className="text-center">
                        <small>Color 2</small>
                      </p>
                    </div>
                    <div className="container gradient-direction text-black">
                      <div className="row">
                        <div
                          onClick={() => onGradientDirectionSelect("top")}
                          style={{ backgroundColor: "#FED983" }}
                          className="col-sm-6"
                        >
                          <p>Up</p>
                        </div>
                        <div
                          onClick={() => onGradientDirectionSelect("left")}
                          style={{ backgroundColor: "#A2CAD4" }}
                          className="col-sm-6"
                        >
                          <p>Left</p>
                        </div>
                      </div>
                      <div className="row">
                        <div
                          onClick={() => onGradientDirectionSelect("bottom")}
                          style={{ backgroundColor: "#80AFFF" }}
                          className="col-sm-6"
                        >
                          <p>Down</p>
                        </div>
                        <div
                          onClick={() => onGradientDirectionSelect("right")}
                          style={{ backgroundColor: "#FD6193" }}
                          className="col-sm-6"
                        >
                          <p>Right</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-12 text-white py-2 pattern-select">
                  <input
                    onChange={(e) => {
                      if (e.target.checked) {
                        toast.warn("Please select frame pattern");
                      } else {
                        setFramePath("");
                      }
                    }}
                    checked={!!framePath}
                    type="checkbox"
                    className="checkbox-round"
                  />
                  <label className="cursor-pointer font-italic  custom-control-label mx-2">
                    <h2>Select Pattern:</h2>
                  </label>
                  <small className="d-block">
                    Select a pattern to add to your NFT
                  </small>
                  <div className="d-flex flex-row col-lg-10 py-2">
                    <div
                      onClick={() =>
                        onFrameSelect(
                          require("../../assets/images/patterns/pattern1.png")
                        )
                      }
                      className="col-lg-6 frameContainer"
                    >
                      <img
                        alt="pattern1"
                        src={
                          require("../../assets/images/patterns/pattern1.png")
                            .default
                        }
                      />
                    </div>
                    <div
                      onClick={() =>
                        onFrameSelect(
                          require("../../assets/images/patterns/pattern2.png")
                        )
                      }
                      className="col-lg-6 frameContainer"
                    >
                      <img
                        alt="pattern2"
                        src={
                          require("../../assets/images/patterns/pattern2.png")
                            .default
                        }
                      />
                    </div>
                  </div>
                  <div className="d-flex flex-row col-lg-10 py-2">
                    <div
                      onClick={() =>
                        onFrameSelect(
                          require("../../assets/images/patterns/pattern3.png")
                        )
                      }
                      className="col-lg-6 frameContainer"
                    >
                      <img
                        alt="pattern3"
                        src={
                          require("../../assets/images/patterns/pattern3.png")
                            .default
                        }
                      />
                    </div>
                    <div
                      onClick={() =>
                        onFrameSelect(
                          require("../../assets/images/patterns/pattern4.png")
                        )
                      }
                      className="col-lg-6 frameContainer"
                    >
                      <img
                        alt="pattern4"
                        src={
                          require("../../assets/images/patterns/pattern4.png")
                            .default
                        }
                      />
                    </div>
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
                      <h2>Text on NFT</h2>
                    </label>
                    <small className="d-block">
                      Type a text to add to your NFT
                    </small>
                    <form className="img-upload-container my-3">
                      <input
                        type="text"
                        className="form-control d-block w-75"
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
                      if (!!selectedImage) setShow(true);
                      else {
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
  framePath: any;
  frameColor: string;
  selectedImage: string;
  nftText: string;
}
const PreviewImage = React.forwardRef(
  (props: IPreviewImage, ref: React.Ref<HTMLDivElement>) => {
    const { frameColor, selectedImage, framePath, nftText } = props;
    return (
      <div
        ref={ref}
        id="nft-image-container-preview"
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
        <div className="nft-text-centered">{nftText}</div>
        {!!framePath && (
          <img className="preview-frame-pattern" src={framePath.default} />
        )}
      </div>
    );
  }
);
