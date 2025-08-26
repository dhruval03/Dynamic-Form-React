import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { FormDataProvider } from "./context/FormDataContext";

import Header from "./components/Header";
import FormPage from "./pages/FormPage";
import DataPage from "./pages/DataPage";

export default function App() {
  return (
    <ThemeProvider>
      <FormDataProvider>
        <Router>
          <div className="bg-gray-50 text-gray-900 dark:text-gray-100">
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<FormPage />} />
                <Route path="/data" element={<DataPage />} />
              </Routes>
            </main>
          </div>
        </Router>
      </FormDataProvider>
    </ThemeProvider>
  );
}
