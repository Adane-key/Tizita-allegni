const fs = require("fs");
const path = require("path");

const dictionaries = {
  en: JSON.parse(
    fs.readFileSync(path.join(__dirname, "..", "locales", "en.json"), "utf-8")
  ),
  am: JSON.parse(
    fs.readFileSync(path.join(__dirname, "..", "locales", "am.json"), "utf-8")
  ),
};

function translate(lang, key) {
  const dict = dictionaries[lang] || dictionaries.en;
  return dict[key] || dictionaries.en[key] || key;
}

function i18nMiddleware(req, res, next) {
  const lang = req.session && req.session.lang === "am" ? "am" : "en";
  req.lang = lang;
  res.locals.lang = lang;
  res.locals.t = (key) => translate(lang, key);
  next();
}

module.exports = { i18nMiddleware, translate };
