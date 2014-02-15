
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'MemoApp' });
};

exports.user = function(req, res){
  res.render('index', { title: 'MemoApp: user' });
};