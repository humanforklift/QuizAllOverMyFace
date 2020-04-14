import { observable, action, computed } from "mobx";
import { createContext } from "react";
import FormErrorHandler from "../../shared-components/input-props/form-error-handler";
import { GlobalStore } from "../shared/stores/GlobalStore";
//import { accountClient } from "client/backendclientinstances";
import { snackbar } from "shared-components/material-ui-modals";

export class ForgotPasswordStore {
  constructor(globalStore?: GlobalStore) {
    this.globalStore = globalStore;
  }
  globalStore?: GlobalStore;

  @observable emailAddress = "";
  @observable modalOpen = false;

  @observable emailIsSending = false;

  @observable errorHandler = new FormErrorHandler();

  @action handleForgotPassword = () => {
    this.modalOpen = true
  };

  @action cancelForgotPassword = () => {
    this.modalOpen = false;
  };

  @computed get toggleForgotPassword() {
    return !!this.modalOpen 
  }

  @action emailResetPasswordLink = async () => {
    this.emailIsSending = true
    try {
      //await accountClient.forgotPassword(this.emailAddress);
      snackbar({ title: "Password reset email sent to your email address", })
      this.modalOpen = false;
    } catch (error) {
      console.log(error);
    }
    this.emailIsSending = false
  };

  @computed get isButtonDisabled() {
    return this.emailAddress.length < 1;
  }
}

export const ForgotPasswordStoreContext = createContext(
  new ForgotPasswordStore()
);
