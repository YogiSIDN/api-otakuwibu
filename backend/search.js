const Scraper = require('@yimura/scraper').default;
const yts = new Scraper();

async function youtube(query) {
    return new Promise((resolve, reject) => {
        yts.search(query)
            .then(res => {
                const videos = res.videos.map(video => ({
                    id: video.id,
                    title: video.title,
                    duration: video.duration_raw,
                    channel: video.channel.name,
                    thumbnail: video.thumbnail,
                    link: video.shareLink
                }));
                resolve({
                    status: 200,
                    dev: "@mysu_019",
                    data: videos
                });
            })
            .catch(error => reject({
                status: 500,
                dev: "@mysu_019",
                message: "Terjadi kesalahan."
            }
            }));
    });
}

module.exports = {
    youtube
}
