const success = (req, res, data, status, messageLog) => {
  console.log('[estados de la peticion] ==>', messageLog);
  res.status(status || 200).send({
    error: "",
    data,
  });
};

const error = (req, res, data, status, details) => {
  console.error('[causa de error]', details);
  res.status(status || 500).send({
    data: data,
    body: "",
  });
};

module.exports = { error, success };
