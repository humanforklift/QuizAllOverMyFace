import { observable, action, computed } from "mobx"
import { createContext } from "react"
//import { accountClient } from "client/backendclientinstances"
// import { User } from "client/backendclient";
// import { UserLoginRequest } from "client/backendclient";
import { GlobalStore } from "features/shared/stores/GlobalStore";
import FormErrorHandler from "shared-components/input-props/form-error-handler";
import { quizClient } from "client/backendclientinstances";
import { QuizViewModel, Quiz } from "client/backendclient";




export class BeginActionsStore {
    constructor(globalStore: GlobalStore) {
        this.globalStore = globalStore
    }
    globalStore: GlobalStore

    @observable hostName = ""
    @observable quizName = ""
    
    @observable isSaving = false
    @observable quizCreatedSuccessfully = false

    @observable errorHandler = new FormErrorHandler()
    @observable quiz = new Quiz()

    @action createQuiz = async () => {
        this.isSaving = true
        try {
            if (await this.validation()) {
                this.quiz = await quizClient.createQuiz(new QuizViewModel({
                    quizHostName: this.hostName,
                    quizName: this.quizName
                }))
                this.quizCreatedSuccessfully = true
            }
        } catch (error) {
            console.log(error)
        }

        this.isSaving = false
    }
    
    @computed get isStartQuizDisabled () {
        return this.hostName.trim().length < 1
        || this.quizName.trim().length < 1
    }

    // @computed get isButtonDisabled () {
    //     return this.quizName.trim().length < 1 
    //     || this.numberOfRounds === 0
    //     || this.email.trim().length < 1
    //     || this.password1.trim().length < 1
    //     || this.password2.trim().length < 1
    // }

    validation = async () => {
        this.errorHandler.reset()

        if (this.isStartQuizDisabled) {
            this.errorHandler.error("hostName", "All fields are mandatory")
        }
        
        return true
    }

}

export const BeginActionsStoreContext = createContext(new BeginActionsStore(new GlobalStore()))