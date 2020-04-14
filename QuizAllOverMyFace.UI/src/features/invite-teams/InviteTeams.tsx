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
import { InviteTeamsStore } from "./InviteTeamsStore";
import useInitialMount from "custom-hooks/useInitialMount";

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
    addMore: {
      marginTop: theme.spacing(2),
      flexGrow: 1,
      background: "#3E8BB7",
      color: "#fff",

      "&:hover": {
        background: "#5ca8d1",
      },
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
    bg: {
        background:
          "linear-gradient(to top, #68717a, #b5b1b1)",
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

const InviteTeams = () => {
  const classes = useStyles({});
  const history = useHistory();
  const globalStore = useContext(GlobalStoreContext);
  const store = useLocalStore(
    (source) => new InviteTeamsStore(source.globalStore),
    {
      globalStore,
    }
  );

  useInitialMount(() => {
    store.createTeamsArray()
  })

  const handleKeyPress = (e: any) => {
    if (e.keyCode === 13 || e.which === 13) {
      store.isStartQuizDisabled || store.createQuiz();
    }
  };

  const preventDefault = (event: React.SyntheticEvent) =>
    event.preventDefault();

  return (
    <div className={classes.bg}>
      <form className={classes.container} noValidate autoComplete="off">
        <Card className={classes.card}>
          <CardHeader className={classes.header} title="Invite Teams" />
          <CardContent>
            <div>
              {store.teams.map((row, index) => <InputProps
                stateObject={store}
                errorHandler={store.errorHandler}
                propertyName={store.inviteTeams[index].fieldName!}
              >
                <TextField
                  key={index}
                  fullWidth
                  required
                  id={index.toString()}
                  label="Send Invite To"
                  placeholder="Enter email address"
                  margin="normal"
                  onKeyPress={(e) => handleKeyPress(e)}
                />
              </InputProps>)}
              {/* <InputProps
                stateObject={store}
                errorHandler={store.errorHandler}
                propertyName="quizName"
              >
                <TextField
                  fullWidth
                  required
                  id="quizName"
                  label="Quizzical Name"
                  placeholder="Quiz Name"
                  margin="normal"
                  onKeyPress={(e) => handleKeyPress(e)}
                />
              </InputProps> */}
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
              variant="outlined"
              size="large"
              className={classes.addMore}
              onClick={store.addAdditionalTeam}
              disabled={store.isStartQuizDisabled}
            >
              Add Another Team
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
      {/* {store.quizCreatedSuccessfully && <Redirect to={{ pathname: "/inviteTeams" }} />} */}
    </div>
  );
};

export default observer(InviteTeams);
