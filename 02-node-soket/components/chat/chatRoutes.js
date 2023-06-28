const express = require("express");
const controllers = require("./controllers");
const response = require("../../network/response");

const router = express.Router();

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const data = await controllers.getChat(userId);
    response.success(req, res, data, 200, "listade chats enviada");
  } catch (error) {
    response.error(
      req,
      res,
      "Unexpected error",
      400,
      `Error al actualizar el mensaje ${error}`
    );
  }
});

router.post("/", async (req, res) => {
  const { users } = req.body;
  console.log(users);
  try {
    const data = await controllers.addChats(users);
    response.success(req, res, data, 200, "Hola todo salió bien!");
  } catch (error) {
    response.success(
      req,
      res,
      "Unexpected error",
      400,
      `Error al actualizar el mensaje ${error}`
    );
  }
});
module.exports = router;
