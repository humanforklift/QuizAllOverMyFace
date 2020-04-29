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
import { WaitingRoomStore } from "./WaitingRoomStore";
import useInitialMount from "../../shared-components/hooks/useInitialMount";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: "flex",
      flexWrap: "wrap",
      width: 600,
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
    image: {
        height: '500',
        width: 'auto'
    },
    card: {
      marginTop: theme.spacing(10),
      // maxHeight: '600px',
      border: "1px solid #808080",
    },
    actions: {
      marginBottom: theme.spacing(2),
    },
  })
);

const WaitingRoom = () => {
  const classes = useStyles({});
  const history = useHistory();
  const globalStore = useContext(GlobalStoreContext);
  const store = useLocalStore(
    (source) => new WaitingRoomStore(source.globalStore),
    {
      globalStore,
    }
  );

  useInitialMount(() => {
    async function retrieveFact() {
      await store.retrieveFact();
    }
    retrieveFact();
  });

  const preventDefault = (event: React.SyntheticEvent) =>
    event.preventDefault();

  return (
    <>
      <div className={classes.container}>
        <Card className={classes.card}>
          <CardHeader className={classes.header} title="Did you know?" />
          <CardContent>
            <div>
            <img
                className={classes.image}
                width={500}
                height={300}
                src={process.env.PUBLIC_URL + "/ChuckNorris.jpeg"}
                alt="Logo"
              />
              <Typography variant={"h5"}>{store.chuckFact}</Typography>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default observer(WaitingRoom);
