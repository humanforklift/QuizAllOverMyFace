import React, { useContext } from "react";
import TextField from "@material-ui/core/TextField";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import CardHeader from "@material-ui/core/CardHeader";
import { Typography, Link, Paper, InputAdornment, IconButton } from "@material-ui/core";
import { observer, useLocalStore } from "mobx-react-lite";
import { GlobalStoreContext } from "../shared/stores/GlobalStore";
import { InputProps } from "../../shared-components/input-props";
import { useHistory, Redirect, useParams } from "react-router-dom";
import { LoadingModal } from "../../shared-components/material-ui-modals";
import { AddRoundsStore } from "./AddRoundsStore";
import useInitialMount from "../../shared-components/hooks/useInitialMount";
import ClearIcon from '@material-ui/icons/Clear';

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
        minHeight: '400px',
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

const AddRounds = () => {
  const { guid } = useParams();
  const classes = useStyles({});
  const history = useHistory();
  const globalStore = useContext(GlobalStoreContext);
  const store = useLocalStore(
    (source) => new AddRoundsStore(source),
    {
      globalStore,
      guid
    }
  );

  useInitialMount(() => {
    store.addQuestionToArray()
  })

  const handleKeyPress = (e: any) => {
    if (e.keyCode === 13 || e.which === 13) {
      store.canAddAnotherQuestion || store.addQuestionToArray();
    }
  };

  const preventDefault = (event: React.SyntheticEvent) =>
    event.preventDefault();

  return (
    <div className={classes.bg}>
      <form className={classes.container} noValidate autoComplete="off">
        <Card className={classes.card}>
          <CardHeader className={classes.header} title="Add Round" />
          <CardContent>
            <div>
              <InputProps
                stateObject={store}
                errorHandler={store.errorHandler}
                propertyName="roundSubject"
              >
                <TextField
                  fullWidth
                  required
                  id="roundSubject"
                  label="Round Subject"
                  placeholder="Enter the subject for this round"
                  margin="normal"
                  onKeyPress={(e) => handleKeyPress(e)}
                />
              </InputProps>
              {store.questions.map((row, index) => <InputProps
                stateObject={store.questions[index]}
                errorHandler={store.errorHandler}
                propertyName='questionText'
              >
                <TextField
                  key={index}
                  fullWidth
                  required
                  id={index.toString()}
                  label={`Question ${index + 1}`}
                  placeholder="Enter question text"
                  margin="normal"
                  onKeyPress={(e) => handleKeyPress(e)}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">
                      <IconButton
                        aria-label="remove question"
                        disabled={index === 0 && store.questions.length === 1}
                        onClick={() => store.removeQuestion(index)}
                        edge="end"
                      >
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  }}
                />
              </InputProps>)}
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
              onClick={store.addQuestionToArray}
              disabled={!store.canAddAnotherQuestion}
            >
              Add Another Question
            </Button>
            <Button
              variant="contained"
              size="large"
              className={classes.submitBtn}
              onClick={store.saveRound}
              disabled={store.isCreateRoundDisabled}
            >
              Save Round
            </Button>
          </CardActions>
        </Card>
      </form>
      <LoadingModal title="Saving Round..." visible={store.isSaving} />
      {store.redirectUserToHomepage && <Redirect to={{ pathname: "/" }} />}
    </div>
  );
};

export default observer(AddRounds);
