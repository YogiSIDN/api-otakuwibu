const express = require("express")
const booru = require("booru")
const axios = require("axios")
const path = require("path")
const app = express()
app.use(express.json())
app.use(express.static(path.join(__dirname, "public")))

// Backend
const { tinyUrl } = require("./backend/shortURL")
const { yts } = require("./backend/search")
app.set("json spaces", 4)

app.get("/api/sfw/loli", async (req, res) => {
    try {
        const pilihan = ["loli", "goth-loli", "lolita", "lolita_fashion", "sweet_loli", "lolicon"];
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
            message: "Terjadi kesalahan pada.",
        });
    }
});

app.get("/api/sfw/neko", async (req, res) => {
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

app.get("/api/sfw/waifu", async (req, res) => {
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

app.get("/api/yts", async (req, res) => {
       const { q } = req.query;
       if (!q) {
           return res.status(400).json({ 
               status: 400,
               dev: "@mysu_019",
               message: "Terjadi kesalahan." 
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
   
app.get("/api/tinyUrl", async (req, res) => {
    const { url } = req.query
    if (!url) {
        return res.status(400).json({ 
            status: 400,
            dev: "@mysu_019",
            message: "Terjadi kesalahan." 
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