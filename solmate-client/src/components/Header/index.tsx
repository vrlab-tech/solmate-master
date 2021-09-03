import React,{useState} from "react";
import { Link } from "react-router-dom";
import shallow from "zustand/shallow";
import { useWalletStore } from "../../store/wallet";
import { WeddingMenu } from "./WeddingMenu";
const truncateMiddle = (text: string, maxCharacters: number) => {
  const txtLength = text.length; // Length of the incoming text
  const txtLengthHalf = maxCharacters
    ? Math.round(maxCharacters / 2)
    : Math.round(txtLength / 2); // set max txtHalfLength
  return (
    text.substring(0, txtLengthHalf - 1).trim() +
    "..." +
    text.substring(txtLength - txtLengthHalf + 2, txtLength).trim()
  ); //Return the string
};
export const Header = () => {
  const { publicAddress } = useWalletStore((state) => state, shallow);
  const [showHamburger, setShowHamburger] = useState(false);

const mobileMenu= () =>{
  setShowHamburger(true)
}
  return (
    <React.Fragment>
      <nav
        className="navbar navbar-expand-lg navbar-dark  fixed-top"
        id="mainNav"
      >
        <button
          className="navbar-toggler navbar-toggler-right"
          type="button"
          data-toggle="collapse"
          onClick={mobileMenu}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse " id="navbarResponsive">
        <WeddingMenu  />

         <div className="w-100 mx-4 my-2">
            <p
              className="text-right text-white "
              style={{ textAlign: "right" }}
            >
              <span className="mx-3">{truncateMiddle(publicAddress, 20)}</span>
              <img
                alt="solana solmate user"
                src={
                  require("../../assets/images/dashboard/salary 1.png").default
                }
              />
            </p>
          </div>
        </div>
      </nav>
      {showHamburger ? 
       <div className="modal bg-pink-gradient" role="dialog" style={{ display: "block" }}>
       <div className="modal-dialog" role="document">
         <div className="modal-content bg-pink-gradient">
         <div className="modal-header " style={{"justifyContent": "end"}}>
              <button
               type="button"
               className="btn btn-secondary modal-no-btn py-1 w-auto"
               data-dismiss="modal"
               onClick={() => setShowHamburger(false)}
             >
               X
             </button>
          </div>
           <div className="modal-body text-center">
                <WeddingMenu  />
           </div>
         </div>
       </div>
     </div> : null
      }
     
      
    </React.Fragment>
  );
};
