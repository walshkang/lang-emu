import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { mGBA } from '@thenick775/mgba-wasm';

interface GbaCanvasProps {
  width?: number;
  height?: number;
  scale?: number;
  onFrame?: (frameData: Uint8Array) => void;
}

export const GbaCanvas: React.FC<GbaCanvasProps> = ({
  width = 240,
  height = 160,
  scale = 2,
  onFrame
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [emulator, setEmulator] = useState<mGBA | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const frameRequestRef = useRef<number>();

  useEffect(() => {
    const initEmulator = async () => {
      try {
        const mgba = await mGBA.init({
          canvas: canvasRef.current!,
          sampleRate: 44100,
          width,
          height,
          scale
        });
        setEmulator(mgba);

        // Load BIOS if available
        const settings = await window.electron.getSettings();
        if (settings?.biosPath) {
          const biosData = await window.electron.loadBIOS(settings.biosPath);
          await mgba.loadBIOS(new Uint8Array(biosData));
        }

        // Auto-load ROM if specified in settings
        if (settings?.lastRomPath) {
          const romData = await window.electron.loadROM(settings.lastRomPath);
          await mgba.loadROM(new Uint8Array(romData));
          setIsRunning(true);
        }
      } catch (err) {
        console.error('Failed to initialize mGBA:', err);
      }
    };

    initEmulator();
    return () => {
      if (frameRequestRef.current) {
        cancelAnimationFrame(frameRequestRef.current);
      }
    };
  }, [width, height, scale]);

  useEffect(() => {
    if (!emulator || !isRunning) return;

    const runFrame = () => {
      const frameData = emulator.runFrame();
      if (onFrame) onFrame(frameData);
      frameRequestRef.current = requestAnimationFrame(runFrame);
    };

    frameRequestRef.current = requestAnimationFrame(runFrame);
    return () => {
      if (frameRequestRef.current) {
        cancelAnimationFrame(frameRequestRef.current);
      }
    };
  }, [emulator, isRunning, onFrame]);

  // Handle keyboard input
  useEffect(() => {
    if (!emulator) return;

    const keyMap: Record<string, number> = {
      'ArrowUp': 0,    // Up
      'ArrowDown': 1,  // Down
      'ArrowLeft': 2,  // Left
      'ArrowRight': 3, // Right
      'z': 4,         // A
      'x': 5,         // B
      'Backspace': 6, // Select
      'Enter': 7,     // Start
      'a': 8,         // L
      's': 9,         // R
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const button = keyMap[e.key];
      if (button !== undefined) {
        emulator.keyDown(button);
        e.preventDefault();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const button = keyMap[e.key];
      if (button !== undefined) {
        emulator.keyUp(button);
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
    };
  }, [emulator]);

  return (
    <div className="gba-canvas-container">
      <canvas
        ref={canvasRef}
        width={width * scale}
        height={height * scale}
        style={{
          imageRendering: 'pixelated',
          width: width * scale,
          height: height * scale
        }}
      />
    </div>
  );
};
