import React, { useEffect, useState } from "react";
import { Header } from "../../components/Header";
import { Form, Formik, FormikErrors, FormikProps, FormikTouched } from "formik";
import * as Yup from "yup";
import Loader from "react-loader-spinner";
import axios from "axios";
import { apiEndPoint } from "../../config/constants";
import { useWalletStore } from "../../store/wallet";
import shallow from "zustand/shallow";
import { toast, ToastContainer } from "react-toastify";
import moment from "moment";
import _ from "lodash";
import { registerWeeding } from "../../utils/weddingRegistry/registerWedding";
type TInitialValues = {
  bride_firstname: string;
  bride_lastname: string;
  groom_firstname: string;
  groom_lastname: string;
  datetime: string;
  location: string;
  bestman_firstname: string;
  bestman_lastname: string;
  maidofhonor_firstname: string;
  maidofhonor_lastname: string;
};
const initialValues: TInitialValues = {
  bride_firstname: "",
  bride_lastname: "",
  groom_firstname: "",
  groom_lastname: "",
  datetime: "",
  location: "",
  bestman_firstname: "",
  bestman_lastname: "",
  maidofhonor_firstname: "",
  maidofhonor_lastname: "",
};
const WeddingFormSchema = Yup.object().shape({
  bride_firstname: Yup.string().required("This field is required"),
  bride_lastname: Yup.string().required("This field is required"),
  groom_firstname: Yup.string().required("This field is required"),
  groom_lastname: Yup.string().required("This field is required"),
  datetime: Yup.mixed().required("Please select your wedding date"),
  location: Yup.string().required("This field is required"),
});
export const WeddingDetails = () => {
  console.log("p", process.env);
  const { publicAddress } = useWalletStore((state) => state, shallow);
  const [isAdded, setIsAdded] = useState({
    status: false,
    loading: true,
    data: initialValues,
  });
  const [show, setShow] = useState(false);
  const [data, setData] = useState<TInitialValues>(initialValues);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    axios
      .get(`${apiEndPoint}/weddingInfo?public_key=${publicAddress}`)
      .then((res) => {
        if (!!res.data) {
          setIsAdded({ status: true, loading: false, data: res.data[0] });
        } else {
          setIsAdded({ status: false, loading: false, data: initialValues });
        }
      });
  }, []);
  const submitForm = async () => {
    const registry = await registerWeeding(data);
    console.log("registry", registry);
    setShow(false);
    setLoading(true);
    axios
      .post(`${apiEndPoint}/weddingInfo`, {
        ...data,
        public_key: publicAddress,
        account_id: registry.greetedPubKey,
        trasaction_id: registry.trx,
      })
      .then((res) => {
        setLoading(false);
        console.log("res", res.data);
        if (res.data.success) {
          toast.success(res.data.message);
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((error) => {
        console.log("error", error);
        setLoading(false);
        toast.error("Something went wrong. Please try again");
      });
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
                <div className="row">
                  <div className="col-xl-12 mb-3 dash-img banner-img">
                    <p>Register your Wedding...</p>
                  </div>
                  {isAdded.loading ? (
                    <div className="col-lg-12 d-flex justify-content-center">
                      <Loader color="#fff" type="TailSpin" />
                    </div>
                  ) : (
                    <>
                      <div className="col-xl-12 my-3 text-center text-white">
                        <p className="text-uppercase p-text">
                          kindly input all the below information for us to{" "}
                        </p>
                        <p className="text-uppercase p-text">
                          create your wedding on solana.
                        </p>
                      </div>
                      <div className="col-xl-12 my-1 text-center text-white">
                        <Formik
                          enableReinitialize={true}
                          validationSchema={WeddingFormSchema}
                          onSubmit={(data: TInitialValues) => {
                            setShow(true);
                            setData(data);
                          }}
                          initialValues={
                            isAdded.status ? isAdded.data : initialValues
                          }
                          component={(props) => (
                            <WeddingForm
                              isAdded={isAdded.status}
                              loading={loading}
                              show={show}
                              confirmSubmit={submitForm}
                              openConfirmation={() => setShow(true)}
                              closeConfirmation={() => setShow(false)}
                              {...props}
                            />
                          )}
                        />
                        <div className="row">
                          <div className="col-md-2"></div>
                          <div className="col-md-2"></div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};
interface IWeddingForm extends FormikProps<TInitialValues> {
  show: boolean;
  openConfirmation: () => void;
  closeConfirmation: () => void;
  confirmSubmit: () => void;
  loading: boolean;
  isAdded: boolean;
}
const WeddingForm = (props: IWeddingForm) => {
  const {
    errors,
    handleChange,
    setFieldValue,
    touched,
    handleSubmit,
    show,
    openConfirmation,
    closeConfirmation,
    confirmSubmit,
    values,
    loading,
    isAdded,
  } = props;
  return (
    <Form
      onSubmit={handleSubmit}
      style={{ margin: "0px auto" }}
      className="col-md-8 text-center"
    >
      <div className="col-md-12">
        <div className="field-wrapper my-4">
          <div className="box">
            <img
              alt="solana home"
              width="44px"
              className=""
              src={require("../../assets/images/bride.png").default}
            />
            <span>
              Who's the bride? <span className="req">*</span>
            </span>
          </div>
          <div className="row my-3">
            <div className="col-md-6">
              <input
                onChange={handleChange}
                type="text"
                className="form-control"
                name="bride_firstname"
                id="bride_firstname"
                aria-describedby=""
                placeholder="First Name"
                defaultValue={values.bride_firstname}
              />
              <ErrorMessage
                touched={touched}
                name="bride_firstname"
                errors={errors}
              />
            </div>
            <div className="col-md-6">
              <input
                onChange={handleChange}
                type="text"
                className="form-control"
                id="bride_lastname"
                aria-describedby=""
                placeholder="Last Name"
                defaultValue={values.bride_lastname}
              />
              <ErrorMessage
                touched={touched}
                name="bride_lastname"
                errors={errors}
              />
            </div>
          </div>
        </div>

        <div className="field-wrapper my-4">
          <div className="box">
            <img
              alt="solana home"
              width="44px"
              className=""
              src={require("../../assets/images/groom.png").default}
            />
            <span>
              Who's the groom? <span className="req">*</span>
            </span>
          </div>
          <div className="row my-3">
            <div className="col-md-6">
              <input
                onChange={handleChange}
                type="text"
                className="form-control"
                id="groom_firstname"
                name="groom_firstname"
                aria-describedby=""
                placeholder="First Name"
                defaultValue={values.groom_firstname}
              />
              <ErrorMessage
                touched={touched}
                name="groom_firstname"
                errors={errors}
              />
            </div>
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                id="groom_lastname"
                aria-describedby=""
                placeholder="Last Name"
                onChange={handleChange}
                defaultValue={values.groom_lastname}
              />
              <ErrorMessage
                touched={touched}
                name="groom_lastname"
                errors={errors}
              />
            </div>
          </div>
        </div>
        <div className="field-wrapper my-4">
          <div className="box">
            <img
              alt="solana home"
              width="44px"
              className=""
              src={require("../../assets/images/calender.png").default}
            />
            <span>
              When is/was the big day? <span className="req">*</span>
            </span>
          </div>
          <div className="row my-3 justify-content-center">
            <div className="col-md-6">
              <input
                type="date"
                className="form-control"
                id="datetime"
                aria-describedby=""
                placeholder="DD-MM-YYYY HH:MM:SS"
                onChange={handleChange}
                defaultValue={moment(values.datetime).format("YYYY-MM-DD")}
              />
              <ErrorMessage touched={touched} name="datetime" errors={errors} />
            </div>
          </div>
        </div>

        <div className="field-wrapper my-4">
          <div className="box">
            <img
              alt="solana home"
              width="44px"
              className=""
              src={require("../../assets/images/location-pin.png").default}
            />
            <span>
              Where is/was the ceremony? <span className="req">*</span>
            </span>
          </div>
          <div className="row my-3 justify-content-center">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                id="location"
                onChange={handleChange}
                aria-describedby=""
                placeholder="Enter location"
                name="location"
                defaultValue={values.location}
              />
              <ErrorMessage touched={touched} name="location" errors={errors} />
            </div>
          </div>
        </div>

        <div className="field-wrapper my-4">
          <div className="box">
            <img
              alt="solana home"
              width="44px"
              className=""
              src={require("../../assets/images/best-man.png").default}
            />
            <span>Who is/was the best man?</span>
          </div>
          <div className="row my-3">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                id="bestman_firstname"
                name="bestman_firstname"
                onChange={handleChange}
                aria-describedby=""
                placeholder="First Name"
                defaultValue={values.bestman_firstname}
              />
            </div>
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                id="bestman_lastname"
                name="bestman_lastname"
                onChange={handleChange}
                aria-describedby=""
                placeholder="Last Name"
                defaultValue={values.bestman_lastname}
              />
            </div>
          </div>
        </div>

        <div className="field-wrapper my-4">
          <div className="box">
            <img
              alt="solana home"
              width="44px"
              className=""
              src={require("../../assets/images/bridesmaids 1.png").default}
            />
            <span>Who is/was the maid of honor?</span>
          </div>
          <div className="row my-3">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                id="maidofhonor_firstname"
                name="maidofhonor_firstname"
                aria-describedby=""
                placeholder="First Name"
                defaultValue={values.maidofhonor_firstname}
              />
            </div>
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                id="maidofhonor_lastname"
                name="maidofhonor_lastname"
                aria-describedby=""
                placeholder="Last Name"
                defaultValue={values.maidofhonor_lastname}
              />
            </div>
          </div>
        </div>

        <div className="field-wrapper my-4">
          <div className="row my-5">
            <div className="col-md-3"></div>
            <div className="col-md-6">
              <button
                disabled={loading}
                type="submit"
                className="btn py-2 bg-pink-gradient text-white rounded-pill font-weight-bold w-100 text-uppercase"
              >
                {loading ? (
                  <Loader height={10} color="#fff" type="ThreeDots" />
                ) : isAdded ? (
                  "DEtails already submitted"
                ) : (
                  "SUBMIT TO SOLANA"
                )}
              </button>
              {show ? (
                <div
                  className="modal"
                  role="dialog"
                  style={{ display: "block" }}
                >
                  <div className="modal-dialog" role="document">
                    <div className="modal-content">
                      <div className="modal-body">
                        <img
                          alt="solana home"
                          className="py-3"
                          src={
                            require("../../assets/images/heart-lock1.png")
                              .default
                          }
                        />
                        <p className="alert-text">
                          Are you sure you want to publish these details on
                          Solana?{" "}
                        </p>
                        <p style={{ color: "#FF6093" }}>
                          PLEASE NOTE: ONCE SUBMITTED, THESE DETAILS CANNOT BE
                          EDITED.{" "}
                        </p>
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button"
                          onClick={confirmSubmit}
                          className="btn btn-primary modal-yes-btn py-3"
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary modal-no-btn py-3"
                          data-dismiss="modal"
                          onClick={closeConfirmation}
                        >
                          No
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
            <div className="col-md-3"></div>
          </div>
        </div>
      </div>
    </Form>
  );
};
interface IErrorMessage {
  errors: FormikErrors<TInitialValues>;
  touched: FormikTouched<TInitialValues>;
  name: keyof TInitialValues;
}
const ErrorMessage = (props: IErrorMessage) => {
  const { touched, errors, name } = props;
  return (
    <small style={{ color: "#d74b79" }}>
      {touched?.[name] && errors?.[name] ? errors?.[name] : ""}
    </small>
  );
};
