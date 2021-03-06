import { observable, action, computed } from "mobx"
import { createContext } from "react"
import { GlobalStore } from "../shared/stores/GlobalStore"
// import { UserRegisterRequest } from "../../client/backendclient"
// import { usersClient } from "../../client/backendclientinstances"
import FormErrorHandler from "shared-components/input-props/form-error-handler"
import { snackbar } from "shared-components/material-ui-modals"

export class RegisterStore {
    constructor(globalStore: GlobalStore) {
        this.globalStore = globalStore
    }
    globalStore: GlobalStore

    @observable email = ""
    @observable firstName = ""
    @observable lastName = ""
    @observable password1 = ""
    @observable password2 = ""

    @observable isSaving = false
    @observable userRegisteredSuccessfully = false

    @observable errorHandler = new FormErrorHandler()

    @action submitRegisterForm = async () => {
        this.isSaving = true
        try {
            if (await this.validation()) {
                // const response = await usersClient.register(new UserRegisterRequest({
                //     firstName: this.firstName,
                //     lastName: this.lastName,
                //     emailAddress: this.email,
                //     password: this.password1
                // }))
                this.clearInputs()
                // snackbar({ title: `User ${response.firstName} ${response.lastName} saved successfully` })
                this.userRegisteredSuccessfully = true
            }
            
        } catch (error) {
            //this.error = error
            console.log(error)
        }
        this.isSaving = false
    }

    @computed get isButtonDisabled () {
        return this.firstName.trim().length < 1 
        || this.lastName.trim().length < 1 
        || this.email.trim().length < 1
        || this.password1.trim().length < 1
        || this.password2.trim().length < 1
    }

    clearInputs = () => {
        this.firstName = ''
        this.lastName = ''
        this.email = ''
        this.password1 = ''
        this.password2 = ''
    }

    validation = async () => { 
        this.errorHandler.reset()

        if (this.password2 !== this.password1) {
            this.errorHandler.error("password2", "Password values don't match")
            return false
        }

        // ensure there are no empty input fields
        // we should never get here as submit button should be disabled in UI
        // but user could potentially manually set button to enabled by manipulating HTML, so this is a backup
        if (this.isButtonDisabled) {
            this.errorHandler.error("password2", "All fields are mandatory")
        }

        return true
    }
}

export const RegisterStoreContext = createContext(new RegisterStore(new GlobalStore()))