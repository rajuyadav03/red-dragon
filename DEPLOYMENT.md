# Deployment Guide: Red Dragon Restaurant

This guide explains how to deploy your application to Vercel and connect it to your existing MongoDB Atlas Cluster without interfering with your other projects.

## 🚀 Strategy: One Cluster, Multiple Databases

Since you are on the MongoDB Atlas Free Tier (512MB), you can host multiple projects on the same cluster by using **different Database Names**.

- **Project A (Existing)**: Uses database `project_a` (or whatever it currently uses)
- **Red Dragon (This App)**: Will use database `red_dragon`

They will live side-by-side in the same cluster but will effectively be completely separate.

---

## 🛠️ Step 1: Get Your MongoDB Connection String

1. Log in to **MongoDB Atlas**.
2. Click **Connect** on your Cluster.
3. Choose **Drivers** (Node.js).
4. Copy the connection string. It looks like this:
   ```text
   mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority
   ```
   *Note: Do not include a database name after the slash in the URI yet.*

---

## ☁️ Step 2: Deploy to Vercel

1. Push your code to **GitHub**.
2. Go to [Vercel](https://vercel.com) and click **Add New > Project**.
3. Import your `red-dragon` repository.
4. In the **Configure Project** screen, find **Environment Variables**.
5. Add the following variables:

| Variable Name | Value | Description |
|--------------|-------|-------------|
| `MONGO_URL` | `mongodb+srv://user:pass@cluster...` | Your Atlas connection string |
| `DB_NAME` | `red_dragon` | **IMPORTANT**: This separates this app's data |
| `NEXT_PUBLIC_BASE_URL` | `https://your-vercel-domain.vercel.app` | Your deployed URL |
| `CORS_ORIGINS` | `*` | Allows access from browsers |

**💡 Crucial Detail:**
By setting `DB_NAME` to `red_dragon`, all data for this restaurant app will be stored in a folder (database) named `red_dragon` inside your cluster. Your other project's data (in its own database) will remain untouched.

---

## ✅ Step 3: Verify Connection

After deployment:
1. Visit your new website URL.
2. Go to `/admin` to verify you can log in (`admin@reddragon.com` / `admin123`).
3. Check your MongoDB Atlas Collections view:
   - You should now see a new database `red_dragon` alongside your existing databases.

---

## ⚠️ Important Notes for Free Tier

- **Storage Limit**: You have 512MB total for *all* databases combined.
- **Images**: This app uses external URLs for images (Unsplash/Pexels). It does *not* store image files in the database, so it won't use much space.
- **Monitoring**: Keep an eye on your Atlas storage usage. If it gets full, you may need to delete old orders or upgrade.
