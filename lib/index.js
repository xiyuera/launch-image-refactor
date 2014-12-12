var path      = require('path');
var fs        = require('fs');
var async     = require('async');
var strformat = require('strformat');
var imageSize = require('image-size');

var maker = function(options) {
	this.options = options;
	if (!fs.existsSync(this.options.compareDir)) {
		throw new Error(strformat('找不到对比文件夹{0}', this.options.compareDir));

		return;
	}

	if (!fs.existsSync(this.options.targetDir)) {
		throw new Error(strformat('找不到目标文件夹{0}', this.options.compareDir));

		return;
	}
	this.targImgs = {};
	this.compImgs = {};

	this.run();
};

maker.prototype.run = function () {
	this.loadCompImgs();
};

maker.prototype.loadCompImgs = function (next, args) {
	var self = this;

	console.info("Loading compare dir[" + self.options.compareDir + "] imgs.");

	fs.readdir(self.options.compareDir, function(err, files) {
		if (err) {
			throw new Error(strformat('对比文件夹读取失败: {0}', err.toString()));
			return;
		}

		var ext;
		var file_path;
		var file_size;
		var file_size_key;

		files.forEach(function(file) {
			ext = path.extname(file);
			if (ext != '.png') {
				return;
			}

			file_path = self.options.compareDir + '/' + file;
			file_size = imageSize(file_path);
			file_size_key = strformat('{0}x{1}', file_size.width, file_size.height);
			self.compImgs[file_size_key] = file_path;
		});

		console.log("target imgs: ", self.compImgs);

		self.loadTargImgs();
	});
};

maker.prototype.loadTargImgs = function () {
	var self = this;

	console.info("Loading target dir imgs.");

	fs.readdir(self.options.targetDir, function(err, files) {
		if (err) {
			throw new Error(strformat('对比文件夹读取失败: {0}', err.toString()));
			return;
		}

		var ext;
		var file_path;
		var file_size;
		var file_size_key;

		files.forEach(function(file) {
			ext = path.extname(file);
			if (ext != '.png') {
				return;
			}

			file_path = self.options.targetDir + '/' + file;
			file_size = imageSize(file_path);
			file_size_key = strformat('{0}x{1}', file_size.width, file_size.height);
			self.targImgs[file_size_key] = file_path;
		});

		console.log("target imgs: ", self.targImgs);

		self.executeRename();

	});
};

maker.prototype.executeRename = function() {
	for (var size_key in this.targImgs) {
		if (this.targImgs.hasOwnProperty(size_key)
			&& this.compImgs.hasOwnProperty(size_key)) {

			var file_path = this.targImgs[size_key];
			var dir_name  = path.dirname(file_path);

			var shouldBeNamed = path.basename(this.compImgs[size_key]);
			var shouldBePath = strformat('{0}/{1}', dir_name, shouldBeNamed);

			console.info("Move " + file_path + " -> " + shouldBePath + ".");

			fs.renameSync(file_path, shouldBePath);
		}
	}
};

exports.make = function(options) {
	return new maker(options);
};