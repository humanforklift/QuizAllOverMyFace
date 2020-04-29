import React from "react";
import { useState, useEffect, useContext } from "react";
import SignalRController from "./SignalRController"
import { GlobalStoreContext } from "../shared/stores/GlobalStore";
import { Typography, Snackbar } from "@material-ui/core";
import { observer } from "mobx-react-lite";
import FlexBanner from "flex-banner";

const SignalRClient: React.FC = () => {  
    const globalStore = useContext(GlobalStoreContext);
    const connection = globalStore.signalRConnection
    
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

    const toggleBanner = () => {
      globalStore.showBanner = !globalStore.showBanner
    }

    useEffect(() => {
      connection!.on("setClientMessage", (message) => {
        globalStore.hasSignalRInfo = true
        setClientMessage(message);
      });
      connection!.on("setRoundName", (message) => {
        setRoundName(message);
      });
      connection!.on("setQuestion1", (message) => {
        setQuestion1(message);
      });
      connection!.on("setQuestion2", (message) => {
        setQuestion2(message);
      });
      connection!.on("setQuestion3", (message) => {
        setQuestion3(message);
      });
      connection!.on("setQuestion4", (message) => {
        setQuestion4(message);
      });
      connection!.on("setQuestion5", (message) => {
        setQuestion5(message);
      });
      connection!.on("setQuestion6", (message) => {
        setQuestion6(message);
      });
      connection!.on("setQuestion7", (message) => {
        setQuestion7(message);
      });
      connection!.on("setQuestion8", (message) => {
        setQuestion8(message);
      });
      connection!.on("setQuestion9", (message) => {
        setQuestion9(message);
      });
      connection!.on("setQuestion10", (message) => {
        setQuestion10(message);
      });
    });

    if (globalStore.hasSignalRInfo) {
      return (
        <>
          <FlexBanner title={clientMessage!} ctaLink='' ctaTitle='' isCenter animationTime={0} delayToShowBanner={0} crossIconSize={0} wrapperStyle={{backgroundColor: '#f5f774'}} mainStyleTitle={{color: '#000'}} crossStyle={{color: '#000'}}/>
          {/* <Typography variant={"h5"}>{clientMessage}</Typography> */}
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
    }
    return null
  };

  export default observer(SignalRClient);