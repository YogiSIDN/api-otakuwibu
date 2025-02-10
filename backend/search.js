const ytSearch = require("youtube-search-api");

async function yts(query) {
    try {
        const res = await ytSearch.GetListByKeyword(query, false, 10); 
        const videos = res.items.map(video => ({
            id: video.id,
            title: video.title,
            duration: video.length.simpleText || "N/A",
            channel: video.channelTitle,
            thumbnail: video.thumbnail.thumbnails.pop().url,
            link: `https://www.youtube.com/watch?v=${video.id}`
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

module.exports = { yts }