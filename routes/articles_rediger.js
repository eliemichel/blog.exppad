exports.getData = function(utils, req, mongoose, marked, titreURL, callback) {
	var post = req.body;
	var ArticlesModel = mongoose.model('articles');
	
	if (post.article !== undefined) {
		var nouveau = titreURL == '';
		utils.newTitreURL(post.titre, mongoose, function (titreURL) {
			marked(post.article, {}, function (err, rendu) {
				if (err != null) rendu = '<strong>Parse error :</strong> ' + err;
				
				var hash = {
					titre : post.titre,
					titreURL : titreURL,
					auteur : post.auteur,
					resume : post.resume,
					script : post.article,
					rendu : rendu,
					tags : utils.parseTagsList(post.tags, mongoose)
				};
				
				if (nouveau) {
					(new ArticlesModel(hash)).save(function (err) {
						if (err != null) throw err;
						callback({redirect : utils.domain + '/article/' + titreURL});
					});
				}
				else {
					hash.titreURL = titreURL = post.titreURL;
					ArticlesModel.findOneAndUpdate({titreURL : titreURL}, hash, function (err) {
						if (err != null) throw err;
						callback({redirect : utils.domain + '/article/' + titreURL});
					});
				}
			});
		});
	}
	else {
		var data = {
			admin : req.session.admin || false,
			nouveau : true
		};
	
		if (titreURL != '') {
			mongoose.model('articles').findOne({titreURL : titreURL}, function (err, article) {
				if (err == null) {
					data.nouveau = false;
					data.titre = article.titre;
					data.titreURL = titreURL;
					data.resume = article.resume;
					data.article = article.script;
					data.tags = '';
					article.tags.forEach(function (tag) {
						data.tags += tag + ' ';
					});
					data.auteur = article.auteur;
				}
				callback(data);
			});
		}
		else {
			callback(data);
		}
	}
};





