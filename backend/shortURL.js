const axios = require("axios")
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

// Generate Short URL
async function tinyUrl(links) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch("https://tinyurl.com/api-create.php?url=" + links);
            const shortUrl = await response.text();
            resolve({
                status: 200,
                dev: "@mysu_019",
                data: {
                    baseUrl: links,
                    shortUrl: shortUrl
                }
            })
        } catch (error) {
            reject({
                status: 500,
                dev: "@mysu_019",
                message: "Terjadi kesalahan saat membuat short Url."
            });
        }
    });
}

async function akariUrl(links) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios.post("https://api.waa.ai/v2/links", {
                url: links
            }, {
                headers: {
                    'Authorization': `Bearer 767c4f1c12619aa5226d28f109fd032532d2c637`,
                    'Content-Type': 'application/json'
                }
            })
            const shortUrl = response.data.data.link
            resolve({
                status: 200,
                dev: "@mysu_019",
                data: {
                    baseUrl: links,
                    shortUrl: shortUrl
                }
            })
        } catch (error) {
            reject({
                status: 500,
                dev: "@mysu_019",
                message: "Tejadi kesalahan saat membuat short Url."
            })
        }
    })
}

module.exports = {
    tinyUrl,
    akariUrl
}