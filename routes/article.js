exports.getData = function(utils, admin, mongoose, id, callback) {
	var articlesModel = mongoose.model('articles'),
		tagsModel = mongoose.model('tags');
	
	articlesModel.findOne()
	.where('titreURL').equals(id)
	.exec(function (err, article) {
		if (err != null) throw err;
		if (article == null) {
			callback({
				id : 'erreur',
				titre : 'Cet article n\'existe pas !',
				date : '',
				contenu : '',
				resume : 'L\'article que vous avez demandé n\'existe pas. Vérifiez que l\'adresse de la page est correct. Si vous avez atteint cette page depuis un lien de ce site, merci de la signaler.',
				tags : '',
				reactions : [],
				admin : false
			})
		}
		else {
			var data = {
				id : article.titreURL,
				titre : article.titre,
				date : utils.formatDate(article.date),
				resume : article.resume,
				contenu : article.rendu + utils.signature(article.date, article.auteur),
				tags : '',
				reactions : [],
				admin : admin
			};
			
			
			var reac;
			for (var i = 0 ; i < article.reactions.length ; i++) {
				reac = article.reactions[i];
				data.reactions.push({
					auteur : reac.auteur,
					date : utils.formatDate(reac.date),
					reaction : utils.parseLite(reac.script)
				});
			}
			
			utils.convertTags(article.tags, tagsModel, function (err, tags) {
				if (err != null) throw err;
				
				data.tags = utils.formatTags(tags);
				callback(data);
			});
		}
	});
};





