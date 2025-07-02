export function actualizarPaginacion(currentPage, totalPages, paginaActualEl, btnPrevEl, btnNextEl) {
  paginaActualEl.textContent = `Página ${currentPage} de ${totalPages}`;
  btnPrevEl.disabled = currentPage === 1;
  btnNextEl.disabled = currentPage === totalPages;
}
