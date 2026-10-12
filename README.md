# Meredian — Dashboard

Espace d'administration de la plateforme, separe du site public.

| App | Dossier | Port |
|---|---|---|
| Site public | `Mérédian_School_Front_end` | 5180 |
| Dashboard | `Mérédian_School_Dashboard` | 5181 |
| API NestJS | `Mérédian_School_Back end` | 4000 |

## Lancer

```bash
cp .env.example .env
npm install
npm run dev        # http://localhost:5181
```

Le backend doit autoriser l'origine du dashboard :
`CORS_ORIGIN=http://localhost:5180,http://localhost:5181` dans le `.env` du backend.

Pour tester sans backend : `VITE_USE_MOCKS=true` dans `.env`
(compte demo : `admin@meredian.dev` / `admin1234`).

## Acces

Reserve aux comptes `role = admin` (verifie aussi cote serveur).
Le compte admin est cree par `npm run seed` dans le backend, a partir de
`ADMIN_EMAIL` / `ADMIN_PASSWORD`.

## Pages

- **Vue d'ensemble** : chiffres cles, elements a traiter, derniers messages
- **Cours** : catalogue, prix, gratuit/payant, modules et sections
- **Corrections** : travaux envoyes par les etudiants
- **Mentorat** : reservations 1-a-1
- **Sessions Q&R** : sessions en direct
- **Messages** : formulaire de contact, marquage comme lu
