import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";

// Для проверки useEntity: замените <App /> на <EntityTestPage /> (импорт: import { EntityTestPage } from "./app/pages/EntityTestPage")
createRoot(document.getElementById("root")!).render(<App />);
  