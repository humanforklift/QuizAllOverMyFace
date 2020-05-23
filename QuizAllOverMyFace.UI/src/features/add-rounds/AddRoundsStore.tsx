import { observable, action, computed } from "mobx"
import { createContext } from "react"
//import { accountClient } from "client/backendclientinstances"
// import { User } from "client/backendclient";
// import { UserLoginRequest } from "client/backendclient";
import { GlobalStore } from "../../features/shared/stores/GlobalStore";
import FormErrorHandler from "../../shared-components/input-props/form-error-handler";
import { roundClient, quizClient } from "../../client/backendclientinstances";
import { QuizViewModel, Quiz, Round, Question, RoundViewModel, QuestionViewModel } from "../../client/backendclient";

class ObservableQuestion {
    @observable questionText: string = ''
    @observable questionValue: number = 1
}

interface AddRoundsStoreParams {
    globalStore: GlobalStore
    guid?: string;
}

export class AddRoundsStore {
    constructor(sp: AddRoundsStoreParams) {
        this.sp = sp
    }

    sp: AddRoundsStoreParams

    @observable roundSubject = ""
    @observable numberOfQuestionsInRound = ""
    
    @observable isSaving = false
    @observable roundCreatedSuccessfully = false

    @observable isGuidValid = false

    @observable questions = [] as ObservableQuestion[]

    @observable errorHandler = new FormErrorHandler()
    // @observable round = new Round({id:0, quizId: "", numberOfQuestions:1, questions: [] as Question[]})

    @action saveRound = async () => {
        this.isSaving = true
        try {
            const round = await roundClient.generateEmptyRound(this.sp.guid!);
            if (await this.validation() && round != null) {
                const questionViewModel: QuestionViewModel[] = this.questions.map((x, index) => (new QuestionViewModel({ questionText: x.questionText, pointValue: x.questionValue, questionNumber: index + 1 })))
                round.subject = this.roundSubject
                round.questions = questionViewModel
                //round.quizId = parseInt(this.sp.guid!, 10)
                await roundClient.addRound(round)
                this.roundCreatedSuccessfully = true
            }
            // if (await this.validation()) {
            //     let questionViewModel = new QuestionViewModel[(this.questions.map((x, index) => ({ questionText: x.questionText, pointValue: x.questionValue, questionNumber: index + 1 })))]
            //     const roundViewModel = new RoundViewModel({
            //         subject: this.roundSubject,
            //         questions: questionViewModel
            //     })
            //     const response = await roundClient.addRound()
            //     this.invitedSuccessfully = true
            // }
        } catch (error) {
            console.log(error)
        }

        this.isSaving = false
    }
    
    @computed get guidValid () {
        this.validateGuid()
        return this.isGuidValid
    }
    
    @action validateGuid = async () => {
        this.isGuidValid = await quizClient.validateQuizGuid(this.sp.guid!)
    }

    @action createQuestionsArray = () => {
        this.questions.push(new ObservableQuestion())
    }

    @action addAdditionalQuestion = () => {
        this.questions.push(new ObservableQuestion())
    }

    @computed get canAddAnotherQuestion() {
        const questionsWithoutText = this.questions.filter(q => q.questionText.length < 1)
        return questionsWithoutText.length < 1
    }

    @action removeQuestion = (index: number) => {
        this.questions.splice(index, 1)
    }
    
    @computed get isCreateRoundDisabled () {
        return this.roundSubject.trim().length < 1
        || !this.canAddAnotherQuestion
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

        //TODO - Add error handling for too many questions
        const numberOfQuestions = this.questions.length
        if (numberOfQuestions < 1 || numberOfQuestions > 20) {
            this.errorHandler.error(numberOfQuestions - 1, "Number must be between 1 and 20")
        }

        if (this.isCreateRoundDisabled) {
            this.errorHandler.error("roundSubject", "All fields are mandatory")
        }
        
        return true
    }

}

//export const BeginActionsStoreContext = createContext(new AddRoundsStore(new GlobalStore()))