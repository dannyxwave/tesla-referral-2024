// https://github.com/dazecoop/vanilla-js-i18n-translator/
// List of available locales
const availableLocales = ['en', 'no'];

// Default locale.
const defaultLanguage = 'en';

// Manually detect users' language, strip languages such as `en-GB` to just `en`.
let language = (window.navigator.userLanguage || window.navigator.language).substr(0, 2);

// If `?lang=` exists in URL params & is valid, then use that instead.
const urlParams = new URLSearchParams(window.location.search);
const langFromUrl = urlParams.get('lang');
if (langFromUrl && availableLocales.includes(langFromUrl)) {
  language = langFromUrl
}

// Set `pageLanguage` only if its available within our locales, otherwise default.
let pageLanguage = defaultLanguage;
if (availableLocales.includes(language)) {
  pageLanguage = language;
}

// Locale translations.
const locales = {
  en: {
    "lang": "en",
    "site-title": "Tesla Referral Link | xCode",
    "header": {
      "title": "Tesla<br/>Referral Link",
      "description": "Use this referral link to receive a discount on Tesla vehicles, charging mileage, or points to use in the official Tesla store.",
      "button": "Go to tesla.com",
    },
    //"variables": "Current date: {date}<br>Unix timestamp: {time}<br>Or static text: {static}",
  },

  no: {
    "lang": "no",
    "site-title": "Tesla rabattkode | xCode",
    "header": {
      "title": "Tesla<br/>Rabattlenke",
      "description": "Bruk denne rabattlenken for å få rabatt på kjøretøy, lading eller poeng for å bruke i den offisielle Tesla-butikken.",
      "button": "Gå til tesla.com",
    },
    //"variables": "Aktuelle datoer: {date}<br>Unix-tidsstempel: {time}<br>Statisk tekst: {static}",
  },

};

if (pageLanguage === 'no') {
  document.getElementById('referral-link').href = "https://www.tesla.com/no_no/referral/danisak989381";
}

document.addEventListener('DOMContentLoaded', () => {

  // Get all page elements to be translated.
  const elements = document.querySelectorAll('[data-i18n]');

  // Get JSON object of translations.
  const json = locales[pageLanguage];

  // On each element, found the translation from JSON file & update.
  elements.forEach((element, index) => {
    const key = element.getAttribute('data-i18n');
    let text = key.split('.').reduce((obj, i) => {
      return (obj ? obj[i] : null);
    }, json);

    const variables = text.match(/{(.*?)}/g);
    if (variables) {

      variables.forEach((variable) => {
        // Filter all `data-*` attributes for this element to find the matching key.
        Object.entries(element.dataset).filter(([key, value]) => {
          if (`{${key}}` === variable) {
            try {
              // Attempt to run actual JavaScript code.
              text = text.replace(`${variable}`, new Function(`return (${value})`)());
            } catch (error) {
              // Probably just static text replacement.
              text = text.replace(`${variable}`, value);
            }
          }
        })
      });
    }

    // Regular text replacement for given locale.
    element.innerHTML = text;
  });

  // Set <html> tag lang attribute.
  const htmlElement = document.querySelector('html');
  htmlElement.setAttribute('lang', pageLanguage);
});
