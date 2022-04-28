import { ViewColumn, window } from "vscode";

export async function isInstallFinished() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
}

export function createLoaderWebView() {
  const panel = window.createWebviewPanel(
    "Loader",
    "Loading",
    ViewColumn.One,
    {}
  );
  panel.webview.html = getLoaderHTML();
  return panel;
}

function getLoaderHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Loading</title>
    <meta name="theme-color" content="#000000">
</head>
<style>
body {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #000000;
  overflow: hidden;
}
.loader {
  --b: 10px; /* border thickness */
  --n: 10; /* number of dashes*/
  --g: 10deg; /* gap  between dashes*/
  --c: green; /* the color */

  width: 100px; /* size */
  margin: 0 auto;
  aspect-ratio: 1;
  border-radius: 50%;
  padding: 1px; /* get rid of bad outlines */
  background: conic-gradient(#0000, var(--c)) content-box;
  -webkit-mask: /* we use +/-1deg between colors to avoid jagged edges */ repeating-conic-gradient(
      #0000 0deg,
      #000 1deg calc(360deg / var(--n) - var(--g) - 1deg),
      #0000 calc(360deg / var(--n) - var(--g)) calc(360deg / var(--n))
    ),
    radial-gradient(
      farthest-side,
      #0000 calc(98% - var(--b)),
      #000 calc(100% - var(--b))
    );
  mask: repeating-conic-gradient(
      #0000 0deg,
      #000 1deg calc(360deg / var(--n) - var(--g) - 1deg),
      #0000 calc(360deg / var(--n) - var(--g)) calc(360deg / var(--n))
    ),
    radial-gradient(
      farthest-side,
      #0000 calc(98% - var(--b)),
      #000 calc(100% - var(--b))
    );
  -webkit-mask-composite: destination-in;
  mask-composite: intersect;
  animation: load 1s infinite steps(var(--n));
}
@keyframes load {
  to {
    transform: rotate(1turn);
  }
}
</style>
<body>
  <div class="loader"></div>;
</body>
</html>`;
}
