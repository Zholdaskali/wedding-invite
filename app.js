const API_URL = "https://script.google.com/macros/s/AKfycbxUBMvxDFDeyNxVKns5PB_lVvbsSC6CtGbGfrGdAbjfcfByR3PE5Mz_zYQ9fB-LojRS/exec";

function startVideo() {
  const startScreen = document.getElementById("start-screen");
  const intro = document.getElementById("intro");
  const video = document.getElementById("wedding-video");

  startScreen.style.display = "none";
  intro.style.display = "block";

  video.currentTime = 0;
  video.play().catch(error => {
    console.log("Автоплей заблокирован:", error);
    video.muted = true;
    video.play();
  });
}

function showMain() {
  document.getElementById("intro").style.display = "none";
  document.getElementById("main").style.display = "block";
}

function send(status) {
  const nameInput = document.getElementById("name");
  const name = nameInput.value.trim();
  
  const btnYes = document.querySelector(".yes");
  const btnNo = document.querySelector(".no");

  if (!name) {
    alert("Пожалуйста, введите ваше имя и фамилию.");
    return;
  }

  nameInput.disabled = true;
  btnYes.disabled = true;
  btnNo.disabled = true;

  if (status === 'yes') {
    btnYes.innerText = "Отправка...";
  } else {
    btnNo.innerText = "Отправка...";
  }

  fetch(API_URL, {
    method: "POST",
    mode: "no-cors",
    body: JSON.stringify({ name, status })
  })
  .then(() => {
    // Полностью скрываем блок формы, чтобы освободить место для визитки
    document.getElementById("rsvp-form-block").style.display = "none";

    const msgElement = document.getElementById("msg");
    const calendarAction = document.getElementById("calendar-action-wrapper");
    const locationRow = document.getElementById("vcard-location-row");
    const mapLink = document.getElementById("map-link");

    if (status === "yes") {
      msgElement.innerText = "Благодарим, мы ждем Вас!";
      // Показываем полные данные для пришедшего гостя
      calendarAction.style.display = "block";
      locationRow.style.display = "flex";
      mapLink.style.display = "block";
    } else {
      msgElement.innerText = "Благодарим за ответ. Нам очень жаль, что вы не сможете быть с нами.";
      // Убираем адрес, карту и календарь, если гость не придет
      calendarAction.style.display = "none";
      locationRow.style.display = "none";
      mapLink.style.display = "none";
    }

    // Отображаем визитку
    document.getElementById("wedding-card").style.display = "block";
    
    setTimeout(loadGuests, 1200);
  })
  .catch(error => {
    console.error("Ошибка:", error);
    nameInput.disabled = false;
    btnYes.disabled = false;
    btnNo.disabled = false;
    btnYes.innerText = "Подтверждаю";
    btnNo.innerText = "Не смогу прийти";
  });
}

// Генерация файла календаря iCal (.ics)
function downloadICS() {
  const icsData = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wedding Invite//NONSGML v1.0//EN",
    "BEGIN:VEVENT",
    "UID:" + new Date().getTime() + "@wedding.musin",
    "DTSTAMP:20260614T000000Z",
    "DTSTART:20260817T180000",
    "DTEND:20260817T233000",
    "SUMMARY:Свадьба Даулета и Асем 💍",
    "DESCRIPTION:Ждем вас на нашем торжестве! Той иелері: Алпат - Гулмира.",
    "LOCATION:Ресторан Prestige, г. Актобе",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute("download", "wedding_daulet_asem.ics");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function loadGuests() {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      let list = document.getElementById("guests");
      list.innerHTML = "";
      data.forEach(g => {
        let li = document.createElement("li");
        let nameSpan = document.createElement("span");
        nameSpan.textContent = g.name;
        li.appendChild(nameSpan);
        li.setAttribute("data-status", g.status === "yes" ? "yes" : "no");
        list.appendChild(li);
      });
    })
    .catch(error => console.error("Ошибка:", error));
}

loadGuests();