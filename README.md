# Pikacheck Website

Site web officiel de Pikacheck - Application de gestion de collection Pokémon.

## Structure du projet

```
├── assets/
│   ├── badges/          # Badges App Store et Google Play
│   ├── favicons/        # Tous les favicons et icônes
│   ├── images/          # Images du site (screenshots, logos)
│   └── mockups/         # Mockups iPhone pour présentation
├── download/            # Page de téléchargement
├── pages/               # Pages légales (privacy, terms)
├── index.html           # Page d'accueil
├── comparateur-prix-pokemon.html  # Page comparateur de prix
├── sitemap.xml          # Plan du site pour SEO
├── robots.txt           # Configuration robots SEO
├── CNAME                # Configuration domaine personnalisé
└── README.md            # Documentation du projet
```

## Pages

- **/** - Page d'accueil avec présentation de l'app
- **/articles** - Hub centralisé pour tous les articles et guides
- **/comparateur-prix-pokemon.html** - Article SEO sur le comparateur de prix
- **/download/** - Page de redirection vers les stores
- **/pages/privacy.html** - Politique de confidentialité
- **/pages/terms.html** - Conditions d'utilisation

## Déploiement

Le site est déployé automatiquement sur GitHub Pages à chaque push sur la branche `main`.

URL de production : https://app.pikacheck.com

## Mise à jour

```bash
# Faire vos modifications
git add .
git commit -m "Description des changements"
git push
```

Le déploiement prend 1-2 minutes après le push.

## SEO

- Sitemap à jour dans `sitemap.xml`
- Meta tags optimisés sur toutes les pages
- Schema.org markup pour l'indexation
- Images optimisées en WebP/PNG
