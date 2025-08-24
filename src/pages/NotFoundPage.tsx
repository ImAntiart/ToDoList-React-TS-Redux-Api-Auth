import { ThemeProvider } from "../components/ThemeContext";
import { ThemeToggle } from "../components/ThemeToggle";

export const NotFoundPage = () => {
  return (
    <ThemeProvider>
      <ThemeToggle />
      <div className="form-page">
        <div className="input-area">
          <h2>404</h2>
          <p>Страница не найдена</p>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default NotFoundPage;
