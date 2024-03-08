export class Security {
  static errorModal = document.getElementById("error-modal");
  static errorModalMessage = document.getElementById("error-modal-message");

  static successModal = document.getElementById("success-modal");
  static successModalMessage = document.getElementById("success-modal-message");

  static checkUserDiaryStudyingHoursInput() {
    const userDiaryStudyingHoursInput =
      document.getElementById("studying-max-hours");

    if (
      userDiaryStudyingHoursInput.value <= 0 ||
      userDiaryStudyingHoursInput.value === ""
    ) {
      Security.errorModalMessage.textContent =
        "Please enter a valid number of hours for the Diary Studying Hours Input!";

      Security.errorModal.showModal();

      return true;
    }

    return false;
  }

  static customSuccessModal(message) {
    Security.successModalMessage.textContent = message;
    Security.successModal.showModal();
  }

  static customErrorModal(message) {
    Security.errorModalMessage.textContent = message;
    Security.errorModal.showModal();
  }
}
