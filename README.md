# ★ Summer Stars — Skating Leaderboard

Two web pages that share one cloud database, so the leaderboard looks the same
on every device:

- **`index.html`** — the public leaderboard. View-only, sorted with the most
  stars at the top. Updates live when the admin adds stars.
- **`admin.html`** — password-protected page where an admin enters a name and a
  number of stars. If the skater is already listed, the new stars are **added**
  to their total.

The public page **cannot edit the data** — not even by tampering with the code.
The database itself only allows writes from a signed-in admin (this is enforced
by Supabase Row Level Security).

---

## One-time setup (about 10 minutes)

### 1. Create a free Supabase project

1. Go to <https://supabase.com> and sign up (free).
2. Click **New project**. Give it a name (e.g. `summer-stars`), set a database
   password (you can ignore it after), pick a region near you, and create it.
3. Wait ~2 minutes for it to finish provisioning.

### 2. Create the table and security rules

In your project, open **SQL Editor** (left sidebar) → **New query**, paste the
block below, and click **Run**:

```sql
-- The leaderboard table
create table public.skaters (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  stars      integer not null default 0,
  updated_at timestamptz not null default now()
);

-- Turn on Row Level Security
alter table public.skaters enable row level security;

-- ANYONE can READ the leaderboard (this powers the public page)
create policy "Public can read"
  on public.skaters for select
  to anon, authenticated
  using (true);

-- Only SIGNED-IN admins can add / change / remove rows
create policy "Admins can write"
  on public.skaters for all
  to authenticated
  using (true)
  with check (true);

-- Let the public page receive live updates
alter publication supabase_realtime add table public.skaters;
```

### 3. Create the single admin login

1. Left sidebar → **Authentication** → **Users** → **Add user** →
   **Create new user**.
2. Email: `admin@skating.local`  (you can use any email; just match it in
   `config.js` below).
3. Password: choose your shared admin password.
4. **Important:** enable **Auto Confirm User** (or turn off email confirmation
   under Authentication → Providers → Email) so the account works immediately.

### 4. Plug in your keys

1. Left sidebar → **Project Settings** → **API**.
2. Copy the **Project URL** and the **anon public** key.
3. Open `config.js` and fill in all three values:

```js
const SUPABASE_URL = "https://YOUR-PROJECT.supabase.co";
const SUPABASE_ANON_KEY = "eyJ...your anon key...";
const ADMIN_EMAIL = "admin@skating.local"; // must match the user you created
```

> The anon key is **meant** to be public — it's safe in the browser. Your data
> is protected by the security rules from step 2, not by hiding this key.

---

## Try it locally

From this folder, run a tiny web server (any one of these):

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000/index.html> (public) and
<http://localhost:8000/admin.html> (admin).

> Opening the files by double-clicking (`file://`) can break the Supabase
> connection — use a local server like the one above.

---

## Put it online (so any device can see it)

Upload these files to any static host. Easiest free options:

- **Netlify Drop** — go to <https://app.netlify.com/drop> and drag this whole
  folder in. Done.
- **GitHub Pages**, **Cloudflare Pages**, or **Vercel** also work — just deploy
  the folder as a static site.

Share the public URL with everyone; keep the `/admin.html` URL and password for
yourself.

---

## Day-to-day use

1. Go to `admin.html`, type the password, **Sign in**.
2. Enter a skater's name and how many stars to award, then **Add stars**.
3. Everyone watching `index.html` sees the leaderboard update instantly.

To fix a mistake, use **Remove** in the admin standings list and re-add.

## Files

| File         | What it is                                  |
|--------------|---------------------------------------------|
| `index.html` | Public, view-only leaderboard               |
| `admin.html` | Password-protected admin page               |
| `config.js`  | Your Supabase keys (edit this)              |
| `styles.css` | Shared styling                              |