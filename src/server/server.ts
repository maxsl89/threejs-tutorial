import express from "express";
import path from "path";
import http from "http";
import socketIO from "socket.io";

const app = express();

app.use(express.static(path.join(__dirname, "../client")));
app.use(
  "/build/three.module.js",
  express.static(
    path.join(__dirname, "../../node_modules/three/build/three.module.js")
  )
);
app.use(
  "/jsm/controls/OrbitControls",
  express.static(
    path.join(
      __dirname,
      "../../node_modules/three/examples/jsm/controls/OrbitControls.js"
    )
  )
);
app.use(
  "/jsm/loaders/GLTFLoader",
  express.static(
    path.join(
      __dirname,
      "../../node_modules/three/examples/jsm/loaders/GLTFLoader.js"
    )
  )
);
app.use(
  "/jsm/libs/stats.module",
  express.static(
    path.join(
      __dirname,
      "../../node_modules/three/examples/jsm/libs/stats.module.js"
    )
  )
);
app.use(
  "/jsm/libs/dat.gui.module",
  express.static(
    path.join(
      __dirname,
      "../../node_modules/three/examples/jsm/libs/dat.gui.module.js"
    )
  )
);
app.use(
  "/jsm/libs/tween.module.min",
  express.static(
    path.join(
      __dirname,
      "../../node_modules/three/examples/jsm/libs/tween.module.min.js"
    )
  )
);

const httpServer = http.createServer(app);
const io = socketIO(httpServer);

const botName = "bot name";

// Run when client connects
io.on("connection", async (socket) => {
  console.log(`${socket.id} connected`);
  io.emit("newGame", {});
});

const port = 3000;

const server = httpServer.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
