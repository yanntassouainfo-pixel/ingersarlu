# INGER Sarlu — Site vitrine

Site web institutionnel d'**INGER Sarlu** (Ingénieurs et Experts Réunis), bureau d'ingénieurs-conseils agréé par l'État togolais — études et contrôle technique en **bâtiments, infrastructures routières, hydraulique & assainissement**. Lomé, Togo & espace UEMOA.

Prototype statique, sans dépendance ni build : **HTML + CSS + JavaScript** (vanilla). Polices via Google Fonts (Fraunces, Inter, JetBrains Mono).

---

## Démarrage

Aucune installation requise. Deux options :

- Ouvrir directement `index.html` dans un navigateur.
- Ou servir le dossier localement (recommandé) :
  - Python : `python3 -m http.server 8000` puis ouvrir `http://localhost:8000`

---

## Structure du projet

```
inger-sarlu-site/
├── index.html                     Page principale (toutes les sections)
├── 404.html                       Page d'erreur — introuvable
├── 500.html                       Page d'erreur — serveur
├── 503.html                       Page d'erreur — maintenance
├── politique-confidentialite.html Politique de confidentialité (RGPD)
├── GUIDE-images.html              Guide des emplacements d'images
├── css/
│   └── style.css                  Tous les styles (light mode, responsive)
├── js/
│   ├── script.js                  Interactions : nav, menu, reveal, FAQ,
│   │                              onglets références, portfolio, lightbox,
│   │                              filigrane hero (nombre d'or)
│   ├── chatbot.js                 Assistant conversationnel « Solim » (FR/EN)
│   └── i18n.js                    Bascule de langue FR / EN (dictionnaire)
└── images/                        Visuels des sections et projets
```

---

## Sections (index.html)

Hero · À propos · Identité (Bento) · Savoir-faire & approche · Domaines (3 pôles + agréments) · Portfolio · Références (onglets) · Expertise / agréments · Zone d'intervention (carte UEMOA) · FAQ · Contact · Footer.

---

## Personnalisation rapide

| Élément | Fichier | Repère |
|---|---|---|
| **Remplacer une image** | `images/` | Garder le même nom de fichier (voir `GUIDE-images.html`) |
| **Image « À propos »** | `images/about-inger.jpg` | Portrait 4:5 conseillé |
| **Textes FR** | `index.html` | Modifier directement le contenu |
| **Traductions EN** | `js/i18n.js` | Objet `DICT` (clé FR → valeur EN) |
| **Nom / WhatsApp du chatbot** | `js/chatbot.js` | Objet `CFG` (name, wa, tel, mail) |
| **Projets visibles au départ (Portfolio)** | `js/script.js` | `var INIT = 4` (et `STEP`) |
| **Références révélées par clic** | `js/script.js` | `var STEP = 10` (bloc « affichage progressif ») |
| **Aperçu références (lignes visibles)** | `index.html` | Classe `ref-extra` sur les lignes masquées |
| **Intensité du filigrane hero** | `css/style.css` | `.hero-bg .hero-fil { opacity: .04 }` |
| **Téléphone / e-mail / adresse** | `index.html` | Section Contact + Footer |

---

## Multilingue (FR / EN)

- Sélecteur **FR · EN** dans l'en-tête (et le menu mobile).
- Moteur léger côté client : `js/i18n.js` applique un dictionnaire FR → EN aux textes, mémorise le choix (`localStorage`) et met à jour `<html lang>`.
- Les noms propres, clients et fiches de références restent volontairement non traduits.
- Pour un référencement EN complet : créer des pages `/en/` dédiées + balises `hreflang` (note en bas de `js/i18n.js`).

---

## Chatbot « Solim »

Assistant d'acquisition autonome (`js/chatbot.js`) : accueil, orientation services, FAQ, qualification de prospect, CTA WhatsApp, capture e-mail/téléphone. Bilingue (suit le sélecteur).

Évolution possible : brancher un CRM / une IA via `window.INGER_CHAT_ENDPOINT` ou le callback `window.INGER_CHAT_ON_LEAD`.

---

## Formulaire de contact

⚠️ Le formulaire est en **mode démonstration (non connecté)**. Pour recevoir les messages, le brancher à un service sans backend, par exemple **Web3Forms** ou **Formspree** :

- ajouter `action="https://api.web3forms.com/submit"` et `method="POST"` au `<form>` ;
- insérer `<input type="hidden" name="access_key" value="VOTRE_CLE">` ;
- nommer chaque champ (`name="..."`).

---

## Pages d'erreur

`404.html`, `500.html`, `503.html` reprennent l'identité du site. À activer côté hébergeur (ex. Apache : `ErrorDocument 404 /404.html`). GitHub Pages gère `404.html` automatiquement.

---

## Déploiement (lien live)

Site 100 % statique → hébergement gratuit, chemins relatifs compatibles.

- **Netlify Drop** (le plus simple) : glisser le dossier sur `app.netlify.com/drop` → URL instantanée.
- **GitHub Pages** : dépôt public → Settings → Pages → branche `main` / `/root`.
- **Vercel** : importer le dossier / dépôt.

HTTPS recommandé (nécessaire pour les liens WhatsApp et le chatbot).

---

## Accessibilité & performance

- `prefers-reduced-motion` respecté (animations réduites).
- ARIA sur la navigation, les onglets et le chatbot.
- Conseil : compresser les images lourdes (WebP) avant mise en ligne.

---

© 2026 INGER Sarlu — Ingénieurs et Experts Réunis · Lomé, Togo.
