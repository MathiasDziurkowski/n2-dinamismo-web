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
const addButton = document.getElementById("btn-adicionar");
const editButton = document.getElementById("btn-editar");
const editPost = document.getElementById("editar-postagem");
const removeButton = document.getElementById("btn-remover");
const body = document.body;
let posts = [];
let users = [];
let lastOption = '';

let allDivs = [postList, userList, addUser, addPost, editUser, editPost];
let allButtons = [add, edit, remove];
let usersDiv = [userList, addUser, editUser];
let postsDiv = [postList, addPost, editPost];

document.body.onload = async () => {
    initialVisibility();
    users = await fetchData(endpointUser);
    posts = await fetchData(endpointPosts);  
}

editButton.addEventListener('click', () => {
    const select = document.getElementById("select-options");
    const id = select.value;
    const elementsEdit = document.getElementById("editar-usuario").children;
    const elementsEditPost = document.getElementById("editar-postagem").children;
    if (lastOption === 'user') {
        for (let element of elementsEdit) {
            const user = users.find(user => user.id == id);
            Object.keys(user).forEach(key => {
                if (element.id === `edit-${key}` && id == user.id) {
                    users.splice(users.indexOf(user), 1, {
                        ...user,
                        [key]: element.value
                    });
                }
            })
        }  
        fetchAndDisplayUsers(); 
    } else if (lastOption === 'post') {
        for (let element of elementsEditPost) {
            const post = posts.find(post => post.id == id);
            Object.keys(post).forEach(key => {
                if (element.id === `edit-${key}` && id == post.id) {
                    posts.splice(posts.indexOf(post), 1, {
                        ...post,
                        [key]: element.value
                    });
                    console.log(post);
                }
            })
        }
        fetchAndDisplayPosts();
    }
    optionsSelectorFunction(lastOption);
})

removeButton.addEventListener('click', () => {  
    const select = document.getElementById("remove-options");
    const id = select.value;
    if (lastOption === 'user') {
        const user = users.find(user => user.id == id);
        users.splice(users.indexOf(user), 1);
        fetchAndDisplayUsers();
    }
    else if (lastOption === 'post') {
        const post = posts.find(post => post.id == id);
        posts.splice(posts.indexOf(post), 1);
        fetchAndDisplayPosts();
    }
    optionsSelectorFunction(lastOption);
})

addButton.addEventListener('click', () => {
    if (lastOption === 'user') {
        const newUser = {
            id: users.length + 1,
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
        }
        users.push(newUser);
        fetchAndDisplayUsers();
    } else if (lastOption === 'post') {
        const newPost = {
            id: posts.length + 1,
            title: document.getElementById("title").value,
            body: document.getElementById("body").value,
            userId: parseInt(document.getElementById("userId").value)
        }
        posts.push(newPost);
        fetchAndDisplayPosts();
    }
    optionsSelectorFunction(lastOption);
})

const optionsSelectorFunction = (opt) => {
    const select = document.createElement('select');
    const removeSelect = document.createElement('select');
    let options = [];
    removeSelect.id = 'remove-options';
    select.id = 'select-options';
    if (opt === 'user') {
        users.forEach(user => {
            const option = document.createElement('option');
            option.value = user.id;
            option.id = "user-option";
            option.textContent = user.name;
            select.appendChild(option);
            removeSelect.appendChild(option.cloneNode(true));
        });
        document.getElementById("select-options")?.remove();
        document.getElementById("remove-options")?.remove();
        removeSelect.remove();
        
    } else if (opt === 'post') {
        posts.forEach(post => {
            const option = document.createElement('option');
            option.value = post.id;
            option.id = "post-option";
            option.textContent = post.title;
            select.appendChild(option);
            removeSelect.appendChild(option.cloneNode(true));
        });
        document.getElementById("select-options")?.remove();
        document.getElementById("remove-options")?.remove();
    }
    remove.appendChild(removeSelect);
    edit.appendChild(select);
}

const editAutoComplete = (id) => {
    console.log(id);
    if (lastOption === 'user') {
        users.forEach(user => {
            const elementEdit = document.getElementById("editar-usuario");
            const select = document.getElementById("select-options");
            for (let child of elementEdit.children) {
                Object.keys(user).forEach(key => {
                    if (child.id === `edit-${key}` && id == user.id) {
                        child.value = user[key];
                        console.log(child.value);
                    }
                })
            }
        })
    } else if (lastOption === 'post') {
        posts.forEach(post => {
            const elementEdit = document.getElementById("editar-postagem");
            const select = document.getElementById("select-options");
            for (let child of elementEdit.children) {
                Object.keys(post).forEach(key => {
                    if (child.id === `edit-${key}` && id == post.id) {
                        child.value = post[key];
                        console.log(child.value);
                    }
                })
            }
        })
    }
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
            list.style.display = '';
        });
        fetchAndDisplayUsers();
        visibleButtons(opt);
    } else if (opt === 'post') {
        postsDiv.forEach(list => {
            list.style.display = '';
        }); 
        fetchAndDisplayPosts();
        visibleButtons(opt);
    }

    
}

const visibleButtons = (opt) => {
    allButtons.forEach(button => {
        button.style.display = '';
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

const fetchAndDisplayUsers = () => {
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

const fetchAndDisplayPosts = () => {
    postList.innerHTML = '<ul id="ul-postagens"><h2>Postagens</h2></ul>';
    const ulPosts = document.getElementById("ul-postagens");
    
    const usersSelector = document.getElementById("userId");

    posts.forEach(post => {
        const postItem = document.createElement('li');
        const title = document.createElement('h3');
        title.textContent = `${post.title}`;
        postItem.textContent = `${post.body}`;
        ulPosts.appendChild(postItem);
        postItem.prepend(title)
        const userName = document.createElement('p');
        const user = users.find(user => user.id === post.userId);
        userName.textContent = `Autor: ${user ? user.name : 'Desconhecido'}`;
        postItem.appendChild(userName);
    });

    users.forEach(user => {
        const option = document.createElement('option');
        option.value = user.id;
        option.textContent = user.name;
        usersSelector.appendChild(option);
     });
}

optionsSelector.addEventListener('change', (event) => {
    visibleList(event.target.value);
    optionsSelectorFunction(event.target.value);
    lastOption = event.target.value;
})

document.addEventListener('change', (event) => {
    if (event.target.id === "select-options") {
        editAutoComplete(event.target.value);
    }
})