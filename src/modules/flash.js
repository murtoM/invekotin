const assert = require("assert");

module.exports = () => {
  return (req, res, next) => {
    assert(req.session, "a req.session is required!");
    if (!Array.isArray(req.session.flashmessages)) {
      req.session.flashmessages = new Array();
      req.session.flashmessages[0] = null;
    }
    res.locals.flashmessages = req.session.flashmessages;

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
        let i = 0;
        while (res.locals.flashmessages[i] != null) i++;
        res.locals.flashmessages[i] = message;
        res.locals.flashmessages.push(null);
      },
      consume: () => {
        if (res.locals.flashmessages[0] == null) return null;
        return res.locals.flashmessages.shift();
      }
    };

    next();
  };
};

