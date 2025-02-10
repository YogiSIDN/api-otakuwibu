const express = require("express");
const path = require("path");
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Backend
const { tinyUrl } = require("./backend/shortURL");
app.set("json spaces", 4);

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
        res.status(500).json(error);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Running in port: ${PORT}`);
});