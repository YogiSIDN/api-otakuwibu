const express = require("express");
const app = express();
app.use(express.json());

// Backend
const { tinyUrl } = require("./backend/shortURL");

app.set("json spaces", 4);

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
        res.json({result});
    } catch (error) {
        res.status(500).json({ 
            status: 500, 
            success: false, 
            message: "Terjadi kesalahan saat memproses URL"
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Running in port: ${PORT}`);
});

module.exports = app;
