# 🚀 HomePro Web Preview & Landing Page

Ultra-lightweight, high-performance static showcase page for **HomePro - Family GPS Tracker & Women Safety Guardian**.

---

## 🌟 Highlights
- **Realistic 3D Smartphone Mockup** with 4 interactive screen states:
  1. 📍 **Live GPS Map Tracking** (Speed, pin avatars, accuracy badge).
  2. 🚨 **Women Safety & SOS Alert Screen** (Emergency broadcast, police 112 quick dialer, siren).
  3. 👨‍👩‍👧 **Family Circle & Live Telemetry** (Battery %, network state, remote refresh).
  4. ⭕ **Smart Geofence Safe Zones** (Arrival/departure automated check-ins).
- **Direct APK Download Button** (Pre-linked to `HomePro-release.apk` with size & version badges).
- **Scan QR Code Modal** for direct phone downloads.
- **Zero-Dependency & Instant Load** (Pure HTML5 + Tailwind CSS + Vanilla JS).

---

## 🌐 How to Host on Render (Free & Fast)

1. **Push this folder to a GitHub repository** (e.g. `HomePro_Preview` or your portfolio repo).
2. Go to **[Render.com](https://render.com/)** and click **New +** -> **Static Site**.
3. Connect your GitHub repository.
4. Settings:
   - **Name**: `homepro-preview` (or any name you like)
   - **Branch**: `main`
   - **Build Command**: *(Leave Empty)*
   - **Publish Directory**: `./` (or `.` / root)
5. Click **Create Static Site**. Your site will be live within seconds at `https://homepro-preview.onrender.com`! 🎉

---

## 📦 APK Hosting Strategy

- **Option A (Included in Repo):** `HomePro-release.apk` is already in this directory and directly linked to the Download button.
- **Option B (GitHub Releases - Recommended for large files):**
  1. In your GitHub repository, click **Releases** -> **Draft a new release**.
  2. Upload `HomePro-release.apk` and publish release `v1.0.0`.
  3. Copy the release asset download URL and replace `href="HomePro-release.apk"` in `index.html` with your GitHub Release URL.
