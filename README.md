# 📚 Catálogo de Livros - Flask

Esta é uma aplicação simples em Flask que funciona como um catálogo de livros. A aplicação permite adicionar livros à lista, exibir suas capas e buscar informações sobre os livros utilizando a API do Open Library. Além disso, há um tradutor básico para buscar títulos semelhantes em português com base no autor digitado.

![Imagem da Aplicação](![image](https://github.com/user-attachments/assets/4d1b4036-78b1-4129-8ee5-16412dd61e5d))

## 🚀 Funcionalidades
- **Adicionar Livros**: Adicione novos livros à lista fornecendo o título e o autor.
- **Exibir Capas**: A aplicação consome a API do Open Library para buscar e exibir as capas dos livros.
- **Tradutor de Títulos**: Como a API busca livros em inglês, há um tradutor básico que tenta encontrar um título semelhante em português com base no autor digitado.

## 🛠️ Instalação
Antes de começar, certifique-se de ter o Python instalado na sua máquina. Verifique a versão instalada com:

```bash
python --version
```
Se o Python não estiver instalado, baixe-o em [python.org](https://www.python.org/).

### 1️⃣ Clone o repositório
```bash
git clone [https://github.com/lupajr/catalogo_livros.git](https://github.com/lupajr/catalogo_livros.git)
cd catalogo_livros
```

### 2️⃣ Crie um ambiente virtual (opcional, mas recomendado)
```bash
python -m venv venv
```

### 3️⃣ Ative o ambiente virtual
No Windows:
```bash
venv\Scripts\activate
```
No macOS/Linux:
```bash
source venv/bin/activate
```

### 4️⃣ Instale as dependências
```bash
pip install -r requirements.txt
```

## ▶️ Executando a Aplicação

```bash
flask --app app.app run
```
A aplicação estará disponível em: [http://127.0.0.1:5000/](http://127.0.0.1:5000/)

## 📂 Estrutura do Projeto
```
app/
|-- app.py           # Inicialização da aplicação
|-- templates/       # Templates HTML
|-- static/          # Imagem genérica de capa de livro
requirements.txt     # Lista de dependências do projeto
README.md            # Este arquivo com informações sobre o projeto
```

## 🌍 API Utilizada
A aplicação utiliza a [API do Open Library](https://openlibrary.org/developers/api) para buscar informações sobre os livros e exibir suas capas.

## 📜 Licença
Este projeto está sob a [MIT License](LICENSE).


