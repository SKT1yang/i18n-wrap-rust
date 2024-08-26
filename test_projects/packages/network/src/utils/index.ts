import html2Canvas from 'html2canvas';
import JsPDF from 'jspdf';
//导出PDF
export function getPdf(title, dom) {
  return new Promise((resolve) => {
    html2Canvas(document.querySelector(dom), {
      allowTaint: true,
    }).then(function (canvas) {
      const contentWidth = canvas.width;
      const contentHeight = canvas.height;
      const pageHeight = (contentWidth / 592.28) * 841.89;
      let leftHeight = contentHeight;
      let position = 0;
      const imgWidth = 595.28;
      const imgHeight = (592.28 / contentWidth) * contentHeight;
      const pageData = canvas.toDataURL('image/jpeg', 1.0);
      const PDF = new JsPDF(undefined, 'pt', 'a4');
      if (leftHeight < pageHeight) {
        PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight);
      } else {
        while (leftHeight > 0) {
          PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight);
          leftHeight -= pageHeight;
          position -= 841.89;
          if (leftHeight > 0) {
            PDF.addPage();
          }
        }
      }
      PDF.save(title + '.pdf');
      resolve(true);
    });
  });
}
