import React, { useContext } from "react";
import TextField from "@material-ui/core/TextField";
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme
} from "@material-ui/core/styles";
import { Typography, Grid } from "@material-ui/core";
import { observer, useLocalStore } from "mobx-react-lite";
import { InputProps } from "../../shared-components/input-props";
import { GlobalStoreContext } from "../shared/stores/GlobalStore";
import { ForgotPasswordStore, ForgotPasswordStoreContext } from "./ForgotPasswordStore";
import { MessageDialog, LoadingModal } from "../../shared-components/material-ui-modals";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: "flex",
      flexWrap: "wrap",
      width: 400,
      margin: `${theme.spacing(0)} auto`
    },
    loginBtn: {
      marginTop: theme.spacing(2),
      flexGrow: 1,
      background: "#43A047",
      color: "#fff",

      "&:hover": {
        background: "#39C16C"
      }
    },
    header: {
      textAlign: "center",
      background: "#0D4C9D",
      color: "#fff"
    },
    card: {
      marginTop: theme.spacing(10),
      // maxHeight: '600px',
      border: "1px solid #808080"
    },
    actions: {
      marginBottom: theme.spacing(2)
    }
  })
);

const ForgotPassword = () => {
  const theme = useTheme();
  const globalStore = useContext(GlobalStoreContext);
  const store = useContext(ForgotPasswordStoreContext);

    return (
      <>
        <MessageDialog
          title={"Forgot Password"}
          open={store.modalOpen}
          content={
            <Grid container>
              <Grid item>
                <Typography variant="subtitle2">
                  Please enter email address to send password reset link to:
                </Typography>
                <br />
                <InputProps
                  stateObject={store}
                  propertyName={"emailAddress"}
                  errorHandler={store.errorHandler}
                >
                  <TextField
                    fullWidth
                    required
                    type="email"
                    style={{ width: theme.spacing(50) }}
                  />
                </InputProps>
                <br />
              </Grid>
            </Grid>
          }
          actions={[
            {
              name: "Ok",
              color: "primary",
              callback: store.emailResetPasswordLink
            },
            {
              name: "Cancel",
              color: "secondary",
              callback: store.cancelForgotPassword
            }
          ]}
        />
        <LoadingModal title="Sending password reset email..." visible={store.emailIsSending} />
      </>
    );
};

export default observer(ForgotPassword);
