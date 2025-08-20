import styled from 'styled-components';
import { useTheme } from './ThemeContext';

const ToggleButton = styled.button`
  position: fixed;
  top: 5px;
  right: 5px;
  padding: 8px 12px;
  background: var(--toggle-bg);
  border: 1px solid var(--toggle-border);
  border-radius: 4px;
  cursor: pointer;
  z-index: 100;
  font-size: var(--toggle-size);
  transition: all 0.3s ease;

  @media (max-width: 480px) {
    padding: 2px 2px;
    font-size: 0.8rem;
    top: 2px;
    right: 2px;
  }

  @media (min-width: 481px) and (max-width: 768px) {
    padding: 7px 10px;
    font-size: 0.9rem;
    top: 2px;
    right: 2px;
  }
  }
`;

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <ToggleButton onClick={toggleTheme}>
      {theme === 'light' ? '🌙' : '☀️'}
    </ToggleButton>
  );
};