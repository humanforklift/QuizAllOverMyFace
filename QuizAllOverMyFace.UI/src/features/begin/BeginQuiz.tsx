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
import { InputProps } from "../../shared-components/input-props";
import { useHistory, Redirect } from "react-router-dom";
import { LoadingModal } from "../../shared-components/material-ui-modals";
import { BeginActionsStore } from "./BeginActionsStore";
import SignalRClient from "../main-page/SignalRClient";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: "flex",
      flexWrap: "wrap",
      width: 400,
      margin: `${theme.spacing(0)} auto`,
    },
    submitBtn: {
      marginTop: theme.spacing(2),
      flexGrow: 1,
      background: "#43A047",
      color: "#fff",

      "&:hover": {
        background: "#39C16C",
      },
    },
    backBtn: {
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
      minWidth: "600px",
      minHeight: "600px",
      // maxHeight: '600px',
      border: "1px solid #808080",
    },
    bg: {
      background: "linear-gradient(to top, #68717a, #b5b1b1)",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      height: "100vh",
    },
    actions: {
      marginBottom: theme.spacing(2),
    },
  })
);

const BeginQuiz = () => {
  const classes = useStyles({});
  const history = useHistory();
  const globalStore = useContext(GlobalStoreContext);
  const store = useLocalStore(
    (source) => new BeginActionsStore(source.globalStore),
    {
      globalStore,
    }
  );

  const handleKeyPress = (e: any) => {
    if (e.keyCode === 13 || e.which === 13) {
      store.isStartQuizDisabled || store.createQuiz();
    }
  };

  const preventDefault = (event: React.SyntheticEvent) =>
    event.preventDefault();

  // if (store.hasSignalRConnection) {
  //   return <SignalRClient />
  // }

  return (
    <>
      <SignalRClient />
      <div className={classes.bg}>
        <form className={classes.container} noValidate autoComplete="off">
          <Card className={classes.card}>
            <CardHeader className={classes.header} title="Create Quiz" />
            <CardContent>
              <div>
                <InputProps
                  stateObject={store}
                  errorHandler={store.errorHandler}
                  propertyName="hostName"
                >
                  <TextField
                    fullWidth
                    required
                    id="hostName"
                    label="Host Name"
                    placeholder="Enter a name"
                    margin="normal"
                    onKeyPress={(e) => handleKeyPress(e)}
                  />
                </InputProps>
                <InputProps
                  stateObject={store}
                  errorHandler={store.errorHandler}
                  propertyName="quizName"
                >
                  <TextField
                    fullWidth
                    required
                    id="quizName"
                    label="Quiz Name"
                    placeholder="Quiz Name"
                    margin="normal"
                    onKeyPress={(e) => handleKeyPress(e)}
                  />
                </InputProps>
              </div>
            </CardContent>
            <CardActions className={classes.actions}>
              <Button
                variant="outlined"
                size="large"
                className={classes.backBtn}
                onClick={() => history.push("/")}
              >
                Back to Previous
              </Button>
              <Button
                variant="contained"
                size="large"
                className={classes.submitBtn}
                onClick={store.createQuiz}
                disabled={store.isStartQuizDisabled}
              >
                Create Quiz
              </Button>
            </CardActions>
          </Card>
        </form>
        <LoadingModal title="Creating Quiz..." visible={store.isSaving} />
        {store.quizCreatedSuccessfully && (
          <Redirect to={{ pathname: `/invite-teams/${store.quiz.id}` }} />
        )}
      </div>
    </>
  );
};

export default observer(BeginQuiz);
