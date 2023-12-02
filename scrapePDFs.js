const puppeteer = require('puppeteer');

async function scrapePDFLinks() {
  const browser = await puppeteer.launch({ headless: 'new' }); // Utilizando o novo modo "headless"
  const page = await browser.newPage();

  try {
    // Abre a página desejada
    await page.goto('https://ru.unb.br/index.php/cardapio-refeitorio');

    const pdfLinks = await page.evaluate(() => {
      // Use os seletores fornecidos para encontrar os links intermediários para as páginas dos PDFs
      const intermediateLinks = [
        "#content > div.item-page > div:nth-child(3) > div:nth-child(6) > a",
        "#content > div.item-page > div:nth-child(3) > div:nth-child(11) > a",
        "#content > div.item-page > div:nth-child(3) > div:nth-child(12) > div:nth-child(2) > div:nth-child(5) > a",
        "#content > div.item-page > div:nth-child(3) > div:nth-child(15) > a",
        "#content > div.item-page > div:nth-child(3) > div:nth-child(19) > a"
      ];

      // Função para extrair o link do PDF a partir de uma página intermediária
      function extractPDFLink(linkSelector) {
        const link = document.querySelector(linkSelector);
        if (link) {
          return link.href;
        }
        return null;
      }

      // Navega para cada página intermediária e extrai o link direto para o PDF
      const hrefs = intermediateLinks.map(link => extractPDFLink(link));
      return hrefs;
    });

    console.log('Links diretos para os PDFs:');
    console.log(pdfLinks.filter(link => link !== null)); // Exibe os links encontrados
  } catch (error) {
    console.error('Ocorreu um erro:', error);
  } finally {
    await browser.close();
  }
}

// Chamada da função para iniciar o scraping
scrapePDFLinks();
