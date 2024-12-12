/**
 *
 * @param {string} endpointPath
 * @returns {Promise<Object>} JSON Data
 * @throws Throw error if the fetch request fails
 */
async function fetchData(endpointPath) {
  try {
    const response = await fetch(endpointPath);
    if (!response.ok) throw new Error(`HTTP Status: ${response.status}`);
    const data = await response.json();
    return data;
  } catch (err) {
    return Promise.reject(err);
  }
}

/**
 *
 * @param {string[]} endpointPaths
 * @returns {Promise<Object[]>} JSON Data
 * @throws Throw error if any of the fetch requests fail.
 */
async function fetchMultiple(endpointPaths) {
  try {
    const responses = await Promise.all(
      endpointPaths.map((endpointPath) => fetch(endpointPath))
    );
    if (!responses.every((response) => response.ok)) {
      throw new Error(
        `HTTP Status: ${responses
          .filter((response) => !response.ok)
          .map((response) => response.status)}`
      );
    }
    const data = await Promise.all(
      responses.map((response) => response.json())
    );
    return data;
  } catch (err) {
    return Promise.reject(err);
  }
}

/**
 *
 * @param {string} endpointPath
 * @returns idk something
 */
async function fetchImage(endpointPath) {
  try {
    const response = await fetch(endpointPath);
    if (!response.ok) throw new Error(`HTTP Status: ${response.status}`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (err) {
    return Promise.reject(err);
  }
}

async function getProfilePicture() {
  try {
    const url = await fetchImage('https://unsplash.it/15/');
    return url;
  } catch (err) {
    console.error(err);
  }
}

async function renderPosts(endpointPaths) {
  try {
    const posts = await fetchMultiple(endpointPaths);

    const profilePicture = posts.map(() => getProfilePicture());
    const profilePictures = await Promise.all(profilePicture);

    const profileName = posts.map((post) =>
      fetchData(`https://jsonplaceholder.typicode.com/users/${post.id}`).then(
        (user) => user.name
      )
    );
    const profileNames = await Promise.all(profileName);

    for (const [index, post] of posts.entries()) {
      const url = profilePictures[index];
      const name = profileNames[index];

      const div = document.createElement('div');

      div.classList.add('post');
      div.innerHTML = `
      <h3>${capitalize(
        post.title
      )} <span class="post-author">by <img src="${url}" alt="Profile Picture"> ${name}</span></h3>
      <p>${capitalize(post.body)}</p>
      <div class="post-actions">
      <button type="button"><i class="fa-solid fa-comments"></i> Comments</button>
      <button type="button"><i class="fa-solid fa-share"></i> Share</button>
      </div>
      `;
      document.querySelector('#main-content').appendChild(div);
      document
        .querySelector('#main-content')
        .appendChild(document.createElement('hr'));
    }
  } catch (err) {
    console.error(err);
  }
}

function capitalize(text) {
  return String(text).charAt(0).toUpperCase() + String(text).slice(1);
}

function initMap(x, y) {
  let map = L.map('map').setView([x, y], 13);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
}

document.addEventListener('DOMContentLoaded', () => {
  fetchData('https://jsonplaceholder.typicode.com/users/1')
    .then((user) => {
      console.log(user);

      document.querySelector('#profile-name').textContent = user.name;
      document.querySelector(
        '#profile-contact'
      ).textContent = `${user.phone} ・ ${user.email} ・ ${user.website}`;
      document.querySelector(
        '#profile-address'
      ).textContent = `${user.address.street}, ${user.address.suite}, ${user.address.city}, ${user.address.zipcode}`;
      initMap(53.3995432, -0.7728464);
    })
    .catch(console.error);

  fetch('/assets/profile-desc.txt')
    .then((response) => response.text())
    .then((text) => {
      document.querySelector('#profile-bio').textContent = text;
    })
    .catch(console.error);

  fetchImage('https://unsplash.it/300/200?random&blur=3')
    .then((url) => (document.querySelector('#background-image').src = url))
    .catch(console.error);

  fetchImage('https://unsplash.it/150/?random')
    .then((url) => (document.querySelector('#profile-picture').src = url))
    .catch(console.error);

  const endpointPath = 'https://jsonplaceholder.typicode.com/posts';
  const endpointPaths = Array(10)
    .fill(null)
    .map((_, i) => `${endpointPath}/${i + 1}`);

  renderPosts(endpointPaths);
});
