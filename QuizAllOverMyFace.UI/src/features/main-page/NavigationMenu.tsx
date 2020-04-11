import React, { useContext } from "react"
import { Link } from "react-router-dom"
import { observable } from "mobx"
import { observer, useLocalStore } from "mobx-react-lite"

import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'
import ListSubheader from '@material-ui/core/ListSubheader'

import makeStyles from "@material-ui/core/styles/makeStyles"
import { GlobalStoreContext } from "../shared/stores/GlobalStore"
import MenuIcon from '@material-ui/icons/Menu'

const getPath = () => (window.location.pathname === "/" ? "/sub-menu-1/" : window.location.pathname)
class NavigationMenuStore {
    @observable path = getPath()
}

const useStyles = makeStyles(theme => ({
    list: {
        width: 250,
    },
    listItem: {
        color: 'black',
    }
}))

const NavigationMenu = () => {

    const store = useLocalStore(() => new NavigationMenuStore())
    const globalStore = useContext(GlobalStoreContext)

    const classes = useStyles()

    function click() {
        store.path = getPath()
    }
    function activeRoute(routeName: string) {
        return window.location.pathname.indexOf(routeName) > -1 ? true : false
    }

    let first = true
    const menuItems = globalStore.menuItems.map((menuItem) => {
        let subMenu = (
            <React.Fragment key={menuItem.divisionName}>
                {!first && <Divider />}

                <List
                    subheader={
                        <ListSubheader component="div" id="nested-list-subheader">
                            {menuItem.divisionName}
                        </ListSubheader>
                    }>
                    {menuItem.routes.map((route, index) => {
                        if (route.displaysInMenu) {
                            const IconComponent = route.icon
                            return (
                                <Link to={route.path} key={route.name} >
                                    <ListItem button selected={activeRoute(route.path)}>
                                        <ListItemIcon>
                                            <IconComponent />
                                        </ListItemIcon>

                                        <ListItemText className={classes.listItem} primary={route.name} />

                                    </ListItem>
                                </Link>
                            )
                        }
                        return null
                    })}
                </List>
            </React.Fragment>
        )

        if (first) {
            first = false
        }

        return subMenu
    })

    return (
        <Drawer open={globalStore.drawerOpen} onClose={() => globalStore.drawerOpen = false} onClick={() => globalStore.drawerOpen = false} >
            <div
                className={classes.list}
                role="presentation"
                onClick={click}
                onKeyDown={() => globalStore.drawerOpen = false}
            >
                <List>
                    <ListItem>
                        <ListItemIcon>
                            <MenuIcon onClick={() => globalStore.drawerOpen = false} />
                        </ListItemIcon>
                        <ListItemText primary={"Menu"} />
                    </ListItem>
                </List>
                <Divider />
                {menuItems}
            </div>
        </Drawer>
    )
}
export default observer(NavigationMenu)