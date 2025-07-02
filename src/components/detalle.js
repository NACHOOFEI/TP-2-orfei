export function mostrarDetalle(user) {
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
