import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';
import './PdfComp.css'; // Import the CSS file for styles

function PdfComp({ pdfFile, setLearningStarted }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [showModal, setShowModal] = useState(true);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const openModal = () => {
    setShowModal(true);
   
  };

  const closeModal = () => {
    setShowModal(false);
    setLearningStarted(false)
  };

  const nextPage = () => {
    if (pageNumber < numPages) {
      setPageNumber(pageNumber + 1);
    }
  };

  const prevPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  return (
    <div className='relative w-screen h-screen'>
   

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button onClick={closeModal} className="close-modal">
              &times;
            </button>
            <div className="pdf-container">
              <Document
                file={pdfFile}
                onLoadSuccess={onDocumentLoadSuccess}
                className="pdf-document"
              >
                <Page
                  pageNumber={pageNumber}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className="pdf-page"
                />
              </Document>
            </div>
            <div className="pagination-controls">
              <button
                onClick={prevPage}
                disabled={pageNumber <= 1}
                className="pagination-button"
              >
                Previous
              </button>
              <span className="page-info">
                Page {pageNumber} of {numPages}
              </span>
              <button
                onClick={nextPage}
                disabled={pageNumber >= numPages}
                className="pagination-button"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PdfComp;