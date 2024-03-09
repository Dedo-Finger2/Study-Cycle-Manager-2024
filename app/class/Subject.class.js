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
    nameContainer.appendChild(this.nameSpanValidation);

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

  get nameSpanValidation() {
    const nameSpanValidation = document.createElement("span");
    nameSpanValidation.id = `error-subject-${this.id}-name`;
    nameSpanValidation.textContent = "Type the name of this subject";

    return nameSpanValidation;
  }

  get weightContainer() {
    const weightContainer = document.createElement("div");
    weightContainer.appendChild(this.weightLabel);
    weightContainer.appendChild(this.weightInput);
    weightContainer.appendChild(this.weightSpanValidation);

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

  get weightSpanValidation() {
    const weightSpanValidation = document.createElement("span");
    weightSpanValidation.id = `error-subject-${this.id}-weight`;
    weightSpanValidation.textContent =
      "Type a weight for this subject, higher = more difficulty (1-5)";

    return weightSpanValidation;
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

  static updateStatus(subject) {
    const subjectStatusSpan = document.getElementById(
      `subject-${subject.id}-status`
    );

    if (subject.currentWeekHours >= subject.maxHoursAWeek) {
      subject.status = "Done!";
      subjectStatusSpan.textContent = subject.status;
    } else {
      subject.status = "Can Study";
      subjectStatusSpan.textContent = subject.status;
    }
  }

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

  static addCurrentWeekHours(subjectId, subjectHourId) {
    let studyCycleObj = JSON.parse(localStorage.getItem("myStudyCycle")); // Objeto que armazena o ciclo de estudos
    const subjects = Object.values(studyCycleObj)[0]; // Matérias do ciclo de estudos

    subjects.forEach((subject) => {
      // Loop para encontrar a matéria desejada
      if (subject.id === Number(subjectId)) {
        // Se a matéria for encontrada
        if (subjectHourId <= subject.maxHoursAWeek) {
          // Se a hora não ultrapassar a hora máxima por semana
          subject.currentWeekHours++; // Adiciona uma hora à agenda semanal da matéria

          Subject.updateStatus(subject); // Atualiza o status da matéria

          localStorage.setItem("myStudyCycle", JSON.stringify(studyCycleObj)); // Salva a alteração no ciclo de estudos no LocalStorage
          console.log(subject); // Exibe a matéria no console
        }
      }
    });

    localStorage.setItem(
      `subject-${subjectId}-${subjectHourId}-hour`,
      "checked"
    ); // Marca a hora da matéria como adicionada no LocalStorage
  }

  static removeCurrentWeekHours(subjectId, subjectHourId) {
    let studyCycleObj = JSON.parse(localStorage.getItem("myStudyCycle")); // Objeto que armazena o ciclo de estudos
    const subjects = Object.values(studyCycleObj)[0]; // Matérias do ciclo de estudos

    // Loop para encontrar o assunto desejado
    subjects.forEach((subject) => {
      if (subject.id === Number(subjectId)) {
        // Se a hora não ultrapassar a hora máxima por semana
        if (subjectHourId <= subject.maxHoursAWeek) {
          // Subtrai uma hora à agenda semanal do assunto
          subject.currentWeekHours--;
          // Atualiza o status do assunto
          Subject.updateStatus(subject);
          // Salva a alteração no ciclo de estudos no LocalStorage
          localStorage.setItem("myStudyCycle", JSON.stringify(studyCycleObj));
          // Exibe o assunto no console
          console.log(subject);
        }
      }
    });

    // Remove a marcação do checkbox da localStorage
    localStorage.removeItem(
      `subject-${subjectId}-${subjectHourId}-hour`,
      "checked"
    );
  }

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
