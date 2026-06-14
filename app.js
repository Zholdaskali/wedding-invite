// Ссылка на ваш Google Apps Script веб-сервис
const API_URL = "https://script.google.com/macros/s/AKfycbxUBMvxDFDeyNxVKns5PB_lVvbsSC6CtGbGfrGdAbjfcfByR3PE5Mz_zYQ9fB-LojRS/exec";

// Функция для запуска видео со звуком после клика пользователя
function startVideo() {
  const startScreen = document.getElementById("start-screen");
  const intro = document.getElementById("intro");
  const video = document.getElementById("wedding-video");

  startScreen.style.display = "none";
  intro.style.display = "block";

  video.currentTime = 0;
  video.play().catch(error => {
    console.log("Ошибка воспроизведения: ", error);
    video.muted = true;
    video.play();
  });
}

// Показать сайт после окончания видео
function showMain() {
  document.getElementById("intro").style.display = "none";
  document.getElementById("main").style.display = "block";
}

// Отправка RSVP ответа в Google Таблицу
function send(status) {
  const nameInput = document.getElementById("name");
  const name = nameInput.value.trim();
  
  const btnYes = document.querySelector(".yes");
  const btnNo = document.querySelector(".no");

  if (!name) {
    alert("Пожалуйста, введите ваше имя перед отправкой.");
    return;
  }

  // БЛОКИРОВКА: выключаем инпут и обе кнопки, чтобы нельзя было нажать дважды
  nameInput.disabled = true;
  btnYes.disabled = true;
  btnNo.disabled = true;

  // Визуально показываем, что идет отправка
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
    // Возвращаем кнопкам красивый текст финального статуса
    btnYes.innerText = "👍 Приду";
    btnNo.innerText = "👎 Не приду";

    document.getElementById("msg").innerText =
      status === "yes" ? "Ждём тебя 🎉" : "Жаль 😢";
    
    setTimeout(loadGuests, 1000);
  })
  .catch(error => {
    console.error("Ошибка при отправке данных:", error);
    // В случае жесткой ошибки сети возвращаем доступ к кнопкам
    nameInput.disabled = false;
    btnYes.disabled = false;
    btnNo.disabled = false;
    btnYes.innerText = "👍 Приду";
    btnNo.innerText = "👎 Не приду";
  });
}

// Загрузка списка ответивших гостей
function loadGuests() {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      let list = document.getElementById("guests");
      list.innerHTML = "";

      data.forEach(g => {
        let li = document.createElement("li");
        li.textContent = `${g.name} — ${g.status === "yes" ? "👍 Приду" : "👎 Не приду"}`;
        list.appendChild(li);
      });
    })
    .catch(error => {
      console.error("Не удалось загрузить список гостей:", error);
    });
}

loadGuests();