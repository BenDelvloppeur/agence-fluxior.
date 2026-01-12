# 🚀 Agence Fluxior

Agence Web Premium spécialisée dans la création de sites vitrines haute performance pour artisans et PME.

## 📋 Table des Matières

- [Description](#description)
- [Technologies](#technologies)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Scripts Disponibles](#scripts-disponibles)
- [Structure du Projet](#structure-du-projet)
- [Développement](#développement)
- [Déploiement](#déploiement)
- [Contribuer](#contribuer)

## 📖 Description

Agence Fluxior est une application web moderne construite avec Astro et React, proposant :

- **Site vitrine** pour présenter les services de l'agence
- **Dashboard admin** complet pour la gestion des leads et partenaires
- **Démonstrations interactives** (Kaly Mode, Maison Tradition)
- **Système de génération de leads** avec wizard de configuration

## 🛠 Technologies

- **[Astro](https://astro.build/)** 5.16.8 - Framework web moderne
- **[React](https://react.dev/)** 19.2.3 - Bibliothèque UI
- **[TypeScript](https://www.typescriptlang.org/)** - Typage statique
- **[Tailwind CSS](https://tailwindcss.com/)** 3.4.17 - Framework CSS
- **[Supabase](https://supabase.com/)** - Backend as a Service (BaaS)
- **[Framer Motion](https://www.framer.com/motion/)** - Animations
- **[Zod](https://zod.dev/)** - Validation de schémas
- **[Recharts](https://recharts.org/)** - Graphiques

## 📦 Prérequis

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 (ou yarn/pnpm)
- Compte **Supabase** avec projet configuré

## 🚀 Installation

1. **Cloner le dépôt**

```bash
git clone <url-du-repo>
cd agence-fluxior
```

2. **Installer les dépendances**

```bash
npm install
```

3. **Configurer les variables d'environnement**

```bash
cp .env.example .env
```

Éditez le fichier `.env` et renseignez vos clés Supabase :

```env
PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
PUBLIC_SUPABASE_ANON_KEY=votre-cle-anon
```

## ⚙️ Configuration

### Variables d'Environnement

| Variable | Description | Requis |
|----------|-------------|--------|
| `PUBLIC_SUPABASE_URL` | URL de votre projet Supabase | ✅ Oui |
| `PUBLIC_SUPABASE_ANON_KEY` | Clé anonyme Supabase | ✅ Oui |
| `PUBLIC_SENTRY_DSN` | DSN Sentry pour le monitoring (optionnel) | ❌ Non |
| `PUBLIC_ANALYTICS_ID` | ID analytics (optionnel) | ❌ Non |

### Configuration Supabase

1. Créez un projet sur [Supabase](https://app.supabase.com)
2. Créez les tables suivantes :
   - `leads` - Pour stocker les leads
   - `partners` - Pour gérer les partenaires
3. Configurez l'authentification Supabase
4. Activez Row Level Security (RLS) selon vos besoins

## 📜 Scripts Disponibles

### Développement

```bash
# Démarrer le serveur de développement
npm run dev

# Vérifier les types TypeScript
npm run type-check

# Linter le code
npm run lint

# Corriger automatiquement les erreurs de linting
npm run lint:fix

# Formater le code avec Prettier
npm run format

# Vérifier le formatage (sans modifier)
npm run format:check
```

### Production

```bash
# Build de production
npm run build

# Prévisualiser le build de production
npm run preview
```

## 📁 Structure du Projet

```
agence-fluxior/
├── public/                 # Assets statiques
├── src/
│   ├── components/         # Composants réutilisables
│   │   ├── admin/         # Dashboard admin
│   │   ├── demos/         # Démonstrations
│   │   ├── home/          # Composants page d'accueil
│   │   ├── layout/        # Navbar, Footer
│   │   └── ui/            # Composants UI génériques
│   ├── layouts/           # Layouts Astro
│   ├── lib/               # Utilitaires et configuration
│   │   ├── types.ts       # Types TypeScript centralisés
│   │   ├── validation.ts  # Schémas Zod
│   │   ├── errors.ts      # Gestion d'erreurs
│   │   ├── logger.ts      # Système de logging
│   │   ├── env.ts         # Validation variables d'environnement
│   │   └── supabase.ts    # Client Supabase
│   ├── pages/             # Pages Astro (routing)
│   │   ├── admin/         # Pages admin
│   │   └── projets/       # Pages projets/démos
│   └── styles/            # Styles globaux
├── .env.example           # Exemple de configuration
├── astro.config.mjs       # Configuration Astro
├── tailwind.config.mjs    # Configuration Tailwind
└── tsconfig.json          # Configuration TypeScript
```

## 💻 Développement

### Architecture

L'application utilise une architecture hybride :

- **Astro** pour le SSR/SSG et le routing
- **React** pour les composants interactifs (dashboard, wizards)
- **TypeScript** pour le typage strict
- **Supabase** pour la base de données et l'authentification

### Bonnes Pratiques

1. **Types centralisés** : Utilisez `src/lib/types.ts` comme source unique de vérité
2. **Validation** : Utilisez Zod pour valider les données (`src/lib/validation.ts`)
3. **Gestion d'erreurs** : Utilisez le système centralisé (`src/lib/errors.ts`)
4. **Logging** : Utilisez le logger (`src/lib/logger.ts`) au lieu de console.log
5. **Formatage** : Le code est formaté automatiquement avec Prettier
6. **Linting** : ESLint vérifie le code à chaque commit (Husky)

### Ajouter une Nouvelle Page

1. Créez un fichier `.astro` dans `src/pages/`
2. Importez le layout : `import Layout from '../layouts/Layout.astro'`
3. Le routing est automatique basé sur le nom du fichier

### Ajouter un Composant React

1. Créez le composant dans `src/components/`
2. Utilisez `client:load` ou `client:visible` pour l'hydratation
3. Types dans `src/lib/types.ts`

## 🚀 Déploiement

### Préparation

1. Vérifiez que toutes les variables d'environnement sont configurées
2. Testez le build localement : `npm run build`
3. Vérifiez le preview : `npm run preview`

### Plateformes Recommandées

- **Vercel** - Déploiement optimal pour Astro
- **Netlify** - Alternative populaire
- **Cloudflare Pages** - Performance globale

### Variables d'Environnement en Production

Configurez les variables d'environnement dans votre plateforme de déploiement :
- `PUBLIC_SUPABASE_URL`
- `PUBLIC_SUPABASE_ANON_KEY`

## 🧪 Tests

> ⚠️ Les tests ne sont pas encore implémentés. Voir [ANALYSE_ET_AMELIORATIONS.md](./ANALYSE_ET_AMELIORATIONS.md) pour les recommandations.

Pour implémenter des tests :

```bash
# Installer Vitest (recommandé)
npm install -D vitest @testing-library/react

# Ajouter un script dans package.json
"test": "vitest"
```

## 🤝 Contribuer

1. Fork le projet
2. Créez une branche pour votre feature (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

### Standards de Code

- Respectez les règles ESLint (vérifiées automatiquement)
- Utilisez Prettier pour le formatage
- Écrivez du TypeScript strict
- Documentez les fonctions complexes
- Ajoutez des commentaires JSDoc si nécessaire

## 📝 Documentation Supplémentaire

- [Analyse et Améliorations](./ANALYSE_ET_AMELIORATIONS.md) - Analyse détaillée du code
- [Explication Console.log](./EXPLICATION_CONSOLE_LOG.md) - Pourquoi éviter console.log en production

## 📄 Licence

Ce projet est propriétaire. Tous droits réservés.

## 📧 Contact

- **Email** : contact@agence-fluxior.fr
- **Site web** : https://agence-fluxior.fr

---

**Développé avec ❤️ par l'équipe Fluxior**
