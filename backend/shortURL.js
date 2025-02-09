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



module.exports = {

    tinyUrl

                       }
