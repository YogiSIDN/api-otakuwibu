const express = require("express")
const app = express()
app.use(express.json())
// Backend
const { tinyUrl } = require("./backend/shortURL")

app.set("json spaces", 4);

app.get("/api/tinyUrl", async (req, res) => {
    const { url } = req.query
    if (!url) {
        return res.status(400).send(message: "Berikan saya URL!")
    }
    try {
        const result = await tinyUrl(url)
        res.send(result)
    } catch (error) {
        res.send(result)
    }
})


const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Running in port: ${PORT}`)
})

module.exports = app
