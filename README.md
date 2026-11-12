# Philip Park portfolio redesign

This is a new, static portfolio shell inspired by the restraint and project-focused flow of kyama.net. The original Wikipedia-style website remains on the repository's `main` branch.

## Edit the portfolio

- Change introductory, about, and contact copy in `index.html`.
- Add or edit projects in `content.js`. Copy a project object, give it a unique `id`, then update the text and links. Leave `image` blank for a designed placeholder, or set it to a local path such as `images/project.jpg`.
- Adjust colors, spacing, and type in `styles.css`.

The two “coming soon” projects are intentional example slots. Replace them with real work when ready.

## Preview

Run `python3 -m http.server 8000` in this directory, then open `http://localhost:8000`.

No build step or dependencies are required. The Google Fonts request and the current museum image require an internet connection. For a fully self-contained deployment, download an authorized project image into an `images/` directory and point the corresponding `image` field to it.
