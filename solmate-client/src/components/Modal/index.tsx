

import React, { useState } from "react";
export const Modal = () => {

  return (
    <React.Fragment>
       <div className="modal"  role="dialog" style={{display:"block"}}>
                  <div className="modal-dialog" role="document">
                    <div className="modal-content">
                      
                      <div className="modal-body">
                      <img
                      alt="solana home"
                      className="py-3"
                        src={
                          require("../../assets/images/heart-lock1.png").default
                        } />
                        <p className="alert-text">Are you sure you want to publish 
                        these details on Solana? </p>
                        <p style={{color: "#FF6093"}}>PLEASE NOTE: ONCE SUBMITTED, THESE DETAILS CANNOT BE EDITED. </p>
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-primary modal-yes-btn py-3">Yes</button>
                        <button type="button" className="btn btn-secondary modal-no-btn py-3" data-dismiss="modal" >No</button>
                      </div>
                    </div>
                  </div>
                </div>
    </React.Fragment>
  );
};
