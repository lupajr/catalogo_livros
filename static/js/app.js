let currentBookId = null;

// Função para renderizar a lista de livros
async function renderBooks() {
    const books = await api.getBooks();
    const bookList = document.getElementById("bookList");
    bookList.innerHTML = "";

    for (const book of books) {
        const coverUrl = await api.fetchBookCover(book.title, book.author);

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

// Event Listeners e Handlers
document.getElementById("addBookForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.getElementById("title").value.trim();
    const author = document.getElementById("author").value.trim();

    if (!title || !author) {
        alert("Por favor preencha ambos os campos!");
        return;
    }

    await api.addBook(title, author);
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    await renderBooks();
});

// Funções para o modal de edição
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

    errorDiv.classList.add('d-none');
    ['editTitle', 'editAuthor'].forEach(field => {
        document.getElementById(field).classList.remove('is-invalid');
    });

    let isValid = true;
    if (!title || !author) {
        errorDiv.classList.remove('d-none');
        errorDiv.textContent = "É necessário preencher os dois campos!";
        isValid = false;

        if (!title) document.getElementById('editTitle').classList.add('is-invalid');
        if (!author) document.getElementById('editAuthor').classList.add('is-invalid');
    }

    if (!isValid) return;

    try {
        saveBtn.disabled = true;
        spinner.classList.remove('d-none');

        await api.updateBook(id, title, author);
        bootstrap.Modal.getInstance(document.getElementById("editModal")).hide();
        await renderBooks();
    } catch (error) {
        errorDiv.classList.remove('d-none');
        errorDiv.textContent = error.message;
    } finally {
        saveBtn.disabled = false;
        spinner.classList.add('d-none');
    }
});

// Funções para o modal de exclusão
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

        await api.deleteBook(currentBookId);
        await renderBooks();

        bootstrap.Modal.getInstance(document.getElementById('deleteModal')).hide();
    } catch (error) {
        alert('Erro ao excluir o livro');
    } finally {
        deleteBtn.disabled = false;
        spinner.classList.add('d-none');
    }
});

// Inicialização
renderBooks();