
exports.init = function (utils, mongoose) {
	mongoose.connect('mongodb://localhost/exppad', function (err) {
		if (err) throw err;
	});
	
	/* Schémas */
	var tagSchema = new mongoose.Schema({
		titre : String,
		titreURL : String, // = titre.toLowerCase().replace(' ', '-')
		description : String,
		actif : {type : Boolean, default : true}
	});
	
	var articleSchema = new mongoose.Schema({
		titre : String,
		titreURL : String,
		auteur : String,
		date : {type : Date, default : Date.now},
		resume : String,
		script : String,
		rendu : String,
		tags : [String],
		reactions : [{
			auteur : {type : String, match : utils.auteurRegex },
			date : {type : Date, default : Date.now},
			script : String
		}],
		publique : {type : Boolean, default : true}
	});
	
	var categorieSchema = new mongoose.Schema({
		titre : String,
		description : String,
		ordre : Number,
		actif : {type : Boolean, default : true}
	});
	
	var lienSchema = new mongoose.Schema({
		titre : String,
		url : String,
		description : String,
		ordre : Number,
		categorie : String,
		defectueux : {type : Number, min : 0, default : 0},
	});
	
	/* Modèles */
	mongoose.model('tags', tagSchema);
	var T = mongoose.model('articles', articleSchema);
	mongoose.model('categories', categorieSchema);
	mongoose.model('liens', lienSchema);
	
	/*T.remove(console.log);
	(new T({
		titre : 'Rawkes',
		url : 'http://rawkes.com/',
		description : 'Blog m\'ayant fortement insipré pour le design de Exppad. J\'ai en particulier suivi les articles sur ViziCities.',
		ordre : 0,
		categorie : 'Blogs et sites perso',
		defectueux : 28
	})).save(console.log);
	(new T({
		titre : 'The Nature of Code',
		url : 'http://natureofcode.com/book/introduction/',
		description : 'Livre publié gratuitement en ligne présentant de façon très agréable et fluide la programmation d\'un véritable petit vivarium virtuelle.',
		ordre : 10,
		categorie : 'Blogs et sites perso'
	})).save(console.log);
	(new T({
		titre : 'Google',
		url : 'http://www.google.fr',
		description : 'Un lien bien pratique',
		ordre : 0,
		categorie : 'Test'
	})).save(console.log);
	//*/
	
	
	/*T.remove(console.log);
	(new T({
		titre : 'Blogs et sites perso',
		description : '',
		ordre : 0
	})).save(console.log);
	(new T({
		titre : 'Test',
		description : 'Liens de test. Devront être supprimés',
		ordre : 10
	})).save(console.log);
	//*/
	
	/*T.remove(console.log);
	(new T({
		titre : 'Blog',
		titreURL : 'blog',
		description : 'Ces articles concernent la vie du blog et son développement.',
	})).save(console.log);
	(new T({
		titre : 'Test',
		titreURL : 'test',
		description : 'Articles de test du blog. Ils doivent à terme être supprimés.',
	})).save(console.log);
	(new T({
		titre : 'Lorem ipsum',
		titreURL : 'lorem-ipsum',
		description : '',
	})).save(console.log);
	(new T({
		titre : 'Premier post',
		titreURL : 'premier-post',
		description : '',
	})).save(console.log);//*/
	
	/*T.remove(console.log);
	(new T({
		titre : 'Une toute première entrée pour ce blog !',
		titreURL : 'une-toute-premiere-entree-pour-ce-blog',
		auteur : 'Elie',
		date : new Date(1372869045000),
		resume : 'Ceci est le premier post de ce blog. Je n\'ai pas grand chose à raconter mais ce post est très important pour la réalisation du blog et permet de tester la façon dont son contenu s\'affiche, surtout s\'il est un peu trop long.',
		rendu : '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam tincidunt leo neque, sed <a href="#">elementum nulla</a> tincidunt vitae. Maecenas molestie massa eget dolor elementum semper. Nulla augue erat, consequat at sem quis, viverra commodo libero. Nam at vehicula urna. Etiam ultrices elit et ultrices vehicula.\
			</p>\
			<p>\
				Donec auctor id eros nec vestibulum. Vestibulum adipiscing gravida libero, non euismod magna congue a. In hac habitasse platea dictumst. Vivamus leo massa, tincidunt hendrerit pretium sit amet, scelerisque in ante. Cras quis dolor sed quam lobortis aliquam. Integer sed odio nisi. Integer iaculis eu purus placerat tincidunt. Integer justo risus, placerat a nulla eget, lacinia dapibus odio. Etiam non arcu ullamcorper, pharetra risus sed, pharetra sem. Aliquam consectetur facilisis mauris, vitae suscipit tellus blandit sed.</p>',
		tags : ['test', 'blog', 'premier post'],
		reactions : [
			{
				auteur : 'Mr.Réaction',
				date : new Date(1373389579000),
				script : 'Je réagit vivement !<br/>Et même que j\'utilise deux lignes pour insister...'
			},
			{
				auteur : 'Moon Key',
				date : new Date(1373439242000),
				script : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam tincidunt leo neque, sed elementum nulla.'
			},
			{
				auteur : 'Guérahir',
				date : new Date(1373303717000),
				script : 'C\'est bien pensé mais un peu court, dommage !<br/>Ce texte montre très bien la créativité de l\'auteur !!!'
			},
			{
				auteur : 'Elie',
				date : new Date(1373534732000),
				script : 'Première réaction  ajoutée depuis le site !'
			},
			{
				auteur : 'Test',
				date : new Date(1373534795000),
				script : 'Avec un\
retour à la ligne'
			},
			{
				auteur : 'H4ck3r',
				date : new Date(1373535549000),
				script : 'Test<br/>de<a href="chezmoi">Hack</a> !'
			},
			{
				auteur : 'Test',
				date : new Date(1373535655000),
				script : 'J\'espère que les "appostrophes" fonctionnent bien...'
			},
			{
				auteur : 'Test',
				date : new Date(1373537200000),
				script : 'L\'*astérisque* (\*), c\'est trop **strong** ! Puis on peut *-rayer-* *_souligner_* des mots aussi =)'
			}
		]
	})).save(console.log);
	(new T({
		titre : 'Un deuxième article',
		titreURL : 'un-deuxieme-article',
		auteur : 'Elie',
		date : new Date(1375622790000),
		resume : 'J\'avais déjà pas grand chose à dire pour l\'article précédent mais alors là je suis encore moins inspiré. M\'enfin j\'ai un peu la flemme d\'aller chercher le Lorem ipsum pour ça...',
		rendu : '<p>Cet article sert à tester le code markdown, l\'affichage des images et du code<br/><img alt="Une image..." src="test.png"/>Une image...</p><p>Un peu de code <code class="language-js">en inline</code> ou en bloc :\
		<pre class="line-numbers"><code class="language-css">p {\
color : red;\
}</code></pre></p>',
		tags : ['test', 'blog'],
		reactions : [
			{
				auteur : 'Elie',
				date : new Date(1373538262000),
				script : 'Une première réaction !\
Elle s\'étend même sur **plusieurs lignes**'
			},
			{
				auteur : 'Test',
				date : new Date(1373538894000),
				script : 'J\'essaye d\'afficher un [lien compliqué](https://www.google.fr/#sclient=psy-ab&q=google&oq=google&gs_l=hp.3..35i39l2j0l2.2363.3198.0.3499.6.6.0.0.0.0.286.832.1j4j1.6.0...0.0.0..1c.1.17.psy-ab.L5V0qptlxbw&pbx=1&bav=on.2,or.r_cp.r_qf.&bvm=bv.48705608,d.d2k&fp=affc2c6f55ec3f31&biw=1535&bih=788)...'
			},
			{
				auteur : 'Test',
				date : new Date(1373559234000),
				script : 'Une *_**première**_* réaction avec les boutons de mise en page !'
			}
		]
	})).save(console.log);
	(new T({
		titre : 'Lorem ipsum',
		titreURL : 'lorem-ipsum',
		auteur : 'Elie',
		date : new Date(1377332067000),
		resume : 'Finalement, je n\'y échappe pas, le voilà : Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam tincidunt leo neque, sed elementum nulla tincidunt vitae. Maecenas molestie massa eget dolor elementum semper. Nulla augue erat, consequat at sem quis, viverra commodo libero. Nam at vehicula urna. Etiam ultrices elit et ultrices vehicula.',
		rendu : '<p>Cet article aussi est vide. Il contient juste un petit coucou pour Greg ;-)</p>',
		tags : ['test', 'blog', 'lorem ipsum'],
		reactions : [
			{
				auteur : 'Test',
				date : new Date(1375013652000),
				script : 'Je fais un super test !'
			},
			{
				auteur : 'Test',
				date : new Date(1378218351000),
				script : 'C\'est encore moi !'
			}
		]
	})).save(console.log);
	(new T({
		titre : 'Un nouvel article',
		titreURL : 'un-nouvel-article',
		auteur : 'MoonkeyTest',
		resume : 'Pour aller toujours plus loin dans les tests !',
		rendu : '<p>TEST !<br/>Ceci est encore un test...</p>',
		tags : ['test', 'blog', 'mongodb']
	})).save(console.log);
	//*/
};



