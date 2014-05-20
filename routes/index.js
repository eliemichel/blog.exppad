exports.getData = function (utils, admin, mongoose, callback) {
	var articlesModel = mongoose.model('articles');
	articlesModel.find('{"publique":true}')
	.select('titre titreURL date resume')
	.sort('-date')
	.exec(function (err, result) {
		if (err != null) throw err;
		
		articles = [];
		
		for(var i = 0 ; i < result.length ; i++) {
			/* Les données sont formatées ici */
			articles.push({
				titre : result[i].titre,
				date : utils.formatShortDate(result[i].date),
				resume : result[i].resume,
				id : result[i].titreURL
			});
		}
		
		callback({
			articles : articles,
			admin : admin
		});
	});
};
