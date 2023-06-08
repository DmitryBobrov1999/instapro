import { renderPostsPageComponent } from './components/posts-page-component.js';

const personalKey = 'dmitry-bobrov';
const baseHost = 'https://webdev-hw-api.vercel.app';
const postsHost = `${baseHost}/api/v1/${personalKey}/instapro`;

let allPosts = [];

import { formatDistanceToNow } from './node_modules/date-fns';

export function getPosts({ token }) {
  return fetch(postsHost, {
    method: 'GET',
    headers: {
      Authorization: token,
    },
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
          date: formatDistanceToNow(createDate, currentDate),
          id: post.user.id,
          image: post.user.imageUrl,
          postImage: post.imageUrl,
          dataId: post.id,
          description: post.description,
        };
      });
      renderPostsPageComponent();
    });
}



export function uploadPost({ token, description, imageUrl }) {

	return fetch(postsHost, {
		headers: {
			Authorization: token,
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

// Загружает картинку в облако, возвращает url загруженной картинки
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

export { allPosts };