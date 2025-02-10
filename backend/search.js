const yts = require("yt-search");

async function ytsearch(query) {
    try {
        const res = await yts.search(query);
        if (!res.videos.length) {
            return {
                status: 404,
                dev: "@mysu_019",
                message: "Tidak ditemukan hasil untuk pencarian tersebut."
            };
        }

        const videos = res.videos.slice(0, 10).map(video => ({
            id: video.videoId,
            title: video.title,
            duration: video.timestamp,
            channel: video.author.name,
            thumbnail: video.thumbnail,
            link: video.url
        }));

        return {
            status: 200,
            dev: "@mysu_019",
            data: videos
        };
    } catch (error) {
        return {
            status: 500,
            dev: "@mysu_019",
            message: "Terjadi kesalahan.",
            error: error.message
        };
    }
}

module.exports = { youtube };
