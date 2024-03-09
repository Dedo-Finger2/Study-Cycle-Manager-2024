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

          // Cria um elemento div para envolver os dados da data atual
          const studyCycleData = document.createElement("div");
          studyCycleData.id = "study-cycle-data";

          // Cria um elemento h2 para exibir a data atual
          const dateTitle = document.createElement("h2");
          dateTitle.textContent = date;

          // Cria um elemento span para exibir o número de semanas passadas
          const weeksPassed = document.createElement("span");
          weeksPassed.id = "weeks-passed";
          weeksPassed.textContent = `Semanas Passadas: ${studyCycleObj.weeksPassed}`;

          // Cria um elemento span para exibir o número de semanas em um ciclo completo
          const weeksFullCycle = document.createElement("span");
          weeksFullCycle.id = "weeks-full-cycle";
          weeksFullCycle.textContent = `Ciclo Completo de Semanas: ${studyCycleObj.weeksFullCycle}`;

          // Cria um elemento span para exibir a data de início
          const startedAtDateSpan = document.createElement("span");
          startedAtDateSpan.id = "started-at-date";
          startedAtDateSpan.textContent = `Iniciado Em: ${studyCycleObj.startedAt}`;

          // Cria elementos br para adicionar espaçamento
          const breakBetweenWeeksSpans = document.createElement("br");
          const breakBetweenWeeksSpanAndStartedDate =
            document.createElement("br");
          const breakBetweenWeeksAndSubjects = document.createElement("br");

          // Adiciona os elementos ao elemento studyCycleData
          studyCycleData.appendChild(dateTitle);
          studyCycleData.appendChild(startedAtDateSpan);
          studyCycleData.appendChild(breakBetweenWeeksSpanAndStartedDate);
          studyCycleData.appendChild(weeksPassed);
          studyCycleData.appendChild(breakBetweenWeeksSpans);
          studyCycleData.appendChild(weeksFullCycle);

          // Adiciona o elemento studyCycleData ao container de informações de estudos
          studyCycleInfoContainer.appendChild(studyCycleData);
          studyCycleInfoContainer.appendChild(breakBetweenWeeksAndSubjects);

          // Itera sobre cada assunto na lista de assuntos da data atual
          dataList.forEach((subject) => {
            // Cria um elemento div para envolver cada assunto
            const subjectDiv = document.createElement("div");

            // Cria um elemento span para exibir o nome do assunto
            const subjectName = document.createElement("span");
            subjectName.textContent = subject.name;

            subjectDiv.appendChild(subjectName);

            // Itera sobre cada hora do assunto
            for (let index = 1; index <= subject.maxHoursAWeek; index++) {
              // Cria um elemento checkbox para cada hora do assunto
              const checkbox = document.createElement("input");
              checkbox.type = "checkbox";
              checkbox.name = `subject-${subject.id}-${index}-hour`;
              checkbox.id = `subject-${subject.id}`;
              checkbox.value = 1;

              subjectDiv.appendChild(checkbox);
            }

            // Cria um elemento span para exibir o status do assunto
            const subjectStatus = document.createElement("span");
            subjectStatus.textContent = subject.status;
            subjectStatus.id = `subject-${subject.id}-status`;
            subjectDiv.appendChild(subjectStatus);

            // Cria um elemento br para adicionar espaçamento
            const br = document.createElement("br");
            studyCycleInfoContainer.appendChild(subjectDiv);
            studyCycleInfoContainer.appendChild(br);
          });
        }
      }

      StudyCycle.subjectSaveCheckedCheckboxes();

      StudyCycle.loadCheckedCheckboxes();
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
    const checkboxInputs = document.querySelectorAll('input[type="checkbox"]');

    // Verifica se o checkbox está marcado na inicialização da página
    checkboxInputs.forEach((checkbox) => {
      const subjectId = checkbox.name.split("-")[1];
      const subjectHourId = checkbox.name.split("-")[2];

      // Se o checkbox está marcado na localStorage
      if (
        localStorage.getItem(`subject-${subjectId}-${subjectHourId}-hour`) ===
        "checked"
      ) {
        // Marca o checkbox
        checkbox.checked = true;
      }
    });
  }

  static updateStatus() {
    // Obtém o objeto do ciclo de estudos a partir do LocalStorage
    const studyCycleObj = JSON.parse(localStorage.getItem("myStudyCycle"));
    // Obtém a lista de matérias do ciclo de estudos
    const subjects = Object.values(studyCycleObj)[0];

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
      const keys = Object.keys(studyCycleObj);
      studyCycleObj[keys[0]] = currentDate.toLocaleDateString();

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
