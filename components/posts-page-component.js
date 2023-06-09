import { USER_POSTS_PAGE } from '../routes.js';
import { renderHeaderComponent } from './header-component.js';
import { goToPage } from '../index.js';
import { allPosts, removeLikes, addLikes } from '../api.js';

const getListPostsEdit = (post, index) => {
	return `<li class="post" data-index = '${index}'>
      <div class="post-header" data-user-id="${post.userId}">
      <img src="${post.image}" class="post-header__user-image">
      <p class="post-header__user-name">${post.name}</p>
      </div>
      <div class="post-image-container">
      <img class="post-image" src="${post.postImage}">
      </div>
      <div class="post-likes">
      <button data-post-id="${post.postId}" class="like-button ">
      ${
				post.isLiked
					? `<img src="./assets/images/like-active.svg">`
					: `<img src="./assets/images/like-not-active.svg"></img>`
			}
      </button>
      <p  class="post-likes-text">
      Нравится: <strong >${post.numberOfLikes}</strong>
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


//!нeдoдeлaнный код для лайков
export const initEventListeners = () => {
	const buttonsLike = document.querySelectorAll('.like-button');
	for (const buttonLike of buttonsLike) {
		const postId = buttonLike.dataset.postId;
		buttonLike.addEventListener('click', event => {
			event.stopPropagation();

			if (postId) {
				removeLikes({
					postId: postId,
					isLiked: false,
				}).then(() => {
          renderPostsPageComponent()
				});
			} else {
				addLikes({
					postId: postId,
					isLiked: false,
				}).then(() => {
          renderPostsPageComponent()
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
			goToPage(USER_POSTS_PAGE, {
				userId: userEl.dataset.userId,
			});
		});
	}
	initEventListeners();
}
