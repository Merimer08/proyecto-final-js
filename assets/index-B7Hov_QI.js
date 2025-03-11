(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))i(e);new MutationObserver(e=>{for(const o of e)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function s(e){const o={};return e.integrity&&(o.integrity=e.integrity),e.referrerPolicy&&(o.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?o.credentials="include":e.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(e){if(e.ep)return;e.ep=!0;const o=s(e);fetch(e.href,o)}})();const n={form:document.getElementById("searchForm"),input:document.getElementById("searchInput"),error:document.getElementById("error"),loading:document.getElementById("loading"),results:document.getElementById("results")},c={baseUrl:"https://openlibrary.org/search.json",coverUrl:"https://covers.openlibrary.org/b/id",limit:12},m=r=>{n.error.style.display="block",n.error.textContent=r},l=()=>{n.error.style.display="none"},p=()=>{n.loading.style.display="block"},f=()=>{n.loading.style.display="none"},y=()=>{n.results.innerHTML=""},g=r=>{const{title:t,cover_i:s,author_name:i=["Desconocido"],first_publish_year:e="Desconocido"}=r,o=s?`${c.coverUrl}/${s}-M.jpg`:null;return`
            <div class="book-item">
                ${o?`<img src="${o}" alt="${t}" class="book-image">`:'<div class="book-image no-image">Sin portada disponible</div>'}
                <div class="book-info">
                    <h3>${t}</h3>
                    <p><strong>Autor:</strong> ${i[0]}</p>
                    <p><strong>Año:</strong> ${e}</p>
                </div>
            </div>
            `},h=(r,t)=>{let s;return function(...e){const o=()=>{clearTimeout(s),r(...e)};clearTimeout(s),s=setTimeout(o,t)}},d=async r=>{if(!r){l(),y();return}try{p(),l();const t=new URL(c.baseUrl);t.searchParams.append("title",r),t.searchParams.append("limit",c.limit);const s=await fetch(t);if(!s.ok)throw new Error("Error en la petición a la API");const{docs:i}=await s.json();if(i.length===0){n.results.innerHTML='<div class="no-results">No se encontraron libros con ese título.</div>';return}const e=i.map(g).join("");n.results.style.opacity="0",n.results.innerHTML=e,setTimeout(()=>{n.results.style.opacity="1"},150)}catch(t){m("Ha ocurrido un error al buscar los libros. Por favor, inténtalo de nuevo."),console.error("Error:",t)}finally{f()}},b=h(r=>d(r),300);n.form.addEventListener("submit",async r=>{r.preventDefault();const t=n.input.value.trim();d(t)});n.input.addEventListener("input",r=>{const t=r.target.value.trim();b(t)});const u=document.createElement("style");u.textContent=`
    .results {
        transition: opacity 0.3s ease-in-out;
    }
    .book-item {
        animation: fadeIn 0.5s ease-in-out;
    }
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;document.head.appendChild(u);
