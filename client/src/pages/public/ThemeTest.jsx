import { useTheme } from "../../context/ThemeContext";

const ThemeTest = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-white p-8 text-gray-900 dark:bg-slate-900 dark:text-white">
      <h1 className="text-3xl font-bold">InterviAI Theme Test</h1>

      <p className="my-4">Current theme: {theme}</p>

      <button
        onClick={toggleTheme}
        className="rounded-lg bg-blue-600 px-5 py-2 text-white"
      >
        Toggle Theme
      </button>
    </div>
  );
};

export default ThemeTest;
