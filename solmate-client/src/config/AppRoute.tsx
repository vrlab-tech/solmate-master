import { useWallet } from "@solana/wallet-adapter-react";
import { Redirect, Route } from "react-router-dom";
interface IAppRoute {
  Component: React.ReactNode;
  path: string;
}
export const AppRoute = (props: IAppRoute) => {
  const { adapter } = useWallet();
  const { Component, path } = props;
  // const [localStorageValue, setLocalStorage] = useLocalStorage(
  //   "solmate-pb",
  //   ""
  // );
  return (
    <Route
      path={path}
      render={(props) => {
        if (!adapter?.connected) {
          return <Redirect to={{ pathname: "/login" }} />;
        }
        return Component;
      }}
    />
  );
};
