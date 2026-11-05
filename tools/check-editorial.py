"""Comprueba las declaraciones editoriales visibles de la portada, sin dependencias."""
from html.parser import HTMLParser
from pathlib import Path
import re


class Content(HTMLParser):
    def __init__(self):
        super().__init__()
        self.text = []
        self.links = []

    def handle_data(self, data):
        self.text.append(data)

    def handle_starttag(self, tag, attrs):
        if tag == "a":
            self.links.append(dict(attrs))

    def normalized(self):
        return " ".join(" ".join(self.text).split())


def content(fragment):
    parsed = Content()
    parsed.feed(fragment)
    return parsed


def require(condition, message):
    if not condition:
        raise SystemExit(message)


root = Path(__file__).resolve().parents[1]
html = (root / "index.html").read_text(encoding="utf-8")
articles = re.findall(r"<article\b[^>]*>.*?</article>", html, re.S | re.I)
cards = [content(a) for a in articles if re.search(r"<h3>biosemiotics</h3>", a)]
require(len(cards) == 1, "Debe existir una sola ficha de biosemiotics.")
card = cards[0]
for declaration in (
    "Publicación seriada de Powersemiotics",
    "ISSN 3144-7813 (en línea)",
    "Licencia CC BY 4.0 · Acceso abierto, sin cargos al autor",
):
    require(declaration in card.normalized(), "Falta en Cartera: " + declaration)
require(any(a.get("href") == "https://creativecommons.org/licenses/by/4.0/deed.es"
            and "license" in a.get("rel", "").split() for a in card.links),
        "La licencia de la ficha debe enlazar a CC BY 4.0.")

footer = re.search(r'<footer\b[^>]*id="recepcion"[^>]*>(.*?)</footer>', html, re.S)
require(footer is not None, "Falta el pie de recepción.")
blocks = [content(b) for b in re.findall(
    r'<div class="bloque">(.*?)</div>', footer.group(1), re.S)]
authors = [b for b in blocks if b.normalized().startswith("Autor ")]
editors = [b for b in blocks if b.normalized().startswith("Editor ")]
require(len(authors) == len(editors) == 1, "Debe distinguirse Autor de Editor.")
require(authors[0].normalized() ==
        "Autor Alcy Edmundo Torres Guerrero Medicina interna · ORCID 0000-0002-9742-375X",
        "El bloque Autor debe conservar la redacción acordada, sin ciudad.")
require(any(a.get("href") == "https://orcid.org/0000-0002-9742-375X"
            for a in authors[0].links), "ORCID debe seguir enlazado.")
require(editors[0].normalized() ==
        "Editor Publicado por Powersemiotics · Wellesley, Massachusetts, EE. UU.",
        "El bloque Editor debe identificar la sede de Wellesley.")
require((root / "CNAME").read_text(encoding="utf-8").strip() == "powersemiotics.com",
        "El dominio debe seguir siendo powersemiotics.com.")
print("OK: Cartera, ISSN, licencia, Autor sin ciudad y Editor en Wellesley.")
