let currentBookId = null;

// Objeto para armazenar as capas já carregadas
const cachedCovers = {};

async function fetchBooks() {
    try {
        const response = await fetch("/book");
        if (!response.ok) {
            throw new Error("Erro ao carregar livros");
        }
        const books = await response.json();
        const bookList = document.getElementById("bookList");
        bookList.innerHTML = "";

        for (const book of books) {
            const coverUrl = await fetchBookCover(book.title);
            console.log("URL da capa para o livro:", book.title, "->", coverUrl); // Depuração

            const bookCard = `
                <div class="col-md-4">
                    <div class="book-card">
                        <img src="${coverUrl || '/static/placeholder.jpg'}" class="book-cover" alt="Capa do livro">
                        <h5>${book.title}</h5>
                        <p>Autor: ${book.author}</p>
                        <div class="d-grid gap-2">
                            <button class="btn btn-edit btn-sm" 
                                    onclick="openEditModal(${book.id}, '${book.title.replace(/'/g, "\\'")}', '${book.author.replace(/'/g, "\\'")}')">
                                Editar
                            </button>
                            <button class="btn btn-delete btn-sm" 
                                    onclick="openDeleteModal(${book.id})">
                                Excluir
                            </button>
                        </div>
                    </div>
                </div>
            `;
            bookList.innerHTML += bookCard;
        }
    } catch (error) {
        console.error("Erro ao carregar livros:", error);
    }
}

try {
    let response = await fetch(`https://openlibrary.org/search.json?title=${encodeURIComponent(title)}`);
    let data = await response.json();

    if (data.docs && data.docs.length > 0) {
        const coverId = data.docs[0].cover_i;
        if (coverId) {
            const coverUrl = `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
            cachedCovers[title] = coverUrl; // Armazena a capa no cache
            return coverUrl;
        }
    }

    // Se não encontrar, tentar buscar o título em inglês usando uma API de tradução
    const translatedTitle = await translateToEnglish(title);
    if (translatedTitle !== title) {
        response = await fetch(`https://openlibrary.org/search.json?title=${encodeURIComponent(translatedTitle)}`);
        data = await response.json();

        if (data.docs && data.docs.length > 0) {
            const coverId = data.docs[0].cover_i;
            if (coverId) {
                const coverUrl = `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
                cachedCovers[title] = coverUrl; // Armazena a capa no cache
                return coverUrl;
            }
        }
    }

    // Se ainda não encontrar, buscar pelo autor e verificar títulos semelhantes
    if (author) {
        response = await fetch(`https://openlibrary.org/search.json?author=${encodeURIComponent(author)}`);
        data = await response.json();

        if (data.docs && data.docs.length > 0) {
            for (const book of data.docs) {
                if (book.title.toLowerCase().includes(title.toLowerCase()) || title.toLowerCase().includes(book.title.toLowerCase())) {
                    if (book.cover_i) {
                        const coverUrl = `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
                        cachedCovers[title] = coverUrl; // Armazena a capa no cache
                        return coverUrl;
                    }
                }
            }
        }
    }

    return null; // Se não encontrar nada
} catch (error) {
    console.error("Erro ao buscar capa do livro:", error);
    return null;
}
}

// Função para adicionar um novo livro
async function addNewBook(title, author) {
    const coverUrl = await fetchBookCover(title, author);

    if (coverUrl) {
        const bookCard = `
            <div class="col-md-4">
                <div class="book-card">
                    <img src="${coverUrl || '/static/placeholder.jpg'}" class="book-cover" alt="Capa do livro">
                    <h5>${title}</h5>
                    <p>Autor: ${author}</p>
                    <div class="d-grid gap-2">
                        <button class="btn btn-edit btn-sm" 
                                onclick="openEditModal(${book.id}, '${title.replace(/'/g, "\\'")}', '${author.replace(/'/g, "\\'")}')">
                            Editar
                        </button>
                        <button class="btn btn-delete btn-sm" 
                                onclick="openDeleteModal(${book.id})">
                            Excluir
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.getElementById("bookList").innerHTML += bookCard;
    } else {
        console.log(`Não foi possível encontrar a capa para o livro: ${title}`);
    }
}

// Função para traduzir um título para inglês usando a API de tradução gratuita (exemplo com MyMemory API)
async function translateToEnglish(text) {
    try {
        const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=pt|en`);
        const data = await response.json();
        return data.responseData.translatedText || text;
    } catch (error) {
        console.error("Erro ao traduzir título:", error);
        return text;
    }
}


// Função para carregar a lista de livros
async function fetchBooks() {
    const response = await fetch("/book");
    const books = await response.json();
    const bookList = document.getElementById("bookList");
    bookList.innerHTML = "";

    for (const book of books) {
        const coverUrl = await fetchBookCover(book.title);
        console.log("URL da capa para o livro:", book.title, "->", coverUrl); // Depuração

        const bookCard = `
    <div class="col-md-4">
        <div class="book-card">
            <img src="${coverUrl || '/static/placeholder.jpg'}" class="book-cover" alt="Capa do livro">
            <h5>${book.title}</h5>
            <p>Autor: ${book.author}</p>
            <div class="d-grid gap-2">
                <button class="btn btn-edit btn-sm" 
                        onclick="openEditModal(${book.id}, '${book.title.replace(/'/g, "\\'")}', '${book.author.replace(/'/g, "\\'")}')">
                    Editar
                </button>
                <button class="btn btn-delete btn-sm" 
                        onclick="openDeleteModal(${book.id})">
                    Excluir
                </button>
            </div>
        </div>
    </div>
`;
        bookList.innerHTML += bookCard;
    }
}

// Adicionar livro
document.getElementById("addBookForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.getElementById("title").value.trim();
    const author = document.getElementById("author").value.trim();

    if (!title || !author) {
        alert("Por favor preencha ambos os campos!");
        return;
    }

    await fetch("/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, author })
    });

    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    await fetchBooks();
});

// Funções de edição
function openEditModal(id, title, author) {
    document.getElementById("editError").classList.add('d-none');
    ['editTitle', 'editAuthor'].forEach(field => {
        document.getElementById(field).classList.remove('is-invalid');
    });

    document.getElementById("editId").value = id;
    document.getElementById("editTitle").value = title;
    document.getElementById("editAuthor").value = author;
    new bootstrap.Modal(document.getElementById("editModal")).show();
}

document.getElementById("saveEdit").addEventListener("click", async () => {
    const saveBtn = document.getElementById("saveEdit");
    const spinner = saveBtn.querySelector('.spinner-border');
    const errorDiv = document.getElementById("editError");

    const id = document.getElementById("editId").value;
    const title = document.getElementById("editTitle").value.trim();
    const author = document.getElementById("editAuthor").value.trim();

    // Resetar estados anteriores
    errorDiv.classList.add('d-none');
    ['editTitle', 'editAuthor'].forEach(field => {
        document.getElementById(field).classList.remove('is-invalid');
    });

    // Validação modificada
    let isValid = true;
    if (!title || !author) {
        errorDiv.classList.remove('d-none');
        errorDiv.textContent = "É necessário preencher os dois campos!";
        isValid = false;

        // Destacar apenas os campos vazios
        if (!title) document.getElementById('editTitle').classList.add('is-invalid');
        if (!author) document.getElementById('editAuthor').classList.add('is-invalid');
    }

    if (!isValid) return;

    saveBtn.disabled = true;
    spinner.classList.remove('d-none');

    try {
        const response = await fetch(`/book/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, author })
        });

        if (!response.ok) throw new Error("Erro ao atualizar o livro");

        bootstrap.Modal.getInstance(document.getElementById("editModal")).hide();
        await fetchBooks();
    } catch (error) {
        errorDiv.classList.remove('d-none');
        errorDiv.textContent = error.message;
    } finally {
        saveBtn.disabled = false;
        spinner.classList.add('d-none');
    }
});

// Funções de exclusão
function openDeleteModal(id) {
    currentBookId = id;
    new bootstrap.Modal(document.getElementById('deleteModal')).show();
}

document.getElementById('confirmDelete').addEventListener('click', async () => {
    const deleteBtn = document.getElementById('confirmDelete');
    const spinner = deleteBtn.querySelector('.spinner-border');

    try {
        deleteBtn.disabled = true;
        spinner.classList.remove('d-none');

        await fetch(`/book/${currentBookId}`, { method: "DELETE" });
        await fetchBooks();

        bootstrap.Modal.getInstance(document.getElementById('deleteModal')).hide();
    } catch (error) {
        alert('Erro ao excluir o livro');
    } finally {
        deleteBtn.disabled = false;
        spinner.classList.add('d-none');
    }
});

// Inicialização
fetchBooks();