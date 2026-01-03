
import React, { useEffect, useRef } from 'react';

interface AdSlotProps {
  html: string;
  className?: string;
}

const AdSlot: React.FC<AdSlotProps> = ({ html, className = "" }) => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (adRef.current && html) {
      // Create a range to properly execute scripts if present in the HTML string
      const range = document.createRange();
      range.selectNode(adRef.current);
      const documentFragment = range.createContextualFragment(html);
      adRef.current.innerHTML = '';
      adRef.current.appendChild(documentFragment);
    }
  }, [html]);

  if (!html) return null;

  return (
    <div 
      ref={adRef} 
      className={`ad-container overflow-hidden flex justify-center items-center ${className}`} 
    />
  );
};

export default AdSlot;
