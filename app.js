const API_URL = "https://script.google.com/macros/s/AKfycbxUBMvxDFDeyNxVKns5PB_lVvbsSC6CtGbGfrGdAbjfcfByR3PE5Mz_zYQ9fB-LojRS/exec";

// Активация видео
function startVideo() {
  const startScreen = document.getElementById("start-screen");
  const intro = document.getElementById("intro");
  const video = document.getElementById("wedding-video");

  startScreen.style.display = "none";
  intro.style.display = "block";

  video.currentTime = 0;
  video.play().catch(error => {
    console.log("Автоплей со звуком заблокирован, включаем тихое воспроизведение:", error);
    video.muted = true;
    video.play();
  });
}

// Переход на главный экран
function showMain() {
  document.getElementById("intro").style.display = "none";
  document.getElementById("main").style.display = "block";
}

// Отправка RSVP ответа
function send(status) {
  const nameInput = document.getElementById("name");
  const name = nameInput.value.trim();
  
  const btnYes = document.querySelector(".yes");
  const btnNo = document.querySelector(".no");

  if (!name) {
    alert("Пожалуйста, введите ваше имя и фамилию.");
    return;
  }

  // СТРОГАЯ БЛОКИРОВКА ИНТЕРФЕЙСА (Анти-даблклик)
  nameInput.disabled = true;
  btnYes.disabled = true;
  btnNo.disabled = true;

  const originalYesText = btnYes.innerText;
  const originalNoText = btnNo.innerText;

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
    btnYes.innerText = originalYesText;
    btnNo.innerText = originalNoText;

    // Изящный премиальный текст вместо смайлов
    document.getElementById("msg").innerText =
      status === "yes" ? "Благодарим, мы ждем Вас!" : "Благодарим за ответ.";
    
    setTimeout(loadGuests, 1200);
  })
  .catch(error => {
    console.error("Ошибка сети:", error);
    nameInput.disabled = false;
    btnYes.disabled = false;
    btnNo.disabled = false;
    btnYes.innerText = originalYesText;
    btnNo.innerText = originalNoText;
  });
}

// Красивый рендеринг списка гостей
function loadGuests() {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      let list = document.getElementById("guests");
      list.innerHTML = "";

      data.forEach(g => {
        let li = document.createElement("li");
        
        // Помещаем имя гостя
        let nameSpan = document.createElement("span");
        nameSpan.textContent = g.name;
        li.appendChild(nameSpan);
        
        // Передаем статус в CSS для красивого правого выравнивания
        li.setAttribute("data-status", g.status === "yes" ? "yes" : "no");
        
        list.appendChild(li);
      });
    })
    .catch(error => {
      console.error("Ошибка загрузки гостей:", error);
    });
}

// Инициализация при старте страницы
loadGuests();