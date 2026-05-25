import type React from "react";

/**
 * onKeyDown handler: pressionar Enter move o foco para o próximo input do formulário.
 * Ignora inputs do tipo radio, checkbox e disabled.
 */
export const handleEnterNavigation = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key !== "Enter") return;
  e.preventDefault();
  const form = e.currentTarget.closest("form");
  if (!form) return;
  const inputs = Array.from(
    form.querySelectorAll<HTMLInputElement>(
      'input:not([type="radio"]):not([type="checkbox"]):not([disabled])',
    ),
  );
  const index = inputs.indexOf(e.currentTarget);
  if (index >= 0 && index < inputs.length - 1) {
    inputs[index + 1].focus();
  }
};
