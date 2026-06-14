// Ссылка на ваш Google Apps Script веб-сервис
const API_URL = "https://script.google.com/macros/s/AKfycbxUBMvxDFDeyNxVKns5PB_lVvbsSC6CtGbGfrGdAbjfcfByR3PE5Mz_zYQ9fB-LojRS/exec";

// Функция для запуска видео со звуком после клика пользователя
function startVideo() {
  const startScreen = document.getElementById("start-screen");
  const intro = document.getElementById("intro");
  const video = document.getElementById("wedding-video");

  // Скрываем стартовую кнопку и показываем видео-блок
  startScreen.style.display = "none";
  intro.style.display = "block";

  // Запускаем видео программно
  video.currentTime = 0;
  video.play().catch(error => {
    console.log("Ошибка воспроизведения: ", error);
    // Запасной план: если браузер заблокировал звук, включаем без звука
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

  // Не отправляем пустые имена
  if (!name) {
    alert("Пожалуйста, введите ваше имя перед отправкой.");
    return;
  }

  // Блокируем ввод, пока идет отправка
  nameInput.disabled = true;

  fetch(API_URL, {
    method: "POST",
    mode: "no-cors", // Предотвращает ошибки безопасности (CORS) при отправке в Google
    body: JSON.stringify({ name, status })
  })
  .then(() => {
    document.getElementById("msg").innerText =
      status === "yes" ? "Ждём тебя 🎉" : "Жаль 😢";
    
    // Спустя 1 секунду обновляем список гостей, чтобы там появилось новое имя
    setTimeout(loadGuests, 1000);
  })
  .catch(error => {
    console.error("Ошибка при отправке данных:", error);
    nameInput.disabled = false;
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

// Автоматически загружаем список гостей при первой загрузке страницы
loadGuests();