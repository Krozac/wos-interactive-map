export function fitText(el, maxWidth = 70, fontSize = 12) {
  if (!el) return;

  el.style.fontSize = fontSize + "px";

  while (el.scrollWidth > maxWidth && fontSize > 6) {
    fontSize--;
    el.style.fontSize = fontSize + "px";
  }
}

export function fitCanvasText(ctx, text, maxWidth, initialSize = 80) {
    let fontSize = initialSize;

    do {
        ctx.font = `${fontSize}px Rowdies`;
        const width = ctx.measureText(text).width;

        if (width <= maxWidth || fontSize <= 10) break;

        fontSize--;
    } while (true);

    return fontSize;
}