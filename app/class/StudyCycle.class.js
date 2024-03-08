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

	init() {
		
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
