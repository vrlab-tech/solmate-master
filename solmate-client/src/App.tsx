import { WalletError } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  getPhantomWallet,
  getSolletWallet,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { useCallback, useMemo } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import "./App.css";
import { Login } from "./pages/Auth/Login";
import { BuildNft } from "./pages/BuildNft";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import { DateNFT } from "./pages/DateNFT";
import { BuildDateNft } from "./pages/DateNFT/BuildDateNft";
import { DownloadCertificate } from "./pages/DownloadCertificate";
import Home from "./pages/Home/Home";
import { Nfts } from "./pages/Nfts";
import { PreviewNFT } from "./pages/PreviewNFT";
import { Social } from "./pages/Social";
import { WeddingDetails } from "./pages/WeddingDetails";
import { AppRoute } from "./config/AppRoute";

function App() {
  const endpoint = useMemo(() => clusterApiUrl("devnet"), []);
  const wallets = useMemo(() => [getSolletWallet(), getPhantomWallet()], []);
  const onError = useCallback((error: WalletError) => {
    console.log(
      "error",
      error.message ? `${error.name}: ${error.message}` : error.name
    );
    console.log("err", error);
  }, []);
  // const [localStorageValue, setLocalStorage] = useLocalStorage(
  //   "solmate-pb",
  //   ""
  // );
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider
        localStorageKey="solmate-pb"
        autoConnect={true}
        onError={onError}
        wallets={wallets}
      >
        <Router>
          <Switch>
            <AppRoute path="/dashboard" Component={<Dashboard />} />
            <AppRoute path="/nfts" Component={<Nfts />} />
            <AppRoute path="/build-nft" Component={<BuildNft />} />
            <AppRoute path="/build-date-nft" Component={<BuildDateNft />} />
            <AppRoute path="/wedding-details" Component={<WeddingDetails />} />
            <AppRoute path="/date-nft" Component={<DateNFT />} />
            <AppRoute path="/preview-nfts" Component={<PreviewNFT />} />
            <AppRoute
              path="/download-certificate"
              Component={<DownloadCertificate />}
            />
            <AppRoute path="/solmate-social" Component={<Social />} />
            <Route path="/login" render={(props) => <Login />} />
            <Route path="/" render={() => <Home />} />
            <Route path="/*" render={(props) => <div>Not found</div>} />
          </Switch>
        </Router>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
