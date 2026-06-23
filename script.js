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
const dialogRemove = document.getElementById("dialogRemover");
const dialogRemoveConfirmButton = document.getElementById("btn-remover-confirmar");
const dialogRemoveCancelButton = document.getElementById("btn-remover-cancelar")
const dialogEdit = document.getElementById("dialogEditar");
const dialogEditConfirmButton = document.getElementById("btn-editar-confirmar");
const dialogEditCancelButton = document.getElementById("btn-editar-cancelar");
const dialogAdd = document.getElementById("dialogAdicionar");
const dialogAddConfirmButton = document.getElementById("btn-adicionar-confirmar");
const dialogAddCancelButton = document.getElementById("btn-adicionar-cancelar");
const notification = document.getElementById("notificação");
const notificationTitle = document.getElementById("notificação-titulo");
const notificationBody = document.getElementById("notificação-corpo");
const loading = document.getElementById("loading");
const body = document.body;
let posts = [];
let users = [];


let allDivs = [postList, userList, addUser, addPost, editUser, editPost];
let allButtons = [add, edit, remove];
let usersDiv = [userList, addUser, editUser];
let postsDiv = [postList, addPost, editPost];
let usersLength = 1;
let postsLength = 1;

document.body.onload = async () => {
    body.classList.add('is-loading');
    loading.style.display = 'flex';

    users = await fetchData(endpointUser);
    usersLength = users.length;
    posts = await fetchData(endpointPosts);
    postsLength = posts.length;
    lastOption = 'post';
    optionsSelector.value = 'post';

    initialVisibility();
    visibleList("post");
    optionsSelectorFunction("post");
    body.classList.remove('is-loading');
    loading.style.display = 'none';
}




editButton.addEventListener('click', () => {
    if (lastOption === 'user') {
        dialogEdit.querySelector('h1').textContent = `Tem certeza que deseja editar este usuário?`;
    } else if (lastOption === 'post') {
        dialogEdit.querySelector('h1').textContent = `Tem certeza que deseja editar esta postagem?`;
    }
    dialogEdit.showModal();

    dialogEditConfirmButton.onclick = () => {
        editItem();
        dialogEdit.close();
    };
    dialogEditCancelButton.onclick = () => {
        dialogEdit.close();
    };
})

const editItem = () => {
    const select = document.getElementById("select-options");
    const id = select.value;
    const lastPostsLength = posts.length;
    const elementsEdit = document.getElementById("editar-usuario").children;
    const elementsEditPost = document.getElementById("editar-postagem").children;
    if (users.length > usersLength) usersLength = users.length;
    if (posts.length > postsLength) postsLength = posts.length;
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
        showNotification("Usuário editado", `O usuário ${users.find(user => user.id == id).name} foi editado com sucesso.`);
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
        showNotification("Postagem editada", `A postagem "${posts.find(post => post.id == id).title}" foi editada com sucesso.`);
        fetchAndDisplayPosts();
    }
    optionsSelectorFunction(lastOption);
}

const showNotification = (title, body) => {
    notificationTitle.textContent = title;
    notificationBody.textContent = body;
    notification.style.display = 'block';
    notification.style.animation = 'fadeIn 0.5s, fadeOut 0.5s 2.5s';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}



removeButton.addEventListener('click', () => {
    const select = document.getElementById("remove-options");
    if (lastOption === 'user') {
        dialogRemove.querySelector('h1').textContent = `Tem certeza que deseja remover ${users.find(user => user.id == select.value)?.name}? Ele(a) e todas as suas postagens serão removidos.`;
    } else if (lastOption === 'post') {
        dialogRemove.querySelector('h1').textContent = `Tem certeza que deseja remover esta postagem?`;
    }
    dialogRemove.showModal();

    dialogRemoveConfirmButton.onclick = () => {
        removeItem();
        dialogRemove.close();
    };
    dialogRemoveCancelButton.onclick = () => {
        dialogRemove.close();
    };
})

const removeItem = () => {
    const select = document.getElementById("remove-options");
    const id = select.value;
    if (users.length > usersLength) usersLength = users.length;
    if (lastOption === 'user') {
        const user = users.find(user => user.id == id);
        console.log(user);
        users.splice(users.indexOf(user), 1);
        postsToRemove = posts.filter(post => post.userId == id);
        postsToRemove.forEach(post => {
            posts.splice(posts.indexOf(post), 1);
            postsLength++;
        });
        showNotification("Usuário removido", `O usuário ${user.name} e suas postagens foram removidos com sucesso.`);
        fetchAndDisplayUsers();
    }
    else if (lastOption === 'post') {
        const post = posts.find(post => post.id == id);
        posts.splice(posts.indexOf(post), 1);
        showNotification("Postagem removida", `A postagem "${post.title}" foi removida com sucesso.`);
        fetchAndDisplayPosts();
    }
    usersLength++;
    postsLength++;
    optionsSelectorFunction(lastOption);
}

const addItem = () => {
    if (lastOption === 'user') {
        if (!document.getElementById("name").value || !document.getElementById("email").value) {
            showNotification("Erro ao adicionar usuário", "Por favor, preencha os campos obrigatórios");
            return;
        }
        if (users.length > usersLength) {
            usersLength = users.length;
        }
        if (posts.length > postsLength) {
            postsLength = posts.length;
        }
        let newUser = {
            id: usersLength + 1,
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value || '',
            username: document.getElementById("username").value || '',
            address: {
                street: document.getElementById("street").value || '',
                city: document.getElementById("city").value || '',
                zipcode: document.getElementById("zipcode").value || ''
            }
        }
        users.push(newUser);
        console.log(users);
        showNotification("Usuário adicionado", `O usuário ${newUser.name} foi adicionado com sucesso.`);
        fetchAndDisplayUsers();
    } else if (lastOption === 'post') {
        if (!document.getElementById("title").value || !document.getElementById("body").value || !document.getElementById("userId").value) {
            showNotification("Erro ao adicionar postagem", "Por favor, preencha todos os campos para adicionar uma postagem.");
            return;
        }
        const newPost = {
            id: postsLength + 1,
            title: document.getElementById("title").value,
            body: document.getElementById("body").value,
            userId: parseInt(document.getElementById("userId").value)
        }
        posts.push(newPost);
        showNotification("Postagem adicionada", `A postagem "${newPost.title}" foi adicionada com sucesso.`);
        fetchAndDisplayPosts();
    }
    optionsSelectorFunction(lastOption);
}

addButton.addEventListener('click', () => {
    dialogAdd.showModal();

    dialogAddConfirmButton.onclick = () => {
        addItem();
        dialogAdd.close();
    };
    dialogAddCancelButton.onclick = () => {
        dialogAdd.close();
    };
    

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
                Object.keys(user.address).forEach(key => {
                    if (child.id === `edit-${key}` && id == user.id) {
                        child.value = user.address[key];
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
        const userAddress = document.createElement('p');
        const postsParagraph = document.createElement('p');
        const userPosts = posts.filter(post => post.userId === user.id);
        postCount = userPosts.length;
        userEmail.textContent = `Email: ${user.email}`;
        userAddress.textContent = `Endereço: ${user.address.street}, ${user.address.city}, ${user.address.zipcode}`; 
        postsParagraph.textContent = `Número de postagens: ${postCount}`;
        userItem.appendChild(userName);
        userItem.appendChild(userEmail);
        userItem.appendChild(userAddress);
        userItem.appendChild(postsParagraph);
        ulUsers.appendChild(userItem);
    });
    editAutoComplete(lastOption === 'user' ? users[0].id : posts[0].id);
}

const fetchAndDisplayPosts = () => {
    postList.innerHTML = '<ul id="ul-postagens"><h2>Postagens</h2></ul>';
    const ulPosts = document.getElementById("ul-postagens");
    
    const usersSelector = document.getElementById("userId");
    usersSelector.innerHTML = '';

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