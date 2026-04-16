# YouTube Downloader - Setup Guide

## ස්ථාපනය කරන ආකාරය (Installation Guide)

### 1️⃣ প්‍රয়োජনීය Software එක ස්ථාපනය කරන්න

#### Option A: Windows ගිණුම (Recommended - Easiest)
```
Windows PowerShell (Administrator) තුළින් ඉතුරු කාරණ ස්ථාපනය කරන්න:

1. Python ස්ථාපනය කරන්න (yt-dlp ට වෙන්න):
   - https://www.python.org/downloads/ වෙතින් download කරන්න
   - Setup දී "Add Python to PATH" check කරන්න

2. yt-dlp ස්ථාපනය කරන්න:
   pip install yt-dlp
```

#### Option B: Chocolatey (Windows) - සරලම ක්‍රමය
```
PowerShell එක Run as Administrator වලින් හරවා නගා විවෘත කරන්න:

choco install python
choco install nodejs

pip install yt-dlp
```

#### Option C: Manual
- Download Node.js: https://nodejs.org/ (LTS version)
- Download Python: https://www.python.org/
- After install, run: `pip install yt-dlp`

---

### 2️⃣ Node.js Dependencies ස්ථාපනය කරන්න

PowerShell/Command Prompt ඉතුරු කර YouTube Downloader folder එක තුළින් चलાවන්න:

```
npm install
```

---

### 3️⃣ サーバ chালаවන්න

```
node server.js
```

ඔබ දිස්විය යුතු ප්‍රකාශනය:
```
Server running at http://localhost:3000
Downloads folder: C:\...\Youtube Downloader\downloads
```

---

### 4️⃣ Application එක විවෘත කරන්න

ඔබගේ browser එක තුළින් මෙම address එක ඇතුළු කරන්න:
```
http://localhost:3000
```

---

## ✅ දැන් කාර්ය කිරීමට සූදානම්

1. YouTube Link එකක් Paste කරන්න (උදා: https://www.youtube.com/watch?v=...)
2. Quality සහ Format තෝරන්න
3. (Option) Trim කිරීමට කැමති නම් Start අරඹුම End Time දාන්න
4. "Download කරන්න" බොතම clicks කරන්න
5. Downloads folder එක තුළින් ගිය file එක බලන්න

---

## 🔧 Troubleshooting

### "Server error" හෝ "Failed to start download"
- yt-dlp installed ඇතිද බට පරීක්ෂා කරන්න: `yt-dlp --version`
- Reinstall කරන්න: `pip install --upgrade yt-dlp`

### "Cannot find module 'express'"
```
npm install
```

### URL එක වලංගු නැත යැයි කියන්න
- YouTube video URL එක සිදු බවට තහවුරු කරන්න
- උදා: https://www.youtube.com/watch?v=dQw4w9WgXcQ

### සර්වරය පිටින්නෙ නෑ
- Node.js installed සිටින්න බට පරීක්ෂා කරන්න: `node --version`
- npm install හරි ලෙස නිම වූ බවට තහවුරු කරන්න

---

## 📝 Notes

- Downloaded files පිටින්නේ `downloads` folder එක තුළින්
- යම් ගිණුම හි ගිණුම් ගිණුම් ගිණුම් සිටින
- MP3 බහනින්න MP3 වලට convert කරයි (බිම් ගිණුම්)

=== Setup එක නිම විය ===
