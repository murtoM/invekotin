const assert = require("assert");

module.exports = () => {
  return (req, res, next) => {
    assert(req.session, "a req.session is required!");
    if (!Array.isArray(req.session.flashmessages))
      req.session.flashmessages = [null];

    res.locals.flash = {
      push: (type, msg) => {
        if (!msg) {
          msg = type;
          type = "error";
        }
        let message = {
          msg: msg,
          type: type,
        };
        req.session.flashmessages[req.session.flashmessages.length - 1] = message;
        req.session.flashmessages.push(null);
      },
      consume: () => {
        if (req.session.flashmessages[0] == null) return null;
        return req.session.flashmessages.shift();
      }
    };

    // get passport messages
    if (req.session.messages && req.session.messages.length > 0) {
      req.session.messages.forEach(res.locals.flash.push);
      req.session.messages = [];
    }

    next();
  };
};

