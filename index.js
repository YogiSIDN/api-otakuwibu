const express = require("express");
const path = require("path");
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Backend
const { tinyUrl } = require("./backend/shortURL");
const { youtube } = require("./backend/search");

app.set("json spaces", 2);

// Endpoint API
app.get("/api/tinyUrl", async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ 
            status: 400, 
            message: "Berikan saya URL!" 
        });
    }
    try {
        const result = await tinyUrl(url);
        res.json(result);
    } catch (error) {
        res.status(500).json({ 
            status: 500, 
            success: false, 
            message: "Terjadi kesalahan saat memproses URL"
        });
    }
});

app.get("/api/ytsearch", async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ 
            status: 400, 
            message: "Berikan saya JUDUL!" 
        });
    }
    try {
        const result = await youtube(url);
        res.json(result);
    } catch (error) {
        res.status(500).json({ 
            status: 500, 
            success: false, 
            message: "Terjadi kesalahan."
        });
    }
});

// Jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Running in port: ${PORT}`);
});