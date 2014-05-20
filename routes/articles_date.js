exports.getData = function(utils, mongoose, date, callback) {
	var articlesModel = mongoose.model('articles'),
		requete = articlesModel.find(),
		now = new Date();
	
	switch(date) {
		case 'aujourdhui' :
		dateAffichage = 'Ajourd\'hui';
		requete.where('date').gt(utils.debutJournee(now));
		break;
		
		case 'cette-semaine' :
		dateAffichage = 'Cette semaine';
		requete.where('date').gt(utils.debutSemaine(now));
		break;
		
		case 'ce-mois' :
		dateAffichage = 'En ' + utils.ceMois();
		requete.where('date').gt(utils.debutMois(now));
		break;
		
		default :
		var an = parseInt(date.slice(3));
		dateAffichage = 'En ' + an;
		requete.where('date').gte(utils.debutAnnee(an)).lt(utils.debutAnnee(an+1));
	}
	requete
	.sort('-date')
	.select('titre titreURL date resume')
	.exec(function (err, result) {
		if (err != null) throw err;
		
		var articles = []
		result.forEach(function (article) {
			articles.push({
				titre : article.titre,
				id : article.titreURL,
				date : utils.formatShortDate(article.date),
				resume : article.resume
			});
		});
		
		var data = {
			date : date,
			date_affichage : dateAffichage,
			articles : articles
		};
		
		callback(data);
	});
};





