import React, { useContext } from "react"
import { Route } from "react-router"
import { observer } from "mobx-react-lite"
import makeStyles from "@material-ui/core/styles/makeStyles"
import { GlobalStoreContext } from "../shared/stores/GlobalStore"

const useStyles = makeStyles(theme =>
    ({
        content: {
            flexGrow: 1
        },
    }),
)

const MainPageRoutes = () => {
    const globalStore = useContext(GlobalStoreContext)
    const classes = useStyles()

    return (
        <>
            {
                globalStore.menuItems.map((menuItem) => {
                    return (menuItem.routes.map((route) => {
                        const RouteComponent = route.component
                        return (
                            <Route key={route.path} path={route.path} exact={route.exact}
                                render={() => (
                                    <React.Fragment>
                                        <div className={classes.content}>
                                            <RouteComponent />
                                        </div>
                                    </React.Fragment>
                                )}
                            />
                        )
                    }))
                })
            }
        </>
    )
}

export default observer(MainPageRoutes)