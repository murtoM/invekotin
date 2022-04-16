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
          type = "info";
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

    next();
  };
};

