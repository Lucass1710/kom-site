// ============================================================
// menu.js : le petit programme du menu ☰, commun à toutes les pages.
// Sur téléphone, un appui sur ☰ ouvre le menu plein écran ;
// un nouvel appui (sur ✕) ou un appui sur un lien le referme.
// ============================================================

const barreMenu = document.querySelector('.menu');
const boutonBurger = document.querySelector('.burger');

function ouvrirFermerMenu(ouvrir) {
  barreMenu.classList.toggle('ouvert', ouvrir);
  document.body.classList.toggle('menu-ouvert', ouvrir);   // bloque le défilement de la page derrière
  boutonBurger.setAttribute('aria-expanded', ouvrir);
  boutonBurger.setAttribute('aria-label', ouvrir ? 'Fermer le menu' : 'Ouvrir le menu');
}

if (boutonBurger) {
  boutonBurger.addEventListener('click', function () {
    ouvrirFermerMenu(!barreMenu.classList.contains('ouvert'));
  });

  // Un appui sur un lien du menu le referme (utile pour les liens de la même page)
  barreMenu.querySelectorAll('.liens a').forEach(function (lien) {
    lien.addEventListener('click', function () { ouvrirFermerMenu(false); });
  });

  // La touche Échap referme aussi le menu
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') ouvrirFermerMenu(false);
  });
}

// ============================================================
// Barre fixe en bas de l'écran (visible seulement sur téléphone) :
// « Appeler » et « Rendez-vous », toujours à portée de pouce.
// Elle est créée ici une seule fois pour toutes les pages :
// pour changer le numéro, il suffit de le modifier ci-dessous.
// ============================================================
const TELEPHONE = '+33638822219';   // 06 38 82 22 19

// Pas de barre sur la page Rendez-vous : elle a déjà ses propres boutons
if (!location.pathname.endsWith('rendez-vous.html')) {
  const barre = document.createElement('div');
  barre.className = 'barre-contact';
  barre.innerHTML =
    '<a href="tel:' + TELEPHONE + '"><span class="icone-tel"></span>Appeler</a>' +
    '<a href="rendez-vous.html" class="plein">Rendez-vous</a>';
  document.body.appendChild(barre);
  document.body.classList.add('avec-barre');
}

// ============================================================
// Glisser les photos avec le doigt (téléphone et tablette).
// Sur chaque diaporama du site, un glissement vers la gauche
// « appuie » sur la flèche ›, vers la droite sur la flèche ‹.
// Les diaporamas concernés : accueil, fiches et cartes du catalogue.
// ============================================================
const diaporamas = [
  { zone: '.diaporama',  gauche: '.fleche-gauche',       droite: '.fleche-droite' },        // accueil
  { zone: '.fiche-diapo', gauche: '.fleche-gauche',      droite: '.fleche-droite' },        // fiches
  { zone: '.carte-diapo', gauche: '.mini-fleche.gauche', droite: '.mini-fleche.droite' }    // catalogue
];

diaporamas.forEach(function (d) {
  document.querySelectorAll(d.zone).forEach(function (zone) {
    let departX = 0, departY = 0;

    zone.addEventListener('touchstart', function (e) {
      departX = e.touches[0].clientX;     // où le doigt se pose
      departY = e.touches[0].clientY;
    }, { passive: true });

    zone.addEventListener('touchend', function (e) {
      const ecartX = e.changedTouches[0].clientX - departX;   // de combien le doigt a glissé
      const ecartY = e.changedTouches[0].clientY - departY;
      // Il faut un vrai glissement horizontal (plus de 40 pixels, et plus large que haut)
      // pour ne pas gêner le défilement normal de la page vers le bas.
      if (Math.abs(ecartX) < 40 || Math.abs(ecartX) < Math.abs(ecartY) * 1.5) return;
      const fleche = zone.querySelector(ecartX < 0 ? d.droite : d.gauche);
      if (fleche) fleche.click();
    }, { passive: true });
  });
});
