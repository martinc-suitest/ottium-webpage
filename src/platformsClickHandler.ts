// platformsClickHandler.ts
// This script adds click event listeners to all category buttons in the platforms section.

document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll<HTMLButtonElement>('.categories-list .category-button');
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      // Add your click logic here. For demonstration, we'll toggle an 'active' class.
      buttons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');
      // You can add more logic here, e.g., display supported platforms for the selected category.
    });
  });
});
