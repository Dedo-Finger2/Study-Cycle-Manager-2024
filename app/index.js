import { Subject } from "./class/Subject.class.js";
import { StudyCycle } from "./class/StudyCycle.class.js";

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

// Formulário de criação de um ciclo de estudo
const createStudyCycleForm = document.getElementById("create-study-cycle-form");

// [ EVENTOS ] \\

// Adicionar uma nova matéria
addNewSubjectBtn.addEventListener("click", () => {
  const newSubject = new Subject();
  newSubject.addNewSubject();
});

// Iniciar criação de um ciclo de estudos
initCreateStudyCycleBtn.addEventListener("click", StudyCycle.init);

// Criar um ciclo de estudos (POST)
createStudyCycleForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Previne o formulário de dar submit de fato

  // Chama a função que cuida da criação de um ciclo de estudos
  StudyCycle.create();
});

// Cancelar a criação de um ciclo de estudos
cancelCreateStudyCycleBtn.addEventListener("click", StudyCycle.cancel);

// Trata a deleção de uma matéria criada pelo usuário
document.addEventListener("click", Subject.removeSubject);