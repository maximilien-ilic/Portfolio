# Portfolio — Maximilien Ilic

**URL :** https://maximilien-ilic-portfolio.onrender.com

Portfolio personnel construit avec Next.js (App Router), React 19 et CSS Modules.
Aucune dépendance UI : l'illustration de l'océan est du SVG inline animé en CSS.

L'identité visuelle est décrite dans [DESIGN.md](DESIGN.md) — palette, typographie
et élément signature, dérivés des images de référence dans `refs/ui/`.

## Installation

```bash
git clone https://github.com/maximilien-ilic/portfolio.git
cd portfolio
npm install
npm run dev
```

Le site est disponible sur http://localhost:3000

Aucune variable d'environnement n'est nécessaire : le contact se fait par lien
`mailto:`, il n'y a ni API ni base de données.

## Scripts

| Commande        | Description                 |
| --------------- | --------------------------- |
| `npm run dev`   | Serveur de développement    |
| `npm run build` | Build de production         |
| `npm start`     | Sert le build de production |
| `npm run lint`  | Analyse ESLint              |

## Structure

```
app/
  page.tsx              Accueil : hero, océan, projets
  projects/[slug]/      Page de détail par projet (générée statiquement)
  not-found.tsx         404
  globals.css           Tokens de design et primitives partagées
components/
  SiteNav / SiteFooter  Chrome du site
  Ocean                 L'illustration signature (SVG + CSS)
  ProjectBlock          Une plaque projet, avec sa vidéo et son cartouche HUD
data/
  site.ts               Nom, rôle, texte d'intro, liens de contact
  projects.ts           Les projets
public/videos/          Captures vidéo des projets (16:9)
```

Pour ajouter un projet : une entrée dans `data/projects.ts` (avec un `slug`
unique) et une vidéo 16:9 dans `public/videos/`. La page de détail est générée
automatiquement.
