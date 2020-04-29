import React, { useContext } from "react";
import TextField from "@material-ui/core/TextField";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import CardHeader from "@material-ui/core/CardHeader";
import { Typography, Link, Paper } from "@material-ui/core";
import { observer, useLocalStore } from "mobx-react-lite";
import { GlobalStoreContext } from "../shared/stores/GlobalStore";
import { RegisterForQuizStore } from "./RegisterForQuizStore";
import { InputProps } from "../../shared-components/input-props";
import { useHistory, Redirect } from "react-router-dom";
import { LoadingModal } from "../../shared-components/material-ui-modals";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: "flex",
      flexWrap: "wrap",
      width: 400,
      margin: `${theme.spacing(0)} auto`
    },
    submitBtn: {
      marginTop: theme.spacing(2),
      flexGrow: 1,
      background: "#43A047",
      color: "#fff",

      "&:hover": {
        background: "#39C16C"
      }
    },
    backBtn: {
      marginTop: theme.spacing(2),
      flexGrow: 1,
      background: "#fff"
      // color: '#fff'
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

const RegisterForQuiz = () => {
  const classes = useStyles({});
  const history = useHistory();
  const globalStore = useContext(GlobalStoreContext);
  const store = useLocalStore(source => new RegisterForQuizStore(source.globalStore), {
    globalStore
  });

  const handleKeyPress = (e: any) => {
    if (e.keyCode === 13 || e.which === 13) {
      store.isButtonDisabled || store.submitRegisterForm();
    }
  };

  const preventDefault = (event: React.SyntheticEvent) =>
    event.preventDefault();

  return (
    <>
      <form className={classes.container} noValidate autoComplete="off">
        <Card className={classes.card}>
          <CardHeader className={classes.header} title="Register User" />
          <CardContent>
            <div>
              <InputProps stateObject={store} propertyName="teamName">
                <TextField
                  fullWidth
                  required
                  id="firstName"
                  label="First Name"
                  placeholder="First Name"
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
              className={classes.submitBtn}
              onClick={store.submitRegisterForm}
              disabled={store.isButtonDisabled}
            >
              Register Team
            </Button>
          </CardActions>
        </Card>
      </form>
      <LoadingModal title="Registering Your Team..." visible={store.isSaving} />
      {store.userRegisteredSuccessfully && <Redirect to={{ pathname: "/" }} />}
    </>
  );
};

export default observer(RegisterForQuiz);
