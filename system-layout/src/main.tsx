import { render } from 'preact';
import './index.css';
import { App } from './app.tsx';

const appElement = document.getElementById('app');

if (!appElement) {
  throw new Error('Failed to find app element. Make sure there is an element with id="app" in the HTML.');
}

render(<App />, appElement);
