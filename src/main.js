//Elementos del DOM
const elements = {
    form: document.getElementById("searchForm"),
    input: document.getElementById("searchInput"),
    error: document.getElementById("error"),
    loading: document.getElementById("loading"),
    results: document.getElementById("results"),
};

//Configuración: parametros de API
const config = {
    baseUrl: "https://openlibrary.org/search.json", // URL base de la API para buscar libros.
    coverUrl: "https://covers.openlibrary.org/b/id", // URL base para obtener las imágenes de portada de los libros.
    limit: 12, // Límite de resultados por búsqueda.
};

//Funciones auxiliares
const showError = (message) => {
    elements.error.style.display = "block"; // Muestra el mensaje de error.
    elements.error.textContent = message; // Establece el contenido del mensaje de error.
};

const hideError = () => {
    elements.error.style.display = "none";
};

const showLoading = () => {
    elements.loading.style.display = "block";
};

const hideLoading = () => {
    elements.loading.style.display = "none";
};

const clearResults = () => {
    elements.results.innerHTML = "";
};

// Función para crear la tarjeta de cada libro que se mostrará en la página.
const createBookCard = (book) => {
    const {
        title, // Título del libro.
        cover_i: coverId, // ID de la portada del libro.
        author_name: authors = ["Desconocido"], // Nombre del autor, si no se encuentra, se usa 'Desconocido'.
        first_publish_year: year = "Desconocido", // Año de la primera publicación del libro.
    } = book;

    // Genera la URL de la portada si existe el ID, sino asigna null.
    const imageUrl = coverId ? `${config.coverUrl}/${coverId}-M.jpg` : null;

    // Si hay imagen, se muestra, sino muestra un mensaje que dice que no hay portada disponible.
    const imageElement = imageUrl ?
        `<img src="${imageUrl}" alt="${title}" class="book-image">` :
        `<div class="book-image no-image">Sin portada disponible</div>`; // Retorna el HTML de la tarjeta con los datos del libro.
    return `
            <div class="book-item">
                ${imageElement}
                <div class="book-info">
                    <h3>${title}</h3>
                    <p><strong>Autor:</strong> ${authors[0]}</p>
                    <p><strong>Año:</strong> ${year}</p>
                </div>
            </div>
            `;
};

// Event Listeners: Escuchamos el evento de envío del formulario para realizar la búsqueda.

elements.form.addEventListener("submit", async(e) => {
    e.preventDefault();

    const searchTerm = elements.input.value.trim();

    if (!searchTerm) {
        showError("Por favor, introduce un título para buscar");
        return;
    }

    hideError();
    clearResults();
    showLoading();

    try {
        const url = new URL(config.baseUrl);
        url.searchParams.append("title", searchTerm);
        url.searchParams.append("limit", config.limit);

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Error en la petición a la API");
        }

        const { docs } = await response.json();

        if (docs.length === 0) {
            elements.results.innerHTML =
                '<div class="no-results">No se encontraron libros con ese título.</div>';
            return;
        }

        const booksHTML = docs.map(createBookCard).join("");
        elements.results.innerHTML = booksHTML;
    } catch (error) {
        showError(
            "Ha ocurrido un error al buscar los libros. Por favor, inténtalo de nuevo."
        );
        console.error("Error:", error);
    } finally {
        hideLoading();
    }
});