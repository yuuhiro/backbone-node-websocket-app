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
				"public/static/hbs/*.hbs",
				"public/static/hbs/*/*.hbs",
				],
				// 実行するタスク
				tasks: ["compass", "handlebars"]
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
		},
		handlebars: {
			app: {
				options: {
					namespace: 'YUU.Templates',
					processContent: function(hbs) {
						hbs = hbs.replace(/^[\x20\t]+/mg, '').replace(/[\x20\t]+$/mg, '');
						hbs = hbs.replace(/^[\r\n]+/, '').replace(/[\r\n]+$/, '');
						return hbs;
					},
					processName: function(fname) {
						return fname.replace('public/static/hbs/', '').replace('.hbs', '');
					},
					processPartialName: function(fname) {
						return fname.replace('public/static/hbs/partials/', '').replace('.hbs', '');
					},
					partialsUseNamespace: true
				},
				files: {
					'public/static/js/template.js': ['public/static/hbs/*.hbs', 'public/static/hbs/*/*.hbs']
				}
			}
		}
	});

	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-contrib-compass");
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-handlebars');

	grunt.registerTask("default", ["watch:app"]);
};