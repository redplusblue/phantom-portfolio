// Get CSS Variables
export const getCSSVariable = (variable) => {
  return getComputedStyle(document.documentElement).getPropertyValue(variable);
};
// Set CSS Variables
export const setCSSVariable = (variable, value) => {
  document.documentElement.style.setProperty(variable, value);
};
