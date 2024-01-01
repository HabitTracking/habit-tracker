function respond (res, response, additionalInfo) {
  if (additionalInfo)
    return res.status(response.code).json({ message: response.message, additionalInfo} );
  else
    return res.status(response.code).json({ message: response.message});
}

module.exports = respond;
