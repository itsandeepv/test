import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const ExportPDFButton = ({ buttonText, targetReff }) => {
    console.log("targetRef>>", targetReff.current)
    const handleGeneratePdf = async () => {
        const pdf = new jsPDF("portrait", "pt", "a4");
        const data = await html2canvas(targetReff.current);
        const img = data.toDataURL("image/png");
        const imgProperties = pdf.getImageProperties(img);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;
        pdf.addImage(img, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("exported_document.pdf");
    };

    return (
        <div className="d-flex curser">
            <div onClick={handleGeneratePdf} className="blueButtonStyle white">
                <span className="ml-10px mr-10px d-flex">{buttonText}</span>
            </div>
        </div>
    )
}
