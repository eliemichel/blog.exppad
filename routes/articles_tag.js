exports.getData = function(utils, mongoose, tag, callback) {
	var articlesModel = mongoose.model('articles'),
		tagsModel = mongoose.model('tags');
	
	tagsModel.findOne({titreURL : tag, actif : true}, function (err, tagInfo) {
		if (err != null) throw err;
		
		var data = {};
		if (tagInfo == null) {
			data = {
				tag : tag,
				tag_affichage : tag,
				description : 'Aucun article n\'est associé à ce tag.',
				articles : []
			};
			callback(data);
		}
		else {
			articlesModel.find({tags : tag})
			.select('titre titreURL date resume')
			.sort('-date')
			.exec(function (err, result) {
				if (err != null) throw err;
				
				var articles = [];
				result.forEach(function (article) {
					articles.push({
						titre : article.titre,
						id : article.titreURL,
						date : utils.formatShortDate(article.date),
						resume : article.resume
					});
				});
			
				data = {
					tag : tag,
					tag_affichage : tagInfo.titre,
					description : tagInfo.description,
					articles : articles
				};
				callback(data);
			});
		}
	});
};





