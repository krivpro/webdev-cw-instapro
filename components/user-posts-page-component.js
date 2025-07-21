import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage } from "../index.js";
import { formatDistanceToNow } from 'https://unpkg.com/date-fns@2.29.3/esm/index.js';
import { likePost, dislikePost } from "../api.js";
import { updatePost, user } from "../index.js";


function createPostHTML(post) {
  const formattedDate = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });
  
  return `
    <li class="post">
      <div class="post-header" data-user-id="${post.user.id}">
        <img src="${post.user.imageUrl}" class="post-header__user-image">
        <p class="post-header__user-name">${post.user.name}</p>
      </div>
      <div class="post-image-container">
        <img class="post-image" src="${post.imageUrl}">
      </div>
      <div class="post-likes">
        <button data-post-id="${post.id}" class="like-button">
          <img src="./assets/images/${post.isLiked ? 'like-active' : 'like-not-active'}.svg">
        </button>
        <p class="post-likes-text">
          Нравится: <strong>${post.likes.length}</strong>
        </p>
      </div>
      <p class="post-text">
        <span class="user-name">${post.user.name}</span>
        ${post.description}
      </p>
      <p class="post-date">
        ${formattedDate}
      </p>
    </li>
  `;
}

export function renderUserPostsPageComponent({ appEl, userId, userName }) {

  const postsHTML = posts.map(post => createPostHTML(post)).join('');

  const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <div class="posts-user-header">
        <img src="${posts[0]?.user.imageUrl || ''}" class="posts-user-header__user-image">
        <p class="posts-user-header__user-name">${userName || 'Пользователь'}</p>
      </div>
      <ul class="posts">
        ${postsHTML}
      </ul>
    </div>
  `;

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  // Обработчики кликов по пользователям (для навигации между пользователями)
  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }

  for (let likeButton of document.querySelectorAll(".like-button")) {
    likeButton.addEventListener("click", () => {
      const postId = likeButton.dataset.postId;
      const post = posts.find(p => p.id === postId);
      
      if (!post) return;
      
      const isLiked = post.isLiked;
      const token = user ? `Bearer ${user.token}` : undefined;
      
      if (!token) {
        alert("Нужно войти в систему, чтобы ставить лайки");
        return;
      }
      
      const apiCall = isLiked ? dislikePost : likePost;
      
      apiCall({ postId, token })
        .then((updatedPost) => {
          updatePost(updatedPost);
          renderUserPostsPageComponent({ appEl, userId, userName });
        })
        .catch((error) => {
          console.error("Ошибка при обновлении лайка:", error);
          alert("Ошибка при обновлении лайка: " + error.message);
        });
    });
  }
}