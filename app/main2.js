const studyCycle = localStorage.getItem("myStudyCycle");

const noStudyCycleMsg = document.getElementById("no-study-cycle-msg");

const completedCycleMsg = document.getElementById("completed-all-subjects-msg");

const confirmDeleteModal = document.getElementById(
  "confirm-study-cycle-delete-modal"
);

const confirmDeleteStudyCycle = document.getElementById(
  "confirm-delete-study-cycle"
);

const openDeleteStudyCycleModal = document.getElementById(
  "open-delete-study-cycle-modal"
);

confirmDeleteStudyCycle.addEventListener("click", () => {
  localStorage.removeItem("myStudyCycle");

  localStorage.removeItem("myStudyCycleUserConfig");

  for (let key in localStorage) {
    if (key.startsWith("subject-")) {
      localStorage.removeItem(key);
    }
  }

  confirmDeleteModal.close();

  window.location.reload();
});

document.addEventListener("DOMContentLoaded", () => {
  if (studyCycle) {
    updateStudyCycleStatus();

    showCompletedAllSubjectsMsg();

    resetAllSubjectsCurrentHours();

    noStudyCycleMsg.classList.add("hidden");
    openDeleteStudyCycleModal.classList.remove("hidden");

    const studyCycleObj = JSON.parse(studyCycle);

    console.log(studyCycleObj);

    // Assuming you have a div with id "container" in your HTML
    const container = document.getElementById("container");

    // Criação da página
    for (const date in studyCycleObj) {
      if (date.includes("/")) {
        const dataList = studyCycleObj[date];

        const studyCycleData = document.createElement("div");
        studyCycleData.id = "study-cycle-data";

        const dateTitle = document.createElement("h2");
        dateTitle.textContent = date;

        const weeksPassed = document.createElement("span");
        weeksPassed.id = "weeks-passed";
        weeksPassed.textContent = `Weeks Passed: ${studyCycleObj.weeksPassed}`;

        const weeksFullCycle = document.createElement("span");
        weeksFullCycle.id = "weeks-full-cycle";
        weeksFullCycle.textContent = `Completed Cycle Streak: ${studyCycleObj.weeksFullCycle}`;

        const startedAtDateSpan = document.createElement("span");
        startedAtDateSpan.id = "started-at-date";
        startedAtDateSpan.textContent = `Started At: ${studyCycleObj.startedAt}`;

        const breakBetweenWeeksSpans = document.createElement("br");
        const breakBetweenWeeksSpanAndStartedDate =
          document.createElement("br");
        const breakBetweenWeeksAndSubjects = document.createElement("br");

        studyCycleData.appendChild(dateTitle);
        studyCycleData.appendChild(startedAtDateSpan);
        studyCycleData.appendChild(breakBetweenWeeksSpanAndStartedDate);
        studyCycleData.appendChild(weeksPassed);
        studyCycleData.appendChild(breakBetweenWeeksSpans);
        studyCycleData.appendChild(weeksFullCycle);

        container.appendChild(studyCycleData);
        container.appendChild(breakBetweenWeeksAndSubjects);

        dataList.forEach((subject) => {
          const subjectDiv = document.createElement("div");

          const subjectName = document.createElement("span");
          subjectName.textContent = subject.name;

          subjectDiv.appendChild(subjectName);

          for (let index = 1; index <= subject.maxHoursAWeek; index++) {
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.name = `subject-${subject.id}-${index}-hour`;
            checkbox.id = `subject-${subject.id}`;
            checkbox.value = 1;

            subjectDiv.appendChild(checkbox);
          }

          const subjectStatus = document.createElement("span");
          subjectStatus.textContent = subject.status;
          subjectStatus.id = `subject-${subject.id}-status`;
          subjectDiv.appendChild(subjectStatus);

          const br = document.createElement("br");

          container.appendChild(subjectDiv);
          container.appendChild(br);
        });
      }
    }

    const checkboxInputs = document.querySelectorAll('input[type="checkbox"]');

    checkboxInputs.forEach((checkbox) => {
      checkbox.addEventListener("change", (event) => {
        const subjectId = event.target.name.split("-")[1];
        const subjectHourId = event.target.name.split("-")[2];

        if (checkbox.checked) {
          console.log(`Checked: ${subjectId}`);
          handleAddingHourToSubject(subjectId, subjectHourId);
        } else {
          console.log(`Uncheck: ${subjectId}`);
          handleRemovingHourToSubject(subjectId, subjectHourId);
        }
      });
    });

    checkboxInputs.forEach((checkbox) => {
      const subjectId = checkbox.name.split("-")[1];
      const subjectHourId = checkbox.name.split("-")[2];

      if (
        localStorage.getItem(`subject-${subjectId}-${subjectHourId}-hour`) ===
        "checked"
      ) {
        checkbox.checked = true;
      }
    });
  }
});

function handleAddingHourToSubject(subjectId, subjectHourId) {
  let studyCycleObj = JSON.parse(localStorage.getItem("myStudyCycle"));
  const subjects = Object.values(studyCycleObj)[0];

  subjects.forEach((subject) => {
    if (subject.id === Number(subjectId)) {
      if (subjectHourId <= subject.maxHoursAWeek) {
        subject.currentWeekHours++;
        updateStatus(subject);
        localStorage.setItem("myStudyCycle", JSON.stringify(studyCycleObj));
        console.log(subject);
      }
    }
  });

  localStorage.setItem(`subject-${subjectId}-${subjectHourId}-hour`, "checked");
}

function handleRemovingHourToSubject(subjectId, subjectHourId) {
  let studyCycleObj = JSON.parse(localStorage.getItem("myStudyCycle"));
  const subjects = Object.values(studyCycleObj)[0];

  subjects.forEach((subject) => {
    if (subject.id === Number(subjectId)) {
      if (subjectHourId <= subject.maxHoursAWeek) {
        subject.currentWeekHours--;
        updateStatus(subject);
        localStorage.setItem("myStudyCycle", JSON.stringify(studyCycleObj));
        console.log(subject);
      }
    }
  });

  localStorage.removeItem(
    `subject-${subjectId}-${subjectHourId}-hour`,
    "checked"
  );
}

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

function updateStudyCycleStatus() {
  const studyCycleObj = JSON.parse(localStorage.getItem("myStudyCycle"));
  const subjects = Object.values(studyCycleObj)[0];

  let sumWeekHours = 0;
  let sumUserHours = 0;

  subjects.forEach((subject) => {
    sumUserHours += subject.currentWeekHours;
    sumWeekHours += subject.maxHoursAWeek;
  });

  if (sumUserHours >= sumWeekHours) {
    studyCycleObj.cycleCompleted = true;
  } else {
    studyCycleObj.cycleCompleted = false;
  }

  localStorage.setItem("myStudyCycle", JSON.stringify(studyCycleObj));
}

function showCompletedAllSubjectsMsg() {
  const studyCycleObj = JSON.parse(localStorage.getItem("myStudyCycle"));

  if (studyCycleObj.cycleCompleted === true) {
    completedCycleMsg.classList.remove("hidden");
  } else {
    completedCycleMsg.classList.add("hidden");
  }
}

function resetAllSubjectsCurrentHours() {
  const studyCycleObj = JSON.parse(localStorage.getItem("myStudyCycle"));

  const subjects = Object.values(studyCycleObj)[0];

  const currentDate = new Date();

  if (currentDate.getDay() === 0) {
    subjects.forEach((subject) => {
      subject.currentWeekHours = 0;
    });

    const keys = Object.keys(studyCycleObj);
    studyCycleObj[keys[0]] = currentDate.toLocaleDateString();

    studyCycleObj.cycleCompleted = false;
    studyCycleObj.weeksPassed++;

    if (studyCycleObj.cycleCompleted === true) {
      studyCycleObj.weeksFullCycle++;
    }

    localStorage.setItem("myStudyCycle", JSON.stringify(studyCycleObj));
  }
}
