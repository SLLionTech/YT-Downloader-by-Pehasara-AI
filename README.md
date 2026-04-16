# YouTube Downloader - Quick Start

## ⚡ Quick Setup (5 minutes)

### Step 1: Install Dependencies
```bash
# Install Python (if not already installed)
# Download from: https://www.python.org/

# After Python is installed, run:
pip install yt-dlp

# Install Node.js dependencies:
npm install
```

### Step 2: Start Server
```bash
node server.js
```

You should see:
```
Server running at http://localhost:3000
```

### Step 3: Use the App
Open your browser and go to: `http://localhost:3000`

---

## 📥 Download Your Videos

1. Paste a YouTube URL
2. Choose quality (MP4 1080p, 720p, or MP3)
3. (Optional) Set start and end times for trimming
4. Click "Download කරන්න" button
5. Wait for success message
6. Check the `downloads` folder

---

## ✅ What I Fixed

✓ Uncommented & fixed the fetch API call  
✓ Created a working Node.js backend server  
✓ Backend uses `yt-dlp` to download videos  
✓ Proper error handling & status messages  
✓ Support for multiple formats (MP4 1080p, 720p, MP3)  
✓ Support for trimming videos (start/end time)  

---

## 🎯 System Requirements

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **Python 3.8+** - [Download](https://www.python.org/)
- **yt-dlp** - Install with: `pip install yt-dlp`

---

## 📁 File Structure

```
Youtube Downloader/
├── index.html        (Frontend UI)
├── server.js         (Backend server)
├── package.json      (Node.js dependencies)
├── downloads/        (Downloaded files will be here)
├── SETUP.md         (Full setup guide in Sinhala)
└── README.md        (This file)
```

---

## 🐛 If It Doesn't Work

1. Make sure the server is running: `node server.js`
2. Check yt-dlp is installed: `yt-dlp --version`
3. Open browser to: `http://localhost:3000`
4. Check browser console (F12) for errors
5. Make sure port 3000 is not in use

---

Enjoy! 🎥
