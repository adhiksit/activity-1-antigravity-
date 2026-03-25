// Elements
const dogBtn = document.getElementById('btn-dog');
const dogContent = document.getElementById('dog-content');
const loadingDog = document.getElementById('loading-dog');

const jokeBtn = document.getElementById('btn-joke');
const jokeContent = document.getElementById('joke-content');
const loadingJoke = document.getElementById('loading-joke');

const userBtn = document.getElementById('btn-user');
const userContent = document.getElementById('user-content');
const loadingUser = document.getElementById('loading-user');

const jsonBtn = document.getElementById('btn-json');
const jsonContent = document.getElementById('json-content');
const loadingJson = document.getElementById('loading-json');

const toast = document.getElementById('toast');

// Utility Functions
function showLoading(overlayElement) {
    overlayElement.style.display = 'flex';
}

function hideLoading(overlayElement) {
    overlayElement.style.display = 'none';
}

function renderError(containerElement, message) {
    containerElement.innerHTML = `<div class="error-msg">⚠️ ${message}</div>`;
}

function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// 1. Dog Image Functionality
async function fetchDog() {
    showLoading(loadingDog);
    try {
        const res = await fetch('https://dog.ceo/api/breeds/image/random');
        if (!res.ok) throw new Error('Failed to fetch dog image');
        
        const data = await res.json();
        const imageUrl = data.message;
        
        // Extract breed from URL (format: https://images.dog.ceo/breeds/hound-afghan/n02085465_1001.jpg)
        const parts = imageUrl.split('/');
        let breed = parts[4];
        if(breed) {
            breed = breed.replace('-', ' ');
        } else {
            breed = 'Unknown breed';
        }

        dogContent.innerHTML = `
            <div class="dog-image-container">
                <img src="${imageUrl}" alt="A cute dog">
            </div>
            <div class="breed-badge">${breed}</div>
        `;
        
        // Modify buttons - check if 'Copy URL' button exists, if not create it
        const cardActions = document.querySelector('#dog-card .card-actions');
        if (!document.getElementById('btn-copy-dog')) {
            const copyBtn = document.createElement('button');
            copyBtn.id = 'btn-copy-dog';
            copyBtn.className = 'secondary-btn';
            copyBtn.textContent = 'Copy URL';
            cardActions.appendChild(copyBtn);
            
            copyBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(imageUrl).then(() => {
                    showToast('Image URL copied!');
                }).catch(err => {
                    showToast('Failed to copy URL');
                });
            });
        }
        
    } catch (error) {
        renderError(dogContent, error.message);
    } finally {
        hideLoading(loadingDog);
    }
}

// 2. Joke Generator Functionality
async function fetchJoke() {
    showLoading(loadingJoke);
    try {
        const res = await fetch('https://official-joke-api.appspot.com/random_joke');
        if (!res.ok) throw new Error('Failed to fetch joke');
        
        const data = await res.json();
        
        jokeContent.innerHTML = `
            <div class="joke-setup">${data.setup}</div>
            <div class="joke-punchline">${data.punchline}</div>
        `;
        
        // Update button text to 'Next Joke'
        jokeBtn.textContent = 'Next Joke';
        
    } catch (error) {
        renderError(jokeContent, error.message);
    } finally {
        hideLoading(loadingJoke);
    }
}

// 3. Random User Profile Functionality
async function fetchUser() {
    showLoading(loadingUser);
    try {
        const res = await fetch('https://randomuser.me/api/');
        if (!res.ok) throw new Error('Failed to fetch user');
        
        const data = await res.json();
        const user = data.results[0];
        
        const fullName = `${user.name.first} ${user.name.last}`;
        const photo = user.picture.large;
        const email = user.email;
        const country = user.location.country;
        const age = user.dob.age;
        
        userContent.innerHTML = `
            <img src="${photo}" alt="${fullName}" class="user-avatar">
            <div class="user-name">${fullName}</div>
            <div class="user-details">
                <p>📧 ${email}</p>
                <p>🌍 ${country}</p>
                <p>🎂 Age: ${age}</p>
            </div>
        `;
        
    } catch (error) {
        renderError(userContent, error.message);
    } finally {
        hideLoading(loadingUser);
    }
}

// 4. JSONPlaceholder Functionality
async function fetchPosts() {
    showLoading(loadingJson);
    try {
        // Fetch only 5 posts to keep the UI clean
        const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=4');
        if (!res.ok) throw new Error('Failed to fetch posts');
        
        const posts = await res.json();
        
        let postsHtml = '<ul class="post-list">';
        posts.forEach(post => {
            postsHtml += `
                <li class="post-item">
                    <div class="post-title">${post.title}</div>
                    <div class="post-body">${post.body}</div>
                </li>
            `;
        });
        postsHtml += '</ul>';
        
        jsonContent.innerHTML = postsHtml;
        
        // Reload Posts button
        jsonBtn.textContent = 'Reload Posts';
        
    } catch (error) {
        renderError(jsonContent, error.message);
    } finally {
        hideLoading(loadingJson);
    }
}

// Event Listeners
dogBtn.addEventListener('click', fetchDog);
jokeBtn.addEventListener('click', fetchJoke);
userBtn.addEventListener('click', fetchUser);
jsonBtn.addEventListener('click', fetchPosts);
