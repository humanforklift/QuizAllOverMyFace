import { observable, action, computed } from "mobx"
import { createContext } from "react"
//import { accountClient } from "client/backendclientinstances"
// import { User } from "client/backendclient";
// import { UserLoginRequest } from "client/backendclient";
import { GlobalStore } from "features/shared/stores/GlobalStore";




export class BeginActionsStore {
    /**
     *
     */
    constructor(globalStore: GlobalStore) {
        this.globalStore = globalStore
    }
    globalStore: GlobalStore

    @observable username = ""
    @observable password = ""
    //@observable user = new User()
    @observable error = ""

    @action submitLoginForm = async () => {
        try {
            //const user = await accountClient.login(new UserLoginRequest({ username: this.username, password: this.password}))
            //this.globalStore.login(user)
            
        } catch (error) {
            this.error = error
        }
    }

    @computed get isButtonDisabled () {
        return this.username.length < 1 || this.password.length < 1
    }
}

export const LoginStoreContext = createContext(new BeginActionsStore(new GlobalStore()))