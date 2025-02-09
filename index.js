const express = require("express")
const app = express()
app.use(express.json())
// Backend
const { tinyUrl } = require("./backend/shortURL")

app.set("json spaces", 4)

app.get("/api/tinyUrl", async (req, res) => {
    const { url } = req.query
    if (!url) {
        return res.status(400).send(JSON.stringify({
            message: "Berikan saya URL!"
        }, null, 4))
    }
    try {
        const result = await tinyUrl(url)
        res.send(JSON.stringify(result, null, 4))
    } catch (error) {
        res.send(JSON.stringify(result, null, 4))
    }
})


const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Running in port: ${PORT}`)
})

module.exports = app
