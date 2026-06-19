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

function closeModal() {
  document.getElementById("vcard-modal").style.display = "none";
}

// Показывает или скрывает поле для имени супруга
function toggleSpouseInput() {
  const checkbox = document.getElementById("has-spouse");
  const container = document.getElementById("spouse-name-container");
  const spouseInput = document.getElementById("spouse-name");
  
  if (checkbox && checkbox.checked) {
    container.style.display = "block";
    spouseInput.focus();
  } else {
    container.style.display = "none";
    if (spouseInput) spouseInput.value = ""; // Очищаем, если сняли галочку
  }
}

function send(status) {
  const nameInput = document.getElementById("name");
  const name = nameInput.value.trim();
  
  const hasSpouseCheckbox = document.getElementById("has-spouse");
  const hasSpouse = hasSpouseCheckbox && hasSpouseCheckbox.checked ? 'yes' : 'no';
  
  const spouseNameInput = document.getElementById("spouse-name");
  const spouseName = spouseNameInput ? spouseNameInput.value.trim() : "";
  
  const btnYes = document.querySelector(".yes");
  const btnNo = document.querySelector(".no");

  if (!name) {
    alert("Пожалуйста, введите ваше имя и фамилию.");
    return;
  }

  // Если выбрали "С супругом", но забыли написать имя
  if (status === 'yes' && hasSpouse === 'yes' && !spouseName) {
    alert("Пожалуйста, введите имя вашего(ей) супруга(и).");
    return;
  }

  nameInput.disabled = true;
  if(hasSpouseCheckbox) hasSpouseCheckbox.disabled = true;
  if(spouseNameInput) spouseNameInput.disabled = true;
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
    body: JSON.stringify({ name, status, hasSpouse, spouseName })
  })
  .then(() => {
    document.getElementById("rsvp-form-block").style.display = "none";
    
    // Формируем красивое отображение на визитке: "Имя + ИмяСупруга" или просто "Имя"
    const displayName = (hasSpouse === 'yes' && status === 'yes') ? `${name} + ${spouseName}` : name;
    document.getElementById("vcard-guest-name").innerText = displayName;

    const msgElement = document.getElementById("msg");
    const calendarAction = document.getElementById("calendar-action-wrapper");
    const locationRow = document.getElementById("vcard-location-row");
    const mapLink = document.getElementById("map-link");

    if (status === "yes") {
      msgElement.innerText = "Благодарим, мы ждем Вас! Ваш цифровой пропуск открыт.";
      calendarAction.style.display = "block";
      locationRow.style.display = "flex";
      mapLink.style.display = "block";
    } else {
      msgElement.innerText = "Благодарим за ответ. Нам очень жаль, что вы не сможете прийти.";
      calendarAction.style.display = "none";
      locationRow.style.display = "none";
      mapLink.style.display = "none";
    }

    document.getElementById("vcard-modal").style.display = "flex";
    
    setTimeout(loadGuests, 1200);
  })
  .catch(error => {
    console.error("Ошибка:", error);
    nameInput.disabled = false;
    if(hasSpouseCheckbox) hasSpouseCheckbox.disabled = false;
    if(spouseNameInput) spouseNameInput.disabled = false;
    btnYes.disabled = false;
    btnNo.disabled = false;
    btnYes.innerText = "Подтверждаю";
    btnNo.innerText = "Не смогу прийти";
  });
}

// ФУНКЦИЯ СКАЧИВАНИЯ КАРТОЧКИ КАК ИЗОБРАЖЕНИЯ
function downloadCardAsImage() {
  const guestName = document.getElementById("vcard-guest-name").innerText;
  const isAttending = document.getElementById("vcard-location-row").style.display !== "none";
  
  const placeText = isAttending ? '"Jan" тойханасы, Иманов көшесі, 175' : 'Отсутствует';

  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="550" viewBox="0 0 400 550">
      <defs>
        <style>
          .bg { fill: #ffffff; }
          .border { fill: none; stroke: #c5a059; stroke-width: 2; }
          .badge { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 9px; fill: #c5a059; letter-spacing: 2px; }
          .logo { font-family: 'Georgia', serif; font-size: 32px; font-style: italic; fill: #c5a059; text-anchor: middle; }
          .title { font-family: 'Georgia', serif; font-size: 26px; fill: #1d3322; text-anchor: middle; }
          .subtitle { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 10px; fill: #76877b; letter-spacing: 1px; text-anchor: middle; }
          .line { stroke: #c5a059; stroke-width: 1; opacity: 0.3; }
          .label { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 10px; fill: #76877b; font-weight: bold; letter-spacing: 0.5px; }
          .value { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; fill: #1d3322; }
        </style>
      </defs>
      <rect width="400" height="550" class="bg"/>
      <rect x="15" y="15" width="370" height="520" class="border"/>
      
      <text x="320" y="40" class="badge">DIGITAL PASS</text>
      <text x="200" y="85" class="logo">M</text>
      <text x="200" y="125" class="title">Дәулет &amp; Әсем</text>
      <text x="200" y="145" class="subtitle">ҮЙЛЕНУ ТОЙЫ • СВАДЕБНОЕ ТОРЖЕСТВО</text>
      
      <line x1="40" y1="175" x2="360" y2="175" class="line" />
      
      <text x="40" y="210" class="label">ҚОНАҚ / ГОСТЬ:</text>
      <text x="40" y="230" class="value">${guestName}</text>
      
      <text x="40" y="270" class="label">КҮН / ДАТА:</text>
      <text x="40" y="290" class="value">17.08.2026 (Понедельник)</text>
      
      <text x="40" y="330" class="label">УАҚЫТЫ / ВРЕМЯ:</text>
      <text x="40" y="350" class="value">18:00</text>
      
      <text x="40" y="390" class="label">МЕКЕН-ЖАЙЫ / МЕСТО:</text>
      <text x="40" y="410" class="value">${placeText}</text>
      
      <text x="40" y="450" class="label">ТОЙ ИЕЛЕРІ:</text>
      <text x="40" y="470" class="value">Алпат - Гулмира</text>
      
      <line x1="40" y1="500" x2="360" y2="500" class="line" />
    </svg>
  `;

  const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  const URL = window.URL || window.webkitURL || window;
  const blobURL = URL.createObjectURL(blob);
  
  const image = new Image();
  image.onload = function() {
    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 550;
    const context = canvas.getContext("2d");
    context.drawImage(image, 0, 0);
    
    const png = canvas.toDataURL("image/png");
    const downloadLink = document.createElement("a");
    downloadLink.href = png;
    downloadLink.download = `Wedding_Pass_${guestName.replace(/\s+/g, '_')}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };
  image.src = blobURL;
}

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
    "LOCATION:Тойхана Jan, г. Актобе, ул. Аманкельды Иманова 175",
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
        
        // Отображение в общем списке на сайте
        const displayListText = (g.hasSpouse === "yes" && g.status === "yes" && g.spouseName) 
          ? `${g.name} + ${g.spouseName}` 
          : g.name;
        
        nameSpan.textContent = displayListText;
        li.appendChild(nameSpan);
        li.setAttribute("data-status", g.status === "yes" ? "yes" : "no");
        list.appendChild(li);
      });
    })
    .catch(error => console.error("Ошибка:", error));
}

loadGuests();