// Cache para as capas dos livros
const cachedCovers = {};

// Funções de API
const api = {
    // Buscar capa do livro
    async fetchBookCover(title, author) {
        if (cachedCovers[title]) {
            return cachedCovers[title];
        }

        try {
            let response = await fetch(`https://openlibrary.org/search.json?title=${encodeURIComponent(title)}`);
            let data = await response.json();

            if (data.docs && data.docs.length > 0) {
                const coverId = data.docs[0].cover_i;
                if (coverId) {
                    const coverUrl = `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
                    cachedCovers[title] = coverUrl;
                    return coverUrl;
                }
            }

            // Se não encontrar, tentar com o autor
            if (author) {
                response = await fetch(`https://openlibrary.org/search.json?author=${encodeURIComponent(author)}`);
                data = await response.json();

                if (data.docs && data.docs.length > 0) {
                    for (const book of data.docs) {
                        if (book.cover_i) {
                            const coverUrl = `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
                            cachedCovers[title] = coverUrl;
                            return coverUrl;
                        }
                    }
                }
            }

            return null;
        } catch (error) {
            console.error("Erro ao buscar capa do livro:", error);
            return null;
        }
    },

    // CRUD Operations
    async getBooks() {
        const response = await fetch("/book");
        return await response.json();
    },

    async addBook(title, author) {
        const response = await fetch("/book", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, author })
        });
        return await response.json();
    },

    async updateBook(id, title, author) {
        const response = await fetch(`/book/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, author })
        });
        return await response.json();
    },

    async deleteBook(id) {
        await fetch(`/book/${id}`, { method: "DELETE" });
    }
};