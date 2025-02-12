const express = require("express")
const booru = require("booru")
const axios = require("axios")
const fs = require("fs")
const PDFDocument = require("pdfkit")
const path = require("path")
const app = express()
app.use(express.json())
app.use(express.static(path.join(__dirname, "public")))

// Backend
const { nhSearch, nhDetail } = require("./backend/nhentai")
const { tinyUrl } = require("./backend/shortURL")
const { sps, yts } = require("./backend/search")
const { ytdl } = require("./backend/ytdl-core")
app.set("json spaces", 4)

const API_KEYS = ["Beta"]; // Daftar API key yang diizinkan

const validateApiKey = (req, res, next) => {
    const apiKey = req.query.apikey || req.headers["x-api-key"];

    if (!apiKey || !API_KEYS.includes(apiKey)) {
        return res.status(403).json({
            status: 403,
            dev: "@mysu_019",
            message: "API Key tidak valid atau tidak disertakan."
        });
    }

    next();
};

app.use("/api", validateApiKey)

app.get("/api/spodl", validateApiKey, async (req, res) => {
    const { url } = req.query;
    if (!url) {
        return res.status(400).json({
            status: 400,
            dev: "@mysu_019",
            message: "Parameter 'url' tidak boleh kosong."
        });
    }
    if (!url.includes("spotify.com")) {
        return res.status(400).json({
            status: 400,
            dev: "@mysu_019",
            message: "URL harus merupakan link Spotify yang valid."
        });
    }
    try {
        const response = await axios.get('https://api.agatz.xyz/api/spotifydl?url=' + url);
        if (!response.data || !response.data.data) {
            return res.status(500).json({
                status: 500,
                dev: "@mysu_019",
                message: "Respons dari API tidak valid."
            });
        }
        const result = JSON.parse(response.data.data);
        res.json({
            status: 200,
            dev: "@mysu_019",
            data: result
        });
    } catch (error) {
        if (error.response) {
            return res.status(error.response.status).json({
                status: error.response.status,
                dev: "@mysu_019",
                message: "Terjadi kesalahan pada API eksternal."
            });
        } else if (error.request) {
            return res.status(500).json({
                status: 500,
                dev: "@mysu_019",
                message: "Tidak ada respons dari API eksternal."
            });
        } else {
            return res.status(500).json({
                status: 500,
                dev: "@mysu_019",
                message: "Terjadi kesalahan saat memproses permintaan."
            });
        }
    }
});

app.get("/api/ytmp3", validateApiKey, async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({
      status: 400,
      dev: "@mysu_019",
      message: "Parameter 'url' tidak boleh kosong."
    });
  }

  try {
    const result = await ytdl(url, "mp3");
    res.json(result);
  } catch (error) {
    res.status(500).json({
      status: 500,
      dev: "@mysu_019",
      message: "Terjadi kesalahan saat memproses permintaan."
    });
  }
});

app.get("/api/ytmp4", validateApiKey, async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({
      status: 400,
      dev: "@mysu_019",
      message: "Parameter 'url' tidak boleh kosong."
    });
  }

  try {
    const result = await ytdl(url, "360");
    res.json(result);
  } catch (error) {
    res.status(500).json({
      status: 500,
      dev: "@mysu_019",
      message: "Terjadi kesalahan saat memproses permintaan."
    });
  }
});

app.get("/api/nsfw/nhsearch", validateApiKey, async (req, res) => {
    const { q } = req.query;
       if (!q) {
           return res.status(400).json({ 
               status: 400,
               dev: "@mysu_019",
               message: "Parameter 'q' tidak boleh kosong." 
           });
       }
    try {
        const response = await nhSearch(q)
        if (!response.data || response.data.length === 0) {
            return res.status(404).json({
                status: 404,
                dev: "@mysu_019",
                message: "Hasil tidak ditemukan."
            })
        }
        res.json(response)
    } catch (error) {
        res.status(500).json({
               status: 500,
               dev: "@mysu_019",
               message: "Terjadi kesalahan."
           });
    }
})

app.get("/api/nsfw/nhdetail", validateApiKey, async (req, res) => {
    const { id } = req.query;
       if (!id) {
           return res.status(400).json({ 
               status: 400,
               dev: "@mysu_019",
               message: "Parameter 'id' tidak boleh kosong." 
           });
       }
    try {
       const response = await nhDetail(id)
       res.json(response)
    } catch (error) {
        res.status(500).json({
            status: 500,
            dev: "@mysu_019",
            message: "Terjadi kesalahan.",
        });
    }
})

app.get("/api/sfw/loli", validateApiKey, async (req, res) => {
    try {
        const pilihan = ["loli", "goth-loli", "lolita_fashion"];
        const hasilAcak = pilihan[Math.floor(Math.random() * pilihan.length)];
        const jsonResponse = await booru.search('konan', [hasilAcak], { limit: 1, random: true });
        if (!jsonResponse.posts || jsonResponse.posts.length === 0) {
            return res.status(404).json({
                status: 404,
                dev: "@mysu_019",
                message: "Gambar tidak ditemukan."
            });
        }
        const imageUrl = jsonResponse.posts[0].fileUrl;
        const imageResponse = await axios.get(imageUrl, { responseType: "arraybuffer" });
        const contentType = imageUrl.endsWith('.png') ? 'image/png' : imageUrl.endsWith('.gif') ? 'image/gif' : 'image/jpeg';

        res.setHeader("Content-Type", contentType);
        res.send(imageResponse.data);
    } catch (error) {
        res.status(500).json({
            status: 500,
            dev: "@mysu_019",
            message: "Terjadi kesalahan.",
        });
    }
});

app.get("/api/sfw/neko", validateApiKey, async (req, res) => {
    try {
        const jsonResponse = await axios.get("https://api.waifu.pics/sfw/neko");
        const imageUrl = jsonResponse.data.url;
        const imageResponse = await axios.get(imageUrl, { responseType: "arraybuffer" });

        res.setHeader("Content-Type", "image/jpeg");
        res.send(imageResponse.data);
    } catch (error) {
        res.status(500).json({
            status: 500,
            dev: "@mysu_019",
            message: "Terjadi kesalahan."
        });
    }
});

app.get("/api/sfw/waifu", validateApiKey, async (req, res) => {
    try {
        const jsonResponse = await axios.get("https://api.waifu.pics/sfw/waifu");
        const imageUrl = jsonResponse.data.url;
        const imageResponse = await axios.get(imageUrl, { responseType: "arraybuffer" });

        res.setHeader("Content-Type", "image/jpeg");
        res.send(imageResponse.data);
    } catch (error) {
        res.status(500).json({
            status: 500,
            dev: "@mysu_019",
            message: "Terjadi kesalahan."
        });
    }
});

app.get("/api/spotifySearch", validateApiKey, async (req, res) => {
    const { q } = req.query;

    if (!q) {
        return res.status(400).json({ 
            status: 400,
            dev: "@mysu_019",
            message: "Parameter 'q' tidak boleh kosong." 
        });
    }

    try {
        const result = await sps(q);
        res.status(result.status).json(result);
    } catch (error) {
        res.status(500).json({
            status: 500,
            dev: "@mysu_019",
            message: "Terjadi kesalahan."
        });
    }
});

app.get("/api/yts", validateApiKey, async (req, res) => {
       const { q } = req.query;
       if (!q) {
           return res.status(400).json({ 
               status: 400,
               dev: "@mysu_019",
               message: "Parameter 'q' tidak boleh kosong." 
           });
       }
       try {
           const result = await yts(q);
           if (result.status !== 200) {
               return res.status(result.status).json(result);
           }
           res.json(result);
       } catch (error) {
           res.status(500).json({
               status: 500,
               dev: "@mysu_019",
               message: "Terjadi kesalahan."
           });
       }
})
   
app.get("/api/tinyUrl", validateApiKey, async (req, res) => {
    const { url } = req.query
    if (!url) {
        return res.status(400).json({ 
            status: 400,
            dev: "@mysu_019",
            message: "Parameter 'url' tidak boleh kosong." 
        })
    }
    try {
        const result = await tinyUrl(url)
        res.json(result)
    } catch (error) {
        res.status(500).json({
               status: 500,
               dev: "@mysu_019",
               message: "Terjadi kesalahan."
           });
    }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Running in port: ${PORT}`)
})