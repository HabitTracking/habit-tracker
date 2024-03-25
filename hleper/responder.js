function respond (res, response, additionalInfo = {}) {
  return res.status(response.code).json({ message: response.message, additionalInfo} );
}

module.exports = respond;
