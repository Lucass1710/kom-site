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
  const toutesLesPhotos = [...diapo.querySelectorAll('img')];
  const zonePoints = diapo.querySelector('.points');
  let photos = [];     // les photos affichées en ce moment (toutes, ou celles d'un coloris)
  let points = [];
  let numero = 0;
  let minuteur;

  // Prépare le diaporama avec une liste de photos : un petit trait par photo, la 1re visible
  function preparer(liste) {
    toutesLesPhotos.forEach(function (p) {
      p.classList.remove('visible');
      p.classList.toggle('hors-coloris', !liste.includes(p));   // cache les photos des autres coloris
    });
    photos = liste;
    zonePoints.innerHTML = '';
    photos.forEach(function (photo, i) {
      const point = document.createElement('span');
      point.className = 'point' + (i === 0 ? ' actif' : '');
      zonePoints.appendChild(point);
    });
    points = [...zonePoints.querySelectorAll('.point')];
    numero = 0;
    photos[0].classList.add('visible');
    // Une seule photo ? On cache les flèches et les traits
    diapo.classList.toggle('une-seule-photo', photos.length < 2);
  }

  // Affiche la photo demandée (boucle : après la dernière, retour à la première)
  function montrer(nouveau) {
    if (photos.length < 2) return;
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

  // 3) Coloris cliquables (si la fiche en a) : chaque photo porte data-coloris="..."
  //    (ou "tous" si elle ne montre pas un coloris précis), chaque bouton aussi.
  //    data-fond indique le type de photo : "noir" (studio sombre, par défaut),
  //    "ambiance" (en extérieur) ou "blanc" (catalogue sur fond blanc).
  //    Les photos sur fond noir passent TOUJOURS en premier, le fond blanc en dernier.
  const rangFond = { noir: 0, ambiance: 1, blanc: 2 };
  function trierParFond(liste) {
    return liste.slice().sort(function (a, b) {
      return (rangFond[a.dataset.fond] || 0) - (rangFond[b.dataset.fond] || 0);
    });
  }
  const boutonsColoris = [...document.querySelectorAll('.coloris button[data-coloris]')];
  function choisirColoris(nom) {
    boutonsColoris.forEach(function (b) {
      const choisi = b.dataset.coloris === nom;
      b.classList.toggle('actif', choisi);
      b.setAttribute('aria-pressed', choisi);
    });
    // « tous » = toutes les photos ; sinon seulement celles du coloris choisi
    const liste = nom === 'tous'
      ? toutesLesPhotos
      : toutesLesPhotos.filter(function (p) { return p.dataset.coloris === nom; });
    preparer(trierParFond(liste.length ? liste : toutesLesPhotos));
    relancer();
  }
  boutonsColoris.forEach(function (b) {
    b.addEventListener('click', function () { choisirColoris(b.dataset.coloris); });
  });

  // Au chargement : le coloris marqué « actif » dans la page, sinon toutes les photos
  const depart = boutonsColoris.find(function (b) { return b.classList.contains('actif'); });
  if (depart) choisirColoris(depart.dataset.coloris);
  else { preparer(trierParFond(toutesLesPhotos)); relancer(); }
}
