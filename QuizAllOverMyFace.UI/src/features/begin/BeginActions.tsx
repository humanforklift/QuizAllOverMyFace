import React, { useContext } from "react";
import TextField from "@material-ui/core/TextField";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import CardHeader from "@material-ui/core/CardHeader";
import { Typography, Link as MaterialUiLink, Grid } from "@material-ui/core";
import { BeginActionsStore } from "./BeginActionsStore";
import { observer, useLocalStore } from "mobx-react-lite";
import { GlobalStoreContext } from "features/shared/stores/GlobalStore";
import { useHistory } from "react-router-dom";
import { InputProps } from "../../shared-components/input-props";
import ForgotPassword from "features/forgot-password/ForgotPassword";
import {
  ForgotPasswordStoreContext,
  ForgotPasswordStore,
} from "features/forgot-password/ForgotPasswordStore";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: "flex",
      flexWrap: "wrap",
      width: 400,
      margin: `${theme.spacing(0)} auto`,
    },
    loginBtn: {
      marginTop: theme.spacing(2),
      flexGrow: 1,
      background: "#43A047",
      color: "#fff",

      "&:hover": {
        background: "#39C16C",
      },
    },
    forgotPwd: {
      "&:hover": {
        cursor: "pointer",
      },
    },
    registerBtn: {
      marginTop: theme.spacing(2),
      flexGrow: 1,
      background: "#fff",
      // color: '#fff'
    },
    header: {
      textAlign: "center",
      background: "#0D4C9D",
      color: "#fff",
    },
    card: {
      marginTop: theme.spacing(10),
      minWidth: '600px',
      minHeight: '600px',
      // maxHeight: '600px',
      border: "1px solid #808080",
    },
    actions: {
      marginBottom: theme.spacing(2),
    },
    image: {
      marginLeft: "auto",
      marginRight: "auto",
      marginTop: theme.spacing(8),
      width: "500px",
      opacity: "1",
    },
    bg: {
      background:
        "linear-gradient(to top, #68717a, #b5b1b1)",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      height: "100vh",
    },
    buttonContainer: {
      display: "flex", 
      alignItems: "center",
      justifyContent: "center",
    }
  })
);

const Login = () => {
  const classes = useStyles();
  const history = useHistory();
  const globalStore = useContext(GlobalStoreContext);
  const forgotPasswordStore = useLocalStore(
    (source) => new ForgotPasswordStore(source.globalStore),
    {
      globalStore,
    }
  );
  const store = useLocalStore((source) => new BeginActionsStore(source.globalStore), {
    globalStore,
  });

  const handleKeyPress = (e: any) => {
    if (e.keyCode === 13 || e.which === 13) {
      store.isButtonDisabled || store.submitLoginForm();
    }
  };

  return (
    <div className={classes.bg}>
      <ForgotPasswordStoreContext.Provider value={forgotPasswordStore}>
        <form className={classes.container} noValidate autoComplete="off">
          <Card className={classes.card}>
            <CardHeader className={classes.header} title="Riddle Me This" />
            <CardContent>
              <Typography variant={"h5"}>
                What would you like to do?
              </Typography>
            </CardContent>
            <CardActions className={classes.actions}>
              {/* <Button
                variant="outlined"
                size="large"
                className={classes.registerBtn}
                onClick={() => history.push("/register")}
                color="default"
              >
                Register
              </Button> */}
              <Button
                variant="contained"
                size="large"
                className={classes.loginBtn}
                onClick={store.submitLoginForm}
                //disabled={store.isButtonDisabled}
              >
                Start New Quiz
              </Button>
            </CardActions>
          </Card>
        </form>
        <ForgotPassword />
      </ForgotPasswordStoreContext.Provider>
    </div>
  );
};

export default observer(Login);
