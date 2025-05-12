import React from 'react';
import ReactDOM from 'react-dom/client';
import { GameWithSubtitles } from './components/GameWithSubtitles';
import './styles.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <GameWithSubtitles />
  </React.StrictMode>
);
