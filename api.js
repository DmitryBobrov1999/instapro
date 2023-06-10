import {
	renderPostsPageComponent
} from './components/posts-page-component.js';
import { getToken } from './index.js';

import { formatDistance } from './node_modules/date-fns';

import {ru} from 'date-fns/locale'

const personalKey = 'dmitry-bobrov';
const baseHost = 'https://webdev-hw-api.vercel.app';
const postsHost = `${baseHost}/api/v1/${personalKey}/instapro`;

let allPosts = [];



export function getPosts() {
	return fetch(postsHost, {
		method: 'GET',
	})
		.then(response => {
			if (response.status === 401) {
				throw new Error('Нет авторизации');
			}
			return response.json();
		})
		.then(responseData => {
			allPosts = responseData.posts.map(post => {
				const createDate = new Date(post.createdAt);
				const currentDate = new Date();
				return {
					name: post.user.name,
					date:
						formatDistance(createDate, currentDate, { locale: ru }) + ' назад',
					userId: post.user.id,
					image: post.user.imageUrl,
					postImage: post.imageUrl,
					postId: post.id,
					description: post.description,
					likes: '',
					isLiked: post.isLiked,
				};
			});

			renderPostsPageComponent();
		});
}

export function getUserPost() {
	const id = window.localStorage.getItem('userId');
	return fetch(
		`https://wedev-api.sky.pro/api/v1/${personalKey}/instapro/user-posts/${id}`,
		{
			method: 'GET',
		}
	)
		.then(response => {
			if (response.status === 401) {
				throw new Error('Нет авторизации');
			}
			return response.json();
		})
		.then(responseData => {
			allPosts = responseData.posts.map(post => {
				const createDate = new Date(post.createdAt);
				const currentDate = new Date();

				return {
					name: post.user.name,
					date: formatDistance(createDate, currentDate, { locale: ru }),
					userId: post.user.id,
					image: post.user.imageUrl,
					postImage: post.imageUrl,
					postId: post.id,
					description: post.description,
					likes: post.likes,
					isLiked: null,
				};
			});
			renderPostsPageComponent();
		})
		.catch(error => {
			console.log(error);
		});
}

export function uploadPost({ description, imageUrl }) {
	return fetch(postsHost, {
		headers: {
			Authorization: getToken(),
		},
		method: 'POST',
		body: JSON.stringify({
			description: description,
			imageUrl: imageUrl,
		}),
	})
		.then(response => {
			if (response.status === 400) {
				throw new Error('Неверный запрос');
			}
			if (response.status === 500) {
				throw new Error('Ошибка сервера');
			} else {
				return response.json();
			}
		})
		.then(() => {
			return getPosts();
		});
}

export function registerUser({ login, password, name, imageUrl }) {
	return fetch(baseHost + '/api/user', {
		method: 'POST',
		body: JSON.stringify({
			login,
			password,
			name,
			imageUrl,
		}),
	}).then(response => {
		if (response.status === 400) {
			throw new Error('Такой пользователь уже существует');
		}
		return response.json();
	});
}

export function loginUser({ login, password }) {
	return fetch(baseHost + '/api/user/login', {
		method: 'POST',
		body: JSON.stringify({
			login,
			password,
		}),
	}).then(response => {
		if (response.status === 400) {
			throw new Error('Неверный логин или пароль');
		}
		return response.json();
	});
}

export function uploadImage({ file }) {
	const data = new FormData();
	data.append('file', file);

	return fetch(baseHost + '/api/upload/image', {
		method: 'POST',
		body: data,
	}).then(response => {
		return response.json();
	});
}

export function addLikes({ postId, isLiked}) {
	return fetch(`${baseHost}/api/v1/${personalKey}/instapro/${postId}/like`, {
		headers: {
			Authorization: getToken(),
		},
		method: 'POST',
		body: {
			isLiked,
		},
	})
		.then(response => {
			if (response.status === 401) {
				throw new Error('Нет авторизации');
			}
			return response.json();
		})
		.catch(error => {
			console.log(error);
		});
}

export function removeLikes({ postId, isLiked }) {
	return fetch(`${baseHost}/api/v1/${personalKey}/instapro/${postId}/dislike`, {
		headers: {
			Authorization: getToken(),
		},
		method: 'POST',
		body: {
			isLiked,
		},
	})
		.then(response => {
			if (response.status === 401) {
				throw new Error('Нет авторизации');
			}
			return response.json();
		})
		.catch(error => {
			console.log(error);
		});
}

export { allPosts };
