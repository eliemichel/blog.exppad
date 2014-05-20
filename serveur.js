var PORT = 8001

var index = require('./routes/index'),
	atom = require ('./routes/atom'),
	article = require('./routes/article'),
	articles = require('./routes/articles'),
	articles_date = require('./routes/articles_date'),
	articles_tag = require('./routes/articles_tag'),
	articles_rediger = require('./routes/articles_rediger'),
	reaction = require('./routes/reaction'),
	liens = require('./routes/liens'),
	liens_defaillance = require('./routes/liens_defaillance'),
	admin = require('./routes/admin'),
	utils = require('./utils'),
	db = require('./database');

var mongoose = require('mongoose'),
	express = require('express'),
	marked = require('marked');

console.log('Server launched');


marked.setOptions({
	highlight : function (code, lang) {
		return '<pre class="line-numbers"><code class="language-javascript">' + code + '</code></pre>'; //' + lang === '' ? 'js' : lang + '
	}
});

db.init(utils, mongoose);

var app = express();

app
.use(express.favicon('public/images/favicon.ico'))
.use(express.bodyParser())
.use(express.cookieParser())
.use(express.cookieSession({
	key : 'exppad.session',
	secret : 'key#exppad'
}))

// DEBUG //
.get(':req(*)', function (req, res, next) {
	console.log('Requete : ' + req.params.req + ' par ' + req.ip);
	next();
})

/* GET */
.get('/', function (req, res) {
	index.getData(utils, req.session.admin || false, mongoose, function (data) {
		res.render('index.ejs', data);
	});
})

.get('/feeds', function (req, res) {
	atom.getData(utils, mongoose, function (data) {
		res.setHeader('Content-Type', 'application/atom+xml');
		res.render('atom.ejs', data);
	});
})

.get(/^\/article\/([A-Za-z0-9-]+)\/?$/, function (req, res) {
	article.getData(utils, req.session.admin || false, mongoose, req.params[0], function (data) {
		res.render('article.ejs', data);
	});
})

.get('/articles', function (req, res) {
	articles.getData(utils, mongoose, function (data) {
		res.render('articles.ejs', data);
	});
})

.get(/^\/articles\/date\/(aujourdhui|cette-semaine|ce-mois|en-[0-9]+)$/, function (req, res) {
	articles_date.getData(utils, mongoose, req.params[0], function (data) {
		res.render('articles_date.ejs', data);
	});
})

.get('/articles/tag/:tag', function (req, res) {
	articles_tag.getData(utils, mongoose, req.params.tag, function (data) {
		res.render('articles_tag.ejs', data);
	});
})

.get(/\/articles\/rediger(\/([A-Za-z0-9-]+))?\/?$/, function (req, res) {
	var titreURL = req.params[1] || '';
	articles_rediger.getData(utils, req, mongoose, marked, titreURL, function (data) {
		res.render('articles_rediger.ejs', data);
	});
})

.get('/liens', function (req, res) {
	liens.getData(utils, req.session.admin || false, mongoose, function (data) {
		res.render('liens.ejs', data);
	});
})

.get('/liens/defaillance/:id', function (req, res) {
	liens_defaillance.getData(utils, req.session.admin || false, false, mongoose, req.params.id, function (data) {
		res.render('liens_defaillance.ejs', data);
	});
})

.get('/liens/valide/:id', function (req, res) {
	liens_defaillance.getData(utils, req.session.admin || false, true, mongoose, req.params.id, function (data) {
		res.render('liens_defaillance.ejs', data);
	});
})

.get('/contact', function (req, res) {
	res.render('contact.ejs');
})

// Sécurité de l'administration //
.get(/^\/admin(\/.*)?$/, function (req, res, next) { // '/admin:dest((/.*)?)'(\/.*)?
	var dest = req.params[0] || ''
	if (!req.session.admin || dest == '' || dest == '/') {
		admin.getData(utils, mongoose, req, res, function (data) {
			res.render('admin.ejs', data);
		});
	}
	else {
		next();
	}
})

.get('/admin/deconnexion', function (req, res) {
	req.session = null;
	res.redirect('/admin');
})
/*  */

/* POST */
.post('/reaction', function (req, res) {
	reaction.getData(utils, mongoose, req.body, function (data) {
		res.render('reaction.ejs', data);
	});
})

.post('/articles/rediger', function (req, res) {
	articles_rediger.getData(utils, req, mongoose, marked, req.body.titreURL || '', function (data) {
		if (data.redirect) {
			res.redirect(data.redirect);
		}
		else {
			res.render('articles_rediger.ejs', data);
		}
	});
})

.post('/admin', function (req, res) {
	admin.getData(utils, mongoose, req, res, function (data) {
		res.render('admin.ejs', data);
	});
})
/*  */

.use('/public', express.directory('public'))
.use('/public', express.static(__dirname + '/public'))


.use(function(req, res, next) {
	res.statusCode = 404;
	res.render('404.ejs', {url : req.path});
})
;



var server = app.listen(PORT)

.on('close', function () {
	console.log('\nServer stopped.');
	mongoose.connection.close();
	process.exit(0);
})
;



