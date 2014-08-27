exports.getData = function (utils, mongoose, callback) {
	var articlesModel = mongoose.model('articles');
	articlesModel.find('{"publique":true}')
	.select('titre titreURL modif date resume rendu')
	.sort('-date')
	.exec(function (err, result) {
		if (err != null) throw err;
		
		articles = [];
		
		for(var i = 0 ; i < result.length ; i++) {
			/* Les données sont formatées ici */
			articles.push({
				titre : result[i].titre,
				date : result[i].date.toISOString(),
				modif : result[i].modif.toISOString(),
				resume : result[i].resume,
				contenu : result[i].rendu,
				id : result[i].titreURL
			});
		}
		
		callback({
			articles : articles
		});
	});
};
