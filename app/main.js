import { Subject } from "./class/Subject.class.js";
import { StudyCycle } from "./class/StudyCycle.class.js";

// [ BOTÕES ] \\

// Botão que inicia a criação dos ciclos de estudo
const initCreateStudyCycleBtn = document.getElementById(
  "init-study-cycle-creation-btn"
);

// Botão que cancela a criação dos ciclos de estudo
const cancelCreateStudyCycleBtn = document.getElementById(
  "cancel-study-cycle-creation-btn"
);

// Botão que adiciona uma nova matéria
const addNewSubjectBtn = document.getElementById("add-new-subject-btn");

// Botão que remove uma matéria criada pelo usuário
const removeSubjectBtn = document.getElementsByClassName("remove-subject-btn");

// [ CONTAINERS ] \\

// Container que contém todas as matérias
const subjectsContainer = document.getElementById("subjects");
// Container que contém os controles para criação de um ciclo de estudo
const studyCycleCreateContainer = document.getElementById(
  "create-study-cycle-container"
);

// [ INPUTS ] \\

// Input de quantas horas o usuário estuda por dia
const userDiaryStudyingHoursInput =
  document.getElementById("studying-max-hours");

// Input de quantas horas o usuário estuda por semana
const weeklyStudyHoursInput = document.getElementById("weekly-study-hours");

// Input do multiplicador (divisão entre o número de horas de estudo por semana e a soma dos pesos)
const multiplierInput = document.getElementById("multiplier");

// Formulário de criação de um ciclo de estudo
const createStudyCycleForm = document.getElementById("create-study-cycle-form");

// [ MODAIS ] \\

// Modal de erro
const errorModal = document.getElementById("error-modal");

// Mensagem do modal de erro
const modalErrorMessage = document.getElementById("error-modal-message");

// Modal de sucesso
const successModal = document.getElementById("success-modal");

// Mensagem do modal de sucesso
const modalSuccessMessage = document.getElementById("success-modal-message");

// [ GERAL ] \\

// Link da home até o ciclo de estudos criado
const myStudyCycleLink = document.getElementById("my-study-cycle-link");

// Mensagem caso não haja ciclo de estudos
const noStudyCycleMsg = document.getElementById("no-study-cycle-msg");

// [ VARIÁVEIS ] \\

// Soma total dos pesos
let totalWeights = 0;

// [ EVENTOS ] \\

// Adicionar uma nova matéria
addNewSubjectBtn.addEventListener("click", () => {
  const newSubject = new Subject();
  newSubject.addNewSubject(subjectsContainer);
});

// Iniciar criação de um ciclo de estudos
initCreateStudyCycleBtn.addEventListener("click", StudyCycle.init);

// Criar um ciclo de estudos (POST)
createStudyCycleForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Previne o formulário de dar submit de fato

  // Chama a função que cuida da criação de um ciclo de estudos
  handleStudyCycleCreation();
});

// Cancelar a criação de um ciclo de estudos
cancelCreateStudyCycleBtn.addEventListener("click", StudyCycle.cancel);

// Trata a deleção de uma matéria criada pelo usuário
document.addEventListener("click", Subject.removeSubject);

// [ FUNÇÕES ] \\

/**
 * Calcula o multiplicador com base em quantas horas semanais o usuário estuda e o total de horas.
 * (Horas Semanais / Soma total dos pesos das matérias)
 *
 * @return {number} O resultado
 */
function getMultiplier() {
  multiplierInput.value = (
    Number(userDiaryStudyingHoursInput.value) / totalWeights
  ).toFixed(2);

  return (Number(userDiaryStudyingHoursInput.value) / totalWeights).toFixed(2);
}

/**
 * Calcula quantas horas semanais o usuário estuda com base em quantas horas ele estuda diariamente.
 * (Horas Semanais = Horas de estudo diário * 7)
 *
 * @return {number} O resultado
 */
function getWeeklyStudyHours() {
  weeklyStudyHoursInput.value = Number(userDiaryStudyingHoursInput.value) * 7;

  return userDiaryStudyingHoursInput * 7;
}

/**
 * Handles the creation of a study cycle, including updating the UI, performing calculations, and saving the study cycle configuration.
 */
function handleStudyCycleCreation() {
  // Pegando todos os inputs de peso e nome das matérias
  const weightInputs = document.querySelectorAll('input[id*="weight"]');
  const nameInputs = document.querySelectorAll('input[id*="name"]');

  // Para cada input de peso, adicionar seu valor na variável "totalWeights"
  weightInputs.forEach((weightInput) => {
    totalWeights += Number(weightInput.value);
  });

  // Esconde o container de criação de ciclo de estudos
  studyCycleCreateContainer.classList.toggle("hidden");

  // Some com o botão de cancelar a criação do ciclo de estudos
  cancelCreateStudyCycleBtn.classList.toggle("hidden");
  // Mostra o botão de criação de ciclos de estudos
  initCreateStudyCycleBtn.classList.toggle("hidden");

  // Desabilita o botão de criação de ciclo de estudos
  initCreateStudyCycleBtn.disabled = true;
  // Desabilita o input de configuração de horas de estudo diário
  userDiaryStudyingHoursInput.disabled = true;

  // Seta o valor do input de multiplicador para o multiplicador encontrado
  getMultiplier();
  // Seta o valor do input de horas semanais para as horas semanais encontradas
  getWeeklyStudyHours();

  // Cria um objeto com os dados e salva no LocalStorage
  createObj(nameInputs, weightInputs);

  // Reseta o ID
  currentId = 0;

  // Salva as configurações no LocalStorage
  saveStudyCycleConfig();

  // Mostra o link que leva até o ciclo de estudos criado
  myStudyCycleLink.classList.remove("hidden");
  // Esconde a mensagem que diz que não existe ciclo de estudos criado
  noStudyCycleMsg.classList.add("hidden");

  // Mostra o modal de sucesso
  modalSuccessMessage.textContent = "Study cycle created successfully!";
  successModal.showModal();
}

/**
 * Creates a new study cycle object based on the given name and weight inputs.
 *
 * @param {Array} nameInputs - array of input elements for names
 * @param {Array} weightInputs - array of input elements for weights
 */
function createObj(nameInputs, weightInputs) {
  // Pega a data atual e formata ela
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString();

  // Id usado para diferenciar as matérias no JSON
  let id = 1;

  // Cria um objeto com as informações do novo ciclo de estudo
  const inputObj = {
    [formattedDate]: [], // É aqui que ficam as matérias, a chave é a data de hoje
    cycleCompleted: false, // Indica se o ciclo de estudo foi concluído
    weeksPassed: 0, // Indica quantas semanas o usuário concluiu
    weeksFullCycle: 0, // Indica quantas semanas o ciclo de estudo ficou completo
    startedAt: formattedDate, // Data em que o ciclo de estudo foi iniciado
  };

  // Para cada input de nome, adiciona um novo objeto ao array
  nameInputs.forEach((nameInput, index) => {
    inputObj[formattedDate].push({
      // adiciona um novo objeto ao array
      id: id++,
      name: nameInput.value,
      weight: Number(weightInputs[index].value), // Adiciona o peso com base no index do nome
      currentWeekHours: 0,
      maxHoursAWeek: getSubjectHours(Number(weightInputs[index].value)), // Pega o calculo de quantas horas a matéria pode ser estudada semanalmente
      status: "Can Study", // Status da matéria
    });
  });

  // Salva no LocalStorage
  localStorage.setItem("myStudyCycle", JSON.stringify(inputObj));
}

/**
 * Calculate the total hours for a subject based on its weight and a multiplier input.
 *
 * @param {number} subjectWeight - The weight of the subject
 * @return {number} The total hours for the subject
 */
function getSubjectHours(subjectWeight) {
  // Calcula as horas que a matéria pode ser estudada semanalmente
  const hours = subjectWeight * Number(multiplierInput.value).toFixed(2);

  // Retorna o resultado arrendondado para cima
  return Math.ceil(hours);
}

/**
 * Saves the study cycle configuration to the local storage if the user enters valid data.
 */
function saveStudyCycleConfig() {
  // Cria um objeto contendo os dados de configuração do ciclo de estudo
  const studyCycleUserConfig = {
    userMaxHours: Number(userDiaryStudyingHoursInput.value),
    weeklyStudyHours: Number(weeklyStudyHoursInput.value),
    multiplier: Number(multiplierInput.value),
  };

  // Se houver um horário diário de estudo e um multiplicador...
  if (studyCycleUserConfig.userMaxHours !== 0) {
    if (studyCycleUserConfig.multiplier !== 0) {
      // Salva as configurações no LocalStorage
      localStorage.setItem(
        "myStudyCycleUserConfig",
        JSON.stringify(studyCycleUserConfig)
      );
    } else {
      modalErrorMessage = "Create a subject first!";
      errorModal.showModal();
    }
  } else {
    modalErrorMessage = "Please enter a valid number of hours first!";
    errorModal.showModal();
  }
}
