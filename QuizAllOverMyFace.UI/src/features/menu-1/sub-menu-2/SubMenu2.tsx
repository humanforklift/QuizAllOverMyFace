import React from 'react'
import Paper from "@material-ui/core/Paper"
import Typography from "@material-ui/core/Typography"
import { useLocalStore, observer } from "mobx-react-lite"
import { SubMenu2Store, SubMenu2StoreContext } from "./SubMenu2Store"
import Button from '@material-ui/core/Button'
import c3 from 'c3'
import Chart from 'features/Chart'

interface SubMenu2Props {
    optionalParam?: string
}

export const SubMenu2 = observer((props: SubMenu2Props) => {
    const store = useLocalStore(sp => new SubMenu2Store(), props)

    const columns = [['data1', 30, 200, 100, 500, 150, 250], ['data2', 50, 20, 10, 40, 15, 25]];

    return (
        <div></div>
        // <SubMenu2StoreContext.Provider value={store}>      
        //     <h1>Title</h1>
        //     <Chart columns={columns} chartType={"line"} />
        //     <h3>More text</h3>
        // </SubMenu2StoreContext.Provider>
    )
})