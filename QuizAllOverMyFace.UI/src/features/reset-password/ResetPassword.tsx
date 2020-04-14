import React, { useContext } from "react";
import TextField from "@material-ui/core/TextField";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import CardHeader from "@material-ui/core/CardHeader";
import { Typography, Link as MaterialUiLink } from "@material-ui/core";
import { observer, useLocalStore } from "mobx-react-lite";
import { GlobalStoreContext } from "features/shared/stores/GlobalStore";
import { InputProps } from "../../shared-components/input-props";
import { ResetPasswordStore } from "./ResetPasswordStore";
import ForgotPassword from "../forgot-password/ForgotPassword";
import {
  ForgotPasswordStoreContext,
  ForgotPasswordStore
} from "features/forgot-password/ForgotPasswordStore";
import { useParams, Redirect } from "react-router-dom";

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
    forgotPwd: {
      "&:hover": {
        cursor: "pointer"
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

interface ResetPasswordProps {
  isUserAuthenticated?: boolean;
}

const ResetPassword = (props: ResetPasswordProps) => {
  const { guid, userId } = useParams();
  const classes = useStyles();
  const globalStore = useContext(GlobalStoreContext);
  const forgotPasswordStore = useLocalStore(
    source => new ForgotPasswordStore(source.globalStore),
    {
      globalStore
    }
  );
  const store = useLocalStore(source => new ResetPasswordStore(source), {
    globalStore,
    guid,
    userId
  });

  const handleKeyPress = (e: any) => {
    if (e.keyCode === 13 || e.which === 13) {
      store.isButtonDisabled || store.submitResetPasswordForm();
    }
  };

  return (
    <ForgotPasswordStoreContext.Provider value={forgotPasswordStore}>
      <form className={classes.container} noValidate autoComplete="off">
        <Card className={classes.card}>
          <CardHeader className={classes.header} title="Reset Password" />
          <CardContent>
            <div>
              {!store.hasUserForgottenPassword && (
                <>
                  <InputProps
                    stateObject={store}
                    errorHandler={store.errorHandler}
                    propertyName="currentPassword"
                  >
                    <TextField
                      fullWidth
                      required
                      id="currentPassword"
                      type="password"
                      label="Current Password"
                      placeholder="Current Password"
                      margin="normal"
                      onKeyPress={e => handleKeyPress(e)}
                    />
                  </InputProps>
                  <Typography>
                    <MaterialUiLink
                      className={classes.forgotPwd}
                      onClick={forgotPasswordStore.handleForgotPassword}
                    >
                      Forgot Password?
                    </MaterialUiLink>
                  </Typography>
                </>
              )}
              <InputProps
                stateObject={store}
                errorHandler={store.errorHandler}
                propertyName="password1"
              >
                <TextField
                  fullWidth
                  required
                  id="password1"
                  type="password"
                  label="New Password"
                  placeholder="New Password"
                  margin="normal"
                  onKeyPress={e => handleKeyPress(e)}
                />
              </InputProps>
              <InputProps
                stateObject={store}
                errorHandler={store.errorHandler}
                propertyName="password2"
              >
                <TextField
                  fullWidth
                  required
                  id="password2"
                  type="password"
                  label="Confirm New Password"
                  placeholder="Confirm New Password"
                  margin="normal"
                  onKeyPress={e => handleKeyPress(e)}
                />
              </InputProps>
            </div>
          </CardContent>
          <CardActions className={classes.actions}>
            <Button
              variant="contained"
              size="large"
              className={classes.loginBtn}
              onClick={store.submitResetPasswordForm}
              disabled={store.isButtonDisabled}
            >
              Reset Password
            </Button>
          </CardActions>
        </Card>
      </form>
      {store.passwordSuccessfullyReset && <Redirect to={{ pathname: "/" }} />}
      <ForgotPassword />
    </ForgotPasswordStoreContext.Provider>
  );
};

export default observer(ResetPassword);
