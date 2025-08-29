import {render, screen} from '@testing-library/react';
import { MemoryRouter , BrowserRouter } from "react-router-dom"; 
import App from './App';
import '@testing-library/jest-dom'; 

test("affiche la page d'accueil", () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText("Certificat")).toBeInTheDocument();
  });