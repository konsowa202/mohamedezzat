"use client";

import React, { useEffect, useRef, useState } from "react";

export function PdfViewer({ url }: { url: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [pages, setPages] = useState<number>(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let isMounted = true;

    const loadPdf = async () => {
      try {
        // Load PDF.js script dynamically
        if (!(window as any).pdfjsLib) {
          await new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.min.js";
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
          });
        }

        const pdfjsLib = (window as any).pdfjsLib;
        pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.worker.min.js";

        const loadingTask = pdfjsLib.getDocument(url);
        const pdf = await loadingTask.promise;
        
        if (!isMounted) return;
        
        setPages(pdf.numPages);
        setLoading(false);

        const container = containerRef.current;
        if (!container) return;

        // Clear previous canvases if any
        container.innerHTML = '';

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const scale = 1.5;
          const viewport = page.getViewport({ scale });
          
          const canvas = document.createElement('canvas');
          canvas.className = "max-w-full h-auto mb-4 mx-auto shadow-md";
          const context = canvas.getContext("2d");
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          
          container.appendChild(canvas);

          const renderContext = {
            canvasContext: context!,
            viewport: viewport,
          };
          
          await page.render(renderContext).promise;
        }

      } catch (err) {
        console.error("PDF load error:", err);
        if (isMounted) {
          setError(true);
          setLoading(false);
        }
      }
    };

    loadPdf();

    return () => {
      isMounted = false;
    };
  }, [url]);

  return (
    <div className="w-full min-h-[70vh] bg-[#0A0A0F] rounded-2xl flex flex-col items-center justify-start p-4 relative overflow-y-auto">
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-[#38BDF8]">
          <svg className="animate-spin h-10 w-10 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="font-medium animate-pulse">Loading Document...</p>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-white text-lg font-bold mb-2">Could not load preview</p>
          <p className="text-[#5B7186] mb-6 max-w-sm">The document preview is unavailable. You can still download the file directly.</p>
          <a href={url} target="_blank" rel="noopener noreferrer" className="bg-[#38BDF8] text-[#06060A] px-6 py-2 rounded-full font-bold">
            Download PDF
          </a>
        </div>
      )}

      <div ref={containerRef} className="w-full flex flex-col items-center" />
    </div>
  );
}
