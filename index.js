const express = require("express")
const path = require("path")
const app = express()
app.use(express.json())
app.use(express.static(path.join(__dirname, "public")))

// Backend
const { tinyUrl } = require("./backend/shortURL")
const { yts } = require("./backend/search")
app.set("json spaces", 4)

app.get("/api/tinyUrl", async (req, res) => {
    const { url } = req.query
    if (!url) {
        return res.status(400).json({ 
            status: 400, 
            message: "Terjadi kesalahan." 
        })
    }
    try {
        const result = await tinyUrl(url)
        res.json(result)
    } catch (error) {
        res.status(500).json(error)
    }
})

app.get("/api/yts", async (req, res) => {
       const { q } = req.query;
       if (!q) {
           return res.status(400).json({ 
               status: 400, 
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
               message: "Terjadi kesalahan.",
               error: error.message
           });
       }
   });

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Running in port: ${PORT}`)
})