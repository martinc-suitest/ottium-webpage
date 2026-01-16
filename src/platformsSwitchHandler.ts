// platformsSwitchHandler.ts
// Handles switching visible platforms group based on selected category

function setSelectedCategory(id: string) {
  // Remove 'active' from all buttons
  const buttons = document.querySelectorAll<HTMLButtonElement>('.categories-list .category-button');
  buttons.forEach((btn) => btn.classList.remove('active'));
  // Add 'active' to selected button
  const selected = document.getElementById(id);
  if (selected) selected.classList.add('active');

  // Hide all platform groups
  const groups = document.querySelectorAll<HTMLElement>('.platforms-group');
  groups.forEach((group) => (group.style.display = 'none'));

  // Show the selected group
  const group = document.querySelector('.platforms-group[data-category="' + id + '"]') as HTMLElement;
  if (group) {
    group.style.display = '';
    // Hide the empty message
    const empty = document.getElementById('platforms-empty');
    if (empty) empty.style.display = 'none';
  } else {
    // If no group, show the empty message
    const empty = document.getElementById('platforms-empty');
    if (empty) empty.style.display = '';
  }
}

// Attach to window for inline HTML usage
// @ts-ignore
window.setSelectedCategory = setSelectedCategory;
