import React, { useContext, useState } from "react"
import { observer } from "mobx-react-lite"
import { GlobalStoreContext } from "../shared/stores/GlobalStore"

import IconButton from "@material-ui/core/IconButton"
import Paper from "@material-ui/core/Paper"
import AccountCircle from '@material-ui/icons/AccountCircle'
import Popper from '@material-ui/core/Popper'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import MenuItem from '@material-ui/core/MenuItem'
import MenuList from '@material-ui/core/MenuList'
import makeStyles from "@material-ui/core/styles/makeStyles"
import { useHistory } from "react-router-dom"

const useStyles = makeStyles(theme => ({
    popper: {
        zIndex: 9999999,
    },
}))

const LoggedUserControl = () => {
    const classes = useStyles()
    const globalStore = useContext(GlobalStoreContext)
    const history = useHistory()
    const anchorRef = React.useRef<HTMLButtonElement>(null)
    const [open, setOpen] = useState(false)

    const resetPassword = () => {
        setOpen(false);
        history.push("/reset-password");
    }
    
    return (
        <>
            <IconButton
                ref={anchorRef}
                color="inherit"
                aria-label="Login"
                onClick={() => setOpen(true)} >
                    
                <AccountCircle />
            </IconButton>

            <Popper open={open} anchorEl={anchorRef.current} className={classes.popper}>
                <Paper>
                    <ClickAwayListener onClickAway={() => setOpen(false)}>
                        <MenuList>
                            {/* <MenuItem key={0} onClick={() => setOpen(false)}>{globalStore.currentUser!.username}</MenuItem> */}
                            <MenuItem key={1} onClick={() => resetPassword()}>Reset Password</MenuItem>
                            {/* <MenuItem key={2} onClick={globalStore.logout}>Logout</MenuItem> */}
                        </MenuList>
                    </ClickAwayListener>
                </Paper>

            </Popper>
        </>
    )
}
export default observer(LoggedUserControl)