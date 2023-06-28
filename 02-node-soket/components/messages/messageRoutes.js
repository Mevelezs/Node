const express = require("express");
const response = require("../../network/response");
const controllers = require("./controllers");
const multer = require("multer"); // para subir documentos a node
const router = express.Router();


const upload = multer({
  dest: "./public/files/",
});
router.get("/", (req, res) => {
  const { user } = req.query;

  controllers
    .getMessages(user)
    .then((messageList) => {
      response.success(req, res, messageList, 200, "listade mensajes enviada");
    })
    .catch((e) => {
      console.log("Algo pasó con mongo");
      response.error(
        req,
        res,
        "Unexpected error",
        500,
        `Error al actualizar el mensaje ${e}`
      );
    });
});

router.post("/", upload.single("files"), (req, res) => {
  // el post para que funcione el multer-upload se tiene que hacer en forma MULTIPART( en thuder-client --> form --> files, en RapidApi --> form url-encode --> multipart)

  const { user, message, chat } = req.body;
  if (!user || !message) {
    response.error(
      req,
      res,
      "Unexpected error",
      500,
      "Error al guardar el mensaje"
    );
    throw new Error("El tonto no mandó los parámetros");
  }
  controllers
    .addMesages(user, message, chat, req.file)
    .then(() => {
      response.success(req, res, "Hola todo salió bien!");
    })
    .catch((e) => {
      console.error(e);
      response.error(
        req,
        res,
        "Unexpected error",
        400,
        "El tonto no mando algo (usuario o mensaje)"
      );
    });
});

router.patch("/:id", (req, res) => {
  const { id } = req.params;
  const { message } = req.body;
  controllers
    .updateMessage(id, message)
    .then(() => {
      response.success(req, res, message, 200, "mensaje actializado");
    })
    .catch((e) => {
      console.log("Algo pasó con mongo");
      response.error(
        req,
        res,
        "Unexpected error",
        500,
        `Error al actualizar el mensaje ${e}`
      );
    });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  if (!id) {
    response.error(
      req,
      res,
      "Unexpected error",
      401,
      "Error al eliminar el mensaje"
    );
    return;
  }
  controllers
    .removeMessage(id)
    .then(() => {
      response.success(req, res, "Mensaje eliminado correctamente", 200);
    })
    .catch((e) => {
      response.error(
        req,
        res,
        "Unexpected error",
        500,
        `Error al eliminar el mensaje ${e}`
      );
    });
});
module.exports = router;
