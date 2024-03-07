const initCreateStudyCycleBtn = document.getElementById(
  "init-study-cycle-creation-btn"
);

const cancelCreateStudyCycleBtn = document.getElementById(
  "cancel-study-cycle-creation-btn"
);

const studyCycleCreateContainer = document.getElementById(
  "create-study-cycle-container"
);

const userMaxHours = document.getElementById("studying-max-hours");

const weeklyStudyHoursInput = document.getElementById("weekly-study-hours");

const multiplierInput = document.getElementById("multiplier");

const createStudyCycleForm = document.getElementById("create-study-cycle-form");

const addNewSubjectBtn = document.getElementById("add-new-subject-btn");

const subjectsContainer = document.getElementById("subjects");

const errorModal = document.getElementById("error-modal");
const modalErrorMessage = document.getElementById("error-modal-message");

const successModal = document.getElementById("success-modal");
const modalSuccessMessage = document.getElementById("success-modal-message");

const removeSubjectBtn = document.getElementsByClassName("remove-subject-btn");

const myStudyCycleLink = document.getElementById("my-study-cycle-link");
const noStudyCycleMsg = document.getElementById("no-study-cycle-msg");

let totalWeights = 0;
let currentId = 0;

addNewSubjectBtn.addEventListener("click", () => {
  currentId++;

  const newSubjectContainer = document.createElement("div");
  newSubjectContainer.classList.add(`subject-container-${currentId}`);

  const subjectNameContainer = document.createElement("div");

  const subjectNameLabel = document.createElement("label");
  subjectNameLabel.for = `subject-name-${currentId}`;
  subjectNameLabel.textContent = "Name";

  const subjectNameInput = document.createElement("input");
  subjectNameInput.type = "text";
  subjectNameInput.required = true;
  subjectNameInput.id = `subject-name-${currentId}`;
  subjectNameInput.placeholder = "Nome da Materia";

  const subjectWeightContainer = document.createElement("div");

  const subjectWeightLabel = document.createElement("label");
  subjectWeightLabel.for = `subject-weight-${currentId}`;
  subjectWeightLabel.textContent = "Weight";

  const subjectWeightInput = document.createElement("input");
  subjectWeightInput.type = "number";
  subjectWeightInput.required = true;
  subjectWeightInput.id = `subject-weight-${currentId}`;
  subjectWeightInput.min = "1";
  subjectWeightInput.max = "5";
  subjectWeightInput.placeholder = "Peso";

  const br = document.createElement("br");

  const removeSubjectBtn = document.createElement("button");
  removeSubjectBtn.type = "button";
  removeSubjectBtn.textContent = "Remove";
  removeSubjectBtn.classList.add("remove-subject-btn");
  removeSubjectBtn.dataset.subjectContainerId = currentId;

  subjectNameContainer.appendChild(subjectNameLabel);
  subjectNameContainer.appendChild(subjectNameInput);

  subjectWeightContainer.appendChild(subjectWeightLabel);
  subjectWeightContainer.appendChild(subjectWeightInput);

  newSubjectContainer.appendChild(subjectNameContainer);
  newSubjectContainer.appendChild(subjectWeightContainer);

  newSubjectContainer.appendChild(removeSubjectBtn);

  newSubjectContainer.appendChild(br);

  subjectsContainer.appendChild(newSubjectContainer);
});

initCreateStudyCycleBtn.addEventListener("click", () => {
  if (userMaxHours.value === "") {
    errorModal.showModal();
    modalErrorMessage.textContent =
      "Provide an hour value for the max hours of studying!";

    return;
  }

  studyCycleCreateContainer.classList.toggle("hidden");
  cancelCreateStudyCycleBtn.classList.toggle("hidden");
  initCreateStudyCycleBtn.classList.toggle("hidden");
});

createStudyCycleForm.addEventListener("submit", (event) => {
  event.preventDefault();

  handleStudyCycleCreation();
});

cancelCreateStudyCycleBtn.addEventListener("click", () => {
  studyCycleCreateContainer.classList.toggle("hidden");
  cancelCreateStudyCycleBtn.classList.toggle("hidden");
  initCreateStudyCycleBtn.classList.toggle("hidden");
});

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("remove-subject-btn")) {
    event.preventDefault();

    const subjectContainerId = event.target.dataset.subjectContainerId;

    const elementToRemove = event.target.parentNode;
    subjectsContainer.removeChild(elementToRemove);
  }
});

function getMultiplier() {
  multiplierInput.value = (Number(userMaxHours.value) / totalWeights).toFixed(
    2
  );

  return (Number(userMaxHours.value) / totalWeights).toFixed(2);
}

function getWeeklyStudyHours() {
  weeklyStudyHoursInput.value = Number(userMaxHours.value) * 7;

  return userMaxHours * 7;
}

function handleStudyCycleCreation() {
  const weightInputs = document.querySelectorAll('input[id*="weight"]');
  const nameInputs = document.querySelectorAll('input[id*="name"]');

  weightInputs.forEach((weightInput) => {
    totalWeights += Number(weightInput.value);
  });

  modalSuccessMessage.textContent = "Study cycle created successfully!";
  successModal.showModal();

  studyCycleCreateContainer.classList.toggle("hidden");

  initCreateStudyCycleBtn.disabled = true;
  userMaxHours.disabled = true;

  getMultiplier();
  getWeeklyStudyHours();

  createObj(nameInputs, weightInputs);

  currentId = 0;

  saveStudyCycleConfig();

  myStudyCycleLink.classList.remove("hidden");
  noStudyCycleMsg.classList.add("hidden");
}

function createObj(nameInputs, weightInputs) {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString();

  let id = 1;

  const inputObj = {
    [formattedDate]: [], // inicializa como um array vazio
    cycleCompleted: false,
    weeksPassed: 0,
    weeksFullCycle: 0,
    startedAt: formattedDate,
  };

  nameInputs.forEach((nameInput, index) => {
    inputObj[formattedDate].push({
      // adiciona um novo objeto ao array
      id: id++,
      name: nameInput.value,
      weight: Number(weightInputs[index].value),
      currentWeekHours: 0,
      maxHoursAWeek: getSubjectHours(Number(weightInputs[index].value)),
      status: "Can Study",
    });
  });

  localStorage.setItem("myStudyCycle", JSON.stringify(inputObj));
}

function getSubjectHours(subjectWeight) {
  const hours = subjectWeight * Number(multiplierInput.value).toFixed(2);

  return Math.ceil(hours);
}

function saveStudyCycleConfig() {
  const studyCycleUserConfig = {
    userMaxHours: Number(userMaxHours.value),
    weeklyStudyHours: Number(weeklyStudyHoursInput.value),
    multiplier: Number(multiplierInput.value),
  };

  if (studyCycleUserConfig.userMaxHours !== 0) {
    if (studyCycleUserConfig.multiplier !== 0) {
      console.log("Saved!");

      getMultiplier();

      getWeeklyStudyHours();

      localStorage.setItem(
        "myStudyCycleUserConfig",
        JSON.stringify(studyCycleUserConfig)
      );
    } else {
      alert("Create a subject first!");
    }
  } else {
    alert("Please enter a valid number of hours first!");
  }
}

function removeSubject(subjectContainerId) {
  console.log(subjectContainerId);
}
