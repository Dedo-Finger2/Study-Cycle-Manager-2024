// [ BOTÕES ] \\

// Botão de confirmação de deleção do ciclo de estudos
const confirmDeleteStudyCycle = document.getElementById(
  "confirm-delete-study-cycle"
);

// Botão que abre o modal de confirmação de deleção
const openDeleteStudyCycleModal = document.getElementById(
  "open-delete-study-cycle-modal"
);

// Botão que exporta o ciclo de estudos para um JSON
const exportAsCsvBtn = document.getElementById("export-as-csv-btn");

// [ MODAIS ] \\

// Modal de confirmação de deleção de ciclo de estudos
const confirmDeleteModal = document.getElementById(
  "confirm-study-cycle-delete-modal"
);

// [ GERAL ] \\

// Mensagem caso não haja ciclo de estudos
const noStudyCycleMsg = document.getElementById("no-study-cycle-msg");

// Mensagem caso o ciclo de estudos seja completo
const completedCycleMsg = document.getElementById("completed-all-subjects-msg");

// [ EVENTOS ] \\

// Evento que baixa o JSON do ciclo de estudos
exportAsCsvBtn.addEventListener("click", exportStudyCycleJson);

// Evento que confirma a deleção do ciclo de estudos
confirmDeleteStudyCycle.addEventListener("click", () => {
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
});

// Quando a página carregar...
document.addEventListener("DOMContentLoaded", () => {
  // Resgata o ciclo de estudos do LocalStorage
  const studyCycle = localStorage.getItem("myStudyCycle");

  // Se houver um ciclo de estudos...
  if (studyCycle) {
    // Verifica se o ciclo de estudos foi concluído, se sim atualiza seu status
    updateStudyCycleStatus();

    // Verifica se o usuário completou o ciclo, se sim então mostrar a mensagem de conclusão
    showCompletedAllSubjectsMsg();

    // Reinicia os valores de horas estudadas pelo usuário das matérias apenas nos domingos
    resetAllSubjectsCurrentHours();

    // Esconde a mensagem que diz que não há ciclo de estudos
    noStudyCycleMsg.classList.add("hidden");

    // Mostra o botão de deleção do ciclo de estudos
    openDeleteStudyCycleModal.classList.remove("hidden");
    // Mostra o botão de exportação em JSON
    exportAsCsvBtn.classList.remove("hidden");

    // Cria um objeto com os dados do ciclo de estudos
    const studyCycleObj = JSON.parse(studyCycle);

    // Container contendo informações do ciclo de estudos
    const studyCycleInfoContainer = document.getElementById("study-cycle-info");

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
          handleAddingHourToSubject(subjectId, subjectHourId);
        } else {
          // Se o checkbox foi desmarcado (unchecked)
          // Chama a função para remover a hora do assunto
          console.log(`Marcação removida para o assunto ${subjectId}`);
          handleRemovingHourToSubject(subjectId, subjectHourId);
        }
      });
    });

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
});

// [ FUNÇÕES ] \\

/**
 * Função para manipular a adição de uma hora à agenda semanal de um matéria.
 *
 * @param {number} subjectId - O ID do matéria
 * @param {number} subjectHourId - O ID da hora do matéria
 */
function handleAddingHourToSubject(subjectId, subjectHourId) {
  let studyCycleObj = JSON.parse(localStorage.getItem("myStudyCycle")); // Objeto que armazena o ciclo de estudos
  const subjects = Object.values(studyCycleObj)[0]; // Matérias do ciclo de estudos

  subjects.forEach((subject) => {
    // Loop para encontrar a matéria desejada
    if (subject.id === Number(subjectId)) {
      // Se a matéria for encontrada
      if (subjectHourId <= subject.maxHoursAWeek) {
        // Se a hora não ultrapassar a hora máxima por semana
        subject.currentWeekHours++; // Adiciona uma hora à agenda semanal da matéria
        updateStatus(subject); // Atualiza o status da matéria
        localStorage.setItem("myStudyCycle", JSON.stringify(studyCycleObj)); // Salva a alteração no ciclo de estudos no LocalStorage
        console.log(subject); // Exibe a matéria no console
      }
    }
  });

  localStorage.setItem(`subject-${subjectId}-${subjectHourId}-hour`, "checked"); // Marca a hora da matéria como adicionada no LocalStorage
}

/**
 * Remove a hora especificada do ciclo de estudos e atualiza o LocalStorage.
 *
 * @param {number} subjectId - O ID da matéria
 * @param {number} subjectHourId - O ID da hora da matéria
 */
function handleRemovingHourToSubject(subjectId, subjectHourId) {
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
        updateStatus(subject);
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

/**
 * Atualiza o status de um assunto com base nas horas da semana atual e nas horas máximas por semana.
 *
 * @param {Object} assunto - O objeto do assunto para atualizar o status
 * @return {void}
 */
function updateStatus(subject) {
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

/**
 * Atualiza o status do ciclo de estudos com base nas horas do usuário e nas horas máximas por semana para cada matéria.
 */
function updateStudyCycleStatus() {
  // Obtém o objeto do ciclo de estudos a partir do LocalStorage
  const studyCycleObj = JSON.parse(localStorage.getItem("myStudyCycle"));
  // Obtém a lista de matérias do ciclo de estudos
  const subjects = Object.values(studyCycleObj)[0];

  // Variáveis para armazenar a soma das horas agendadas e máximas das matérias
  let sumWeekHours = 0;
  let sumUserHours = 0;

  // Loop para percorrer as matérias
  subjects.forEach((subject) => {
    // Soma as horas agendadas e máximas
    sumUserHours += subject.currentWeekHours;
    sumWeekHours += subject.maxHoursAWeek;
  });

  // Verifica se as horas agendadas excedem as horas máximas
  // Se sim, define o ciclo de estudos como completo, caso contrário, define como incompleto
  if (sumUserHours >= sumWeekHours) {
    studyCycleObj.cycleCompleted = true;
  } else {
    studyCycleObj.cycleCompleted = false;
  }

  // Salva o objeto no LocalStorage
  localStorage.setItem("myStudyCycle", JSON.stringify(studyCycleObj));
}

/**
 * Função para exibir uma mensagem para matérias com ciclo de estudos concluídos.
 *
 * @param {type} paramName - descrição do parâmetro
 * @return {type} descrição do valor de retorno
 */
function showCompletedAllSubjectsMsg() {
  const studyCycleObj = JSON.parse(localStorage.getItem("myStudyCycle"));

  if (studyCycleObj.cycleCompleted === true) {
    completedCycleMsg.classList.remove("hidden");
  } else {
    completedCycleMsg.classList.add("hidden");
  }
}

/**
 * Reseta as horas atuais para todas as matérias no ciclo de estudos com base na data atual.
 */
function resetAllSubjectsCurrentHours() {
  // Obtém o objeto do ciclo de estudos do LocalStorage
  const studyCycleObj = JSON.parse(localStorage.getItem("myStudyCycle"));

  // Obtém a lista de matérias do ciclo de estudos
  const subjects = Object.values(studyCycleObj)[0];

  // Obtém a data atual
  const currentDate = new Date();

  // Verifica se é um domingo (dia de semana 0)
  if (currentDate.getDay() === 0) {
    // Zera as horas agendadas para cada matéria
    subjects.forEach((subject) => {
      subject.currentWeekHours = 0;
    });

    // Atualiza a data do ciclo de estudos para a data atual
    const keys = Object.keys(studyCycleObj);
    studyCycleObj[keys[0]] = currentDate.toLocaleDateString();

    // Define o ciclo de estudos como não concluído
    studyCycleObj.cycleCompleted = false;

    // Incrementa o número de semanas passadas
    studyCycleObj.weeksPassed++;

    // Se o ciclo de estudos está completo, incremente o número de semanas do ciclo completo
    if (studyCycleObj.cycleCompleted === true) {
      studyCycleObj.weeksFullCycle++;
    }

    // Salva o objeto no LocalStorage
    localStorage.setItem("myStudyCycle", JSON.stringify(studyCycleObj));
  }
}

/**
 * Exporta os dados do ciclo de estudos para um arquivo JSON.
 */
function exportStudyCycleJson() {
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
