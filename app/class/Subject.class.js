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
    subjectContainer.appendChild(this.adjustSpacingBetweenInputsContainer);

    return subjectContainer;
  }

  get adjustSpacingBetweenInputsContainer() {
    const adjustSpacingBetweenInputsContainer = document.createElement("div");
    adjustSpacingBetweenInputsContainer.classList.add(
      "flex",
      "flex-col",
      "gap-4"
    );
    adjustSpacingBetweenInputsContainer.appendChild(this.nameContainer);
    adjustSpacingBetweenInputsContainer.appendChild(this.weightContainer);
    adjustSpacingBetweenInputsContainer.appendChild(this.removeSubjectBtn);

    return adjustSpacingBetweenInputsContainer;
  }

  get nameContainer() {
    const nameContainer = document.createElement("div");
    nameContainer.classList.add("flex", "flex-col", "gap-2");
    nameContainer.appendChild(this.nameLabel);
    nameContainer.appendChild(this.nameInput);
    nameContainer.appendChild(this.nameSpanValidation);

    return nameContainer;
  }

  get nameLabel() {
    const nameLabel = document.createElement("label");
    nameLabel.for = `subject-name-${this.id}`;
    nameLabel.textContent = "Name";
    nameLabel.classList.add("font-semibold");

    return nameLabel;
  }

  get nameInput() {
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.required = true;
    nameInput.id = `subject-name-${this.id}`;
    nameInput.placeholder = "Nome da Materia";
    nameInput.classList.add(
      "border",
      "border-sky-700",
      "py-1",
      "px-2",
      "rounded",
      "transition-all",
      "ease-in-out",
      "font-medium",
      "focus:outline-sky-600"
    );

    return nameInput;
  }

  get nameSpanValidation() {
    const nameSpanValidation = document.createElement("span");
    nameSpanValidation.id = `error-subject-${this.id}-name`;
    nameSpanValidation.textContent = "Type the name of this subject";
    nameSpanValidation.classList.add("text-sm", "italic", "text-gray-500");

    return nameSpanValidation;
  }

  get weightContainer() {
    const weightContainer = document.createElement("div");
    weightContainer.classList.add("flex", "flex-col", "gap-2");
    weightContainer.appendChild(this.weightLabel);
    weightContainer.appendChild(this.weightInput);
    weightContainer.appendChild(this.weightSpanValidation);

    return weightContainer;
  }

  get weightLabel() {
    const weightLabel = document.createElement("label");
    weightLabel.for = `subject-weight-${this.id}`;
    weightLabel.textContent = "Weight";
    weightLabel.classList.add("font-semibold");

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
    weightInput.classList.add(
      "border",
      "border-sky-700",
      "py-1",
      "px-2",
      "rounded",
      "transition-all",
      "ease-in-out",
      "font-medium",
      "focus:outline-sky-600"
    );

    return weightInput;
  }

  get weightSpanValidation() {
    const weightSpanValidation = document.createElement("span");
    weightSpanValidation.id = `error-subject-${this.id}-weight`;
    weightSpanValidation.textContent =
      "Type a weight for this subject, higher = more difficulty (1-5)";
    weightSpanValidation.classList.add("text-sm", "italic", "text-gray-500");

    return weightSpanValidation;
  }

  get removeSubjectBtn() {
    const removeSubjectBtn = document.createElement("button");
    removeSubjectBtn.type = "button";
    removeSubjectBtn.textContent = "Remove";
    removeSubjectBtn.classList.add("remove-subject-btn");
    removeSubjectBtn.dataset.subjectContainerId = this.id;
    removeSubjectBtn.classList.add(
      "text-sky-50",
      "bg-red-500",
      "p-2",
      "rounded",
      "text-sm",
      "font-bold",
      "shadow-md",
      "transition-all",
      "ease-in-out",
      "hover:bg-red-600",
      "mt-3"
    );

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

    const subjectStatus = document.getElementById(
      `subject-${subject.id}-status`
    );
    const statusIcon = document.getElementById(
      `subject-${subject.id}-status-icon`
    );
    const statusAndIconContainer = document.getElementById(
      `subject-${subject.id}-status-and-icon-container`
    );

    if (subject.currentWeekHours >= subject.maxHoursAWeek) {
      subject.status = "Done";
      subjectStatusSpan.textContent = subject.status;

      statusIcon.classList.remove("bg-red-500");
      subjectStatus.classList.remove("text-red-500");
      statusAndIconContainer.classList.remove("border-red-500");

      statusIcon.classList.add("bg-green-500");
      subjectStatus.classList.add("text-green-500");
      statusAndIconContainer.classList.add("border-green-500");
    } else {
      subject.status = "Can Study";
      subjectStatusSpan.textContent = subject.status;

      statusIcon.classList.remove("bg-green-500");
      subjectStatus.classList.remove("text-green-500");
      statusAndIconContainer.classList.remove("border-green-500");

      statusIcon.classList.add("bg-red-500");
      subjectStatus.classList.add("text-red-500");
      statusAndIconContainer.classList.add("border-red-500");
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
