export class Validation {
  static validateUserDiaryStudyingHoursInput() {
    const userDiaryStudyingHoursInput =
      document.getElementById("studying-max-hours");
    const validationText = document.getElementById("error-studying-max-hours");

    const initStudyCycleCreationBtn = document.getElementById(
      "init-study-cycle-creation-btn"
    );

    if (userDiaryStudyingHoursInput.value === "") {
      validationText.classList.remove("validation-success");
      validationText.classList.add("validation-error");
      validationText.textContent = "The value cannot be null or empty!";
      initStudyCycleCreationBtn.disabled = true;

      return;
    }

    if (userDiaryStudyingHoursInput.value <= 1) {
      validationText.classList.remove("validation-success");
      validationText.classList.add("validation-error");
      validationText.textContent = "The value must be greater than 1!";
      initStudyCycleCreationBtn.disabled = true;

      return;
    }

    if (userDiaryStudyingHoursInput.value > 24) {
      validationText.classList.remove("validation-success");
      validationText.classList.add("validation-error");
      validationText.textContent = "The value must be less than 24!";
      initStudyCycleCreationBtn.disabled = true;

      return;
    }

    validationText.classList.remove("validation-error");
    validationText.classList.add("validation-success");
    validationText.textContent = "Good!";
    initStudyCycleCreationBtn.disabled = false;
  }

  static validateSubjectNameInputs(input) {
    const validationText = input.nextElementSibling;

    if (input.value.trim() === "") {
      validationText.classList.remove("validation-success");
      validationText.classList.add("validation-error");
      validationText.textContent = "The name cannot be null or empty!";

      return;
    }

    validationText.classList.add("validation-success");
    validationText.classList.remove("validation-error");
    validationText.textContent = "Good!";
  }

  static validateSubjectWeightInputs(input) {
    const validationText = input.nextElementSibling;

    if (input.value.trim() === "") {
      validationText.classList.remove("validation-success");
      validationText.classList.add("validation-error");
      validationText.textContent = "The weight cannot be null or empty!";

      return;
    }

    if (input.value < 1) {
      validationText.classList.remove("validation-success");
      validationText.classList.add("validation-error");
      validationText.textContent = "The weight cannot be less than 1!";

      return;
    }

    if (input.value > 5) {
      validationText.classList.remove("validation-success");
      validationText.classList.add("validation-error");
      validationText.textContent = "The weight cannot be greater than 5!";

      return;
    }

    validationText.classList.add("validation-success");
    validationText.classList.remove("validation-error");
    validationText.textContent = "Good!";
  }
}