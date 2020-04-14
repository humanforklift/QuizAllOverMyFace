import React, { useContext } from 'react'
import Paper from "@material-ui/core/Paper"
import { observer } from "mobx-react-lite"
import { ReportsStoreContext } from '../ReportsStore'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

interface ReportsDetailProps {
    optionalParam?: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      marginTop: theme.spacing(3),
      padding: theme.spacing(3),
    }
  })
);

export const ReportsDetail = observer((props: ReportsDetailProps) => {
    const store = useContext(ReportsStoreContext)
    const classes = useStyles();

    return (
        <Paper elevation={7} className={classes.container}>            <Typography >
                {store.detail}
            </Typography>

            <Button onClick={store.changeTitle} variant="contained" color="primary">
                Change things
            </Button>
        </Paper>
    )
})