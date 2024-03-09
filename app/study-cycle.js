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
