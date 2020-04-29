import { observable, action } from "mobx"
import { createContext } from "react"
import React from "react"
import TimelineIcon from '@material-ui/icons/Timeline'
import { cloneObject } from "shared-components/utils/utils"
// import { UserLoginResponse } from "client/backendclient"
//import { userCacheHandler } from "client/auth"
import ResetPassword from "features/reset-password/ResetPassword";
import * as signalR from "@aspnet/signalr";

interface IMenuItem {
    path: string
    name: string
    exact: boolean
    landingPage: boolean;
    component: React.ComponentType
    icon: React.ComponentType
    displaysInMenu: boolean
}
export interface IMenuItemGroup {
    divisionName: string
    icon?: string
    routes: IMenuItem[]
}

const defaultMenuItems: IMenuItemGroup[] = [
    {
        divisionName: "Reports",
        routes: [
            {
                landingPage: false, exact: true, displaysInMenu: false,
                name: "Reset Password", path: "/reset-password/:guid/:userId",
                component: ResetPassword,
                icon: TimelineIcon
            },
            {
                landingPage: false, exact: true, displaysInMenu: false,
                name: "Reset Password", path: "/reset-password/",
                component: ResetPassword,
                icon: TimelineIcon
            },
            // {
            //     landingPage: false, exact: false, displaysInMenu: false, 
            //     name: "Reset Password", path: "/reset-password/",
            //     component: ResetPassword,
            //     icon: TimelineIcon
            // },
        ],
    },
    // {
    //     divisionName: "",
    //     routes: [
    //         {
    //             landingPage: false, exact: false, displaysInMenu: false, 
    //             name: "Reset Password", path: "/reset-password/",
    //             component: ResetPassword,
    //             icon: TimelineIcon
    //         },
    //     ],
    // },
]

export class GlobalStore {

    constructor(load: boolean = true) {
        this.connectToSignalR()
        if (load) {
            this.renderMenuItems()
        }
    }

    @observable menuItems: IMenuItemGroup[] = []
    @observable startNewRound = false
    @observable endRound = true
    @observable hasSignalRInfo = false
    @observable showBanner = false
    @observable signalRConnection: signalR.HubConnection | undefined = undefined

    //@observable currentUser? = userCacheHandler.get()
    // @action logout = () => {
    //     this.currentUser = undefined
    //     userCacheHandler.set(undefined)
    // }
    // @action login = (user: UserLoginResponse) => {
    //     userCacheHandler.set(user)
    //     this.currentUser = user
    // }

    @action private renderMenuItems = () => {
        // ** this can be used to render the menu from an api call
        let newMenuItems: IMenuItemGroup[] = []

        for (const defaultMenuItemGroup of defaultMenuItems) {
            const menuItemGroup = cloneObject(defaultMenuItemGroup)
            menuItemGroup.routes = []
            for (const defaultRoute of defaultMenuItemGroup.routes) {
                if (defaultRoute.landingPage) {
                    const landing = cloneObject(defaultRoute)
                    landing.path = '/'
                    landing.exact = true
                    landing.displaysInMenu = false
                    landing.component = defaultRoute.component
                    landing.icon = defaultRoute.icon
                    menuItemGroup.routes.push(landing)
                }
                const menuItem = cloneObject(defaultRoute)
                menuItem.component = defaultRoute.component
                menuItem.icon = defaultRoute.icon
                menuItemGroup.routes.push(menuItem)
            }
            if (menuItemGroup.routes.length > 0) {
                newMenuItems.push(menuItemGroup)
            }
        }
        this.menuItems = newMenuItems
    }

    @action private connectToSignalR = () => {
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
    
            this.signalRConnection = connection;
    }

    // @action private connectSignalR = () => {

    // }
    /** defines if the menu drawer is open */
    @observable drawerOpen = false
}

export const GlobalStoreContext = createContext(new GlobalStore(false)) // this is to be accessed by the react components