import { Security } from "./Security.class.js";

export class StudyCycle {
  date;
  subjects;
  weeksFullCycle;
  weeksPassed;
  cycleCompleted;

  /**
   * Constructor for initializing the subjects and date.
   *
   * @param {Array} subjects - The array of subjects to be initialized
   */
  constructor(subjects = []) {
    this.subjects = [];

    this.date = new Date().toLocaleDateString();
    this.subjects = subjects;
    this.weeksFullCycle = 0;
    this.weeksPassed = 0;
    this.cycleCompleted = false;
  }

  static init() {
    if (Security.checkUserDiaryStudyingHoursInput()) return;

    StudyCycle.toggleUserDiaryStudyingHoursInput("disabled");
    StudyCycle.toggleStudyCycleCreationContainer();
    StudyCycle.toggleInitStudyCycleBtn();
    StudyCycle.toggleCancelCreateStudyCycleBtn();
  }

  static cancel() {
    StudyCycle.toggleStudyCycleCreationContainer();
    StudyCycle.toggleCancelCreateStudyCycleBtn();
    StudyCycle.toggleInitStudyCycleBtn();
    StudyCycle.toggleUserDiaryStudyingHoursInput("enable");
  }

  static toggleStudyCycleCreationContainer() {
    const studyCycleCreateContainer = document.getElementById(
      "create-study-cycle-container"
    );

    studyCycleCreateContainer.classList.toggle("hidden");
  }

  static toggleCancelCreateStudyCycleBtn() {
    const cancelCreateStudyCycleBtn = document.getElementById(
      "cancel-study-cycle-creation-btn"
    );

    cancelCreateStudyCycleBtn.classList.toggle("hidden");
  }

  static toggleInitStudyCycleBtn() {
    const initCreateStudyCycleBtn = document.getElementById(
      "init-study-cycle-creation-btn"
    );

    initCreateStudyCycleBtn.classList.toggle("hidden");
  }

  static disableInitStudyCycleBtn() {
    const initCreateStudyCycleBtn = document.getElementById(
      "init-study-cycle-creation-btn"
    );

    initCreateStudyCycleBtn.disabled = true;
  }

  static toggleUserDiaryStudyingHoursInput(state) {
    const userDiaryStudyingHoursInput =
      document.getElementById("studying-max-hours");

    userDiaryStudyingHoursInput.disabled = state === "disabled" ? true : false;
  }

  download() {}

  delete() {}

  save() {}

  get info() {
    return {
      date: this.date,
      subjects: this.subjects,
      weeksFullCycle: this.weeksFullCycle,
      weeksPassed: this.weeksPassed,
      cycleCompleted: this.cycleCompleted,
    };
  }
}
