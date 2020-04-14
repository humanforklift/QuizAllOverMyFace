import { observable, action } from "mobx"
import { createContext } from "react"

export class SubMenu3Store {
    @observable menuTitle = "This is menu 3"

    @action changeTitle = () => {
        this.menuTitle = "Hey watcha doing?"
    }
}

export const SubMenu3StoreContext = createContext(new SubMenu3Store())