/**
	Fonctions utilisées dans diverses pages.
**/

var fs = require('fs');

//exports.domain = 'http://localhost:3615';
//exports.domain = 'http:129.199.159.97//:3615';
//exports.domain = 'http:/www.exppad.com';
exports.domain = ''

/* -=-=-=-=-=-=-=- AFFICHAGE DES DATES -=-=-=-=-=-=-=- */
var mois = [
	'Janvier',
	'Février',
	'Mars',
	'Avril',
	'Mai',
	'Juin',
	'Juillet',
	'Août',
	'Septembre',
	'Octobre',
	'Novembre',
	'Décembre'
];

exports.auteurRegex = /^[A-zÀ-ÿ0-9_. ]{2,50}$/;

exports.ceMois = function () {
	return mois[(new Date()).getMonth()];
};

/*exports.timestamp_to_shortdate = function (timestamp) {
	return exports.formatShortDate(new Date(timestamp * 1000));
};*/

exports.formatShortDate = function (date) {
	date = date || new Date();
	var retour = date.getDate() + ' ' + mois[date.getMonth()];
	
	var ajd = new Date();
	if (ajd.getYear() != date.getYear()) {
		retour += ' ' + date.getFullYear();
	}
	return retour;
};

/*exports.timestamp_to_date = function (timestamp) {
	return exports.formatDate(new Date(timestamp * 1000));
};*/

exports.formatDate = function (date) {
	var ajd = new Date();
	date = date || ajd;
	
	if (ajd.getFullYear() == date.getFullYear()) {
		if (ajd.getMonth() == date.getMonth()) {
			if (ajd.getDay() == date.getDay()) {
				var mn = date.getMinutes().toString();
				for (var i = 0 ; i < 2 - mn.length ; i++) {
					mn = '0' + mn;
				}
				return 'Aujourd\'hui à ' + date.getHours() + 'h' + mn;
			}
			else if (ajd.getDay() == date.getDay() + 1) {
				var mn = date.getMinutes().toString();
				for (var i = 0 ; i < 2 - mn.length ; i++) {
					mn = '0' + mn;
				}
				return 'Hier à ' + date.getHours() + 'h' + mn;
			}
		}
		return date.getDate() + ' ' + mois[date.getMonth()];
	}
	return date.getDate() + ' ' + mois[date.getMonth()] + date.getFullYear();
};


exports.debutJournee = function (date) {
	return new Date(Math.floor(date.getTime()/(86400*1000))*86400*1000);
};

exports.debutSemaine = function (date) {
	return exports.debutJournee(new Date(date.getTime() - ((date.getDay() + 6) % 7) * 86400 * 1000));
};

exports.debutMois = function (date) {
	return exports.debutJournee(new Date(date.getTime() - date.getDate() * 86400 * 1000));
};

exports.debutAnnee = function (an) {
	return new Date(an, 0, 0, 0, 0, 0, 0);
};

exports.timestamp = function (date) {
	return Math.floor(date.getTime() / 1000);
};

/*exports.debut_journee = exports.debutJournee;
exports.debut_semaine = exports.debutSemaine;
exports.debut_mois = exports.debutMois;
exports.debut_annee = function (an) {
	return Math.floor((new Date(an, 0, 0, 0, 0, 0, 0)).getTime() / 1000);
};*/


exports.formatClassicDate = function (date) {
	date = date || new Date();
	return date.getDate() + ' ' + mois[date.getMonth()] + ' ' + date.getFullYear();
};

exports.signature = function (date, auteur) {
	return '<p class="signature">Article publié le ' + exports.formatClassicDate(date) + ' par <span class="p-author h-card">' + auteur + '</span></p>'
};

/* -=-=-=-=-=-=-=- CONNEXION À LA BASE DE DONNÉES -=-=-=-=-=-=-=- */
exports.connect = function (mysql, callback) {
	var connexion = mysql.createConnection({
		host : 'localhost', user : 'root', password : 'qsd852', database : 'exppad'
	});
	
	connexion.connect(function (err) {
		if (err != null) {
			console.log('erreur : Connexion à la base de données impossible (' + err + ')');
		}
	});
	
	callback(connexion);
};



/* -=-=-=-=-=-=-=- PARSEUR MARKDOWN -=-=-=-=-=-=-=- */
/* (Inspiré de Markdown mais grandement simplifié)  */
exports.parseLite = function (text) {
	var tagsToReplace = {
		'&' : '&amp;',
		'<' : '&lt;',
		'>' : '&gt;',
		'\\*' : '&#42;',
		'\\-' : '&#45;',
		'\\[' : '&#91;',
		'\\\\' : '&#92;',
		'\\]' : '&#93;',
		'\\_' : '&#95;'
	};
	
	return text
	.replace(/<|>|\\\\|\\\*|\\_|\\\-|\\\[|\\\]/g, function (tag) {return tagsToReplace[tag] || tag;})
	.replace(/&?!(([a-z]+)|(#[0-9]+));/g, '&amp;') // On échappe pas les & servant dans un code html
	.replace(/(\s)\*(\s)/g, '$1' + tagsToReplace['\\*'] + '$2') // On échappe les * isolés
	.replace(/(\s)_(\s)/g, '$1' + tagsToReplace['\\_'] + '$2')
	.replace(/(\s)\-(\s)/g, '$1' + tagsToReplace['\\-'] + '$2')
	.replace(/\[([\s\S]+)?\]\(([-A-z0-9@_:;%\+.,~#?&\/=]+)\)/g, function (match, p1, p2) {
		return '<a target="_blank" href="' + p2 + '">' + p1 + '</a>'
		.replace('*', tagsToReplace['\\*'])
		.replace('_', tagsToReplace['\\_'])
		.replace('-', tagsToReplace['\\-'])
	})
	.replace(/\*\*([\s\S]+?)\*\*/g, '<strong>$1</strong>')
	.replace(/_([\s\S]+?)_/g, '<u>$1</u>')
	.replace(/\-([\s\S]+?)\-/g, '<del>$1</del>')
	.replace(/\*([\s\S]+?)\*/g, '<em>$1</em>')
	.replace(/(http:\/\/[-A-z0-9@_:;%\+.,~#?&\/=]+)/g, '<a target="_blank" href="$1">$1</a>')
	.replace(/\n|\r/g, '<br/>');
};


/* -=-=-=-=-=-=-=- PARSEUR TAGS -=-=-=-=-=-=-=- */
/*exports.print_tags = function (raw_tags) {
	var retour = '';
	var tags = raw_tags.match(/#([A-z0-9 ]*[A-z0-9])/g);
	if (tags == null) return '';
	for (var i = 0 ; i < tags.length ; i++) {
		var tag = tags[i].substr(1).toLowerCase();
		retour += '\n\t\t\t<a href="articles/tag/' + tag.replace(' ', '-') + '">' + tag + '</a>';
	}
	return retour;
};*/

exports.convertTags = function (tags, model, callback) {
	/*async.map(tags, function (tag, next) {
		model.findOne({titreURL : tag}, 'titre', function (err, res) {
			next(null, err == null ? res.titre : tag);
		});
	}, callback);*/
	
	// Autre solution : ne conserve pas l'ordre.
	model.find({titreURL : {$in : tags}}, function (err, res) {
		callback(err, res.map(function (tag) { return tag.titre }));
	});
};

exports.formatTags = function (tags) {
	var retour = '';
	tags.forEach(function (tag) {
		retour += '\n\t\t\t<a class="p-category" href="articles/tag/' + tag.toLowerCase().replace(' ', '-') + '">' + tag + '</a>';
	});
	return retour;
};


exports.parseTagsList = function (tags, mongoose) {
	var tagsModel = mongoose.model('tags');
	
	tags = tags.trim().replace(/ +/g, ' ').split(' ');
	tags.forEach(function (tag) {
		tagsModel.find({titreURL : tag}, '', function (err, res) {
			if (res.length == 0) {
				(new tagsModel({
					titre : tag,
					titreURL : tag,
					description : ''
				})).save(function () {});
			}
		});
	});
	
	return tags;
};

/*exports.liste_tags = function (raw_tags) {
	var retour = [];
	var regex = /#\$?([A-z0-9 ]*[A-z0-9])/g
	var tag = regex.exec(raw_tags);
	while (tag != null) {
		retour.push(tag[1].toLowerCase());
		tag = regex.exec(raw_tags);
	}
	return retour;
};

exports.main_tag = function (raw_tags) {
	var tags = raw_tags.match(/#\$([A-z0-9 ]*[A-z0-9])/g);
	if (tags.length > 0)
		return tags[0].substr(2);
	else return '/';
};*/


/* -=-=-=-=-=-=-=- AUTRES -=-=-=-=-=-=-=- */

exports.newTitreURL = function (titre, mongoose, callback) {
	var titreURL = titre
	.toLowerCase()
	.replace(/à/g, 'a')
	.replace(/â/g, 'a')
	.replace(/é/g, 'e')
	.replace(/è/g, 'e')
	.replace(/ë/g, 'e')
	.replace(/ê/g, 'e')
	.replace(/ï/g, 'i')
	.replace(/î/g, 'i')
	.replace(/ö/g, 'o')
	.replace(/ô/g, 'o')
	.replace(/ù/g, 'u')
	.replace(/ü/g, 'u')
	.replace(/ç/g, 'c')
	.replace(/'| |,|\./g, '-')
	.replace(/[^a-z0-9-]/g, '#')
	.replace(/(\-)+/g, '-')
	.replace(/\-$/g, '');
	
	var i = 0, articlesModel = mongoose.model('articles'), test = titreURL;
	var fun = function (err, res) {
		if (res.length == 0) callback(test);
		else articlesModel.find({titreURL : (test = titreURL + (++i), test)}, '', fun);
	}
	articlesModel.find({titreURL : test}, '', fun);
};


/* -=-=-=-=-=-=-=- LOG SYSTEM -=-=-=-=-=-=-=- */
exports.log = function(msg) {
	var d = new Date();
	fs.appendFile('/var/log/blog/logfile', '[' + d + '] ' + msg + '\n', function (err) {
		  if (err) throw err;
	});
};


