const ytdl = require("@distube/ytdl-core")

async function ytdl(url) {
    try {
        const getInfo = await ytdl.getInfo(url)
        return {
            status: 200,
            dev: "@mysu_019",
            data: getInfo
        } catch (error) {
            return {
               status: 500,
               dev: "@mysu_019",
               message: "Terjadi kesalahan.",
            }
        }
    }
}

module.exports = { ytdl }