import { useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import Loader from "react-loader-spinner";
import { Header } from "../../components/Header";
import { apiEndPoint } from "../../config/constants";
import FileSaver from "file-saver";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";

export const DownloadCertificate = () => {
  const history = useHistory();
  const { publicKey } = useWallet();
  const [status, setStatus] = useState(false);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  useEffect(() => {
    axios
      // .get(`${apiEndPoint}/certificate?public_key=dfddfdfdfdf`)
      .get(`${apiEndPoint}/certificate?=public_key${publicKey.toString}`)
      .then((res) => {
        if (typeof res.data.success === "boolean" && !res.data.sucess) {
          setStatus(false);
        } else {
          setStatus(true);
        }
        setLoading(false);
      })
      .catch((error) => {
        setStatus(false);
        setLoading(false);
      });
  }, []);

  const downloadCertificate = () => {
    setDownloading(true);
    axios
      // .get(`${apiEndPoint}/certificate?public_key=dfddfdfdfdf`)
      .get(`${apiEndPoint}/certificate?=public_key${publicKey.toString}`)
      .then((resp) => {
        console.log("in this then1");
        // const file = window.URL.createObjectURL(new Blob([resp.data]));
        // console.log("in this then1");
        // FileSaver.saveAs(file, "cer.pdf");

        let blob = new Blob([resp.data], { type: "application/pdf" });
        let url = window.URL.createObjectURL(blob);
        //printJS(url);
        window.open(url);
        toast.success("Certificate downloaded successfully!");
        setDownloading(false);
      })
      .catch((error) => {});
  };
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
                  <div
                    onClick={() => downloadCertificate()}
                    className="col-xl-12 mb-3 certificate-img banner-img"
                  >
                    <p>Download Certificate...</p>
                  </div>
                  {loading ? (
                    <div className="col-lg-12 d-flex justify-content-center">
                      {" "}
                      <Loader type="TailSpin" color="#fff" />
                    </div>
                  ) : (
                    <div className="col-xl-12 my-1 text-center text-white">
                      <br></br>
                      {status ? (
                        <button
                          disabled={downloading}
                          onClick={() => downloadCertificate()}
                          type="button"
                          className="btn py-2 text-white font-weight-bold w-auto rounded"
                          style={{ border: "2px solid #ec495aa6" }}
                        >
                          {downloading ? "DOWNLOADING" : "DOWNLOAD CERTIFICATE"}
                        </button>
                      ) : (
                        <button
                          onClick={() => history.push("/wedding-details")}
                          type="button"
                          className="btn py-2 text-white font-weight-bold w-auto rounded"
                          style={{ border: "2px solid #ec495aa6" }}
                        >
                          Register your wedding to get a SolMate certificate
                        </button>
                      )}
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
