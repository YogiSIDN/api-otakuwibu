const axios = require("axios")

const formatAudio = ['mp3', 'm4a', 'webm', 'acc', 'flac', 'opus', 'ogg', 'wav'];
const formatVideo = ['360', '480', '720', '1080', '1440', '4k'];

const ytdl = async (url, format) => {
  if (!formatAudio.includes(format) && !formatVideo.includes(format)) {
    throw new Error('Format tidak didukung, cek daftar format yang tersedia.');
  }

  const config = {
    method: 'GET',
    url: `https://p.oceansaver.in/ajax/download.php?format=${format}&url=${encodeURIComponent(url)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
  };

  try {
    const response = await axios.request(config);

    if (response.data && response.data.success) {
      const { id, title, info } = response.data;
      const { image } = info;
      const downloadUrl = await cekProgress(id);

      return {
        status: 200,
        dev: "@mysu_019",
        data: {
        id,
        image,
        title,
        downloadUrl
        }
      };
    } else {
      throw new Error('Gagal mengambil detail video.');
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

const cekProgress = async (id) => {
  const config = {
    method: 'GET',
    url: `https://p.oceansaver.in/ajax/progress.php?id=${id}`,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
  };

  try {
    while (true) {
      const response = await axios.request(config);

      if (response.data && response.data.success && response.data.progress === 1000) {
        return response.data.download_url;
      }
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

module.exports = { ytdl, cekProgress }