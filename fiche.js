// ============================================================
// fiche.js : le petit programme commun à toutes les fiches vélo.
// Chaque fiche l'appelle avec <script src="fiche.js"></script>.
// ============================================================

// 1) Menu : transparent sur la photo, fond noir dès qu'on fait défiler
const menu = document.querySelector('.menu');
function verifierDefilement() {
  menu.classList.toggle('fond-noir', window.scrollY > 50);
}
window.addEventListener('scroll', verifierDefilement);
verifierDefilement();

// 2) Photos qui défilent en haut de la fiche (s'il y en a plusieurs)
const diapo = document.querySelector('.fiche-diapo');
if (diapo) {
  const photos = diapo.querySelectorAll('img');
  const zonePoints = diapo.querySelector('.points');
  let numero = 0;
  let minuteur;

  // Crée automatiquement un petit trait par photo
  photos.forEach(function (photo, i) {
    const point = document.createElement('span');
    point.className = 'point' + (i === 0 ? ' actif' : '');
    zonePoints.appendChild(point);
  });
  const points = zonePoints.querySelectorAll('.point');
  photos[0].classList.add('visible');

  // Affiche la photo demandée (boucle : après la dernière, retour à la première)
  function montrer(nouveau) {
    photos[numero].classList.remove('visible');
    points[numero].classList.remove('actif');
    numero = (nouveau + photos.length) % photos.length;
    photos[numero].classList.add('visible');
    points[numero].classList.add('actif');
  }

  // Avance tout seul toutes les 5 secondes
  function relancer() {
    clearInterval(minuteur);
    minuteur = setInterval(function () { montrer(numero + 1); }, 5000);
  }

  diapo.querySelector('.fleche-gauche').addEventListener('click', function () { montrer(numero - 1); relancer(); });
  diapo.querySelector('.fleche-droite').addEventListener('click', function () { montrer(numero + 1); relancer(); });
  relancer();
}
