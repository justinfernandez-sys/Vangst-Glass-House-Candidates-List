# Vangst Glasshouse Candidates List — deployable app

This is the same tracker you've been using, rebuilt as a real small web app:
a Node.js server + SQLite database, instead of a single Claude artifact file.
Once deployed, it gets its own URL (like `yourapp-production.up.railway.app`)
that anyone can open — no Claude account needed.

## What's in here
- `server.js` — the backend. Serves the app and a tiny save/load API.
- `public/index.html` — the tracker itself (same UI you already have).
- `package.json` — tells Railway what to install and how to start it.

## Deploy to Railway (free to start)

1. **Put this code on GitHub.**
   - Create a new GitHub repository (private is fine).
   - Upload this whole folder to it (GitHub's website lets you drag-and-drop
     files if you don't use git from the command line — look for
     "Add file → Upload files" on the repo page).

2. **Create a Railway account** at railway.app (you can sign in with GitHub).

3. **New Project → Deploy from GitHub repo**, and pick the repo you just
   created. Railway will detect it's a Node app automatically and start
   building it.

4. **Add a Volume so your data survives redeploys.**
   - In your new Railway service, go to the **Volumes** tab.
   - Click **New Volume**.
   - Set the **mount path** to `/data`.
   - This matters: without it, every time you redeploy, the candidate list
     would reset to empty. With it, your data lives on disk permanently.

5. **Set one environment variable.**
   - Go to the **Variables** tab.
   - Add `DB_PATH` = `/data/app.db`
   - (This tells the app to store its database on the Volume you just made.)

6. **Get your URL.**
   - Go to **Settings → Networking → Generate Domain**.
   - Railway gives you a free `something-production.up.railway.app` URL.
   - That's the link to send your team — open it in any browser, no login
     needed.

7. **(Optional) Use your own domain**, like `candidates.vangst.com`.
   - Still in **Settings → Networking**, choose **Custom Domain**.
   - Railway shows you a DNS record (a CNAME) to add wherever your domain is
     registered (GoDaddy, Namecheap, Cloudflare, etc.). Add that record,
     and Railway handles the rest — usually live within a few minutes to an
     hour depending on DNS.

## Cost
Railway's free trial gives you a small amount of usage credit; a light
internal tool like this typically costs a few dollars a month once that
runs out. You'll see estimated pricing in Railway's dashboard before you're
charged anything.

## Testing it locally first (optional)
If you or someone technical wants to try it before deploying:
```
npm install
npm start
```
Then open http://localhost:3000 in a browser.

## If something's not working
- Blank page / can't save → check that the Volume is attached at `/data`
  and `DB_PATH` is set exactly as above.
- Build fails on Railway → make sure all three files (`server.js`,
  `package.json`, `public/index.html`) were uploaded, with `public/`
  actually as a folder, not files renamed with "public-" in front.
