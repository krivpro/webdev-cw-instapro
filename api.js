// Замени на свой, чтобы получить независимый от других набор данных.
// "боевая" версия инстапро лежит в ключе prod
const personalKey = "krivpro";
const baseHost = "https://wedev-api.sky.pro";
const postsHost = `${baseHost}/api/v1/${personalKey}/instapro`;

export function getPosts({ token }) {
  return fetch(postsHost, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (response.status === 401) {
        throw new Error("Нет авторизации");
      }

      return response.json();
    })
    .then((data) => {
      return data.posts;
    });
}

export function registerUser({ login, password, name, imageUrl }) {
  return fetch(baseHost + "/api/user", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
      name,
      imageUrl,
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("Такой пользователь уже существует");
    }
    return response.json();
  });
}

export function loginUser({ login, password }) {
  return fetch(baseHost + "/api/user/login", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("Неверный логин или пароль");
    }
    return response.json();
  });
}

// Загружает картинку в облако, возвращает url загруженной картинки
export function uploadImage({ file }) {
  const data = new FormData();
  data.append("file", file);

  return fetch(baseHost + "/api/upload/image", {
    method: "POST",
    body: data,
  }).then((response) => {
    return response.json();
  });
}

export function addPost({ description, imageUrl, token }) {
  console.log("Отправляем данные:", { description, imageUrl, token });
  
  // Очищаем данные от лишних символов
  const cleanDescription = description.trim();
  const cleanImageUrl = imageUrl.trim();
  
  const requestBody = {
    description: cleanDescription,
    imageUrl: cleanImageUrl,
  };
  
  const jsonString = JSON.stringify(requestBody);
  console.log("JSON для отправки:", jsonString);
  
  return fetch(postsHost, {
    method: "POST",
    headers: {
      Authorization: token,
    },
    body: jsonString,
  })
    .then((response) => {
      console.log("Ответ сервера:", response.status, response.statusText);
      
      if (response.status === 400) {
        return response.json().then(errorData => {
          console.log("Детали ошибки:", errorData);
          throw new Error(errorData.error || "Неверные данные поста");
        });
      }
      if (response.status === 401) {
        throw new Error("Нет авторизации");
      }
      return response.json();
    });
}