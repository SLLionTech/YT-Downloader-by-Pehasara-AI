const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
// මෙන්න මේ පේළිය අලුතින් එකතු කරන්න
app.use(express.static(__dirname));

// 1. වීඩියෝ එකේ තොරතුරු (කාලය) ලබාගැනීම සඳහා අලුත් API එක
app.post('/info', (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).send("URL එකක් ලබා දී නැත.");

    // yt-dlp.exe හරහා වීඩියෝවේ තොරතුරු JSON විදිහට ගැනීම
    // Windows නම් .\\yt-dlp.exe ද, නැතිනම් (Linux) yt-dlp ද පාවිච්චි කිරීම
    const ytDlpPath = process.platform === 'win32' ? '.\\yt-dlp.exe' : 'yt-dlp';
    const command = `${ytDlpPath} --dump-json "${url}"`;
    
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(error.message);
            return res.status(500).send("වීඩියෝ තොරතුරු ලබාගැනීමට නොහැකි විය.");
        }
        try {
            const info = JSON.parse(stdout);
            res.json({ duration: info.duration, title: info.title });
        } catch (e) {
            res.status(500).send("දත්ත කියවීමේ දෝෂයක්.");
        }
    });
});

// 2. වීඩියෝ එක Download සහ Trim කිරීමේ API එක
app.post('/download', (req, res) => {
    const { url, start, end, format, customPath, fileName } = req.body;
    if (!url) return res.status(400).send("URL එකක් ලබා දී නැත.");

    const isAudio = format.startsWith('mp3');
    const extension = isAudio ? 'mp3' : 'mp4';
    
    // Determine output directory
    let outputDir = path.join(__dirname, 'downloads');
    if (customPath) {
        try {
            if (!fs.existsSync(customPath)) {
                fs.mkdirSync(customPath, { recursive: true });
            }
            outputDir = customPath;
        } catch (e) {
            console.error("Path creation error", e);
        }
    } else {
        if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
    }
    
    // Determine output file name
    let finalFileName = fileName ? `${fileName}.${extension}` : `media_${Date.now()}.${extension}`;
    // Sanitize file name to prevent issues
    finalFileName = finalFileName.replace(/[<>:"/\\|?*]+/g, '_');

    const outputPath = path.join(outputDir, finalFileName);

    let formatOption = '';
    
    // Video Qualities
    if (format === 'mp4_1080') formatOption = '-f "bestvideo[height<=1080][ext=mp4]+bestaudio[ext=m4a]/best"';
    else if (format === 'mp4_720') formatOption = '-f "bestvideo[height<=720][ext=mp4]+bestaudio[ext=m4a]/best"';
    else if (format === 'mp4_480') formatOption = '-f "bestvideo[height<=480][ext=mp4]+bestaudio[ext=m4a]/best"';
    else if (format === 'mp4_360') formatOption = '-f "bestvideo[height<=360][ext=mp4]+bestaudio[ext=m4a]/best"';
    else if (format === 'mp4_240') formatOption = '-f "bestvideo[height<=240][ext=mp4]+bestaudio[ext=m4a]/best"';
    
    // Audio Qualities
    else if (format === 'mp3_320') formatOption = '-x --audio-format mp3 --audio-quality 320K';
    else if (format === 'mp3_192') formatOption = '-x --audio-format mp3 --audio-quality 192K';
    else if (format === 'mp3_128') formatOption = '-x --audio-format mp3 --audio-quality 128K';

    // Trimming Option (වෙලාවන් ලබා දී ඇත්නම් පමණක්)
    let trimOption = '';
    if (start && end && start !== end) {
        trimOption = `--download-sections "*${start}-${end}"`;
    }

    const ytDlpPath = process.platform === 'win32' ? '.\\yt-dlp.exe' : 'yt-dlp';
    const command = `${ytDlpPath} ${formatOption} ${trimOption} -o "${outputPath}" "${url}"`;
    console.log("ක්‍රියාත්මක වන Command එක: ", command);

    exec(command, (error, stdout, stderr) => {
        if (error) return res.status(500).send("Download Error!");

        if (customPath) {
            return res.json({ success: true, message: `Download සාර්ථකයි! File එක ${outputPath} හි සේව් විය.` });
        } else {
            res.download(outputPath, (err) => {
                if (!err) {
                    fs.unlink(outputPath, () => {}); // යැව්වාට පසු මකා දැමීම
                }
            });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Backend Server එක Port ${PORT} හි වැඩ!`);
});