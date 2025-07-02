let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

export function getFavoritos() {
  return favoritos;
}

export function toggleFavorito(user) {
  const index = favoritos.findIndex(fav => fav.id === user.id);
  if (index === -1) {
    favoritos.push(user);
  } else {
    favoritos.splice(index, 1);
  }
  localStorage.setItem("favoritos", JSON.stringify(favoritos));
}

export function setFavoritos(nuevosFavoritos) {
  favoritos = nuevosFavoritos;
  localStorage.setItem("favoritos", JSON.stringify(favoritos));
}
