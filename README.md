# Comet Collector

A simple, kid-friendly browser game.

## How to play

1. Open `index.html` in any modern browser.
2. Click **Start**.
3. Catch yellow comets for points.
4. Dodge gray/red meteors.
5. If a comet falls off the screen, you lose a life.
6. Catch green/purple boost gems for temporary powers.

## Controls

- Desktop: Left/Right arrows or `A` / `D`
- Mobile: Drag finger across the game area
- Settings button: Change difficulty and sound effects

## Boosts

- Shield: Blocks one hit or one missed comet
- Double Points: Comets give double score while active
- Slow Time: Falling objects move slower for a short time

## Notes

- No install needed for the frontend.
- All files are plain HTML/CSS/JS.

## Leaderboard backend

A small Node.js backend is now included in this repo to support the online leaderboard.

### Run locally

1. Install dependencies: `npm install`
2. Start the backend: `npm start`
3. By default it listens on port `3000`.

The backend exposes:

- `GET /leaderboard` — fetch the top 20 scores
- `POST /leaderboard` — submit a score
- `POST /users/login` — create or sign in with a username only
- `GET /users/:username` — fetch user profile data
- `PUT /users/:username` — update user profile data

### Deploy to Render

1. Create a new Node web service on Render using this repository.
2. Set the build command to `npm install`.
3. Set the start command to `npm start`.
4. After deployment, set `REMOTE_API_BASE_URL` in `script.js` to the service URL.

### Important

- The frontend can still be hosted on GitHub Pages.
- The backend handles cross-origin requests so GitHub Pages can call it directly.
- For production use, attach a managed database or persistent store instead of relying on the local SQLite file.
