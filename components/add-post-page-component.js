import { renderHeaderComponent } from "./header-component.js";
import { renderUploadImageComponent } from "./upload-image-component.js";

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  let imageUrl = "";

  const render = () => {
    const appHtml = `
      <div class="page-container">
        <div class="header-container"></div>
        <div class="form">
          <h3 class="form-title">Добавить пост</h3>
          <div class="form-inputs">
            <div class="upload-image-container"></div>
            <textarea 
              id="description-input" 
              class="input" 
              placeholder="Описание поста"
              rows="4"
              style="resize: vertical; min-height: 80px;"
            ></textarea>
            <div class="form-error"></div>
            <button class="button" id="add-button">Добавить</button>
          </div>
        </div>
      </div>
    `;

    appEl.innerHTML = appHtml;

    // Рендерим заголовок
    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });

    // Рендерим компонент загрузки изображения
    const uploadImageContainer = appEl.querySelector(".upload-image-container");
    renderUploadImageComponent({
      element: uploadImageContainer,
      onImageUrlChange(newImageUrl) {
        imageUrl = newImageUrl;
      },
    });

    // Обработчик клика на кнопку добавления
    document.getElementById("add-button").addEventListener("click", () => {
      const description = document.getElementById("description-input").value.trim();
      
      if (!description) {
        alert("Введите описание поста");
        return;
      }
    
      if (!imageUrl) {
        alert("Выберите изображение");
        return;
      }
    
      // Проверяем, что данные не содержат проблемных символов
      console.log("Описание:", JSON.stringify(description));
      console.log("URL изображения:", JSON.stringify(imageUrl));
    
      onAddPostClick({
        description,
        imageUrl,
      });

      // onAddPostClick({
      //   description: "Тестовый пост",
      //   imageUrl: "https://via.placeholder.com/300x200",
      // });
    });
  };

  render();
}