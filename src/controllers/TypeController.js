exports.renderTypePage = (req, res, next) => {
  res.render("type", { typeStr: req.params.typeStr });
};
