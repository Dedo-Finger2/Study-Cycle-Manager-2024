import { StudyCycle } from "./class/StudyCycle.class.js";

// [ BOTÕES ] \\

// Botão de confirmação de deleção do ciclo de estudos
const confirmDeleteStudyCycle = document.getElementById(
  "confirm-delete-study-cycle"
);

// Botão que exporta o ciclo de estudos para um JSON
const exportAsCsvBtn = document.getElementById("export-as-csv-btn");

// [ EVENTOS ] \\

// Evento que baixa o JSON do ciclo de estudos
exportAsCsvBtn.addEventListener("click", StudyCycle.download);

// Evento que confirma a deleção do ciclo de estudos
confirmDeleteStudyCycle.addEventListener("click", StudyCycle.delete);

// Quando a página carregar...
document.addEventListener(
  "DOMContentLoaded",
  StudyCycle.showStudyCycleSubjects
);

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
