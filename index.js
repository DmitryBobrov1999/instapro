import { getPosts, getUserPost } from './api.js';
import { renderAddPostPageComponent } from './components/add-post-page-component.js';
import { renderAuthPageComponent } from './components/auth-page-component.js';
import { renderHeaderComponent } from './components/header-component.js';

import {
	ADD_POSTS_PAGE,
	AUTH_PAGE,
	LOADING_PAGE,
	POSTS_PAGE,
	USER_POSTS_PAGE,
} from './routes.js';
import { renderPostsPageComponent } from './components/posts-page-component.js';
import { renderLoadingPageComponent } from './components/loading-page-component.js';
import {
	getUserFromLocalStorage,
	removeUserFromLocalStorage,
	saveUserToLocalStorage,
} from './helpers.js';

export let user = getUserFromLocalStorage();
export let page = null;
export let allPosts = [];

export const getToken = () => {
	const token = user ? `Bearer ${user.token}` : undefined;
	return token;
};

export const logout = () => {
	user = null;
	removeUserFromLocalStorage();
	goToPage(POSTS_PAGE);
};

/**
 * Включает страницу приложения
 */
export const goToPage = (newPage, data) => {
	if (
		[
			POSTS_PAGE,
			AUTH_PAGE,
			ADD_POSTS_PAGE,
			USER_POSTS_PAGE,
			LOADING_PAGE,
		].includes(newPage)
	) {
		if (newPage === ADD_POSTS_PAGE) {
			// Если пользователь не авторизован, то отправляем его на авторизацию перед добавлением поста
			page = user ? ADD_POSTS_PAGE : AUTH_PAGE;
			return renderApp();
		}

		if (newPage === POSTS_PAGE) {
			page = LOADING_PAGE;
			renderApp();

			return getPosts({ token: getToken() })
				.then(newPosts => {
					page = POSTS_PAGE;
					allPosts = newPosts;
					renderApp();
				})
				.catch(error => {
					console.error(error);
					goToPage(POSTS_PAGE);
				});
		}

		if (newPage === USER_POSTS_PAGE) {
			// TODO: реализовать получение постов юзера из API
			// console.log('Открываю страницу пользователя: ', data.userId);
			allPosts = [];
			page = LOADING_PAGE;
			renderApp();
			return getUserPost()
				.then(newPosts => {
					page = USER_POSTS_PAGE;
					allPosts = newPosts;
					renderApp();
				})
				.catch(error => {
					console.error(error);
					goToPage(USER_POSTS_PAGE);
				});
		}

		page = newPage;
		renderApp();

		return;
	}

	throw new Error('страницы не существует');
};
export const appEl = document.getElementById('app');
const renderApp = () => {
	if (page === LOADING_PAGE) {
		return renderLoadingPageComponent({
			appEl,
			user,
			goToPage,
		});
	}

	if (page === AUTH_PAGE) {
		return renderAuthPageComponent({
			appEl,
			setUser: newUser => {
				user = newUser;
				saveUserToLocalStorage(user);
				goToPage(POSTS_PAGE);
			},
			user,
			goToPage,
		});
	}

	if (page === ADD_POSTS_PAGE) {
		return renderAddPostPageComponent({
			appEl,
			onAddPostClick({ description, imageUrl }) {
				// TODO: реализовать добавление поста в API
				console.log('Добавляю пост...', { description, imageUrl });
				goToPage(POSTS_PAGE);
			},
		});
	}

	if (page === POSTS_PAGE) {
		return renderPostsPageComponent({
			appEl,
		});
	}

	if (page === USER_POSTS_PAGE) {
		// TODO: реализовать страницу фотографию пользователя
		appEl.innerHTML = ` <div class="page-container">
      <div class="header-container">
  <div class="page-header">
      <h1 class="logo">instapro</h1>
      <button class="header-button add-or-login-button">
      <div title="Добавить пост" class="add-post-sign"></div>
      </button>
      <button title="Дмитрий Бобров" class="header-button logout-button">Выйти</button>       
  </div>
</div>

<div class="posts-user-header">
                    <img src="https://storage.yandexcloud.net/skypro-webdev-homework-bucket/1682539071684-Chrysanthemum.jpg" class="posts-user-header__user-image">
                    <p class="posts-user-header__user-name">djon198360</p>
                </div>`;

		renderHeaderComponent({
			element: document.querySelector('.header-container'),
		});
		renderPostsPageComponent();
		return;
	}
};

goToPage(POSTS_PAGE);
