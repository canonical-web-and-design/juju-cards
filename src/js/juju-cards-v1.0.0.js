let jujuCards = () => {
  let targetClass = 'juju-card';
  let apiAddress = 'https://api.jujucharms.com/charmstore/v4/';
  let apiIncludes = '?include=id-name' +
                    '&include=id' +
                    '&include=stats' +
                    '&include=id-series' +
                    '&include=extra-info' +
                    '&include=promulgated';


  let cards = document.querySelectorAll('.' + targetClass);

  // getData
  // Concatenates the api url and fetches it
  let getData = (card, id) => {
    let apiUrl = `${apiAddress}${id}/meta/any${apiIncludes}`;
    get(apiUrl, function(response) {
      if (!response.Message) {
        detectType(card, response);
      } else {
        reportError(card, response.Message);
      }
    }, card, id);
  }

  // detectType
  // Checks if the element is a bundle or charm and renders the correct function
  let detectType = (card, data) => {
    if (data.Meta['id-series'].Series === 'bundle') {
      renderBundle(card, data);
    } else {
      renderCharm(card, data);
    }
  }

  // renderBundle
  // Split out required data and insert card markup
  let renderBundle = (card, data) => {
    let name = data.Meta['id-name'].Name;
    let id = data.Id;
    let series = data.Meta['id-series'].Series;
    let revision = data.Meta.id.Revision;
    let sourceOwner = data.Meta['extra-info']['bzr-owner'];
    let owner = data.Meta['id'].User || sourceOwner;
    let ownerLink = `https://launchpad.net/~${sourceOwner}`;
    let detailsLink = `https://jujucharms.com/${name}/${series}/${revision}`;
    let image = `https://api.jujucharms.com/charmstore/v4/bundle/${name}-${revision}/diagram.svg`;
    if (data.Meta['id'].User) {
      ownerLink = `https://jujucharms.com/u/${owner}`;
      detailsLink = `${ownerLink}/${name}`;
      image = `https://api.jujucharms.com/charmstore/v4/~${owner}/bundle/${name}-${revision}/diagram.svg`;
    }
    let addLink = `https://demo.jujucharms.com/?deploy-target=${getImageID(id)}`;

    let dom = `<div class="juju-card__container bundle-card">` +
        `<a href="${detailsLink}" class="bundle-card__link">View details</a>` +
        `<header class="bundle-card__header">` +
          `<div class="bundle-card__image-container">` +
            `<object wmode="transparent" width="100%" class="bundle-card__bundle-image" type="image/svg+xml" data="${image}"></object>` +
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
              `<input class="bundle-card__actions-field" readonly="readonly" value="juju deploy ${id}" onclick="this.select();" id="cli-deploy">` +
            `</li>` +
            `<li class="bundle-card__actions-item--demo">` +
              `<a href="${addLink}" class="bundle-card__add-button--primary">Deploy with Juju</a>` +
            `</li>` +
          `</ul>` +
        `</main>` +
        `<footer class="bundle-card__footer">` +
          `<a href="http://jujucharms.com"><img src="https://jujucharms.com/static/img/logos/logo.svg" alt="" class="bundle-card__footer-logo" /></a>` +
          `<p class="bundle-card__footer-note">&copy; <a href="http://www.canonical.com">Canonical Ltd</a>.</p>` +
        `</footer>` +
      `</div>`;

    card.innerHTML = dom;
    card.classList.add("juju-card--rendered");
    card.classList.add(getWidthClass(card));
  }

  // renderCharm
  // Split out required data and insert card markup
  let renderCharm = (card, data) => {
    let name = data.Meta['id-name'].Name;
    let id = data.Id;
    let image = `https://api.jujucharms.com/v4/${getImageID(id)}/icon.svg`;
    let deploys = prettyPrintNumber(data.Meta.stats.ArchiveDownloadCount);
    let series = data.Meta['id-series'].Series;
    let revision = data.Meta.id.Revision;
    let owner = data.Meta['extra-info']['bzr-owner'];
    let ownerLink = 'https://launchpad.net/~'+data.Meta['extra-info']['bzr-owner'];
    let detailsLink = `https://jujucharms.com/${name}/${series}/${revision}`;
    let addLink = `https://demo.jujucharms.com/?deploy-target=${id}`;

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
            `<input class="charm-card__actions-field" readonly="readonly" value="juju deploy ${id}" onclick="this.select();" id="cli-deploy">` +
          `</li>` +
            `<li class="charm-card__actions-item--demo">` +
              `<a href="${addLink}" class="charm-card__add-button--primary">Deploy with Juju</a>` +
            `</li>` +
          `</ul>` +
        `</main>` +
        `<footer class="charm-card__footer">` +
          `<a href="http://jujucharms.com"><img src="https://jujucharms.com/static/img/logos/logo.svg" alt="" class="charm-card__footer-logo" /></a>` +
          `<p class="charm-card__footer-note">&copy; <a href="http://www.canonical.com">Canonical Ltd</a>.</p>` +
        `</footer>` +
      `</div>`;

      card.innerHTML = dom;
      card.classList.add("juju-card--rendered");
      card.classList.add(getWidthClass(card));
  }

  // getWidthClass
  // Checks the width of the card container and returns the correct class to
  // attach element queries
  let getWidthClass = (el) => {
    let width = el.offsetWidth;
    let queryClass = 'juju-card--small';
    if (width > 301) { queryClass = 'juju-card--medium'; }
    if (width > 626) { queryClass = 'juju-card--large'; }
    return queryClass;
  }

  let reportError = (card, message) => {

      let dom = `<div class="juju-card__error">` +
          `<p class="juju-card__error-message">${message}</p>` +
        `</div>`;

      card.innerHTML = dom;
      card.classList.add("juju-card--rendered");
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
  let get = (url, callback, card, id) => {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === 4) {
            if (httpRequest.status === 200) {
                var data = JSON.parse(httpRequest.responseText);
                if (callback) callback(data);
            } else {
              reportError(card, 'No charm or bundle found for ' + id);
            }
        } else {
          reportError(card, 'No charm or bundle found for ' + id);
        }
    };
    httpRequest.open('GET', url);
    httpRequest.send();
  }

  Array.prototype.slice.call(cards).forEach(function(card) {
    let id = card.dataset.id;
    if (id == undefined || id == '') {
      console.warn('Card found with no ID');
    } else {
      getData(card, id);
    }
  });
};

// updateHead
// Add the required stylesheet and font to the page head
jujuCards.updateHead = () => {
  let filePath = ''
  // TODO: make this a full regex pattern for js/juju-embed.js$
  //       then use it with the .replace
  let pattern = /juju-cards-v[0-9]+.[0-9]+.[0-9]+\.js$/i;

  Array.prototype.slice.call(document.getElementsByTagName('script')).forEach(function(script) {
    if (pattern.test(script.getAttribute('src'))) {
      filePath = script.getAttribute('src').replace('.js','');
    }
  });

  // Load the card stylesheet
  let css  = document.createElement('link');
  css.rel  = 'stylesheet';
  css.type = 'text/css';
  css.href = `${filePath}.css`;
  css.media = 'all';
  document.getElementsByTagName('head')[0].appendChild(css);
}

if (window.onload && typeof window.onload === function) {
  var jujuCards.onload = window.onload;
}

window.onload = function() {
  jujuCards.onload();
  jujuCards();
  jujuCards.updateHead();
};
