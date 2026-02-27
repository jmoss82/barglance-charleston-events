# Charleston Event Display

**An automated event showcase for hotels and hospitality businesses**

A beautiful 3D map display that automatically cycles through local events, perfect for hotel lobbies, tourist centers, and hospitality spaces. Powered by the BarGlance API.

---

## Product Overview

This display solution helps hotels keep guests informed about what's happening around town. Instead of guests asking "What should we do tonight?", your lobby screen automatically showcases upcoming events at local venues with stunning 3D visuals and detailed event information.

**Perfect for:**
- Hotel lobbies
- Convention centers
- Tourist information centers
- Vacation rental properties
- Hospitality businesses

---

## Quick Start

1. **Start the local server:**
   ```bash
   python start_server.py
   ```

2. **Open the display:**
   ```
   http://localhost:9876/hotel_event_display.html
   ```

The display will automatically:
- Load current and upcoming events in Charleston
- Cycle through each event every 12 seconds
- Update throughout the day to remove events once they’ve ended
- Loop continuously

---

## Sharing & Deployment

Share the map with partners and customers by deploying it to a public URL. The app is static (HTML/JS/CSS + BarGlance API from the browser), so any static host works.

### Recommended: Vercel

**Why:** Clean URL, free tier, no config. Partners open one link (e.g. `https://your-demo.vercel.app`) and see the map.

1. **Push the project to GitHub** (if not already), e.g. a repo containing the `3D Social Map` folder.
2. **Go to [vercel.com](https://vercel.com)** → Sign in with GitHub.
3. **New Project** → Import your repo.
4. **Set Root Directory:** Click "Edit" next to the repo name and set the root to `3D Social Map` (or the folder that contains `hotel_event_display.html`).
5. **Deploy.** Vercel will build and give you a URL. The root URL serves the map (thanks to `vercel.json`).
6. **Share** the link (e.g. `https://your-project.vercel.app`). Optionally add a custom domain in Project Settings.

**CLI option:** From the repo root, run:
```bash
cd "3D Social Map"
npx vercel
```
Follow the prompts; share the URL it prints.

### Alternative: GitHub Pages

**Why:** Free, simple, good if the repo is already on GitHub.

1. Push the repo to GitHub.
2. **Settings → Pages** → Source: "Deploy from a branch".
3. Branch: `main` (or your default), folder: **/ (root)** or **/docs**.
4. If the repo root is the repo (not the `3D Social Map` folder), put the contents of `3D Social Map` at the repo root so that `hotel_event_display.html` is at the root, or put the whole `3D Social Map` folder in the repo and share:  
   `https://<username>.github.io/<repo>/3D%20Social%20Map/hotel_event_display.html`
5. Save; after a minute the site will be live.

### Railway

Railway is better suited to apps with a backend. For this static map, **Vercel or GitHub Pages is simpler** and free. If you use Railway anyway, you can serve the `3D Social Map` folder with a static server (e.g. `npx serve .`) and set the start command accordingly.

### Before you share

- **Mapbox token:** The token in `hotel_event_display.html` is used in the browser. For a public demo, use a token with URL restrictions (e.g. your Vercel/Pages domain) in the Mapbox dashboard so it can’t be reused on other sites.
- **BarGlance API:** The app calls the BarGlance API from the browser. Ensure the API allows requests from your deployment origin (CORS). If you see blocked requests, the API may need to allow your deployment domain.
- **Logo:** Ensure `barglance-logo.png` is in the same folder as `hotel_event_display.html` so the loading screen displays correctly.

---

## Features

### Automated Event Cycling
- **12-second intervals** per event (customizable)
- **Smooth camera transitions** flying to each venue location
- **Loops continuously** - perfect for unattended lobby displays
- **Auto-refresh** every 5 minutes to filter out ended events

### Beautiful 3D Visuals
- **Mapbox 3D buildings** with modern color scheme
- **Dark map style** (night look) — Mapbox dark-v11 base
- **Venue name label** - only the current venue is labeled on the map (green-tinted halo so it stands out); no pin/icon
- **Clean interface** - no clutter, just essential information

### Event Information Display
Each event shows:
- Event title and venue name
- Date and time — shows "All day" for all-day events, "Through [date]" for multi-day, start time only when there’s no specific end (or end is a placeholder), or start–end when both are specific
- Venue address
- Cover charge (if applicable)
- Event description (if available)
- Event category/classification

### Smart Filtering
- Shows **upcoming and ongoing events** (events stay visible until their end time; ended events are hidden)
- **One event per venue per day** (deduplicated so the same venue doesn’t repeat in one cycle)
- Events loaded fresh every 5 minutes

---

## Files

**Main Product:**
- `hotel_event_display.html` - The automated event display (production ready)

**Development/Testing:**
- `mapbox_3d_charleston_test.html` - Map testing and development
- `start_server.py` - Local HTTP server for testing

**Legacy Files:**
- `google_3d_map_charleston.html` - Google 3D map prototype
- `working_social_map.html` - Mapbox national map with venue data

---

## Configuration

### City/Location
Currently set to **Charleston, SC**. To change the city:

1. Update the API endpoint in `hotel_event_display.html` (line ~285):
   ```javascript
   const response = await fetch('https://partner-api.barglance.com/api/v1/partner/events/STATE/CITY', {
   ```

2. Update map center coordinates (line ~230):
   ```javascript
   center: [-79.9311, 32.7765], // Change to your city coordinates
   ```

### Cycle Duration
Adjust how long each event is displayed (search for `CYCLE_DURATION`):
```javascript
const CYCLE_DURATION = 12000; // milliseconds (12 seconds default)
```

### Auto-Refresh Interval
Change how often the event list is refreshed and ended events removed (search for `setInterval`):
```javascript
}, 5 * 60 * 1000); // 5 minutes default
```

### API Keys
**Mapbox Token:** Line 230
**BarGlance API Key:** Line 287

---

## How It Works

1. **Loads events** from BarGlance API for the specified city
2. **Filters events** - removes only events that have ended (ongoing events stay until their end time)
3. **Shows one venue at a time** - the current venue’s name appears as a label on the map (no pin/icon)
4. **Auto-cycles** through events:
   - Flies camera to venue location
   - Shows event info card
   - Shows that venue’s name on the map with a green-tinted halo
   - Moves to next event after 12 seconds
5. **Loops continuously** - restarts from first event after showing all
6. **Auto-refreshes** every 5 minutes to update event list

---

## Technical Details

### Map Configuration
- **Style:** Mapbox Dark (dark-v11) — night-style base
- **3D Buildings:** Modern color scheme (whites, blues, light pastels)
- **Terrain:** Enabled with 1.5x exaggeration
- **Camera:** 60° pitch, aerial view
- **POIs Hidden:** Business names, landmarks, transit, building numbers
- **Labels Visible:** Streets, neighborhoods, parks; plus the **current venue name only** (highlighted with a green-tinted halo)

### Data Source
- **API:** BarGlance Partner API
- **Endpoint:** `/api/v1/partner/events/{state}/{city}`
- **Update Frequency:** Every 5 minutes
- **Event Limit:** One event per venue per day (API behavior)

### Browser Requirements
- Modern browser with WebGL support
- Recommended: Chrome, Firefox, Edge, Safari

---

## Customization Options

### Visual Styling
The display is designed to be hotel-friendly with:
- Clean, modern aesthetic
- Professional white info cards
- Subtle animations
- Easy-to-read fonts

To customize:
- **Colors:** Modify CSS in the `<style>` section (e.g. `.category-tag` for the event-type pill, currently neutral gray)
- **Card position:** Adjust `.event-info-card` CSS (currently top-left)
- **Venue label on map:** The highlighted venue name is a symbol layer `event-label`; adjust its `paint` (e.g. `text-halo-color`, `text-size`) in the JavaScript where the layer is added
- **Building colors:** Edit `fill-extrusion-color` paint properties in the 3D buildings layer

### Future Enhancements
Potential additions:
- Hotel logo/branding overlay
- Distance from hotel location
- Event filtering by type/category
- Multi-city support
- Touch interaction for manual browsing
- QR codes for event details

---

## Product Vision

This is a **B2B product** designed to be sold to hotels and hospitality businesses as an automated guest information solution. The display reduces front desk inquiries while keeping guests engaged and informed about local nightlife and events.

**Value Proposition:**
- Automated content updates (no manual management needed)
- Beautiful visual presentation
- Keeps guests informed and satisfied
- Promotes local venues and nightlife
- Professional, turnkey solution

---

## Support

For questions, customization requests, or deployment support, please contact the development team.
