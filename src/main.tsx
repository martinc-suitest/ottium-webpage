import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './platformsClickHandler';
import { setSelectedCategory } from './platformsSwitchHandler';
// Ensure setSelectedCategory is available globally for inline HTML usage
// @ts-ignore
window.setSelectedCategory = setSelectedCategory;
import './styles/platforms.css'
import './styles/main.css'
import './styles/footer.css'

ReactDOM.createRoot(document.getElementById('navbar-root')!).render(
  <App />,
)
