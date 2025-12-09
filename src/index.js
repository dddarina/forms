
import TripCalendar from './js/TripCalendar.js';
import './css/style.css';

document.addEventListener('DOMContentLoaded', () => {
  const app = new TripCalendar();
  app.init();
  window.app = app; 
});