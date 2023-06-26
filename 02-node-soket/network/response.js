const success = (req, res, message, status, messageLog) => {
  console.log('[estados de la peticion] ==>', messageLog);
  res.status(status || 200).send({
    error: "",
    message,
  });
};

const error = (req, res, message, status, details) => {
  console.error('[causa de error]', details);
  res.status(status || 500).send({
    message: message,
    body: "",
  });
};

module.exports = { error, success };
