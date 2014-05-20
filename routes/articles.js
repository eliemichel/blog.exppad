exports.getData = function(utils, mongoose, callback) {
	var articlesModel = mongoose.model('articles'),
		tagsModel = mongoose.model('tags');
	
	articlesModel.find(null, 'date', function (err, result) {
		if (err != null) throw err;
		
		var i,
			now = new Date(),
			premiereAnnee = now.getFullYear();
		
		result.forEach(function (article) {
			premiereAnnee = Math.min(premiereAnnee, article.date.getFullYear());
		});
		
		
		var nbAnnee = [], nbJournee = 0, nbSemaine = 0 ; nbMois = 0;
		for (i = premiereAnnee ; i <= now.getFullYear() ; i++) nbAnnee[i] = 0;
		
		result.forEach(function (article) {
			nbAnnee[article.date.getFullYear()]++;
			var timestamp = utils.timestamp(article.date);
			if (timestamp > utils.timestamp(utils.debutMois(now))) nbMois++;
			if (timestamp > utils.timestamp(utils.debutSemaine(now))) {
				nbSemaine++;
				if (timestamp > utils.timestamp(utils.debutJournee(now))) nbJournee++;
			}
		});
		
		tagsModel.find(null, 'titre', function (err, tagsInfo) {
			if (err != null) throw err;
			// Regroupe toutes les listes de tags en une seule liste contenant une unique fois chaque tag.
			var tags = [];
			tagsInfo.forEach(function (tag) {
				tags.push(tag.titre);
			});
			
			
			var data = {
				tags : utils.formatTags(tags),
				ce_mois : utils.ceMois(),
				cette_annee : now.getFullYear(),
				premiere_annee : premiereAnnee,
				nb_aujourdhui : nbJournee,
				nb_cette_semaine : nbSemaine,
				nb_ce_mois : nbMois,
				nb_annee : nbAnnee
			};
			
			callback(data);
		});
	});
};





