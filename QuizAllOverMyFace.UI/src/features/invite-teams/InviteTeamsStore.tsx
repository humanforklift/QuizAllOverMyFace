import { observable, action, computed, IObservable, IEnhancer } from "mobx"
import { createContext } from "react"
//import { accountClient } from "client/backendclientinstances"
// import { User } from "client/backendclient";
// import { UserLoginRequest } from "client/backendclient";
import { GlobalStore } from "features/shared/stores/GlobalStore";
import FormErrorHandler from "shared-components/input-props/form-error-handler";
import { quizClient } from "client/backendclientinstances";
import { QuizViewModel, QuizTeam, InviteTeamViewModel, TeamInviteRequest } from "client/backendclient";
import { ObservableValue, IObservableFactory } from "mobx/lib/internal";

class InviteTeam {
    @observable emailAddress: string = ''
}

interface InviteTeamsStoreParams {
    globalStore: GlobalStore
    guid?: string;
}

export class InviteTeamsStore {
    constructor(sp: InviteTeamsStoreParams) {
        this.sp = sp
    }

    sp: InviteTeamsStoreParams

    @observable inviteTeams = [] as InviteTeam[]

    @observable teamCount = 0
    @observable quizId = ''
    
    @observable isSaving = false
    @observable invitedSuccessfully = false

    @observable teams = [] as QuizTeam[]
    // @observable newEmail = 

    @observable errorHandler = new FormErrorHandler()

    getQuizIdFromUrl = () => {
        this.quizId = this.sp.guid!
    }

    createTeamsArray = () => {
        this.inviteTeams.push(new InviteTeam())
    }

    @action sendInvites = async () => {
        this.isSaving = true
        try {
            if (await this.validation()) {
                const teamInviteRequest = new TeamInviteRequest({   
                        quizId: this.quizId, 
                        emailAddresses: this.inviteTeams.map(x => x.emailAddress)
                    })
                const response = await quizClient.inviteTeams(teamInviteRequest)
                this.invitedSuccessfully = true
            }
        } catch (error) {
            console.log(error)
        }

        this.isSaving = false
    }

    @action addAdditionalTeam = () => {
        this.inviteTeams.push(new InviteTeam())
    }

    @computed get canAddAnotherTeam() {
        const teamsWithoutEmail = this.inviteTeams.filter(team => team.emailAddress.length < 1)
        return teamsWithoutEmail.length < 1
    }

    checkForDuplicateEmails() {
        const emails = this.inviteTeams.map(x => x.emailAddress)
        const duplicates = emails.filter((item, index) => emails.indexOf(item) != index)

        
    }

    validation = async () => {
        this.errorHandler.reset()

        if (!this.canAddAnotherTeam) {
            this.errorHandler.error("hostName", "All fields are mandatory")
        }
        
        return true
    }

}

//export const BeginActionsStoreContext = createContext(new InviteTeamsStore(new GlobalStore()))