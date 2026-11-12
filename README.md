# Philip Park portfolio

This is the replacement portfolio on the `codex/portfolio-redesign` branch. The original Wikipedia-style site remains on `main`.

The layout follows the structure of kyama.net: a white full-screen introduction, a centered sequence of project panels with a side index, and separate Craft and About pages. The reference site's images, copy, and code are not included. The home page currently contains three empty project slots.

## Change content

- Edit the home-page sentence in `index.html`.
- Add, remove, or reorder project objects in `content.js`. Each project needs a unique `id`; `shortName` appears in the side index.
- Set `image` to a local path such as `images/my-project.jpg`. The image frame is 16:9. Leave it blank while the project is unfinished.
- Set `href` to an external project URL or a new case-study page. Leave it blank to hide the arrow.
- Edit `about.html` and `craft.html` when you have photos and smaller work to add.

## Preview and build

Run `npm ci` and `npm run dev` for local preview. Run `npm run build` before deploying. This is still the existing Vite repository.
