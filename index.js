const puppeteer = require('puppeteer')

const URL = `https://movie.douban.com/tag/#/?sort=U&range=5,10&tags=`;
const sleep = time => new Promise(resolve => {
  setTimeout(resolve, time);
});

(async () => {
  console.log('*********** start ************');
  const brower = await puppeteer.launch({
    args: ['--no-sandbox'],//启动非沙箱模式
    dumpio: false
  });

  const page = await brower.newPage();

  await page.goto(URL, {
    waitUntil: "networkidle2"
  });

  await sleep(3000);

  await page.waitForSelector('.more');

  for (let i = 0; i < 5; i++) {//5页
    await sleep(3000);
    await page.click('.more');
  }
  
  const result = await page.evaluate(() => {
    let $ = window.$;
    let links = [];
    const items = $('.list-wp a');
    if (items.length >= 1) {
      items.each((index, item) => {
        const el = $(item);
        const id = el.find('div').data('id');
        const title = el.find('.title').text();
        const rate = Number(el.find('.rate').text());
        const poster = el.find('img').attr('src').replace('s_ratio', 'l_ratio');
        links.push({
          id,
          title,
          rate,
          poster,
        });
      });
    }
    return links
  });
  brower.close();
  console.log('result === ', result);
})()