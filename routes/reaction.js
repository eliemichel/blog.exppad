exports.getData = function (utils, mongoose, post, callback) {
	var articlesModel = mongoose.model('articles');
	
	if (!utils.auteurRegex.test(post.pseudo)) {
		callback({erreur : 'Le pseudo doit comporter entre 2 et 50 caractères alphanumériques. `_` et `.` sont également acceptés.'});
	}
	else if (post.reaction.length == 0) {
		callback({erreur : 'Une réaction ne peut être vide.'});
	}
	else {
		articlesModel.findOneAndUpdate(
			{titreURL : post.article},
			
			{$push : {reactions :{
				auteur : post.pseudo,
				script : post.reaction
			}}},
			
			function (err) {
				if (err != null) {
					data = {
						auteur : 'Erreur !',
						date : utils.formatDate(),
						reaction : 'Une erreur est survenue lors de l\'enregistrement de votre réaction.'
					}
				}
				else {
					data = {
						auteur : post.pseudo,
						date : utils.formatDate(),
						reaction : utils.parseLite(post.reaction)
					};
				}
			
				callback(data);
		});
	}
};


