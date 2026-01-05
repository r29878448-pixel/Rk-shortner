
import React, { useEffect, useRef } from 'react';

interface AdSlotProps {
  html: string;
  className?: string;
}

/**
 * AdSlot Component
 * Renders the custom HTML/Script provided in the Admin Dashboard.
 * Uses range.createContextualFragment to ensure <script> tags execute.
 */
const AdSlot: React.FC<AdSlotProps> = ({ html, className = "" }) => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (adRef.current && html && html.trim() !== '') {
      // 1. Clear previous content to avoid duplicates
      adRef.current.innerHTML = '';
      
      // 2. Use contextual fragment to allow script execution
      // This is crucial for Adsterra/SocialBar scripts to work in React
      const range = document.createRange();
      range.selectNode(adRef.current);
      
      try {
        const documentFragment = range.createContextualFragment(html);
        adRef.current.appendChild(documentFragment);
        
        // Log for developer verification
        console.debug("SwiftLink: Successfully injected user ad code.");
      } catch (e) {
        console.error("SwiftLink: Ad injection failed.", e);
        // Fallback to basic innerHTML
        adRef.current.innerHTML = html;
      }
    }
  }, [html]);

  if (!html || html.trim() === '') return null;

  return (
    <div 
      ref={adRef} 
      className={`swiftlink-ad-wrapper overflow-hidden min-h-[50px] flex justify-center items-center transition-opacity duration-500 ${className}`} 
    />
  );
};

export default AdSlot;
