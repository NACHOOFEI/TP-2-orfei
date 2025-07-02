export function createCardErr(msj) {
  const div = document.createElement('div');
  div.innerHTML = `<p>${msj}</p>`;
  return div;
}
