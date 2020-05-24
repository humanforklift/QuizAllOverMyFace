import React, { useContext } from "react";
import TextField from "@material-ui/core/TextField";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import CardHeader from "@material-ui/core/CardHeader";
import {
  Typography,
  Link as MaterialUiLink,
  Grid,
  List,
  ListItemText,
  ListItem,
  Divider,
} from "@material-ui/core";
import {
  BeginActionsStore,
  BeginActionsStoreContext,
} from "./BeginActionsStore";
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
    editBtn: {
      marginTop: theme.spacing(2),
      flexGrow: 1,
      background: theme.palette.info.main,
      color: "#fff",
    },
    addBtn: {
      marginTop: theme.spacing(2),
      flexGrow: 1,
      background: theme.palette.secondary.main,
      color: "#fff",
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
      minWidth: "600px",
      minHeight: "600px",
      // maxHeight: '600px',
      border: "1px solid #808080",
    },
    actions: {
      marginBottom: theme.spacing(2),
      flexDirection: "column",
      alignItems: "normal",

      "&:not(:first-child)": {
        marginLeft: 0,
      },
    },
    image: {
      marginLeft: "auto",
      marginRight: "auto",
      marginTop: theme.spacing(8),
      width: "500px",
      opacity: "1",
    },
    bg: {
      background: "linear-gradient(to top, #68717a, #b5b1b1)",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      height: "100vh",
    },
    buttonContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  })
);

const Begin = () => {
  const classes = useStyles();
  const history = useHistory();
  const globalStore = useContext(GlobalStoreContext);
  // const forgotPasswordStore = useLocalStore(
  //   (source) => new BeginActionsStore(source.globalStore),
  //   {
  //     globalStore,
  //   }
  // );
  const store = useLocalStore(
    (source) => new BeginActionsStore(source.globalStore),
    {
      globalStore,
    }
  );

  return (
    <div className={classes.bg}>
      <form className={classes.container} noValidate autoComplete="off">
        <Card className={classes.card}>
          <CardHeader className={classes.header} title="Riddle Me This" />
          <CardContent>
            <Typography variant={"h5"}>What would you like to do?</Typography>
          </CardContent>
          {/* <CardActions className={classes.actions}> */}
          <List>
            <ListItem>
              <ListItemText primary="New Quiz" />
            </ListItem>
            <ListItem>
              <Button
                variant="contained"
                size="large"
                className={classes.loginBtn}
                onClick={() => history.push("/begin-quiz")}
                //disabled={store.isStartQuizDisabled}
              >
                Create New Quiz
              </Button>
            </ListItem>
            {/* <Button
                variant="outlined"
                size="large"
                className={classes.registerBtn}
                onClick={() => history.push("/register")}
                color="default"
              >
                Register
              </Button> */}
            <Divider component="li" />
            <ListItem>
              <ListItemText primary="Existing Quiz" />
            </ListItem>
            <ListItem>
              <Button
                variant="contained"
                size="large"
                className={classes.addBtn}
                style={{ marginLeft: 0 }}
                onClick={() => history.push("/begin-quiz")}
              >
                Add More Rounds To Existing Quiz
              </Button>
            </ListItem>
            <ListItem>
              <Button
                variant="contained"
                size="large"
                className={classes.editBtn}
                //color="secondary"
                style={{ marginLeft: 0 }}
                onClick={() => history.push("/")}
              >
                Edit Existing Rounds Of Quiz
              </Button>
            </ListItem>
            <ListItem>
              <Button
                variant="contained"
                size="large"
                className={classes.loginBtn}
                onClick={() => history.push("/begin-quiz")}
                //disabled={store.isStartQuizDisabled}
              >
                Start Quiz
              </Button>
            </ListItem>
          </List>
          {/* </CardActions> */}
        </Card>
      </form>
    </div>
  );
};

export default observer(Begin);
