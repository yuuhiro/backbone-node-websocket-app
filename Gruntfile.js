// var gruntFolder = '';
// var markupFolder = '../../40_markup/';
// var webFolder = '';
module.exports = function(grunt) {

	grunt.initConfig({

		// package.jsonに設定されている内容を取得
		pkg: grunt.file.readJSON("package.json"),
		// watchの設定 (grunt-contrib-watch)
		watch: {
			// CSS用の設定
			app: {
				files: [
				// watchするファイルを指定する
				"public/static/sass/*.scss",
				"public/static/sass/*/*.scss",
				],
				// 実行するタスク
				tasks: ["compass"]
			},
		},
		// compassの設定("grunt-contrib-compass")
		compass: {
			// 任意の名前
			app: {
				options: {
					// sassファイルのディレクトリ
					sassDir: 'public/static/sass/',
					// cssの出力先
					cssDir: 'public/static/css/',
					// config: 'config.rb',
					imagesDir: "public/static/images/",
					httpGeneratedImagesPath: '../images/',
					noLineComments: true,
				},
				// 実行するタスク
				// tasks: ["cssmin:compress"]
			}
		},

		concat: {
			app: {
				src: ['public/static/css/base.css'],
				dest: 'public/static/css/all.css'
			},
		}
	});

	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-contrib-compass");
	grunt.loadNpmTasks('grunt-contrib-concat');

	grunt.registerTask("default", ["watch:app"]);
};