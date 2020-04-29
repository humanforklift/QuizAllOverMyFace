import React, { useContext, useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { GlobalStoreContext } from "../shared/stores/GlobalStore";

import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Popper from "@material-ui/core/Popper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { useHistory } from "react-router-dom";
import * as signalR from "@aspnet/signalr";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  popper: {
    zIndex: 9999999,
  },
}));

const SignalRController: React.FC = () => {
  const globalStore = useContext(GlobalStoreContext);
  const connection = new signalR.HubConnectionBuilder()
    .withUrl(process.env.REACT_APP_API_BASE_URL + "/quiz")
    .build();

  connection
    .start()
    // .then((a) => {
    //   connection.invoke("sendMessage", "This is the message to display");
    // })
    .catch((err) => {
      console.log(err.toString());
    });

  const SignalRClient: React.FC = () => {
    const [clientMessage, setClientMessage] = useState<string | null>(null);
    const [roundName, setRoundName] = useState<string | null>(null);
    const [question1, setQuestion1] = useState<string | null>(null);
    const [question2, setQuestion2] = useState<string | null>(null);
    const [question3, setQuestion3] = useState<string | null>(null);
    const [question4, setQuestion4] = useState<string | null>(null);
    const [question5, setQuestion5] = useState<string | null>(null);
    const [question6, setQuestion6] = useState<string | null>(null);
    const [question7, setQuestion7] = useState<string | null>(null);
    const [question8, setQuestion8] = useState<string | null>(null);
    const [question9, setQuestion9] = useState<string | null>(null);
    const [question10, setQuestion10] = useState<string | null>(null);

    useEffect(() => {
      connection.on("setClientMessage", (message) => {
        setClientMessage(message);
      });
      connection.on("setRoundName", (message) => {
        setRoundName(message);
      });
      connection.on("setQuestion1", (message) => {
        setQuestion1(message);
      });
      connection.on("setQuestion2", (message) => {
        setQuestion2(message);
      });
      connection.on("setQuestion3", (message) => {
        setQuestion3(message);
      });
      connection.on("setQuestion4", (message) => {
        setQuestion4(message);
      });
      connection.on("setQuestion5", (message) => {
        setQuestion5(message);
      });
      connection.on("setQuestion6", (message) => {
        setQuestion6(message);
      });
      connection.on("setQuestion7", (message) => {
        setQuestion7(message);
      });
      connection.on("setQuestion8", (message) => {
        setQuestion8(message);
      });
      connection.on("setQuestion9", (message) => {
        setQuestion9(message);
      });
      connection.on("setQuestion10", (message) => {
        setQuestion10(message);
      });
    });

    return (
      <>
        <Typography variant={"h5"}>{clientMessage}</Typography>
        <Typography variant={"h3"}>{roundName}</Typography>
        <Typography variant={"h5"}>{question1}</Typography>
        <Typography variant={"h5"}>{question2}</Typography>
        <Typography variant={"h5"}>{question3}</Typography>
        <Typography variant={"h5"}>{question4}</Typography>
        <Typography variant={"h5"}>{question5}</Typography>
        <Typography variant={"h5"}>{question6}</Typography>
        <Typography variant={"h5"}>{question7}</Typography>
        <Typography variant={"h5"}>{question8}</Typography>
        <Typography variant={"h5"}>{question9}</Typography>
        <Typography variant={"h5"}>{question10}</Typography>
      </>
    );
  };

  if (globalStore.hasSignalRInfo) {
    return (
      <>
        <SignalRClient />
      </>
    );
  } else {
    return null;
  }
};
export default observer(SignalRController);
