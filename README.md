# Portafolio Personal Alan Francisco Sigala Cardona

Proyecto de portafolio profesional desarrollado como parte de la materia de **Programación Web Full Stack** en la Universidad Autónoma de Ciudad Juárez (UACJ).

---

## Descripción

Sitio web estático de presentación personal orientado a mostrar mi formación académica, tecnologías, habilidades e información de contacto. El diseño sigue una estética tipo **terminal** con tipografía monoespaciada, paleta oscura con acentos cian y detalles inspirados en interfaces de línea de comandos.

---

## Características

- **Tema claro/oscuro** con detección automática de preferencia del sistema operativo (`prefers-color-scheme`) y persistencia mediante `localStorage`.
- **Menú hamburguesa** para navegación responsive en dispositivos móviles.
- **Formulario de contacto** con validación en el lado del cliente: campos obligatorios, formato de correo electrónico y retroalimentación visual de errores/éxito.
- **Diseño responsive** adaptado a pantallas de escritorio, tableta y móvil con media queries para 768 px y 480 px.
- **Accesibilidad**: uso de atributos `aria-label`, `aria-expanded`, roles ARIA y navegación por teclado.
- **Animación de parpadeo** sutil en el encabezado para reforzar la estética terminal.
- Sin dependencias externas de JavaScript — todo el comportamiento interactivo está escrito en JS vanilla.

---

## Tecnologías utilizadas

| Capa | Tecnología |
|------|-----------|
| Estructura | HTML5 semántico |
| Estilos | CSS3 (variables, Grid, Flexbox, media queries, animaciones) |
| Comportamiento | JavaScript (ES5+, DOM API, `localStorage`, `matchMedia`) |
| Tipografía | [Fira Code](https://fonts.google.com/specimen/Fira+Code) vía Google Fonts |

---

## Estructura del proyecto

```
portafolio/
├── index.html          # Estructura y contenido de la página
├── styles.css          # Estilos, variables CSS y diseño responsive
├── script.js           # Tema claro/oscuro, menú hamburguesa y validación de formulario
├── assets/
│   └── images/
│       └── pfp.png     # Foto de perfil
└── README.md
```


## Secciones

1. **Sobre mí** — Presentación general y enfoque profesional.
2. **Formación Académica** — Historial universitario en UACJ.
3. **Tecnologías y Herramientas** — Lenguajes, simuladores y herramientas que manejo.
4. **Habilidades Blandas** — Competencias interpersonales.
5. **Intereses Profesionales** — Áreas de mayor motivación e interés.
6. **Idiomas** — Español nativo e inglés C1.
7. **Contacto** — Formulario con validación del lado del cliente.

---

## Contacto

- **Correo:** al236005@alumnos.uacj.mx
- **GitHub:** [@AlanPandaSK](https://github.com/AlanPandaSK)

---

*Desarrollado con HTML, CSS y JavaScript — Alan Sigala 2026*
