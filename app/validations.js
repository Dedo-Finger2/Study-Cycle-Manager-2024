import { Validation } from "./class/Validation.class.js";

const userDiaryStudyingHoursInput =
  document.getElementById("studying-max-hours");

const container = document.getElementById("subjects");

userDiaryStudyingHoursInput.addEventListener(
  "input",
  Validation.validateUserDiaryStudyingHoursInput
);

container.addEventListener("input", function (event) {
  if (event.target.matches('input[id^="subject-name"]')) {
    Validation.validateSubjectNameInputs(event.target);
  }

  if (event.target.matches('input[id^="subject-weight"]')) {
    Validation.validateSubjectWeightInputs(event.target);
  }
});
