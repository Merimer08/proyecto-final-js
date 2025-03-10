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
    e.preventDefault(); // Previene el comportamiento predeterminado del formulario (recargar la página).

    const searchTerm = elements.input.value.trim(); // Toma el valor del campo de búsqueda y lo recorta de espacios innecesarios.

    // Si no se introdujo texto, muestra un mensaje de error.
    if (!searchTerm) {
        showError("Por favor, introduce un título para buscar");
        return;
    }

    hideError(); // Oculta cualquier error anterior.
    clearResults(); // Limpia los resultados anteriores.
    showLoading(); // Muestra el mensaje de carga.

    try {
        // Construye la URL con los parámetros de búsqueda.
        const url = new URL(config.baseUrl);
        url.searchParams.append("title", searchTerm); // Agrega el término de búsqueda a la URL.
        url.searchParams.append("limit", config.limit); // Limita los resultados a 12.

        // Realiza la solicitud HTTP a la API para buscar los libros.
        const response = await fetch(url);

        // Si la respuesta no es exitosa (status no ok), lanza un error.
        if (!response.ok) {
            throw new Error("Error en la petición a la API");
        }

        // Convierte la respuesta JSON en un objeto y extrae los libros (docs).
        const { docs } = await response.json();

        // Si no se encontraron libros, muestra un mensaje en lugar de los resultados.
        if (docs.length === 0) {
            elements.results.innerHTML =
                '<div class="no-results">No se encontraron libros con ese título.</div>';
            return;
        }

        // Crea el HTML para cada libro y lo inserta en el contenedor de resultados.
        const booksHTML = docs.map(createBookCard).join("");
        elements.results.innerHTML = booksHTML;
    } catch (error) {
        // Si ocurre un error en el proceso, muestra el mensaje de error.
        showError(
            "Ha ocurrido un error al buscar los libros. Por favor, inténtalo de nuevo."
        );
        console.error("Error:", error); // Muestra el error en la consola para depuración.
    } finally {
        hideLoading(); // Oculta el mensaje de carga, sin importar si la solicitud fue exitosa o falló.
    }
});