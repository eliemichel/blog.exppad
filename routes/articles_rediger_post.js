exports.getData = function(utils, admin, mongoose, callback) {
	var data = {
		admin : admin,
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
};





