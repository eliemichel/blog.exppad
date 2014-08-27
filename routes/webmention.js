exports.getData = function(utils, post, callback) {
	var data = {
		error : null,
		status : null
	};

	if (post.source && post.target) {
		utils.log('Webmention from ' + post.source + ' to ' + post.target + '.');
		data.status = 202; // = À vérifier plus tard
	}
	else {
		data.error = 'You must specify a source and a target.';
		data.status = 400;
	}

	callback(data);
};





