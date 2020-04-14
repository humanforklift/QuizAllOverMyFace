import React from 'react'
import Paper from "@material-ui/core/Paper"
import Typography from "@material-ui/core/Typography"
import { useLocalStore, observer } from "mobx-react-lite"
import { ReportsStore, ReportsStoreContext } from "./ReportsStore"
import { ReportsDetail } from './detail/ReportsDetail'
import Chart from 'features/Chart'
import useInitialMount from 'shared-components/hooks/useInitialMount'
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

interface ReportsProps {
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

export const Reports = observer((props: ReportsProps) => {
    const store = useLocalStore(() => new ReportsStore(), props)
    let descriptions;
    const classes = useStyles();

    useInitialMount(() => {
        //descriptions = store.getDeviceDescriptions();
        //store.getDevices();
        async function fetchData() {
            setChartColumns()
            setXAxisValues()
            await store.getDeviceDescriptions()
            await store.getDevices()
            console.log(store.deviceDescriptions)
            //console.log(store.devices);
            descriptions = store.deviceDescriptions
        }
        fetchData()
    })

    // const arrangeColumns = () => {
    //     for(let device of store.devices) {
    //         let twoDimensionalArray = []
    //         twoDimensionalArray.push(device.deviceDescription!)
    //         twoDimensionalArray.push(device.iotdeviceCount!.map(d => d.count))
    //         columns.push(twoDimensionalArray)
    //         console.log(columns)
    //     }
    //     console.log(columns)
    // }

    const setChartColumns = async () => {
        await store.arrangeColumns()
    }

    const setXAxisValues = async () => {
        //await store.getXAxisValues()
    }

    //columns = await store.arrangeColumns()/*[['data1', 30, 200, 100, 500, 150, 250], ['data2', 50, 20, 10, 40, 15, 25]]*/

    // const descriptions = store.getDeviceDescriptions();

    return (
        <ReportsStoreContext.Provider value={store}>
            <Paper elevation={7} className={classes.container}>
                <Typography variant='h6'>
                    {store.menuTitle}
                </Typography>
                <Chart columns={store.columns} chartType={"line"} data={descriptions} xAxisValues={store.xAxisValues}/>
            </Paper>
            <ReportsDetail />
        </ReportsStoreContext.Provider>
    )
})