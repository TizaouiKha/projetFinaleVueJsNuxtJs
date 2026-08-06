# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Prisma (configuration locale, sans Docker)

Ce projet utilise Prisma. Pour un contributeur qui clone le repo, l'option la plus simple en local est d'utiliser SQLite (aucun serveur à lancer).

1. Copier `.env.example` en `.env` et adapter la valeur `DATABASE_URL` si nécessaire :

```bash
cp .env.example .env
# (si vous voulez utiliser Postgres ou MySQL, modifiez DATABASE_URL dans .env)
```

2. Installer les dépendances :

```bash
npm install
```

3. Générer le client Prisma (exécuter après avoir configuré `DATABASE_URL`) :

```bash
npx prisma generate
```

4. Appliquer les migrations / initialiser la base en développement :

- Pour développement (interactive) qui crée et applique les migrations locales :

```bash
npx prisma migrate dev
```

- Pour appliquer des migrations déjà présentes (CI / production) :

```bash
npx prisma migrate deploy
```

5. (Optionnel) Si le projet contient des scripts d'import/seed (dans `scripts/`), lancez-les :

```bash
# TypeScript seed/import script
npx ts-node scripts/import-types.ts

# ou si le script est JavaScript compilé
node scripts/import-types.js
```

6. Lancer l'application en développement :

```bash
npm run dev
```

Notes et conseils
- Si vous utilisez SQLite, le fichier de base de données (`dev.db` dans l'exemple) sera créé automatiquement.
- Après chaque modification de `prisma/schema.prisma`, exécutez `npx prisma generate`.
- Préférez `migrate dev` en local et `migrate deploy` en CI/production.
- Si vous voulez que j'ajoute un script `npm run seed` ou un `.env.example` plus détaillé, dites-le-moi.

