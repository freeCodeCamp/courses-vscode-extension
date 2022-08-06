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
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background-color: #1b1b32;
		overflow: hidden;
		margin: 0;
    padding: 0 !important;
	}

	header {
		width: 100%;
		height: 55px;
		background-color: #0a0a23;
		display: flex;
		justify-content: center;
	}

	#logo {
		width: 350px;
		height: 42px;
		max-height: 100%;
		background-color: #0a0a23;
		padding: 0.4rem;
		display: block;
		margin: 0 auto;
		padding-left: 20px;
		padding-right: 20px;
	}

	h1 {
		color: #f5f6f7;
	}

	.loader {
		display: flex;
		flex-direction: row;
	}

	.loader>div {
		width: 5px;
		height: 27px;
		background-color: #99c9ff;
		margin: 2px;
	}

	.loader>div:nth-of-type(1) {
		animation: load 1.0s infinite ease-in-out alternate 1s;
	}

	.loader>div:nth-of-type(2) {
		animation: load 1.0s infinite ease-in-out alternate 1.2s;
	}

	.loader>div:nth-of-type(3) {
		animation: load 1.0s infinite ease-in-out alternate 1.4s;
	}

	.loader>div:nth-of-type(4) {
		animation: load 1.0s infinite ease-in-out alternate 1.6s;
	}

	.loader>div:nth-of-type(5) {
		animation: load 1.0s infinite ease-in-out alternate 1.8s;
	}

	@keyframes load {
		0% {
			transform: scaleY(1.0);
		}

		100% {
			transform: scaleY(2.0);
		}
	}
</style>

<body>
	<header>
		<img src='https://raw.githubusercontent.com/freeCodeCamp/cdn/main/build/platform/universal/fcc_primary.svg' id='logo' alt='freeCodeCamp logo' />
	</header>
	<h1>Preparing the course...</h1>
	<div class="loader">
		<div></div>
		<div></div>
		<div></div>
		<div></div>
		<div></div>
	</div>
</body>

</html>`;
}
