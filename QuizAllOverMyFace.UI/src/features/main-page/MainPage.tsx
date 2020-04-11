import React, { useContext, useEffect, useState, useMemo } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { observer } from "mobx-react-lite";
import NavigationMenu from "./NavigationMenu";
import MainPageRoutes from "./MainPageRoutes";
import MenuIcon from "@material-ui/icons/Menu";
import LoggedUserControl from "./LoggedUserControl";
import { GlobalStoreContext } from "../shared/stores/GlobalStore";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { MessageDialog } from "shared-components/material-ui-modals";
import { AppBarContainer } from "shared-components/material-ui-app-bar-container";
import Login from "../begin/BeginActions";
import Register from "../register-user/Register";
import ResetPassword from "features/reset-password/ResetPassword";

const useStyles = makeStyles(theme => ({
  image: {
    height: theme.spacing(6),
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1)
  }
}));
const MainPage = () => {
  const classes = useStyles();
  const globalStore = useContext(GlobalStoreContext);
  const title = useMemo(
    () =>
      (process.env.REACT_APP_ENVIRONMENT_ID !== "prod"
        ? "(" + process.env.REACT_APP_ENVIRONMENT_NAME + ")"
        : null),
    []
  );

  const [invalidLoginMessage, setInvalidLoginMessage] = useState<
    string | undefined
  >(undefined);
  useEffect(() => {
    (window as any)["setInvalidLoginMessage"] = setInvalidLoginMessage;
    return () => {
      (window as any)["setInvalidLoginMessage"] = undefined;
    };
  }, [setInvalidLoginMessage]);

  if (invalidLoginMessage) {
    return (
      <MessageDialog
        title="Access Restricted"
        content={invalidLoginMessage}
        actions={[
          { name: "Reload Page", callback: () => window.location.reload() }
        ]}
      />
    );
  }

  //if (!!globalStore.currentUser) {
    // return (
    //   <BrowserRouter>
    //     <AppBarContainer
    //       title={
    //         <>
    //           <img
    //             className={classes.image}
    //             src={process.env.PUBLIC_URL + "/chblogowhite.svg"}
    //             alt="Logo"
    //           />
    //           {title}
    //         </>
    //       }
    //       leftButtonOnClick={() => (globalStore.drawerOpen = true)}
    //       leftButtonIcon={<MenuIcon />}
    //       rightButtons={[<LoggedUserControl key={1} />]}
    //     >
    //       <NavigationMenu key={2} />
    //       <MainPageRoutes key={3} />
    //     </AppBarContainer>
    //   </BrowserRouter>
    // );
  //}

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/register">
          <Register />
        </Route>
        <Route path="/reset-password/:guid/:userId">
          <ResetPassword />
        </Route>
        <Route>
          <Login />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};
export default observer(MainPage);
