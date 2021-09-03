import { Link } from "react-router-dom";

export const WeddingMenu = () => {
  return (
    <ul
      className="navbar-nav navbar-sidenav bg-pink-gradient text-white"
      id="exampleAccordion"
    >
      <li className="nav-item">
        <Link to="/dashboard" className="nav-link navbar-brand p-3 text-white">
          SOLMATE
        </Link>
      </li>

      <li className="nav-item">
        <Link to="/dashboard" className="nav-link">
          <img
            alt="solana home"
            className=""
            src={
              require("../../assets/images/dashboard/solana home.png").default
            }
          />
          <span className="nav-link-text ">Sol Home</span>
        </Link>
      </li>
      <li className="nav-item">
        <Link to="/wedding-details" className="nav-link">
          <img
            alt="solana register wedding"
            src={require("../../assets/images/dashboard/map 1.png").default}
          />
          <span className="nav-link-text">Register Wedding</span>
        </Link>
      </li>
      <li className="nav-item">
        <Link to="/nfts" className="nav-link">
          <img
            alt="solana wedding NFT"
            src={require("../../assets/images/dashboard/camera 1.png").default}
          />
          <span className="nav-link-text">Your NFTs</span>
        </Link>
      </li>
      {/* <li className="nav-item">
        <Link to="/date-nfts" className="nav-link nav-link-collapse collapsed">
          <img
            alt="solana wedding"
            src={require("../../assets/images/dashboard/couple 1.png").default}
          />
          <span className="nav-link-text">Your Wedding</span>
        </Link>
      </li> */}
      <li className="nav-item">
        <Link
          to="/download-certificate"
          className="nav-link nav-link-collapse collapsed"
          data-toggle="collapse"
          data-parent="#exampleAccordion"
        >
          <img
            alt="solana social"
            src={require("../../assets/images/dashboard/love 1.png").default}
          />
          <span className="nav-link-text">Certificate</span>
        </Link>
      </li>

      <li className="nav-item">
        <Link
          to="/solmate-social"
          className="nav-link nav-link-collapse collapsed"
        >
          <img
            alt="solana social"
            width="15%"
            src={require("../../assets/images/social-solmate.png").default}
          />
          <span className="nav-link-text">Social</span>
        </Link>
      </li>

      <li className="nav-item">
        <Link to="" className="nav-link nav-link-collapse collapsed">
          <img
            alt="solana logout"
            src={require("../../assets/images/dashboard/travel 1.png").default}
          />
          <span className="nav-link-text">Logout</span>
        </Link>
      </li>

      <li className="nav-item nav-sidebar">
        <span className="nav-link-text text-center" style={{ fontWeight: 700 }}>
          YOUR WEDDING ON SOLANA
        </span>
        <Link
          to=""
          className="nav-link nav-link-collapse collapsed text-center p-0 pt-2"
        >
          <img
            alt="solana solmate couple"
            src={
              require("../../assets/images/dashboard/bride-and-groom 1.png")
                .default
            }
          />
        </Link>
      </li>
    </ul>
  );
};
