exports.getData = function (utils, admin, valide, mongoose, id, callback) {
	var liensModel = mongoose.model('liens');
	var data = {
		valide : valide,
		admin : admin,
		id : id
	}; 
	
	if (admin || !valid) {
		liensModel.findById(id, function (err, lien) {
			if (err == null) {
				lien.defectueux = data.defectueux = valide ? 0 : (lien.defectueux + 1);
				lien.save(function (err) {
					if (err != null) throw err;
					callback(data);
				});
			}
		});
	}
};
