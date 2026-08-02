# Portfolio — Maximilien Ilic

**URL :** https://maximilien-ilic-portfolio.onrender.com

Portfolio personnel construit avec Next.js (App Router), React 19 et CSS Modules.
Fond animé en WebGL (`Dither`, react-three-fiber) et formulaire de contact via Resend.

## Installation

```bash
git clone https://github.com/maximilien-ilic/portfolio.git
cd portfolio
npm install
npm run dev
```

Le site est disponible sur http://localhost:3000

## Variables d'environnement

Créer un fichier `.env.local` à la racine :

```env
RESEND_API_KEY=your_resend_api_key
```

La clé se génère depuis [resend.com/api-keys](https://resend.com/api-keys).
Ne jamais committer ce fichier — il est ignoré par `.gitignore`.

## Scripts

| Commande        | Description                          |
| --------------- | ------------------------------------ |
| `npm run dev`   | Serveur de développement             |
| `npm run build` | Build de production                  |
| `npm start`     | Sert le build de production          |
| `npm run lint`  | Analyse ESLint                       |

## Structure

```
app/          Routes App Router, layout global, API de contact
components/   Composants UI (Card, Navbar, Footer, ContactForm, Dither)
data/         Contenu des projets (data/projects.ts)
public/       Vidéos de démo des projets
```

Pour ajouter un projet, il suffit d'ajouter une entrée dans `data/projects.ts`.
