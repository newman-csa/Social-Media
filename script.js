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

let user = null;
fetchData('https://jsonplaceholder.typicode.com/users/1')
  .then((data) => {
    user = data;
    document.querySelector('#profile-name').textContent = user.name;
  })
  .then(console.log);

fetchImage('https://unsplash.it/300/200?random&blur=3')
  .then((url) => (document.querySelector('#background-image').src = url))
  .catch(console.error);

fetchImage('https://unsplash.it/150/?random')
  .then((url) => (document.querySelector('#profile-picture').src = url))
  .catch(console.error);

// const endpointPath = 'https://jsonplaceholder.typicode.com/users';
// const endpointPaths = Array(3)
//   .fill(null)
//   .map((_, i) => `${endpointPath}/${i + 1}`);

// fetchMultiple(endpointPaths)
//   .then((data) => data.map((user) => user.address))
//   .then(
//     (addresses) =>
//       (document.querySelector('#main-content').lastChild.textContent =
//         JSON.stringify(addresses))
//   )
//   .catch(console.error);
