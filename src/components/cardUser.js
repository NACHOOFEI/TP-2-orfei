import { toggleFavorito } from '../utils/favoritos.js';

export function createCardUser(user, favoritos, mostrandoFavoritos, actualizarVista) {
  const cardUser = document.createElement("div");
  cardUser.className = "cardUser";
  const esFavorito = favoritos.some(fav => fav.id === user.id);

  cardUser.innerHTML = `
    <h3>${user.name}</h3>
    <img src="${user.image}" alt="${user.name}">
    <p>${user.status}</p>
    <button class="btn-fav">${esFavorito ? "★" : "☆"}</button>
  `;

  cardUser.querySelector(".btn-fav").addEventListener("click", (e) => {
    e.stopPropagation();
    toggleFavorito(user);
    actualizarVista();
  });

  cardUser.addEventListener("click", () => {
    import('./detalle.js').then(({ mostrarDetalle }) => mostrarDetalle(user));
  });

  return cardUser;
}
