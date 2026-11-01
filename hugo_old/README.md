# 🗄️ ARXIU — Lloc web HUGO ANTIC (NO EN ÚS)

> ⚠️ **Aquesta carpeta conté el lloc web anterior fet amb Hugo. NO s'utilitza.**
> Conservada únicament per referència/història.

## Estat

- **Arxivada:** 27 d'agost de 2026
- **Estat:** Substituta i sense ús

## Què és això

Contingut del **lloc web HUGO** que es va fer inicialment per a Manteniments Lizana:

- `config.toml` — configuració de Hugo
- `content/` — pàgines en català i castellà (inici, piscines, jardineria, contacte, política de privacitat, RGPD...)
- `layouts/` — plantilles HTML de Hugo
- `i18n/` — fitxers d'idioma (ca, es)
- `static/` — CSS, imatges i JS de l'antiga web
- `archetypes/` — plantilles de contingut
- `CNAME` — domini custom de l'antiga configuració
- `1.0-mantenimentslizana/` — carpeta de la versió 1.0 (buida/sobrant)

## ⚠️ IMPORTANT — No confondre amb l'app actual

La web **publicada actualment** és l'aplicació **React + Vite** que viu a `src/`,
i que es desplega automàticament a **https://mantenimentslizana.com** mitjançant
el workflow `.github/workflows/deploy.yml` (push a `main` → `pnpm build` → GitHub Pages).

**Aquesta carpeta NO participa en el desplegament.** El directori `public/`
(arrel del projecte) sí que és necessari: conté les imatges estàtiques que Vite
copia a la build final.

## Per què es conserva

Per si cal consultar el contingut textual original (textos de les pàgines,
política de privacitat antiga, etc.) o recuperar alguna part en el futur.

Si algun dia es vol eliminar definitivament, es pot esborrar tota aquesta carpeta
sense afectar la web actual.
