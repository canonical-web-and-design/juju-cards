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
}

function getData(card, id) {
  let apiUrl = apiAddress + id + '/meta/any' + apiIncludes;
  let httpRequest;
  if (window.XMLHttpRequest) {
      httpRequest = new XMLHttpRequest();
  } else if (window.ActiveXObject) {
      httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
  }

  httpRequest.onreadystatechange = function(){
    if (httpRequest.readyState === 4) {
      let data = JSON.parse(httpRequest.responseText);
      if ( !data.Message ) {
        render(card, data);
      } else{
        console.warn(data.Message);
      }
    }
  };

  httpRequest.open('GET', apiUrl, true);
  httpRequest.send(null);
}

function render(card, data) {

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

  let dom = `<div class="juju-card__container">` +
      `<header class="juju-card__header">` +
        `<img src="${image}" alt="${name}" class="juju-card__image" />` +
        `<h1 class="juju-card__title">${name}</h1>` +
        `<ul class="juju-card__meta">` +
          `<li class="juju-card__meta-item--by">by <a href="${ownerLink}">${owner}</a></li>` +
          `<li class="juju-card__meta-item--series">${series}</li>` +
        `</ul>` +
      `</header>` +
      `<main class="juju-card__main">` +
        `<label class="juju-card__actions-label" for="cli-deploy">Deploy with the CLI:</label>` +
        `<input class="juju-card__actions-field" readonly="readonly" value="juju deploy ${id}" id="cli-deploy">` +
        `<ul class="juju-card__actions">` +
          `<li class="juju-card__actions-item--demo">` +
            `<a href="${addLink}" class="juju-card__add-button--secondary">Add to demo</a>` +
          `</li>` +
          `<li class="juju-card__actions-item--details">` +
            `<a href="${detailsLink}" class="juju-card__details-button--primary">View details</a>` +
          `</li>` +
        `</ul>` +
      `</main>` +
      `<footer class="juju-card__footer">` +
        `<a href="http://jujucharms.com"><img src="https://jujucharms.com/static/img/logos/logo.svg" alt="" class="juju-card__footer-logo" /></a>` +
        `<p class="juju-card__footer-note">© 2015 <a href="http://www.canonical.com">Canonical Ltd</a>.</p>` +
      `</footer>` +
    `</div>` +
    `<div class="juju-card__error">` +
      `<p class="juju-card__error-message"></p>` +
    `</div>`;

    card.innerHTML = dom;
    card.classList.add("juju-card--rendered");
    card.classList.add(getElementQuery(card));
}

function getElementQuery(el) {
  let width = el.offsetWidth;
  let queryClass = 'juju-card--small';
  if (width > 301) {
    queryClass = 'juju-card--medium';
  }

  if (width > 626) {
    queryClass = 'juju-card--large';
  }
  return queryClass;
}

let prettyPrintNumber = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
let getImageID = (id) => id.toString().replace('cs:', '');
