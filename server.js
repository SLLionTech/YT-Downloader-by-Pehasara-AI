const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Windows නම් .exe ද, Linux නම් yt-dlp ද select කිරීම
const ytDlpPath = process.platform === 'win32' ? '.\\yt-dlp.exe' : 'yt-dlp';

// YouTube flags - android client uses different API that bypasses datacenter IP blocking
const YT_FLAGS = '--no-warnings --extractor-args "youtube:player_client=android,web"';


// DEBUG endpoint - Render Free plan shell නැති නිසා browser හරහා diagnose කිරීමට
app.get('/debug', (req, res) => {
    const testUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    const command = `"${ytDlpPath}" --no-warnings --dump-json "${testUrl}"`;

    exec(command, { timeout: 30000 }, (error, stdout, stderr) => {
        res.json({
            platform: process.platform,
            ytDlpPath,
            command,
            success: !error,
            error: error ? error.message : null,
            stderr: stderr || null,
            stdout_preview: stdout ? stdout.substring(0, 300) : null
        });
    });
});

// 1. Video Info API
app.post('/info', (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL එකක් ලබා දී නැත." });

    const command = `"${ytDlpPath}" ${YT_FLAGS} --dump-json "${url}"`;
    console.log("Info Command:", command);

    exec(command, { timeout: 30000 }, (error, stdout, stderr) => {
        if (error) {
            console.error("yt-dlp error:", stderr || error.message);
            return res.status(500).json({ error: "යූ-ටියුබ් වලින් තොරතුරු ලබාගැනීමට නොහැකි විය.", detail: stderr });
        }
        try {
            const info = JSON.parse(stdout);
            res.json({ duration: info.duration, title: info.title });
        } catch (e) {
            console.error("JSON parse error:", e.message);
            res.status(500).json({ error: "දත්ත කියවීමේ දෝෂයක්." });
        }
    });
});

// 2. Video Download & Trim API
app.post('/download', (req, res) => {
    const { url, start, end, format, customPath, fileName } = req.body;
    if (!url) return res.status(400).json({ error: "URL එකක් ලබා දී නැත." });

    const isAudio = format.startsWith('mp3');
    const extension = isAudio ? 'mp3' : 'mp4';

    // Output directory
    let outputDir = path.join(__dirname, 'downloads');
    if (customPath) {
        try {
            if (!fs.existsSync(customPath)) fs.mkdirSync(customPath, { recursive: true });
            outputDir = customPath;
        } catch (e) {
            console.error("Path creation error", e);
        }
    } else {
        if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
    }

    // Output file name
    let finalFileName = fileName ? `${fileName}.${extension}` : `media_${Date.now()}.${extension}`;
    finalFileName = finalFileName.replace(/[<>:"/\\|?*]+/g, '_');
    const outputPath = path.join(outputDir, finalFileName);

    // Format options
    let formatOption = '';
    if (format === 'mp4_1080') formatOption = '-f "bestvideo[height<=1080][ext=mp4]+bestaudio[ext=m4a]/best"';
    else if (format === 'mp4_720') formatOption = '-f "bestvideo[height<=720][ext=mp4]+bestaudio[ext=m4a]/best"';
    else if (format === 'mp4_480') formatOption = '-f "bestvideo[height<=480][ext=mp4]+bestaudio[ext=m4a]/best"';
    else if (format === 'mp4_360') formatOption = '-f "bestvideo[height<=360][ext=mp4]+bestaudio[ext=m4a]/best"';
    else if (format === 'mp4_240') formatOption = '-f "bestvideo[height<=240][ext=mp4]+bestaudio[ext=m4a]/best"';
    else if (format === 'mp3_320') formatOption = '-x --audio-format mp3 --audio-quality 320K';
    else if (format === 'mp3_192') formatOption = '-x --audio-format mp3 --audio-quality 192K';
    else if (format === 'mp3_128') formatOption = '-x --audio-format mp3 --audio-quality 128K';

    // Trim option
    let trimOption = '';
    if (start && end && start !== end) {
        trimOption = `--download-sections "*${start}-${end}"`;
    }

    const command = `"${ytDlpPath}" ${YT_FLAGS} ${formatOption} ${trimOption} -o "${outputPath}" "${url}"`;
    console.log("Download Command:", command);

    exec(command, { timeout: 300000 }, (error, stdout, stderr) => {
        if (error) {
            console.error("Download error:", stderr || error.message);
            return res.status(500).json({ error: "Download Error!", detail: stderr });
        }

        if (customPath) {
            return res.json({ success: true, message: `Download සාර්ථකයි! File: ${outputPath}` });
        } else {
            res.download(outputPath, (err) => {
                if (!err) fs.unlink(outputPath, () => {});
            });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});