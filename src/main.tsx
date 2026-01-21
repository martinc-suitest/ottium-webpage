import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './platformsClickHandler';
import { setSelectedCategory } from './platformsSwitchHandler';
// Ensure setSelectedCategory is available globally for inline HTML usage
// @ts-ignore
window.setSelectedCategory = setSelectedCategory;
import './styles/main.css'

ReactDOM.createRoot(document.getElementById('navbar-root')!).render(
  <App />,
)
