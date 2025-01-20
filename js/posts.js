const postsPerPage = 6;
let currentPage = 1;
let posts = [];

// Fetch posts data
fetch('./posts.json')
  .then(response => response.json())
  .then(data => {
    posts = data;
    displayPosts();
  })
  .catch(error => console.error('Error loading posts:', error));

// Function to display posts
function displayPosts() {
  const postContainer = document.querySelector('.row.gx-4.gx-lg-5');
  postContainer.innerHTML = ''; // Clear previous posts

  const start = (currentPage - 1) * postsPerPage;
  const end = start + postsPerPage;
  const pagePosts = posts.slice(start, end);

  pagePosts.forEach(post => {
    const postCard = `
      <div class="col-md-6 mb-4">
        <div class="card bg-light text-black h-100 border-0">
          <div class="card-body">
            <img src="${post.image}" class="card-img-top mb-3" alt="Post Image" style="max-height: 200px; object-fit: cover;">
            <a href="${post.link}" class="text-black">
              <h2 class="card-title">${post.title}</h2>
            </a>
            <p class="fs-6">${post.description}</p>
            <p class="card-text">
              Posted by <a href="./about.html" class="text-black">${post.author}</a> on ${post.date}
            </p>
          </div>
        </div>
      </div>
    `;
    postContainer.innerHTML += postCard;
  });

  updatePager();
}

// Function to update the pager
function updatePager() {
  const pager = document.querySelector('.d-flex.justify-content-end');
  const totalPages = Math.ceil(posts.length / postsPerPage);
  pager.innerHTML = `
    <button class="btn btn-primary text-uppercase me-2" ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(-1)">← Newer Posts</button>
    <button class="btn btn-primary text-uppercase" ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage(1)">Older Posts →</button>
  `;
}

// Function to change the page
function changePage(direction) {
  currentPage += direction;
  displayPosts();
}
