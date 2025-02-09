const express = require("express")
const app = express()
app.use(express.json())
// Backend
const { tinyUrl } = require("./backend/shortURL")

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello, World!" })
})

app.post("/api/greet", (req, res) => {
  const { name } = req.body
  if (!name) {
    return res.status(400).json({ error: "Name is required" })
  }
  res.json({ message: `Hello, ${name}!` })
})

app.get("/api/tinyUrl", async (req, res) => {
    const { url } = req.query
    if (!url) {
        return res.status(400).json({ error: "URL is required" })
    }
    try {
        const result = await tinyUrl(url)
        res.json(result)
    } catch (error) {
        res.status(500).json(error)
    }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Running in port: ${PORT}`)
})
