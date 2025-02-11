const { fetch } = require('undici');
const cheerio = require('cheerio');

function extractId(input) {
  const urlRegex = /https:\/\/nhentai\.to\/g\/(\d+)\//;
  const codeRegex = /^\d+$/;

  if (urlRegex.test(input)) {
    const match = input.match(urlRegex);
    return match[1];
  } else if (codeRegex.test(input)) {
    return input;
  } else {
    return null;
  }
}

async function nhDetail(text) {
  try {
    const id = extractId(text);
    if (!id) {
      throw new Error('Input tidak valid. Harap masukkan URL atau kode angka.');
    }

    const response = await fetch(`https://nhentai.to/g/${id}`);
    const $ = cheerio.load(await response.text());

    const title = $('#info h1').text().trim();
    const idFromPage = id;
    const parodies = [];
    const characters = [];
    const tags = [];
    const artists = [];
    const groups = [];
    const languages = [];
    const categories = [];
    const pages = $('#tags .tag-container:contains("Pages") .name').text().trim();
    const uploaded = $('#info time').text().trim()
    const cover = $('#cover img').attr('src');
    const thumbnails = [];

    $('#tags .tag-container:contains("Parodies") .tags a').each((i, el) =>
      parodies.push($(el).find('.name').text().trim())
    );
    $('#tags .tag-container:contains("Characters") .tags a').each((i, el) =>
      characters.push($(el).find('.name').text().trim())
    );
    $('#tags .tag-container:contains("Tags") .tags a').each((i, el) =>
      tags.push($(el).find('.name').text().trim())
    );
    $('#tags .tag-container:contains("Artists") .tags a').each((i, el) =>
      artists.push($(el).find('.name').text().trim())
    );
    $('#tags .tag-container:contains("Groups") .tags a').each((i, el) =>
      groups.push($(el).find('.name').text().trim())
    );
    $('#tags .tag-container:contains("Languages") .tags a').each((i, el) =>
      languages.push($(el).find('.name').text().trim())
    );
    $('#tags .tag-container:contains("Categories") .tags a').each((i, el) =>
      categories.push($(el).find('.name').text().trim())
    );

    $('#thumbnail-container .thumb-container img').each((i, el) => {
      let thumbUrl = $(el).attr('data-src');
      thumbUrl = thumbUrl.replace(/(\d)t(\.jpg|\.png|\.jpeg)$/i, '$1$2');
      thumbnails.push(thumbUrl);
    });

    let covers = cover;

    return {
      status: 200,
      dev: "@mysu_019",
      data: {
          id: idFromPage,
          title,
          parodies,
          characters,
          tags,
          artists,
          groups,
          languages,
          categories,
          pages,
          uploaded,
          covers,
          media: thumbnails
      }
    };
  } catch (error) {
    return {
        status: 500,
        dev: "@mysu_019",
        message: "Terjadi kesalahan."
    }
  }
}

async function nhSearch(query) {
  try {
    const response = await fetch(`https://nhentai.to/search/?q=${query}&page=1`);
    const $ = cheerio.load(await response.text());
    let results = [];

    $('.gallery').each((index, element) => {
      const id = $(element).find('a.cover').attr('href').match(/\/g\/(\d+)\//)[1];
      const title = $(element).find('.caption').text().trim();
      const thumbnail = $(element).find('img').attr('src');

      results.push({
        id,
        title,
        thumbnail
      });
    });

    return {
        status: 200,
        dev: "@mysu_019",
        data: results
    }
  } catch (error) {
    return {
        status: 500,
        dev: "@mysu_019",
        message: "Terjadi kesalahan."
    }
  }
}

module.exports = {
  nhSearch,
  nhDetail
};