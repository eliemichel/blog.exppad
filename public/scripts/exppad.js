$(document).ready( function () {
	$('#haut_de_page').click(function () {
		window.scrollTo(0);
	});
	
	resized();
	$(window).resize(resized);
	
	// Présentation des images //
	$('article.unique img')
	.wrap('<figure/>')
	.after(function () {
		var alt = this['alt'];
		return alt == '' ? '' : '<figcaption>' + alt + '</figcaption>';
	});
	
	// Boutons des réactions //
	var baseText = 'Adresse du lien';
	$('#url').val(baseText).addClass('legende');
	
	$('#bouton_em').click(insertTag('*','*'));
	$('#bouton_strong').click(insertTag('**','**'));
	$('#bouton_u').click(insertTag('_','_'));
	$('#bouton_del').click(insertTag('-','-'));
	$('#bouton_link').click(function () {
		insertTag('[', '](' + $('#url').val() + ')')();
		$('#url').val(baseText).addClass('legende');
	});
	
	$('#url').focus(function () {
		if ($('#url').val() == baseText) {
			$('#url').val('').removeClass('legende');
		}
	});
	$('#url').focusout(function () {
		if ($('#url').val() == '') {
			$('#url').val(baseText).addClass('legende');
		}
	});
	
});



function resized () {
	// Footer en bas de page //
	$('#correction').remove();
	var diff = $(window).height() - $(document.body).height()-1;
	if (diff > 0) {
		$('#contenu').append('<div id="correction" style="height:' + diff + 'px"></div>');
	}
	
	// Présentation des images //
	$('article.unique img')
	.css('max-width', ($('article.unique').width()) + 'px')
}


function insertTag (debut, fin) {
	return function () {
		var textarea = $('textarea');
		textarea.replaceSelection(debut + textarea.getSelection().text + fin);
	};
}

