import { createHandler } from "@solidjs/start/entry";
import { StartServer } from "@solidjs/start/server";


export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>热烈的杯</title>
          <link rel="icon" href="/favicon.ico" />
          <script src="https://file.uhsea.com/2402/c3c3b38d7e1cf4d521dde93af2396cf3AA.js"></script>
          {assets}
        </head>
        <body>
          <div id="app">{children}</div>
          {scripts}
        </body>
      </html>
    )}
  />
));