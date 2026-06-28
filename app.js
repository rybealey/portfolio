// app.js — Phusion Passenger startup file for cPanel / CloudLinux.
//
// cPanel's "Setup Node.js App" runs the application under Passenger, which
// loads this file and expects it to start an HTTP server listening on the
// port (or socket) provided in process.env.PORT. We boot Next.js in
// production mode using the prebuilt output in .next/ (run `npm run build`
// during deploy before (re)starting the app).
const http = require("http");
const next = require("next");

const port = process.env.PORT || 3000;

const app = next({ dev: false });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    http
      .createServer((req, res) => handle(req, res))
      .listen(port, () => {
        console.log(`> Next.js ready, listening on ${port}`);
      });
  })
  .catch((err) => {
    console.error("Failed to start Next.js:", err);
    process.exit(1);
  });
