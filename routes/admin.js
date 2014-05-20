exports.getData = function (utils, mongoose, req, res, callback) {
	var data = {},
		post = req.body;
	
	console.log(req.path);
	
	if (post.mdp != null) {
		if (post.mdp == '15962483') {
			data.connecte = true;
			req.session.admin = true;
			if (post.dest != '/admin' && post.dest != '/admin/') {
				res.redirect(post.dest);
			}
		}
		else {
			data.erreur = 'Mot de passe invalide';
			data.dest = post.dest;
		}
	}
	else {
		if (req.session.admin) {
			data.connecte = true;
		}
		data.dest = req.path;
	}
	
	callback(data);
};
