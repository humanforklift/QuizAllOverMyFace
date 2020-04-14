import { observable, action } from "mobx"
import { createContext } from "react"

export class SubMenu2Store {
    @observable menuTitle = "This is menu 2"

    @action changeTitle = () => {
        this.menuTitle = "Hey watcha doing?"
    }
}

export const SubMenu2StoreContext = createContext(new SubMenu2Store())