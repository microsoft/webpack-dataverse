export default function createWebFileLoader(webFileName: string) {
  return (
    "const scriptElement = document.createElement('script');\r\n" +
    `scriptElement.src = "/${webFileName}";\r\n` +
    "document.body.appendChild(scriptElement);"
  );
}
