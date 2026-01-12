'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export function ResumeExportButton() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      // Get the resume content element
      const resumeElement = document.getElementById('main-content');
      if (!resumeElement) {
        console.error('Resume content not found');
        return;
      }

      // Create a temporary container for PDF export
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.width = '8.5in'; // Standard US letter width
      tempContainer.style.backgroundColor = '#ffffff';
      tempContainer.style.padding = '1in';
      document.body.appendChild(tempContainer);

      // Clone the resume content
      const clonedContent = resumeElement.cloneNode(true) as HTMLElement;
      
      // Remove gradient overlay elements and adjust styles for PDF
      const gradientOverlays = clonedContent.querySelectorAll('[class*="gradient"], [class*="animate"]');
      gradientOverlays.forEach(el => el.remove());

      // Update styles for PDF
      clonedContent.style.backgroundColor = '#ffffff';
      clonedContent.style.color = '#000000';
      clonedContent.style.padding = '0';
      clonedContent.style.maxWidth = '100%';
      clonedContent.style.width = '100%';

      // Update text colors for better PDF readability
      const allElements = clonedContent.querySelectorAll('*');
      allElements.forEach((el: Element) => {
        const htmlEl = el as HTMLElement;
        // Ensure text is dark for PDF
        if (htmlEl.classList.contains('text-muted-foreground')) {
          htmlEl.style.color = '#4b5563';
        }
        if (htmlEl.classList.contains('text-foreground')) {
          htmlEl.style.color = '#000000';
        }
        // Remove dark mode styles
        htmlEl.classList.remove('dark');
      });

      tempContainer.appendChild(clonedContent);

      // Wait for fonts and images to load
      await new Promise(resolve => setTimeout(resolve, 500));

      // Generate canvas from the content
      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: tempContainer.offsetWidth,
        height: tempContainer.offsetHeight,
      });

      // Calculate PDF dimensions
      const imgWidth = 8.5; // inches
      const pageHeight = 11; // inches
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      // Create PDF
      const pdf = new jsPDF('portrait', 'in', 'letter');
      let position = 0;

      // Add image to PDF
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if content is taller than one page
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Clean up
      document.body.removeChild(tempContainer);

      // Save the PDF
      pdf.save('Ryan-Bealey-Resume.pdf');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExportPDF}
      disabled={isExporting}
      className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible-ring min-h-[44px]"
      aria-label="Export resume as PDF"
    >
      <Download className="h-4 w-4" aria-hidden="true" />
      <span>{isExporting ? 'Exporting...' : 'Export PDF'}</span>
    </button>
  );
}