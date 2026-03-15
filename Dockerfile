# Node.js අඩංගු මූලික image එක ගැනීම
FROM node:18

# FFmpeg සහ Python (yt-dlp සඳහා අවශ්‍යයි) install කිරීම
RUN apt-get update && apt-get install -y ffmpeg python3 python3-pip

# yt-dlp බාගත කිරීම
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp
RUN chmod a+rx /usr/local/bin/yt-dlp

# වැඩ කරන තැන (Work Directory) සැකසීම
WORKDIR /app

# අපේ Project එකේ files කොපි කිරීම
COPY package*.json ./
RUN npm install
COPY . .

# සර්වර් එක ආරම්භ කිරීම
CMD ["node", "server.js"]