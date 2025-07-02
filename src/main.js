import './style.css';

const apiUrl = "https://rickandmortyapi.com/api/character";


const main = document.getElementById("app");
const search = document.getElementById("search");
const button = document.getElementById("btnSearch");
const filter = document.getElementById("filtrado");
const ordenar = document.getElementById("ordenar");
const btnFav = document.getElementById("ver-favoritos");
const btnPrev = document.getElementById("prev");
const btnNext = document.getElementById("next");
const paginaActual = document.getElementById("pagina-actual");
const paginacion = document.getElementById("paginacion");


let personajesBase = [];
let personajesFiltrados = [];
let currentPage = 1;
let totalPages = 1;
let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
let mostrandoFavoritos = false;


function guardarFavoritos() {
  localStorage.setItem("favoritos", JSON.stringify(favoritos));
}

function toggleFavorito(user) {
  const index = favoritos.findIndex(f => f.id === user.id);
  if (index === -1) favoritos.push(user);
  else favoritos.splice(index, 1);
  guardarFavoritos();
}

function createCardErr(msj) {
  const div = document.createElement("div");
  const p = document.createElement("p");
  p.textContent = msj;
  div.appendChild(p);
  return div;
}

function createCardUser(user) {
  const card = document.createElement("div");
  card.className = "cardUser";

  const esFavorito = favoritos.some(f => f.id === user.id);

  card.innerHTML = `
    <h3>${user.name}</h3>
    <img src="${user.image}" alt="${user.name}">
    <p>${user.status}</p>
    <button class="btn-fav">${esFavorito ? "★" : "☆"}</button>
  `;

  card.querySelector(".btn-fav").addEventListener("click", (e) => {
    e.stopPropagation();
    toggleFavorito(user);
    actualizarVista();
  });

  card.addEventListener("click", () => mostrarDetalle(user));

  return card;
}

function mostrarDetalle(user) {
  const detalle = document.getElementById("detalle-container");
  detalle.classList.remove("oculto");
  detalle.innerHTML = `
    <img src="${user.image}" alt="${user.name}">
    <h2>${user.name}</h2>
    <p><strong>Status:</strong> ${user.status}</p>
    <p><strong>Species:</strong> ${user.species}</p>
    <p><strong>Gender:</strong> ${user.gender}</p>
    <p><strong>Origin:</strong> ${user.origin.name}</p>
    <button id="cerrar-detalle">Cerrar</button>
  `;

  document.getElementById("cerrar-detalle").addEventListener("click", () => {
    detalle.classList.add("oculto");
    detalle.innerHTML = "";
  });

  detalle.scrollIntoView({ behavior: "smooth" });
}


async function fetchPersonajes(pagina = 1) {
  const res = await fetch(`${apiUrl}?page=${pagina}`);
  return await res.json();
}

async function buscarPorNombre(nombre) {
  let resultados = [];
  let pagina = 1;
  let seguir = true;

  while (seguir) {
    const res = await fetch(`${apiUrl}?page=${pagina}`);
    const data = await res.json();
    const coincidencias = data.results.filter(user =>
      user.name.toLowerCase().includes(nombre)
    );
    resultados = resultados.concat(coincidencias);
    if (!data.info.next) seguir = false;
    else pagina++;
  }

  return resultados;
}


function renderPersonajes(lista) {
  main.innerHTML = '';
  if (lista.length === 0) {
    main.appendChild(createCardErr("No se encontraron personajes"));
    return;
  }
  lista.forEach(user => {
    main.appendChild(createCardUser(user));
  });
}

function aplicarFiltroYOrden() {
  const estado = filter.value;
  if (estado === "") {
    personajesFiltrados = [...personajesBase];
  } else {
    personajesFiltrados = personajesBase.filter(u =>
      u.status.toLowerCase() === estado.toLowerCase()
    );
  }

  const orden = ordenar.value;
  if (orden === "A-Z") {
    personajesFiltrados.sort((a, b) => a.name.localeCompare(b.name));
  } else if (orden === "Z-A") {
    personajesFiltrados.sort((a, b) => b.name.localeCompare(a.name));
  }

  renderPersonajes(personajesFiltrados);
}

function actualizarPaginacion() {
  paginaActual.textContent = `Página ${currentPage} de ${totalPages}`;
  btnPrev.disabled = currentPage === 1;
  btnNext.disabled = currentPage === totalPages;
  paginacion.style.display = "flex";
  paginacion.style.justifyContent = "center";
}

function actualizarVista() {
  if (mostrandoFavoritos) {
    main.innerHTML = '';
    const favs = favoritos;
    if (favs.length === 0) {
      main.appendChild(createCardErr("Aún no tienes personajes favoritos."));
    } else {
      renderPersonajes(favs);
    }
    paginacion.style.display = "none";
  } else {
    mostrarTodos(currentPage);
  }
}


async function mostrarTodos(pagina = 1) {
  try {
    const data = await fetchPersonajes(pagina);
    personajesBase = data.results;
    currentPage = pagina;
    totalPages = data.info.pages;
    aplicarFiltroYOrden();
    actualizarPaginacion();
  } catch (error) {
    main.innerHTML = '';
    main.appendChild(createCardErr("Error al cargar los personajes"));
    paginacion.style.display = "none";
  }
}


button.addEventListener("click", async (e) => {
  e.preventDefault();
  const valor = search.value.trim().toLowerCase();
  if (valor === "") {
     mostrandoFavoritos = false; 
    btnFav.textContent = "Ver Favoritos"; 
    filter.value = "";
    ordenar.value = "";
    await mostrarTodos(1); 
    return;
  }

  try {
    const resultado = await buscarPorNombre(valor);
    personajesBase = resultado;
    personajesFiltrados = resultado;
    renderPersonajes(personajesFiltrados);
    totalPages = 1;
    currentPage = 1;
    actualizarPaginacion();
    paginacion.style.display = "none";
  } catch (e) {
    main.innerHTML = '';
    main.appendChild(createCardErr("Error al buscar personajes"));
  }
});

search.addEventListener("keydown", (e) => {
  if (e.key === "Enter") button.click();
});

filter.addEventListener("change", () => {
  if (!mostrandoFavoritos) aplicarFiltroYOrden();
});

ordenar.addEventListener("change", () => {
  if (!mostrandoFavoritos) aplicarFiltroYOrden();
});

btnPrev.addEventListener("click", () => {
  if (currentPage > 1) mostrarTodos(currentPage - 1);
});

btnNext.addEventListener("click", () => {
  if (currentPage < totalPages) mostrarTodos(currentPage + 1);
});

btnFav.addEventListener("click", () => {
  mostrandoFavoritos = !mostrandoFavoritos;
  btnFav.textContent = mostrandoFavoritos ? "Volver" : "Ver Favoritos";
  actualizarVista();
});

// muestra todos desde el inicio
mostrarTodos();
