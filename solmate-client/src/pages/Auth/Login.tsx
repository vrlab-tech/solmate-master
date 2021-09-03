import { useWallet } from "@solana/wallet-adapter-react";
import { WalletName } from "@solana/wallet-adapter-wallets";
import axios from "axios";
import { MouseEventHandler, useCallback, useEffect, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { apiEndPoint } from "../../config/constants";
export const Login = () => {
  return (
    <div
      className="container-fluid login-container text-white text-center bg-pink-gradient justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <div className="d-flex align-items-center justify-content-center h-100">
        <div className="row">
          <div className="col-lg-2"></div>
          <div className="col-lg-8">
            <h1 className="my-3">SolMate</h1>
            <p className="text-uppercase my-3">Your wedding on solana</p>
            <img
              alt="couple"
              className="couple-img my-3"
              src={
                require("../../assets/images/login/solana-couple.png").default
              }
            />
            <div className="my-3">
              <p className="text-uppercase">Register your wedding on SOLANA.</p>
              <p className="text-uppercase">
                Create A PRoGRAMMABLE NFT with SOLMATE.
              </p>
            </div>
            <WalletButtons />
          </div>
          <br></br>
          <div className="col-lg-2"></div>
        </div>
      </div>
    </div>
  );
};
const WalletButtons = () => {
  const { wallets } = useWallet();
  return (
    <>
      {wallets?.map((wal, index) => {
        return <SingleWalletButton key={index} wallet={wal} />;
      })}
    </>
  );
};
interface ISingleWalletButton {
  wallet: {
    name: WalletName;
    icon: string;
  };
  // onClick: (e: MouseEventHandler<HTMLDivElement>) => void;
}
const SingleWalletButton = (props: ISingleWalletButton) => {
  const { wallet } = props;
  const { adapter } = useWallet();
  const history = useHistory();
  const { select } = useWallet();
  const content = useMemo(() => {
    if (adapter?.connecting) return "Connecting ...";
    if (adapter?.connected) return "Connected";
    if (wallet) return `login with ${wallet.name}`;
    return "Connect Wallet";
  }, [adapter, wallet]);
  const handleClick: MouseEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      select(wallet.name);
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      if (!event.defaultPrevented)
        adapter
          ?.connect()
          .then(() => {
            history.push("/dashboard");
            axios
              .post(`${apiEndPoint}/addKey`, {
                public_key: adapter?.publicKey.toString(),
              })
              .then((res) => {
                history.push("/dashboard");
              });
          })
          .catch((error) => {
            console.log("error here", error);
          });
    },
    []
  );
  useEffect(() => {
    const fetchAndSetPbAddress = async () => {
      // console.log("pb", publicKey?.toString());
      // const pbKey: string = await publicKey?.toString();
      // setLocalStorage(pbKey);
      // setPublicAddress(publicKey?.toString());
      console.log("in fn");
      axios
        .post(`${apiEndPoint}/addKey`, {
          public_key: adapter?.publicKey.toString(),
        })
        .then((res) => {
          history.push("/dashboard");
        });
    };
    if (adapter?.connected) {
      fetchAndSetPbAddress();
    }
  }, [adapter?.connected]);
  return (
    <div onClick={handleClick} className="my-4">
      <div
        className="btn btn-light d-flex rounded-pill justify-content-center py-3 "
        style={{ zIndex: 9999999 }}
      >
        <img
          className="wallet-img"
          alt={`${wallet.name} icon`}
          src={wallet.icon}
        />
        <span className="px-2 color-red font-weight-bolder text-uppercase">
          {content}
        </span>
      </div>
    </div>
  );
};
