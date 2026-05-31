

import { takeScreenshot } from "../three/screenshot";

export default function ScreenshotButton() {
  const handleScreenshot = () => {
    takeScreenshot(3840,2160);
  };

  return (
    <button id="screenshotButton" onClick={handleScreenshot}>
      <i class="fas fa-camera"></i>
    </button>
  );
}