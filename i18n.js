// ─────────────────────────────────────────────────────────────────────────
//  Summer Stars — bilingual (English / French) UI strings
//
//  Mark up elements with data-i18n / data-i18n-ph (placeholder) attributes
//  and call initI18n() once on load. Dynamic strings use t(key, params).
// ─────────────────────────────────────────────────────────────────────────

const I18N = {
  en: {
    // index.html
    "doc.index": "Summer Stars — Skating Leaderboard",
    "index.tagline": "Pyramid of the rising stars",
    "nav.admin": "Admin sign-in →",
    "th.rank": "#",
    "th.skater": "Skater",
    "th.stars": "Stars",
    "index.loading": "Loading…",
    "index.empty": "No skaters yet — check back soon!",
    "index.error": "Could not load the leaderboard.",
    // admin.html
    "doc.admin": "Summer Stars — Admin",
    "admin.h1": "Summer Stars — Admin",
    "admin.subtitle": "Sign in to award stars.",
    "nav.public": "← View public leaderboard",
    "label.email": "Admin email",
    "ph.email": "you@example.com",
    "label.password": "Admin password",
    "ph.password": "Enter password",
    "btn.signin": "Sign in",
    "err.email": "Please enter your email.",
    "err.password": "Please enter your password.",
    "err.credentials": "Incorrect email or password.",
    "admin.award": "Award stars",
    "btn.signout": "Sign out",
    "label.name": "Skater name",
    "ph.name": "Name",
    "label.stars": "Stars to add",
    "admin.hint":
      "If the skater is already on the list, these stars are added to their total.",
    "btn.add": "Add stars",
    "err.name": "Please enter a name.",
    "err.starnum": "Stars must be a whole number of 1 or more.",
    "err.lookup": "Lookup failed: ",
    "err.save": "Could not save: ",
    "msg.added": "Added {stars} ⭐ to {name} (total {total}).",
    "admin.standings": "Current standings",
    "admin.empty": "No skaters yet.",
    "btn.remove": "Remove",
    "confirm.remove": "Remove {name} from the leaderboard?",
  },
  fr: {
    // index.html
    "doc.index": "La pyramide des étoiles montante",
    "index.tagline": "La pyramide des étoiles montante",
    "nav.admin": "Connexion administrateur →",
    "th.rank": "#",
    "th.skater": "Patineur",
    "th.stars": "Étoiles",
    "index.loading": "Chargement…",
    "index.empty": "Aucun patineur pour l'instant — revenez bientôt !",
    "index.error": "Impossible de charger le classement.",
    // admin.html
    "doc.admin": "Étoiles d'été — Administration",
    "admin.h1": "Étoiles d'été — Administration",
    "admin.subtitle": "Connectez-vous pour attribuer des étoiles.",
    "nav.public": "← Voir le classement",
    "label.email": "Courriel administrateur",
    "ph.email": "vous@exemple.com",
    "label.password": "Mot de passe administrateur",
    "ph.password": "Entrez le mot de passe",
    "btn.signin": "Se connecter",
    "err.email": "Veuillez entrer votre courriel.",
    "err.password": "Veuillez entrer votre mot de passe.",
    "err.credentials": "Courriel ou mot de passe incorrect.",
    "admin.award": "Attribuer des étoiles",
    "btn.signout": "Se déconnecter",
    "label.name": "Nom du patineur",
    "ph.name": "Nom",
    "label.stars": "Étoiles à ajouter",
    "admin.hint":
      "Si le patineur est déjà sur la liste, ces étoiles s'ajoutent à son total.",
    "btn.add": "Ajouter des étoiles",
    "err.name": "Veuillez entrer un nom.",
    "err.starnum": "Les étoiles doivent être un nombre entier de 1 ou plus.",
    "err.lookup": "Échec de la recherche : ",
    "err.save": "Échec de l'enregistrement : ",
    "msg.added": "{stars} ⭐ ajoutées à {name} (total {total}).",
    "admin.standings": "Classement actuel",
    "admin.empty": "Aucun patineur pour l'instant.",
    "btn.remove": "Retirer",
    "confirm.remove": "Retirer {name} du classement ?",
  },
};

const LANG_KEY = "summerstars_lang";

function currentLang() {
  const saved = localStorage.getItem(LANG_KEY);
  if (saved === "en" || saved === "fr") return saved;
  return (navigator.language || "en").toLowerCase().startsWith("fr") ? "fr" : "en";
}

// Translate a key, optionally substituting {placeholders}. Falls back to
// English, then to the raw key, so a missing string is never blank.
function t(key, params) {
  const lang = currentLang();
  let str = (I18N[lang] && I18N[lang][key]) || I18N.en[key] || key;
  if (params) {
    for (const k in params) str = str.split("{" + k + "}").join(params[k]);
  }
  return str;
}

// (Re)render every translatable element for the given language.
function applyLang(lang) {
  document.documentElement.lang = lang;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.getAttribute("data-i18n"));
  });
  document.querySelectorAll("[data-i18n-ph]").forEach((el) => {
    el.placeholder = t(el.getAttribute("data-i18n-ph"));
  });

  const titleKey = document.body.getAttribute("data-i18n-title");
  if (titleKey) document.title = t(titleKey);

  // The toggle shows the language you'd switch TO.
  document.querySelectorAll("[data-lang-toggle]").forEach((btn) => {
    btn.textContent = lang === "en" ? "Français" : "English";
  });
}

function setLang(lang) {
  localStorage.setItem(LANG_KEY, lang);
  applyLang(lang);
  document.dispatchEvent(new CustomEvent("langchange", { detail: lang }));
}

// Call once after the DOM is ready. Wires up any [data-lang-toggle] buttons.
function initI18n() {
  applyLang(currentLang());
  document.querySelectorAll("[data-lang-toggle]").forEach((btn) => {
    btn.addEventListener("click", () =>
      setLang(currentLang() === "en" ? "fr" : "en")
    );
  });
}