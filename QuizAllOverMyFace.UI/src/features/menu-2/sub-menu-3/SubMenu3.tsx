import React from 'react'
import Paper from "@material-ui/core/Paper"
import Typography from "@material-ui/core/Typography"
import { useLocalStore, observer } from "mobx-react-lite"
import { SubMenu3Store, SubMenu3StoreContext } from "./SubMenu3Store"
import Button from '@material-ui/core/Button'

interface SubMenu3Props {
    optionalParam?: string
}

export const SubMenu3 = observer((props: SubMenu3Props) => {
    const store = useLocalStore(sp => new SubMenu3Store(), props)

    return (
        <SubMenu3StoreContext.Provider value={store}>
            <Paper>
                <Typography variant='h6'>
                    {store.menuTitle}
                </Typography>
                <Button onClick={store.changeTitle} variant="contained" color="primary">
                    Change things
                </Button>

            </Paper>
        </SubMenu3StoreContext.Provider>
    )
})