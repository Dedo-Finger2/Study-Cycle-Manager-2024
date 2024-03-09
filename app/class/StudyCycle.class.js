import { Security } from "./Security.class.js";
import { Subject } from "./Subject.class.js";

export class StudyCycle {
  static totalWeights = 0;
  static globalId = 1;
  static todaysFormattedDate = new Date().toLocaleDateString("pt-BR");

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

  static create() {
    // Pegando todos os inputs de peso e nome das matérias
    const weightInputs = document.querySelectorAll('input[id*="weight"]');
    const nameInputs = document.querySelectorAll('input[id*="name"]');

    // Para cada input de peso, adicionar seu valor na variável "totalWeights"
    weightInputs.forEach((weightInput) => {
      StudyCycle.totalWeights += Number(weightInput.value);
    });

    // Esconde o container de criação de ciclo de estudos
    StudyCycle.toggleStudyCycleCreationContainer();

    // Some com o botão de cancelar a criação do ciclo de estudos
    StudyCycle.toggleCancelCreateStudyCycleBtn();
    // Mostra o botão de criação de ciclos de estudos
    StudyCycle.toggleInitStudyCycleBtn();

    // Desabilita o botão de criação de ciclo de estudos
    StudyCycle.disableInitStudyCycleBtn();
    // Desabilita o input de configuração de horas de estudo diário
    StudyCycle.toggleUserDiaryStudyingHoursInput("disabled");

    // Seta o valor do input de multiplicador para o multiplicador encontrado
    StudyCycle.setMultiplier();
    // Seta o valor do input de horas semanais para as horas semanais encontradas
    StudyCycle.setWeeklyStudyHours();

    // Cria um objeto com os dados e salva no LocalStorage
    StudyCycle.createObj();

    // Reseta o ID
    StudyCycle.globalId = 0;

    // Salva as configurações no LocalStorage
    StudyCycle.createStudyCycleConfig();

    StudyCycle.toggleBetweenMessageOrLinkToMyStudyCycle();

    // Mostra o modal de sucesso
    Security.customSuccessModal("Study cycle created successfully!");
  }

  static createObj() {
    // Cria um objeto com as informações do novo ciclo de estudo
    const studyCycleObj = {
      [StudyCycle.todaysFormattedDate]: [], // É aqui que ficam as matérias, a chave é a data de hoje
      cycleCompleted: false, // Indica se o ciclo de estudo foi concluído
      weeksPassed: 0, // Indica quantas semanas o usuário concluiu
      weeksFullCycle: 0, // Indica quantas semanas o ciclo de estudo ficou completo
      startedAt: StudyCycle.todaysFormattedDate, // Data em que o ciclo de estudo foi iniciado
    };

    StudyCycle.addSubjects(studyCycleObj);

    StudyCycle.saveStudyCycle(studyCycleObj);

    console.log(studyCycleObj);
  }

  static addSubjects(studyCycleObj) {
    const nameInputs = document.querySelectorAll('input[id*="name"]');
    const weightInputs = document.querySelectorAll('input[id*="weight"]');

    Subject.resetGlobalId();

    // Para cada input de nome, adiciona um novo objeto ao array
    nameInputs.forEach((nameInput, index) => {
      const newSubject = new Subject(
        nameInput.value,
        Number(weightInputs[index].value)
      );
      studyCycleObj[StudyCycle.todaysFormattedDate].push(newSubject.info);
    });
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

  static setWeeklyStudyHours() {
    const weeklyStudyHoursInput = document.getElementById("weekly-study-hours");
    const userDiaryStudyingHoursInput =
      document.getElementById("studying-max-hours");

    weeklyStudyHoursInput.value = Number(userDiaryStudyingHoursInput.value) * 7;
  }

  static setMultiplier() {
    const multiplierInput = document.getElementById("multiplier");
    const userDiaryStudyingHoursInput =
      document.getElementById("studying-max-hours");

    const userDiaryStudyingHours = Number(userDiaryStudyingHoursInput.value);
    const multiplierValue = Number(
      (userDiaryStudyingHours / StudyCycle.totalWeights).toFixed(2)
    );

    multiplierInput.value = multiplierValue;
  }

  static toggleBetweenMessageOrLinkToMyStudyCycle() {
    const myStudyCycleLink = document.getElementById("my-study-cycle-link");
    const noStudyCycleMsg = document.getElementById("no-study-cycle-msg");

    // Mostra o link que leva até o ciclo de estudos criado
    myStudyCycleLink.classList.toggle("hidden");
    // Esconde a mensagem que diz que não existe ciclo de estudos criado
    noStudyCycleMsg.classList.toggle("hidden");
  }

  static createStudyCycleConfig() {
    const userDiaryStudyingHoursInput =
      document.getElementById("studying-max-hours");
    const weeklyStudyHoursInput = document.getElementById("weekly-study-hours");
    const multiplierInput = document.getElementById("multiplier");

    // Cria um objeto contendo os dados de configuração do ciclo de estudo
    const studyCycleUserConfig = {
      userMaxHours: Number(userDiaryStudyingHoursInput.value),
      weeklyStudyHours: Number(weeklyStudyHoursInput.value),
      multiplier: Number(multiplierInput.value),
    };

    StudyCycle.saveConfig(studyCycleUserConfig);
  }

  download() {}

  delete() {}

  static saveStudyCycle(studyCycleObj) {
    localStorage.setItem("myStudyCycle", JSON.stringify(studyCycleObj));

    console.log("Study cycle saved");
  }

  static saveConfig(studyCycleConfigObj) {
    if (Security.checkConfigBeforeSaving(studyCycleConfigObj)) {
      localStorage.setItem(
        "myStudyCycleUserConfig",
        JSON.stringify(studyCycleConfigObj)
      );

      console.log("Study cycle config saved", studyCycleConfigObj);
    } else {
      return;
    }
  }

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
