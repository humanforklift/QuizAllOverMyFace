import { observable, action, computed, IObservable, IEnhancer } from "mobx"
import { createContext } from "react"
//import { accountClient } from "client/backendclientinstances"
// import { User } from "client/backendclient";
// import { UserLoginRequest } from "client/backendclient";
import { GlobalStore } from "features/shared/stores/GlobalStore";
import FormErrorHandler from "shared-components/input-props/form-error-handler";
import { quizClient } from "client/backendclientinstances";
import { QuizViewModel, QuizTeam, InviteTeamViewModel } from "client/backendclient";
import { ObservableValue, IObservableFactory } from "mobx/lib/internal";

export class InviteTeamsStore {
    constructor(globalStore: GlobalStore) {
        this.globalStore = globalStore
    }
    globalStore: GlobalStore

    @observable email1 = ""
    @observable email2 = ""
    @observable email3 = ""
    @observable email4 = ""
    @observable email5 = ""
    @observable teamCount = 0
    
    @observable isSaving = false
    @observable quizCreatedSuccessfully = false

    @observable inviteTeams = [] as InviteTeamViewModel[]
    @observable teams = [] as QuizTeam[]
    // @observable newEmail = 

    @observable errorHandler = new FormErrorHandler()

    createTeamsArray = () => {
        const team = new QuizTeam({emailAddress: "", points: 0, id: 0})
        this.teams.push(team)
        //let thing = this.teams.length.toString()
        this.inviteTeams.push(new InviteTeamViewModel({email: "", fieldName: this.email1}))
        //this.emails.push(new ))
        this.teamCount = 1
    }

    @action createQuiz = async () => {
        // this.isSaving = true
        // try {
        //     if (await this.validation()) {
        //         const response = await quizClient.createQuiz(new QuizViewModel({
        //             quizHostName: this.hostName,
        //             quizName: this.quizName
        //         }))
        //         this.quizCreatedSuccessfully = true
        //     }
        // } catch (error) {
        //     console.log(error)
        // }

        this.isSaving = false
    }
    
    @computed get isStartQuizDisabled () {
        return this.email1.trim().length < 1
    }

    // createObservable = () => {
    //     let thing = this.teamCount.toString()
    //     @observable email = thing 
    // }

    @action addAdditionalTeam = () => {
        const team = new QuizTeam({emailAddress: "", points: 0, id: 0})
        this.teams.push(team)
        let thing = ''

        if (this.teams.length === 2) {
            thing = this.email2
        } else if (this.teams.length === 3) {
            thing = this.email3
        } else if (this.teams.length === 4) {
            thing = this.email4
        } else if (this.teams.length === 5) {
            thing = this.email5
        }

        this.inviteTeams.push(new InviteTeamViewModel({email: "", fieldName: this.email4}))
        this.teamCount += 1
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

export const BeginActionsStoreContext = createContext(new InviteTeamsStore(new GlobalStore()))