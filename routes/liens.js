exports.getData = function (utils, admin, mongoose, callback) {
	var categoriesModel = mongoose.model('categories'),
		liensModel = mongoose.model('liens');
	
	categoriesModel.find({actif : true})
	.select('titre description')
	.sort('ordre')
	.exec(function (err, categories) {
		if (err != null) throw err;
		
		categories.forEach(function (c) { c.liens = [] });
		
		liensModel.find()
		.sort('ordre')
		.exec(function (err, liens) {
			if (err != null) throw err;
			
			liens.forEach(function (lien) {
				lien.description = utils.parseLite(lien.description);
				var categorie = lien.categorie;
				if (categorie == '/') categorie = 'Non triés';
				
				var found = true;
				for (var j = 0 ; j < categories.length || (found = false) ; j++) {
					if (categories[j].titre == categorie) {
						categories[j].liens.push(lien);
						break;
					}
				}
				if (!found) {
					categories.push({
						titre : categorie,
						description : '',
						liens : [lien]
					});
				}
			});
			
			callback({
				categories : categories,
				admin : admin
			});
		});
	});
};
