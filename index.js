const express = require('express')
const cheerio = require('cheerio');
const dotenv = require('dotenv');

dotenv.config();

const app = express()
const port = process.env.PORT;

app.all('/', async (req, res) => {
    try {
        console.log("/api/scrap : fetching converse website")
        const response = await fetch(`https://www.converse.com/shop/womens-shoes?srule=Featured&start=35&sz=60`, { cache: "no-cache" })
        const html = await response.text()
        console.log("/api/scrap : cherio load")
        const $ = cheerio.load(html);
        console.log(html)
        console.log($(html).find(".product-tile"))
    
        const shoeTitle = [];
        console.log("/api/scrap : data processing");
        // iterating every card products
        [...$('.plp-grid__item')].map((element) => {
    
          // get into product container
          // [...$(element).find(".product-tile")].map(async (item: any) => {
          //     const title = $(item).find(".product-tile__url").text().replace(/\n/g, '')
          //     const price = $(item).find(".product-price--sales").text().replace(/\n/g, '')
          //     const type = $(item).find(".product-tile__secondary-badge").text().replace(/\n/g, '');
          //     const productLink = $(item).find(".product-tile__img-url").attr("href");
    
          //     let imageList: any = [];
          //     [...$(item).find(".product-tile__img-container")].map((picture: any) => {
          //         const image = $(picture).find('img').attr("data-src")
    
    
          //         if (!image?.includes("medium_noimage")) {
    
          //             imageList.push(image)
          //         }
    
          //     })
          //     shoeTitle.push({ title, price, type, imageList, productLink })
          //     // shoeTitle.push({ title })
          // });
          const productTile = $(element).find(".product-tile");
          const title = $(productTile).find(".product-tile__url").text().replace(/\n/g, '')
          const price = $(productTile).find(".product-price--sales").text().replace(/\n/g, '')
          const type = $(productTile).find(".product-tile__secondary-badge").text().replace(/\n/g, '');
          const productLink = $(productTile).find(".product-tile__img-url").attr("href");
    
          let imageList = [];
          [...$(productTile).find(".product-tile__img-container")].map((picture) => {
            const image = $(picture).find('img').attr("data-src")
    
    
            if (!image?.includes("medium_noimage") && !imageList.includes(image)) {
    
              imageList.push(image)
            }
    
          })
          shoeTitle.push({ title, price, type, imageList, productLink })
          // [...$(element).find(".product-tile")].map(async (item) => {
    
          //     // shoeTitle.push({ title })
          // })
          // return temp
        })
        console.log("/api/scrap : data collected");
        console.log("/api/scrap : data length = " + shoeTitle.length);
    
        console.log("/api/scrap : data cleaning");
        // console.log($('.plp-grid__item').text());
        function cleaning(array, uniqueKeyProp) {
          const allKeyProps = array.map((item) => {
            return item[uniqueKeyProp]
          })
          // console.log(allKeyProps)
          let temp = [];
          allKeyProps.map((item, index) => {
            if (allKeyProps.indexOf(item) == index) {
              temp.push(array[index])
            }
          })
          return temp
        }
    
        const cleanedShoeTitle = cleaning(shoeTitle, "title")
        // console.log("shoe title length : " + shoeTitle.length)
        // console.log("cleaned shoe title length : " + cleanedShoeTitle.length)
    
        // const onlyTitle = cleanedShoeTitle.map((item) => item.title)
        // return NextResponse.json({ onlyTitle, length: cleanedShoeTitle.length })
        console.log("/api/scrap : Completed!");
    
        res.send({ products: cleanedShoeTitle, length: cleanedShoeTitle.length })
      } catch (error) {
        console.error(error)
      }
})
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
