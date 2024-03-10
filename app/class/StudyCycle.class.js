import { Security } from "./Security.class.js";
import { Subject } from "./Subject.class.js";

export class StudyCycle {
  static totalWeights = 0;
  static globalId = 1;
  static todaysFormattedDate = new Date().toLocaleDateString("pt-BR");
  static sumWeekHours = 0;
  static sumUserHours = 0;

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
    StudyCycle.sumAllSubjectWeights();

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

  static sumAllSubjectWeights() {
    const weightInputs = document.querySelectorAll('input[id*="weight"]');

    // Para cada input de peso, adicionar seu valor na variável "totalWeights"
    weightInputs.forEach((weightInput) => {
      StudyCycle.totalWeights += Number(weightInput.value);
    });
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

  static toggleNoStudyCycleMsgSecondPage() {
    const noStudyCycleMsg = document.getElementById("no-study-cycle-msg");

    noStudyCycleMsg.classList.toggle("hidden");
  }

  static toggleExportStudyCycleBtn() {
    const exportAsCsvBtn = document.getElementById("export-as-csv-btn");

    exportAsCsvBtn.classList.toggle("hidden");
  }

  static toggleDeleteStudyCycleBtn() {
    const openDeleteStudyCycleModal = document.getElementById(
      "open-delete-study-cycle-modal"
    );

    openDeleteStudyCycleModal.classList.toggle("hidden");
  }

  static toggleShowMessageNoStudyCycleOrTheStudyCycleInfo() {
    const noStudyCycleContainer = document.getElementById(
      "no-study-cycle-container"
    );
    const studyCycleInfoContainer = document.getElementById("study-cycle-info");

    noStudyCycleContainer.classList.toggle("hidden");
    studyCycleInfoContainer.classList.toggle("hidden");
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

    const userWeeklyStudyingHours =
      Number(userDiaryStudyingHoursInput.value) * 7;
    const multiplierValue = Number(
      (userWeeklyStudyingHours / StudyCycle.totalWeights).toFixed(2)
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

  static download() {
    // Obtém o objeto do ciclo de estudos do LocalStorage
    const studyCycleObj = JSON.parse(localStorage.getItem("myStudyCycle"));
    // Obtém a configuração do ciclo de estudos do LocalStorage
    const studyCycleConfig = JSON.parse(
      localStorage.getItem("myStudyCycleUserConfig")
    );

    // Obtém a data atual como string no formato local
    const currentDate = new Date().toLocaleDateString();

    // Cria um novo objeto combinando o ciclo de estudos e a configuração do usuário,
    // utilizando a sintaxe spread para mesclar as propriedades
    const exportObj = {
      ...studyCycleObj,
      ...studyCycleConfig,
    };

    // Cria um objeto Blob com o conteúdo do objeto JSON exportado, com a formatação de indentação de 2 espaços
    const exportFile = new Blob([JSON.stringify(exportObj, null, 2)], {
      type: "application/json",
    });

    // Chama a função saveAs do pacote file-saver para salvar o arquivo JSON
    // O nome do arquivo será "myStudyCycle-dataAtual.json", onde dataAtual é a data atual no formato local
    saveAs(exportFile, `myStudyCycle-${currentDate}.json`);
  }

  static delete() {
    const confirmDeleteModal = document.getElementById(
      "confirm-study-cycle-delete-modal"
    );

    // Remove o ciclo de estudos do LocalStorage
    localStorage.removeItem("myStudyCycle");

    // Remove o config do usuário do LocalStorage
    localStorage.removeItem("myStudyCycleUserConfig");

    // Remove todas as matérias que foram marcadas do LocalStorage
    for (let key in localStorage) {
      if (key.startsWith("subject-")) {
        localStorage.removeItem(key);
      }
    }

    // Fecha o modal
    confirmDeleteModal.close();

    // Recarrega a página
    window.location.reload();
  }

  static showCompletedStudyCycleSubjectsMsg() {
    const studyCycleObj = JSON.parse(localStorage.getItem("myStudyCycle"));
    const completedCycleMsg = document.getElementById(
      "completed-all-subjects-msg"
    );

    if (studyCycleObj.cycleCompleted === true) {
      completedCycleMsg.classList.remove("hidden");
    } else {
      completedCycleMsg.classList.add("hidden");
    }
  }

  static showStudyCycleSubjects() {
    if (Security.checkIfStudyCycleExists()) {
      const studyCycle = localStorage.getItem("myStudyCycle");

      StudyCycle.updateStatus();

      StudyCycle.weeklyUserHoursAutoReset();

      StudyCycle.toggleNoStudyCycleMsgSecondPage();

      StudyCycle.showCompletedStudyCycleSubjectsMsg();

      // Toggle os botoes de download e delete
      StudyCycle.toggleDeleteStudyCycleBtn();
      StudyCycle.toggleExportStudyCycleBtn();

      const studyCycleObj = JSON.parse(studyCycle);

      const studyCycleInfoContainer =
        document.getElementById("study-cycle-info");

      // Itera sobre cada data (chave) no objeto "studyCycleObj"
      for (const date in studyCycleObj) {
        // Verifica se a data contém "/", indicando que é uma data válida
        if (date.includes("/")) {
          // Obtém a lista de assuntos da data atual
          const dataList = studyCycleObj[date];

          // Cria um elemento h2 para exibir a data atual
          const dateTitle = document.getElementById("study-cycle-date");
          dateTitle.textContent = date;

          // Cria um elemento span para exibir o número de semanas passadas
          const weeksPassed = document.getElementById("weeks-passed");
          weeksPassed.textContent = `Passed Weeks: ${studyCycleObj.weeksPassed}`;

          // Cria um elemento span para exibir o número de semanas em um ciclo completo
          const weeksFullCycle = document.getElementById("weeks-full-cycle");
          weeksFullCycle.textContent = `Completed Cycles: ${studyCycleObj.weeksFullCycle}`;

          // Cria um elemento span para exibir a data de início
          const startedAtDateSpan = document.getElementById("started-at-date");
          startedAtDateSpan.textContent = `Started At: ${studyCycleObj.startedAt}`;

          // Container com todos os assuntos
          const subjectsContainer = document.getElementById("subjects");

          // Itera sobre cada assunto na lista de assuntos da data atual
          dataList.forEach((subject) => {
            // Cria um elemento div para envolver cada assunto
            const subjectDiv = document.createElement("div");
            subjectDiv.id = `subject-${subject.id}-container`;
            subjectDiv.classList.add("flex", "flex-col", "gap-2");

            const labelAndStatusContainer = document.createElement("div");
            labelAndStatusContainer.id = `subject-${subject.id}-label-and-status-container`;
            labelAndStatusContainer.classList.add("flex", "flex-row", "gap-2");

            // Cria um elemento span para exibir o nome do assunto
            const subjectName = document.createElement("span");
            subjectName.id = `subject-${subject.id}-name`;
            subjectName.classList.add("font-bold");
            subjectName.textContent = subject.name;

            // Container com todas as checkboxes input
            const checkboxContainer = document.createElement("div");
            checkboxContainer.id = `subject-${subject.id}-checkboxes-container`;
            checkboxContainer.classList.add("flex", "flex-row", "gap-2");

            // Cria um elemento span para exibir o status do assunto
            const subjectStatus = document.createElement("span");
            subjectStatus.textContent = subject.status;
            subjectStatus.id = `subject-${subject.id}-status`;
            subjectStatus.classList.add("text-xs", "font-semibold");

            // Ícone do status
            const statusIcon = document.createElement("div");
            statusIcon.id = `subject-${subject.id}-status-icon`;
            statusIcon.classList.add("size-2", "rounded-full");

            // Container que tem o Ícone e o status
            const statusAndIconContainer = document.createElement("div");
            statusAndIconContainer.classList.add(
              "flex",
              "flex-row",
              "gap-2",
              "border",
              "rounded-full",
              "py-[.5px]",
              "px-2",
              "items-center"
            );
            statusAndIconContainer.id = `subject-${subject.id}-status-and-icon-container`;

            if (subject.status === "Done") {
              statusIcon.classList.remove("bg-red-500");
              subjectStatus.classList.remove("text-red-500");
              statusAndIconContainer.classList.remove("border-red-500");

              statusIcon.classList.add("bg-green-500");
              subjectStatus.classList.add("text-green-500");
              statusAndIconContainer.classList.add("border-green-500");
            } else {
              statusIcon.classList.remove("bg-green-500");
              subjectStatus.classList.remove("text-green-500");
              statusAndIconContainer.classList.remove("border-green-500");

              statusIcon.classList.add("bg-red-500");
              subjectStatus.classList.add("text-red-500");
              statusAndIconContainer.classList.add("border-red-500");
            }

            statusAndIconContainer.appendChild(statusIcon);
            statusAndIconContainer.appendChild(subjectStatus);

            labelAndStatusContainer.appendChild(subjectName);
            labelAndStatusContainer.appendChild(statusAndIconContainer);

            subjectDiv.appendChild(labelAndStatusContainer);

            subjectsContainer.appendChild(subjectDiv);
            studyCycleInfoContainer.appendChild(subjectsContainer);

            // Itera sobre cada hora do assunto
            for (let index = 1; index <= subject.maxHoursAWeek; index++) {
              // Cria um elemento checkbox para cada hora do assunto
              const checkbox = document.createElement("input");
              checkbox.type = "checkbox";
              checkbox.name = `subject-${subject.id}-${index}-hour`;
              checkbox.id = `subject-${subject.id}`;
              checkbox.value = 1;

              checkboxContainer.appendChild(checkbox);
              subjectDiv.appendChild(checkboxContainer);
            }
          });
        }
      }

      StudyCycle.subjectSaveCheckedCheckboxes();

      StudyCycle.loadCheckedCheckboxes();
    } else {
      StudyCycle.toggleShowMessageNoStudyCycleOrTheStudyCycleInfo();
    }
  }

  static subjectSaveCheckedCheckboxes() {
    // Seletor de todos os inputs do tipo checkbox na página
    const checkboxInputs = document.querySelectorAll('input[type="checkbox"]');

    // Cria um event listener para cada checkbox
    checkboxInputs.forEach((checkbox) => {
      // Quando o checkbox é alterado (checked ou unchecked)
      checkbox.addEventListener("change", (event) => {
        // Extrai o ID do assunto e a ID da hora do checkbox alterado
        const subjectId = event.target.name.split("-")[1];
        const subjectHourId = event.target.name.split("-")[2];

        // Se o checkbox foi marcado (checked)
        if (checkbox.checked) {
          // Chama a função para adicionar a hora ao assunto
          console.log(`Marcação adicionada para o assunto ${subjectId}`);
          Subject.addCurrentWeekHours(subjectId, subjectHourId);
        } else {
          // Se o checkbox foi desmarcado (unchecked)
          // Chama a função para remover a hora do assunto
          console.log(`Marcação removida para o assunto ${subjectId}`);
          Subject.removeCurrentWeekHours(subjectId, subjectHourId);
        }
      });
    });
  }

  static loadCheckedCheckboxes() {
    const studyCycleObj = JSON.parse(localStorage.getItem("myStudyCycle"));

    const checkboxInputs = document.querySelectorAll('input[type="checkbox"]');

    // Verifica se o checkbox está marcado na inicialização da página
    checkboxInputs.forEach((checkbox) => {
      const subjectId = checkbox.name.split("-")[1];
      const subjectHourId = checkbox.name.split("-")[2];

      const subjectFound = Subject.getById(subjectId);

      // Se o checkbox está marcado na localStorage
      if (
        localStorage.getItem(`subject-${subjectId}-${subjectHourId}-hour`) ===
          "checked" &&
        subjectFound?.currentWeekHours > 0
      ) {
        // Marca o checkbox
        checkbox.checked = true;
      } else {
        checkbox.checked = false;
        console.log("reset de domingo");
      }
    });
  }

  static updateStatus() {
    // Obtém o objeto do ciclo de estudos a partir do LocalStorage
    const studyCycleObj = JSON.parse(localStorage.getItem("myStudyCycle"));
    // Obtém a lista de matérias do ciclo de estudos
    const subjects = Object.values(studyCycleObj)[0];

    console.log(studyCycleObj);

    // Loop para percorrer as matérias
    subjects.forEach((subject) => {
      // Soma as horas agendadas e máximas
      StudyCycle.sumUserHours += subject.currentWeekHours;
      StudyCycle.sumWeekHours += subject.maxHoursAWeek;
    });

    // Verifica se as horas agendadas excedem as horas máximas
    // Se sim, define o ciclo de estudos como completo, caso contrário, define como incompleto
    if (StudyCycle.sumUserHours >= StudyCycle.sumWeekHours) {
      studyCycleObj.cycleCompleted = true;
    } else {
      studyCycleObj.cycleCompleted = false;
    }

    StudyCycle.saveStudyCycle(studyCycleObj);
  }

  static weeklyUserHoursAutoReset() {
    // Obtém o objeto do ciclo de estudos do LocalStorage
    const studyCycleObj = JSON.parse(localStorage.getItem("myStudyCycle"));

    // Obtém a lista de matérias do ciclo de estudos
    const subjects = Object.values(studyCycleObj)[0];

    // Obtém a data atual
    const currentDate = new Date();
    const currentDateFormatted = currentDate.toLocaleDateString();

    // Verifica se é um domingo (dia de semana 0)
    if (
      currentDate.getDay() === 0 &&
      StudyCycle.lastTimeStudyCycleReset !== currentDateFormatted
    ) {
      // Zera as horas agendadas para cada matéria
      subjects.forEach((subject) => {
        subject.currentWeekHours = 0;
      });

      // Atualiza a data do ciclo de estudos para a data atual
      // const keys = Object.keys(studyCycleObj);
      // studyCycleObj[keys[0]] = currentDate.toLocaleDateString();

      // Incrementa o número de semanas passadas
      studyCycleObj.weeksPassed++;

      // Se o ciclo de estudos está completo, incremente o número de semanas do ciclo completo
      if (studyCycleObj.cycleCompleted === true) {
        studyCycleObj.weeksFullCycle++;
        // Define o ciclo de estudos como não concluído
        studyCycleObj.cycleCompleted = false;
      }

      // Salva o objeto no LocalStorage
      StudyCycle.saveStudyCycle(studyCycleObj);

      localStorage.setItem("lastTimeStudyCycleResetAt", currentDateFormatted);

      console.log("Weekly user hours reset");

      StudyCycle.loadCheckedCheckboxes();
      StudyCycle.updateStatus();
    }
  }

  static get lastTimeStudyCycleReset() {
    return localStorage.getItem("lastTimeStudyCycleResetAt");
  }

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
