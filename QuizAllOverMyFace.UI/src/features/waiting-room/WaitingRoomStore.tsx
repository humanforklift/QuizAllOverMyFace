import { observable, action, computed } from "mobx"
import { createContext } from "react"
import { GlobalStore } from "../shared/stores/GlobalStore"
// import { UserRegisterRequest } from "../../client/backendclient"
// import { usersClient } from "../../client/backendclientinstances"
import FormErrorHandler from "../../shared-components/input-props/form-error-handler"
import { snackbar } from "../../shared-components/material-ui-modals"
import { quizClient } from "../../client/backendclientinstances";
import { QuizViewModel } from "../../client/backendclient"

export class WaitingRoomStore {
    constructor(globalStore: GlobalStore) {
        this.globalStore = globalStore
    }
    globalStore: GlobalStore

    @observable chuckFact = ""

    @action retrieveFact = async () => {
        this.chuckFact = await quizClient.getChuckNorrisFact()
    }

}

export const RegisterStoreContext = createContext(new WaitingRoomStore(new GlobalStore()))