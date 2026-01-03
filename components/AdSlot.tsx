
import React, { useEffect, useRef } from 'react';

interface AdSlotProps {
  html: string;
  className?: string;
}

const AdSlot: React.FC<AdSlotProps> = ({ html, className = "" }) => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (adRef.current && html && html.trim() !== '') {
      // Clear previous content
      adRef.current.innerHTML = '';
      
      // Use contextual fragment to ensure <script> tags are executed by the browser
      const range = document.createRange();
      range.selectNode(adRef.current);
      try {
        const documentFragment = range.createContextualFragment(html);
        adRef.current.appendChild(documentFragment);
      } catch (e) {
        console.error("Ad injection error:", e);
        // Fallback for simple HTML
        adRef.current.innerHTML = html;
      }
    }
  }, [html]);

  if (!html || html.trim() === '') return null;

  return (
    <div 
      ref={adRef} 
      className={`ad-container overflow-hidden min-h-[50px] flex justify-center items-center transition-all ${className}`} 
    />
  );
};

export default AdSlot;
