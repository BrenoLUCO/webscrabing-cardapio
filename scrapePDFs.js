const puppeteer = require('puppeteer');

async function scrapePDFLinks() {
  const browser = await puppeteer.launch({ headless: 'new' }); // Utilizando o novo modo "headless"
  const page = await browser.newPage();

  try {
    await page.goto('https://ru.unb.br/index.php/cardapio-refeitorio');

    const pdfLinks = await page.evaluate(() => {
      const intermediateLinks = [
        "#content > div.item-page > div:nth-child(3) > div:nth-child(6) > a",
        "#content > div.item-page > div:nth-child(3) > div:nth-child(11) > a",
        "#content > div.item-page > div:nth-child(3) > div:nth-child(12) > div:nth-child(2) > div:nth-child(5) > a",
        "#content > div.item-page > div:nth-child(3) > div:nth-child(15) > a",
        "#content > div.item-page > div:nth-child(3) > div:nth-child(19) > a"
      ];

      function extractPDFLink(linkSelector) {
        const link = document.querySelector(linkSelector);
        if (link) {
          return link.href;
        }
        return null;
      }

      const hrefs = intermediateLinks.map(link => extractPDFLink(link));
      return hrefs;
    });

    console.log('Links diretos para os PDFs:');
    console.log(pdfLinks.filter(link => link !== null));
  } catch (error) {
    console.error('Ocorreu um erro:', error);
  } finally {
    await browser.close();
  }
}

// Iniciar o scraping após 30 segundos
setTimeout(async () => {
  await scrapePDFLinks();
}, 30000); // 30 segundos (30000 milissegundos)




//Agendar a execução do scraping para todas as segundas às 2h
//cron.schedule('0 2 * * 1', async () => {
//  console.log('Iniciando o scraping...');
//  await scrapePDFLinks();
//}, {
//  timezone: 'America/Sao_Paulo' // Defina o fuso horário desejado
//});
