import { readAsArrayBuffer } from './asyncReader.js';
import { fetchFont } from './prepareAssets';
import { noop } from './helper.js';

export async function save(pdfFile, objects, name) {
  const PDFLib = await window.getAsset('PDFLib');
  const download = await window.getAsset('download');
  const makeTextPDF = await window.getAsset('makeTextPDF');
  let pdfDoc;
  try {
    pdfDoc = await PDFLib.PDFDocument.load(await readAsArrayBuffer(pdfFile));
    
  } catch (e) {
    console.log('Failed to load PDF.');
    throw e;
  }
  const pagesProcesses = pdfDoc.getPages().map(async (page, pageIndex) => {
    const pageObjects = objects[pageIndex];
    // 'y' starts from bottom in PDFLib, use this to calculate y
    const pageHeight = page.getHeight();
    const pageWidth = page.getWidth();
    const embedProcesses = pageObjects.map(async (object) => {
      if (object.type === 'image') {
        let { file, x, y, width, height } = object;
        let img;
        try {
          if (file.type === 'image/jpeg') {
            img = await pdfDoc.embedJpg(await readAsArrayBuffer(file));
          } else {
            img = await pdfDoc.embedPng(await readAsArrayBuffer(file));
          }
          return () =>
            page.drawImage(img, {
              x,
              y: pageHeight - y - height,
              width,
              height,
            });
        } catch (e) {
          console.log('Failed to embed image.', e);
          return noop;
        }
      } else if (object.type === 'text') {
        let { x, y, lines, lineHeight, size, fontFamily } = object;
        const font = await fetchFont(fontFamily);
        const [textPage] = await pdfDoc.embedPdf(
          await makeTextPDF({
            lines,
            fontSize: size,
            lineHeight,
            width: pageWidth,
            height: pageHeight,
            font: font.buffer || fontFamily, // built-in font family
            dy: font.correction(size, lineHeight),
          })
        );
        return () =>
          page.drawPage(textPage, {
            width: pageWidth,
            height: pageHeight,
            x,
            y: -y,
          });
      } else if (object.type === 'drawing') {
        let { x, y, path, scale } = object;
        const {
          pushGraphicsState,
          setLineCap,
          popGraphicsState,
          setLineJoin,
          LineCapStyle,
          LineJoinStyle,
        } = PDFLib;
        return () => {
          page.pushOperators(
            pushGraphicsState(),
            setLineCap(LineCapStyle.Round),
            setLineJoin(LineJoinStyle.Round)
          );
          page.drawSvgPath(path, {
            borderWidth: 5,
            scale,
            x,
            y: pageHeight - y,
          });
          page.pushOperators(popGraphicsState());
        };
      }
    });
    // embed objects in order
    const drawProcesses = await Promise.all(embedProcesses);
    drawProcesses.forEach((p) => p());
  });
  await Promise.all(pagesProcesses);
  try {
    const pdfBytes = await pdfDoc.save();

    var body = new FormData();

    var strGET = window.location.search.replace( '?', ''); 

    const blob = new Blob( [ pdfBytes ], { type: 'application/pdf' } );	
    body.append('files',blob,"sample.pdf");
    body.append("userID",strGET);

  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'https://cors-anywhere.herokuapp.com/http://3.120.184.214:8080/uploadFromConstructor', true);
  xhr.onload = function () {
      alert('Отлично! Теперь вы можете распечать этот принт, нажав кнопку снизу "На печать"!');
    
  };
  xhr.send(body);
    
    // download(pdfBytes, name, 'application/pdf');
  } catch (e) {
    console.log('Failed to save PDF.');
    throw e;
  }
}
