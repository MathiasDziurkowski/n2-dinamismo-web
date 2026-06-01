const endpointUser = 'https://jsonplaceholder.typicode.com/users';
const endpointPosts = 'https://jsonplaceholder.typicode.com/posts';

const optionsSelector = document.getElementById('opt');
const add = document.getElementById('adicionar');
const edit = document.getElementById('editar');
const remove = document.getElementById('remover');
const postList = document.getElementById("lista-postagens");
const userList = document.getElementById("lista-usuarios");
const addUser = document.getElementById("adicionar-usuario");
const addPost = document.getElementById("adicionar-postagem");
const editUser = document.getElementById("editar-usuario");
const editPost = document.getElementById("editar-postagem");
const body = document.body;
let posts = [];
let users = [];

let allDivs = [postList, userList, addUser, addPost, editUser, editPost];
let allButtons = [add, edit, remove];
let usersDiv = [userList, addUser, editUser];
let postsDiv = [postList, addPost, editPost];

document.body.onload = async () => {
    initialVisibility();
    users = await fetchData(endpointUser);
    posts = await fetchData(endpointPosts);
}


const fetchData = async (endpoint) => {
    try {
        const response = await fetch(endpoint);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

const visibleList = (opt) => {

    initialVisibility();
    if (opt === 'user') {
        usersDiv.forEach(list => {
            list.style.display = 'block';
        });
        fetchAndDisplayUsers();
        visibleButtons(opt);
    } else if (opt === 'post') {
        postsDiv.forEach(list => {
            list.style.display = 'block';
        }); 
        fetchAndDisplayPosts();
        visibleButtons(opt);
    }

    
}

const visibleButtons = (opt) => {
    allButtons.forEach(button => {
        button.style.display = 'block';
    });
}

const initialVisibility = () => {
    allDivs.forEach(list => {
        list.style.display = 'none';
    });
    allButtons.forEach(button => {
        button.style.display = 'none';
    })
}

const fetchAndDisplayUsers = async () => {
    userList.innerHTML = '<ul id="ul-usuarios"><h2>Usuários</h2></ul>';
    const ulUsers = document.getElementById("ul-usuarios");
    let postCount = 0;
    users.forEach(user => {
        const userItem = document.createElement('li');
        userItem.id = "user-list-item";
        const userName = document.createElement('p');
        userName.textContent = `Nome: ${user.name}`;
        const userEmail = document.createElement('p');
        const postsParagraph = document.createElement('p');
        let userPosts = posts.filter(post => post.userId === user.id);
        postCount = userPosts.length;
        userEmail.textContent = `Email: ${user.email}`;
        postsParagraph.textContent = `Número de postagens: ${postCount}`;
        userItem.appendChild(userName);
        userItem.appendChild(userEmail);
        userItem.appendChild(postsParagraph);
        ulUsers.appendChild(userItem);
    });
}

const fetchAndDisplayPosts = async () => {
    postList.innerHTML = '<ul id="ul-postagens"><h2>Postagens</h2></ul>';
    const ulPosts = document.getElementById("ul-postagens");
    
    posts.forEach(post => {
        const postItem = document.createElement('li');
        postItem.textContent = `${post.title}`;
        ulPosts.appendChild(postItem);
        const userName = document.createElement('p');
        const user = users.find(user => user.id === post.userId);
        userName.textContent = `Autor: ${user ? user.name : 'Desconhecido'}`;
        postItem.appendChild(userName);
    });
}

optionsSelector.addEventListener('change', (event) => {
    visibleList(event.target.value);
})