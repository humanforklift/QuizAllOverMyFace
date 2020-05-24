import { observable, action, computed } from "mobx"
import { createContext } from "react"
import { GlobalStore } from "../shared/stores/GlobalStore"
// import { UserRegisterRequest } from "../../client/backendclient"
// import { usersClient } from "../../client/backendclientinstances"
import FormErrorHandler from "../../shared-components/input-props/form-error-handler"
import { snackbar } from "../../shared-components/material-ui-modals"
import { quizClient } from "../../client/backendclientinstances";
import { QuizViewModel, Quiz } from "../../client/backendclient"

interface WaitingRoomStoreParams {
    globalStore: GlobalStore
    guid?: string;
}

export class WaitingRoomStore {
    constructor(sp: WaitingRoomStoreParams) {
        this.sp = sp
    }

    sp: WaitingRoomStoreParams

    @observable chuckFact = ""
    @observable quiz = new Quiz()

    @action retrieveFact = async () => {
        this.chuckFact = await quizClient.getChuckNorrisFact()
    }

    @action retrieveQuizFromDB = async () => {
        this.quiz = await quizClient.getQuizById(this.sp.guid!)
    }

}

export const WaitingRoomStoreContext = createContext(new WaitingRoomStore({ globalStore: new GlobalStore(), guid: ""}))