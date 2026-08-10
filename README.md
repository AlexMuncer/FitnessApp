# Strength & Spin — 8-Week Programme

A self-contained, installable mobile web app (PWA) for your 8-week strength +
spin programme, Monday 17 August – Sunday 11 October 2026.

No build step, no backend, no dependencies — plain HTML/CSS/JS.

## Run it locally

From this folder:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080` on your computer, or find your computer's
local IP (e.g. `192.168.1.23`) and open `http://192.168.1.23:8080` on your
iPhone while on the same Wi-Fi network.

## Deploy it so you can use it anywhere

For a permanent link (and for the service worker / offline caching and
"Add to Home Screen" to behave properly on iOS, which expects HTTPS), push
this folder to a static host. Easiest free options:

- **GitHub Pages** — push this folder to a repo, enable Pages on `main`.
- **Netlify Drop** — drag the `FitnessApp` folder onto https://app.netlify.com/drop
- **Vercel** — `vercel deploy` from this folder (no config needed).

Any of these gives you an `https://…` URL to open on your iPhone.

## Add to your iPhone Home Screen

1. Open the app's URL in **Safari** on your iPhone (must be Safari, not Chrome).
2. Tap the **Share** icon (square with an arrow).
3. Tap **Add to Home Screen**.
4. It now launches full-screen, no browser chrome, with its own icon —
   feels like a native app.

## Data & privacy

Everything you log — completed workouts, weights/reps, spin bookings, notes,
moved sessions — is stored **only in your iPhone's local browser storage**
(`localStorage`). Nothing is sent anywhere; there is no server. This also
means:

- Clearing Safari's website data for this app will erase your progress.
- Progress doesn't sync between devices — it's tied to the one you use it on.
- Uninstalling from your Home Screen does **not** delete the underlying
  Safari data unless you also clear Safari's site data for that URL.

## About the spin booking reminders

A plain web page **cannot send real push notifications on iOS** unless it's
either wrapped as a native app or registered with Apple's Push Notification
service via a backend — neither of which fits "a simple web page you open."
So this app does not pretend to send native notifications.

What it does instead: every time you open the app on a **Tuesday or
Thursday**, it checks whether an unbooked spin class falls in the next 7
days and shows an in-app 🔔 **BOOK SPIN** banner at the top of the Plan tab,
with a **Booked ✓** button that persists.

**To get genuine push notifications**, the realistic paths are:
1. Wrap this as a native-feeling app with a tool like Capacitor and add
   Apple Push Notification service (APNs) — real engineering effort.
2. Use a background service (e.g. a scheduled server job) that texts or
   emails you every Tue/Thu — needs a small backend + your contact details.
3. Simplest: set two **recurring iPhone Reminders/Calendar alerts** for
   Tuesday and Thursday evenings — "Book spin for next week" — which take
   two minutes to set up and require no code at all.

## Programme logic summary

- 8 calendar weeks, Monday-start, Mon 17 Aug – Sun 11 Oct 2026.
- Full weeks (1, 4, 5, 8): 2× full-body strength + 1× spin, Mon/Tue/Thu
  pattern, so no two hard sessions land back-to-back.
- Weeks 2 & 3 taper into / return from the 27–31 Aug break with reduced
  volume and an easier re-entry.
- Weeks 6 & 7 are calendar-constrained by the 22 Sep–1 Oct break to a
  single trainable day each (21 Sep, and 2–4 Oct) — clearly labelled as
  primer/return sessions rather than pretending a normal week fits.
- Progression runs Foundation (wk1) → Build (wk4) → Peak (wk5) →
  Final/consolidation with an AMRAP test set (wk8), using RPE-based
  loading throughout — see the in-app phase notes on each session.

## File structure

```
index.html          App shell + markup
css/style.css        All styling (light/dark, mobile-first)
js/data.js            Programme data: exercises, weeks, dates, holidays
js/storage.js         localStorage persistence layer
js/app.js             Rendering, routing, workout mode, progress view
manifest.json         PWA manifest
sw.js                  Service worker (offline app-shell caching)
icons/                 Generated app icons
scripts/gen_icons.py   One-off Python script that generated the icons
```
