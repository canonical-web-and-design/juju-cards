let targetClass = 'juju-card';
let apiAddress = 'https://api.jujucharms.com/charmstore/v4/';
let apiIncludes = '?include=id-name' +
                  '&include=id' +
                  '&include=stats' +
                  '&include=id-series' +
                  '&include=extra-info' +
                  '&include=promulgated';

document.addEventListener("DOMContentLoaded", function(e) {
  init();
});

function init() {
  let cards = document.querySelectorAll('.' + targetClass);

  Array.from(cards).forEach(function(card) {
    let id = card.dataset.id;
    if(id !== null) {
      getData(card, id);
    } else {
      console.warn('Found card with no ID');
    }
  });
  updateHead();
}

function getData(card, id) {
  let apiUrl = apiAddress + id + '/meta/any' + apiIncludes;

  get(apiUrl).then(function(response) {
    let data = JSON.parse(response);
    decideType(card, data);
  }, function(error) {
    console.warn(error);
  });
}

function decideType(card, data) {
  if (data.Meta['id-series'].Series === 'bundle') {
    renderBundle(card, data);
  } else {
    renderCharm(card, data);
  }
}

function renderBundle(card, data) {
  let name = data.Meta['id-name'].Name;
  let id = data.Id;
  let series = data.Meta['id-series'].Series;
  let revision = data.Meta.id.Revision;
  let ownerLink = 'https://launchpad.net/~'+data.Meta['extra-info']['bzr-owner'];
  let owner = data.Meta['extra-info']['bzr-owner'];
  let detailsLink = 'https://jujucharms.com/'+name+'/'+series+'/'+revision;
  let image = 'https://api.jujucharms.com/charmstore/v4/bundle/'+name+'/diagram.svg';
  let addLink = 'https://demo.jujucharms.com/?deploy-target=' + id;

  let dom = `<div class="juju-card__container bundle-card">` +
      `<a href="${detailsLink}" class="bundle-card__link">View details</a>` +
      `<header class="bundle-card__header">` +
        `<div class="bundle-card__image-container">` +
          `<object wmode="transparent" width="100%" class="bundle-card__bundle-image" type="image/svg+xml" data="https://api.jujucharms.com/charmstore/v4/bundle/${name}-${revision}/diagram.svg"></object>` +
        `</div>` +
      `</header>` +
      `<main class="bundle-card__main">` +
        `<div class="bundle-card__meta">` +
          `<h1 class="bundle-card__title">${name}</h1>` +
          `<p class="bundle-card__by">by <a href="${ownerLink}">${owner}</a></h1>` +
        `</div>` +
        `<ul class="bundle-card__actions">` +
          `<li class="bundle-card__actions-item--details">` +
            `<label class="bundle-card__actions-label" for="cli-deploy">Deploy with the CLI:</label>` +
            `<input class="bundle-card__actions-field" readonly="readonly" value="juju deploy ${id}" id="cli-deploy">` +
          `</li>` +
          `<li class="bundle-card__actions-item--demo">` +
            `<a href="${addLink}" class="bundle-card__add-button--primary">Get started</a>` +
          `</li>` +
        `</ul>` +
      `</main>` +
      `<footer class="bundle-card__footer">` +
        `<a href="http://jujucharms.com"><img src="https://jujucharms.com/static/img/logos/logo.svg" alt="" class="bundle-card__footer-logo" /></a>` +
        `<p class="bundle-card__footer-note">© 2015 <a href="http://www.canonical.com">Canonical Ltd</a>.</p>` +
      `</footer>` +
    `</div>` +
    `<div class="juju-card__error">` +
      `<p class="juju-card__error-message"></p>` +
    `</div>`;

  card.innerHTML = dom;
  card.classList.add("juju-card--rendered");
  card.classList.add(getWidthClass(card));
}

function renderCharm(card, data) {
  let name = data.Meta['id-name'].Name;
  let id = data.Id;
  let image = 'https://api.jujucharms.com/v4/'+getImageID(id)+'/icon.svg';
  let deploys = prettyPrintNumber(data.Meta.stats.ArchiveDownloadCount);
  let series = data.Meta['id-series'].Series;
  let revision = data.Meta.id.Revision;
  let owner = data.Meta['extra-info']['bzr-owner'];
  let ownerLink = 'https://launchpad.net/~'+data.Meta['extra-info']['bzr-owner'];
  let detailsLink = 'https://jujucharms.com/'+name+'/'+series+'/'+revision;
  let addLink = 'https://demo.jujucharms.com/?deploy-target=' + id;

  let dom = `<div class="juju-card__container charm-card">` +
      `<a href="${detailsLink}" class="charm-card__link">View details</a>` +
      `<header class="charm-card__header">` +
        `<img src="${image}" alt="${name}" class="charm-card__image" />` +
        `<h1 class="charm-card__title">${name}</h1>` +
        `<ul class="charm-card__meta">` +
          `<li class="charm-card__meta-item--by">by <a href="${ownerLink}">${owner}</a></li>` +
          `<li class="charm-card__meta-item--series">${series}</li>` +
        `</ul>` +
      `</header>` +
      `<main class="charm-card__main">` +
        `<ul class="charm-card__actions">` +
        `<li class="charm-card__actions-item--details">` +
          `<label class="charm-card__actions-label" for="cli-deploy">Deploy with the CLI:</label>` +
          `<input class="charm-card__actions-field" readonly="readonly" value="juju deploy ${id}" id="cli-deploy">` +
        `</li>` +
          `<li class="charm-card__actions-item--demo">` +
            `<a href="${addLink}" class="charm-card__add-button--primary">Get started</a>` +
          `</li>` +
        `</ul>` +
      `</main>` +
      `<footer class="charm-card__footer">` +
        `<a href="http://jujucharms.com"><img src="https://jujucharms.com/static/img/logos/logo.svg" alt="" class="charm-card__footer-logo" /></a>` +
        `<p class="charm-card__footer-note">© 2015 <a href="http://www.canonical.com">Canonical Ltd</a>.</p>` +
      `</footer>` +
    `</div>` +
    `<div class="juju-card__error">` +
      `<p class="juju-card__error-message"></p>` +
    `</div>`;

    card.innerHTML = dom;
    card.classList.add("juju-card--rendered");
    card.classList.add(getWidthClass(card));
}

function updateHead() {
  // Load the card stylesheet
  let css  = document.createElement('link');
  css.rel  = 'stylesheet';
  css.type = 'text/css';
  css.href = 'scss/styles.min.css';
  css.media = 'all';
  document.getElementsByTagName('head')[0].appendChild(css);

  // Load the Ubuntu and Ubuntu Mono font
  let font = document.createElement('link');
  font.rel  = 'stylesheet';
  font.type = 'text/css';
  font.href = 'https://fonts.googleapis.com/css?family=Ubuntu:300';
  document.getElementsByTagName('head')[0].appendChild(font);
}

function getWidthClass(el) {
  let width = el.offsetWidth;
  let queryClass = 'juju-card--small';
  if (width > 301) { queryClass = 'juju-card--medium'; }
  if (width > 626) { queryClass = 'juju-card--large'; }
  return queryClass;
}

// prettyPrintNumber
// Takes a number and returns string with commas in the correct places.
// For example: 3000 => 3,000
let prettyPrintNumber = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

// getImageID
// Take a charm ID and removes ''cs:' then returns the remainer to create the
// image URL.
let getImageID = (id) => id.toString().replace('cs:', '');

// get
// Wraps a XMLHttpRequest in a promise.
let get = (url) => {
  return new Promise(function(resolve, reject) {
    var req = new XMLHttpRequest();
    req.open('GET', url);

    req.onload = function() {
      if (req.status == 200) {
        resolve(req.response);
      } else {
        reject(Error(req.statusText));
      }
    };
    req.onerror = function() {
      reject(Error("Network Error"));
    };
    req.send();
  });
}
