import { USER_POSTS_PAGE } from '../routes.js';
import { renderHeaderComponent } from './header-component.js';
import { goToPage, renderApp } from '../index.js';
import { allPosts, removeLikes, addLikes, getPosts } from '../api.js';

export const getListPostsEdit = (post, index) => {
	return `<li class="post">
      <div class="post-header" data-user-id="${post.userId}">
      <img src="${post.image}" class="post-header__user-image">
      <p class="post-header__user-name">${post.name}</p>
      </div>
      <div class="post-image-container">
      <img class="post-image" src="${post.postImage}">
      </div>
      <div class="post-likes">
      <button data-index = '${index}' data-post-id="${
		post.postId
	}" class="like-button">
      ${
				post.isLiked
					? `<img src="./assets/images/like-active.svg">`
					: `<img src="./assets/images/like-not-active.svg"></img>`
			}
      </button>
      <p  class="post-likes-text">
      Нравится: <strong >${post.likes}</strong>
      </p>
      </div>
      <p class="post-text">
      <span class="user-name">${post.name}</span>
      ${post.description}
      </p>
      <p class="post-date">
      ${post.date}
      </p>
      </li>`;
};

export const likesSwitcher = () => {
	const buttonsLike = document.querySelectorAll('.like-button');
	for (const buttonLike of buttonsLike) {
		const postId = buttonLike.dataset.postId;
		const index = buttonLike.dataset.index;
		buttonLike.addEventListener('click', event => {
			event.stopPropagation();
			if (allPosts[index].isLiked === false) {
				addLikes({
					postId: postId,
					isLiked: true,
				}).then(() => {
					allPosts[index].isLiked = !allPosts[index].isLiked;
					renderApp();
				});
			} else {
				removeLikes({
					postId: postId,
					isLiked: false,
				}).then(() => {
					allPosts[index].isLiked = !allPosts[index].isLiked;
					renderApp();
				});
			}
		});
	}
};

export function renderPostsPageComponent() {
	const appEl = document.getElementById('app');

	// TODO: реализовать рендер постов из api

	const postsHTML = allPosts
		.map((post, index) => getListPostsEdit(post, index))
		.join('');

	const appHtml = `
              <div class="page-container">
                <div class="header-container"></div>
                <ul class="posts">
                  ${postsHTML}
                </ul>
              </div>`;

	appEl.innerHTML = appHtml;

	renderHeaderComponent({
		element: document.querySelector('.header-container'),
	});

	for (let userEl of document.querySelectorAll('.post-header')) {
		userEl.addEventListener('click', () => {
			window.localStorage.setItem('userId', userEl.dataset.userId);
			goToPage(USER_POSTS_PAGE, { userId: userEl.dataset.userId });
		});
	}

	likesSwitcher();
}
