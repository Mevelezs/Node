const express = require("express");
const response = require("../../network/response");
const controllers = require("./controllers");

const router = express.Router();

router.get("/", (req, res) => {
  controllers
    .getUsers()
    .then((userList) => {
      response.success(req, res, userList, 200, "Lista de usuarios enviada");
    })
    .catch((e) => {
      response.error(
        req,
        res,
        "Unexpected error",
        500,
        `Error al actualizar el mensaje ${e}`
      );
    });
});

router.post("/", (req, res) => {
  const body = req.body;
  
  controllers
    .addUsers(body)
    .then((user) => {
      response.success(req, res, user, 200, "Lista de usuarios enviada");
    })
    .catch((e) => {
      response.error(
        req,
        res,
        "Unexpected error",
        500,
        `Error al actualizar el mensaje ${e}`
      );
    });
});

module.exports = router;
