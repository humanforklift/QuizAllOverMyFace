import { observable, action, computed } from "mobx";
import { GlobalStore } from "../shared/stores/GlobalStore";
// import {
//   PasswordResetRequest,
//   User,
//   VerifyPasswordReset
// } from "../../client/backendclient";
// import { accountClient } from "../../client/backendclientinstances";
import FormErrorHandler from "shared-components/input-props/form-error-handler";
import { snackbar } from "shared-components/material-ui-modals";

interface ResetPasswordStoreParams {
  globalStore: GlobalStore;
  guid?: string;
  userId?: string;
}
export class ResetPasswordStore {
  constructor(sp: ResetPasswordStoreParams) {
    this.sp = sp;
  }
  sp: ResetPasswordStoreParams;

  @observable currentPassword = "";
  @observable password1 = "";
  @observable password2 = "";

  //@observable user = new User();
  @observable passwordSuccessfullyReset = false;

  @observable errorHandler = new FormErrorHandler();

  @action submitResetPasswordForm = async () => {
    try {
      if (await this.validation()) {
        // if (this.hasUserForgottenPassword) {
        //   this.user = await this.verifyGuidAndId(this.sp.guid!, this.sp.userId!);
        //   await accountClient.resetPasswordWhereCurrentPasswordUnknown(
        //     new VerifyPasswordReset({
        //       user: this.user,
        //       newPassword: this.password2
        //     })
        //   );
        // } else {
        //   await accountClient.resetPassword(
        //     new PasswordResetRequest({
        //       username: this.sp.globalStore.currentUser!.username,
        //       currentPassword: this.currentPassword,
        //       newPassword: this.password2
        //     })
        //   );
        // }
        this.clearInputs();
        snackbar({ title: "Password successfully changed." });
        if (this.hasUserForgottenPassword) {
          this.passwordSuccessfullyReset = true
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  @computed get isButtonDisabled() {
    return this.password1.trim().length < 1 || this.password2.trim().length < 1;
  }

  @computed get isUserAuthenticated() {
    return false
  }

  @computed get hasUserForgottenPassword() {
    return !!this.sp.guid && !!this.sp.userId;
  }

  // method used to validate password resets from clicking email link
  verifyGuidAndId = async (guid: string, userId: string) => {
    // const user = await accountClient.verifyPasswordReset(
    //   this.sp.guid!,
    //   parseInt(this.sp.userId!, 10)
    // );
    // return user;
  };

  clearInputs = () => {
    this.currentPassword = "";
    this.password1 = "";
    this.password2 = "";
  };

  validation = async () => {
    this.errorHandler.reset();

    if (this.password2 !== this.password1) {
      this.errorHandler.error("password2", "Password values don't match");
      return false;
    }

    if (!this.isUserAuthenticated) {
      if (!(!!this.sp.guid && !!this.sp.userId)) {
        this.errorHandler.error(
          "password2",
          "You do not have the required credentials to reset your password while logged out."
        );
        return false;
      }
    }

    // ensure there are no empty input fields
    // we should never get here as submit button should be disabled in UI
    // but user could potentially manually set button to enabled by manipulating HTML, so this is a backup
    if (this.isButtonDisabled) {
      this.errorHandler.error("password2", "All fields are mandatory");
      return false;
    }

    return true;
  };
}

// export const ResetPasswordStoreContext = createContext(
//   new ResetPasswordStore(new GlobalStore())
// );
