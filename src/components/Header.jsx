import { useTheme } from "../context/ThemeContext";
import { Link, useLocation } from "react-router-dom";
import { Moon, Sun, FileText, Database, Settings } from "lucide-react";

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const linkClasses = (path) =>
    `group relative px-4 py-2.5 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
      location.pathname === path
        ? "bg-blue-100 text-blue-700 border border-blue-200 shadow-md"
        : "text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400"
    }`;

  return (
    <header className="w-full bg-white dark:bg-gray-900 
                       border-b border-blue-100 dark:border-gray-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Left side: Logo / Title */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-blue-100 border-2 border-green-200 rounded-xl flex items-center justify-center shadow-lg transform hover:rotate-6 transition-transform duration-300">
              <Settings className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Dynamic Form Builder
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              Create custom forms and collect data
            </p>
          </div>
        </div>

        {/* Center: Navigation */}
        <nav className="flex items-center gap-2 bg-blue-50 dark:bg-gray-800 rounded-2xl p-2 border border-green-200 dark:border-gray-600 shadow-md">
          <Link to="/" className={linkClasses("/")}>
            <div className="flex items-center">
              <FileText className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:rotate-12" />
              Form
            </div>
          </Link>
          <Link to="/data" className={linkClasses("/data")}>
            <div className="flex items-center">
              <Database className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:rotate-12" />
              Data
            </div>
          </Link>
        </nav>

        {/* Right side: Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="group relative px-5 py-2.5 rounded-xl border-2 border-green-200 dark:border-gray-600
                     bg-green-50 dark:bg-gray-800
                     text-gray-700 dark:text-gray-200 font-medium
                     hover:bg-green-100 dark:hover:bg-gray-700
                     transition-all duration-300 transform hover:scale-105 hover:shadow-lg
                     hover:shadow-green-200/50 dark:hover:shadow-green-500/20
                     active:scale-95 overflow-hidden"
        >
          <div className="flex items-center space-x-2 relative z-10">
            {theme === "light" ? (
              <>
                <Moon className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
                <span>Dark Mode</span>
              </>
            ) : (
              <>
                <Sun className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12 text-yellow-400" />
                <span>Light Mode</span>
              </>
            )}
          </div>
        </button>
      </div>
    </header>
  );
}