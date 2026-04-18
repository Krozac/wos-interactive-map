export function fitText(el, maxWidth = 70, fontSize = 12) {
  if (!el) return;

  el.style.fontSize = fontSize + "px";

  while (el.scrollWidth > maxWidth && fontSize > 6) {
    fontSize--;
    el.style.fontSize = fontSize + "px";
  }
}