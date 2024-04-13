const puppeteer = require('puppeteer');
const fs = require('fs');
const PNG = require('pngjs').PNG;
const pixelmatch = require('pixelmatch');
const pages =require('./config/pages.json');

(async () => {
  const browser = await puppeteer.launch();
  try {
    const page = await browser.newPage();
    for (const { pageName,staging,production} of pages['urls'])  {
        await page.goto(staging);
        await page.screenshot({ path: `Screenshorts/staging/${pageName}.png`,fullPage:true}); 

        await page.goto(production);
        await page.screenshot({ path: `Screenshorts/production/${pageName}.png`,fullPage:true}); 
    
    const img1 = PNG.sync.read(fs.readFileSync(`Screenshorts/staging/${pageName}.png`));
    const img2 = PNG.sync.read(fs.readFileSync(`Screenshorts/production/${pageName}.png`));

    const { width, height } = img1;
    const diff = new PNG({ width, height });

    const result = pixelmatch(img1.data, img2.data, diff.data, width, height, { threshold: 0.1 }); 
      fs.writeFileSync(`Screenshorts/difference/${pageName}.jpeg`, PNG.sync.write(diff));
}
  } 
catch (e) {
    console.log(e)
  } finally {
    await browser.close();
  }
})();