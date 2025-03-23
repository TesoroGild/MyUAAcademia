import { render, screen } from "@testing-library/react";
import Home from "./home";

test("affiche la page d'acceuil", () => {
  render(<Home />);
  expect(screen.getByText("News")).toBeInTheDocument();
});