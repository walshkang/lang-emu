import * as React from 'react';
import { useState } from 'react';
import { GbaCanvas } from './GbaCanvas';

export const GameWithSubtitles: React.FC = () => {
  const [subtitle, setSubtitle] = useState<string>('Waiting for game...');

  const handleFrame = (frameData: Uint8Array) => {
    // TODO: Process frame data for OCR/text extraction
    // For now, we'll just count frames
    setSubtitle(prev => {
      const count = parseInt(prev.match(/\d+/)?.[0] || '0');
      return `Frame ${count + 1}`;
    });
  };

  return (
    <div className="game-container">
      <GbaCanvas 
        width={240}
        height={160}
        scale={2}
        onFrame={handleFrame}
      />
      <div className="subtitle-bar">
        <p>{subtitle}</p>
      </div>
    </div>
  );
};
