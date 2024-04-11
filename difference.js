'use strict';

const puppeteer = require('puppeteer');
const fs = require('fs');
const PNG = require('pngjs').PNG;
const pixelmatch = require('pixelmatch');
const pages =require('./pages.json');
(async () => {
  const browser = await puppeteer.launch();
  try {
    const page = await browser.newPage();
    for (const { pageName,stagingUrl } of pages)  {
        await page.goto(stagingUrl);
        //  await page.setViewport({ width: 1440, height: 1080 });
        await page.screenshot({ path: `Screenshorts/production/${pageName}.png`,fullPage:true,}); 
        

    const img1 = PNG.sync.read(fs.readFileSync(`Screenshorts/production/${pageName}.jpeg`));
    const img2 = PNG.sync.read(fs.readFileSync(`Screenshorts/production/st.png`));

    const { width, height } = img1;
    const diff = new PNG({ width, height });

    const result = pixelmatch(img1.data, img2.data, diff.data, width, height, { threshold: 0.1 }); 
      fs.writeFileSync(`Screenshorts/difference/${pageName}.jpeg`, PNG.sync.write(diff));
}
  } catch (e) {
    console.log(e)
  } finally {
    await browser.close();
  }
})();