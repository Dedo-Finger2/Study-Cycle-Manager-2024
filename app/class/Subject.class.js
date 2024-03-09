export class Subject {
  static globalId = 1;
  id;
  name;
  weight;
  maxHoursAWeek;
  currentWeekHours;
  status;

  /**
   * A constructor function to initialize the name, weight, and status of an object.
   *
   * @param {string} name - description of parameter
   * @param {number} weight - description of parameter
   */
  constructor(name = undefined, weight = undefined) {
    this.id = Subject.globalId;
    this.name = name;
    this.weight = weight;
    this.currentWeekHours = 0;
    this.status = "Can Study";

    Subject.globalId++;
  }

  addNewSubject() {
    const subjectsContainer = document.getElementById("subjects");
    
    subjectsContainer.appendChild(this.newSubjectContainer);
  }

  get newSubjectContainer() {
    const subjectContainer = document.createElement("div");
    subjectContainer.classList.add(`subject-container-${this.id}`);
    subjectContainer.appendChild(this.nameContainer);
    subjectContainer.appendChild(this.weightContainer);
    subjectContainer.appendChild(this.removeSubjectBtn);

    return subjectContainer;
  }

  get nameContainer() {
    const nameContainer = document.createElement("div");
    nameContainer.appendChild(this.nameLabel);
    nameContainer.appendChild(this.nameInput);

    return nameContainer;
  }

  get nameLabel() {
    const nameLabel = document.createElement("label");
    nameLabel.for = `subject-name-${this.id}`;
    nameLabel.textContent = "Name";

    return nameLabel;
  }

  get nameInput() {
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.required = true;
    nameInput.id = `subject-name-${this.id}`;
    nameInput.placeholder = "Nome da Materia";

    return nameInput;
  }

  get weightContainer() {
    const weightContainer = document.createElement("div");
    weightContainer.appendChild(this.weightLabel);
    weightContainer.appendChild(this.weightInput);

    return weightContainer;
  }

  get weightLabel() {
    const weightLabel = document.createElement("label");
    weightLabel.for = `subject-weight-${this.id}`;
    weightLabel.textContent = "Weight";

    return weightLabel;
  }

  get weightInput() {
    const weightInput = document.createElement("input");
    weightInput.type = "number";
    weightInput.required = true;
    weightInput.id = `subject-weight-${this.id}`;
    weightInput.min = "1";
    weightInput.max = "5";
    weightInput.placeholder = "Peso";

    return weightInput;
  }

  get removeSubjectBtn() {
    const removeSubjectBtn = document.createElement("button");
    removeSubjectBtn.type = "button";
    removeSubjectBtn.textContent = "Remove";
    removeSubjectBtn.classList.add("remove-subject-btn");
    removeSubjectBtn.dataset.subjectContainerId = this.id;

    return removeSubjectBtn;
  }

  /**
   * Setter for the name property.
   *
   * @param {string} value - The new value for the name
   */
  set name(value) {
    this.name = value;
  }

  /**
   * Setter for the weight property.
   *
   * @param {number} value - The new value for the weight
   */
  set weight(value) {
    this.weight = value;
  }

  updateStatus() {}

  static removeSubject() {
    const allRemoveSubjectBtn =
      document.getElementsByClassName("remove-subject-btn");

    if (allRemoveSubjectBtn.length > 0) {
      for (let removeSubjectBtn of allRemoveSubjectBtn) {
        removeSubjectBtn.addEventListener("click", (event) => {
          event.preventDefault();
          event.target.parentNode.remove();
        });
      }
    }
  }

  addCurrentWeekHours() {}

  static resetGlobalId() {
    Subject.globalId = 1;
  }

  get subjectHours() {
    const multiplierInput = document.getElementById("multiplier");

    // Calcula as horas que a matéria pode ser estudada semanalmente
    const hours = this.weight * Number(multiplierInput.value).toFixed(2);

    // Retorna o resultado arrendondado para cima
    return Math.ceil(hours);
  }

  get info() {
    return {
      id: this.id,
      name: this.name,
      weight: this.weight,
      maxHoursAWeek: this.subjectHours,
      currentWeekHours: this.currentWeekHours,
      status: this.status,
    };
  }
}
