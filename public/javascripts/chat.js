$(function() {

	Backbone.io.connect();

	//　モデルの設定
	var Model = Backbone.Model.extend({
		idAttribute: '_id'
	});

	// コレクションの設定
	var Models = Backbone.Collection.extend({
		model: Model,
		backend: 'mybackend',
		initialize: function() {
			this.bindBackend();
		}
	});

	// モデルのビュー
	var View = Backbone.View.extend({
		tagName: 'li',
		className: 'message_data',
		template : new EJS({url: 'javascripts/templates/view.ejs'}),
		events: {
			'click .delete': 'delete',
			'dblclick .message': 'editMode',
			'blur .edit_form': 'editDone'
		},
		initialize: function() {
			_.bindAll(this, 'render', 'delete', 'editMode', 'editDone', 'updata', 'convertDate', 'mousedown', 'dragStart', 'dragend');
			this.$el.bind('dragstart', _.bind(this.dragStart, this));
			this.$el.bind('dragend', _.bind(this.dragend, this));
			this.$el.bind('mousedown', _.bind(this.mousedown, this));
			this.$el.bind('mouseup', _.bind(this.mouseup, this));
		},
		render: function() {
			var data = this.model.toJSON();
			data.form_message = data.message;
			var message = data.message;
			data.message = message.replace(/(\n|\r)/g, '<br />');
			var date = this.convertDate(data.date);
			data.newDate = date;
			if(data.isDrag){
				this.$el.css({'position': 'absolute', 'top': data.top + 'px', 'left': data.left + 'px'});
			}
			this.$el.html((this.template).render(data));
			return this;
		},
		delete: function() {
			this.model.destroy();
		},
		editMode: function(e) {
			var $message = $(e.target);
			var $edit_fomr = $(e.target).next();
			var height = $message.height();
			$edit_fomr.height(height);
			$message.hide();
			$edit_fomr.show().focus();
		},
		editDone: function(e) {
			$(e.target).hide().prev().show();
			this.updata();
		},
		updata: function() {
			var message = $this.$el.find('.edit_form').val();
			var date = new Date();
			this.model.save({message: message, date: date});
		},
		convertDate: function(date) {
			var date = new Date(date);
			var year = date.getFullYear()
				, month = date.getMonth()
				, day = date.getDate()
				, hour = date.getHours()
				, minute = date.getMinutes();
			var newDate = {
					'year': year
				,	'month': month + 1
				, 'day': day
				, 'hour': hour
				, 'minute': minute
			}
			return newDate;
		},
		mousedown: function(e) {
			var $target = $(e.target);
			var $currentTarget = $(e.currentTarget);
			var className = $target[0].className;
			if((className !== 'message') && (className !== 'edit_form')){
				this.$el.attr('draggable', 'true');
				this.$el.css('z-index', '100');
				this.offsetX = e.currentTarget.offsetLeft;
				this.offsetY = e.currentTarget.offsetTop;
				console.log(this.offsetX + '/' + this.offsetY);
			}
		},
		mouseup: function(e) {
			this.$el.attr('draggable', 'false');
		},
		dragStart: function(e) {
			this.$el.attr('draggable', 'true');
		},
		dragend: function(e) {
			if (e.originalEvent) e = e.originalEvent;
			console.log(e);
			var $target = $(e.currentTarget);
			var moveX = e.layerX;
			var moveY = e.layerY - e.target.offsetHeight;
			var positionX = this.offsetX + moveX;
			var positionY = this.offsetY + moveY;
			console.log(moveX + '/' + moveY + '-' + positionX + '/' + positionY);
			$target.css({'position': 'absolute' , 'top': positionY, 'left': positionX});
			this.model.save({top: positionY, left: positionX, isDrag: true}, {silent: true});
			this.$el.attr('draggable', 'false');
		}
	});

	// アプリのビュー
	var AppView = Backbone.View.extend({
		el: '.memo_wrap',
		events: {
		  'click .js_send_message': 'saveMessage',
		  'click .js_delete_all': 'deleteAll',
		  'focus .js_form_message': 'createMode',
		  'blur .js_form_message': 'createDone'
		},
		initialize:function () {
			this.limiter = 10;
			_.bindAll(this, 'render');
			this.collection.on('add change remove reset', this.render);
			this.$el.bind('dragover', _.bind(this.dragover, this));
			this.$el.bind('drop', _.bind(this.drop, this));
			this.collection.fetch();
		},
		render: function() {
			console.log(this.collection);
			var that = this;
			this.$el.find('.js_send_message').addClass('not_valid');
			this.$el.find('.js_message_list').empty();
			var isEmpty = this.collection.length;
			if(isEmpty === 0){
				this.$el.find('.js_delete_all').addClass('not_valid');
			}else{
				this.$el.find('.js_delete_all').removeClass('not_valid');
			}
			this.collection.each(function(message) {
				var view = new View({ model: message });
				that.$el.find('.js_message_list').prepend(view.render().el);
			});
			this.limit();
		},
		createMode: function() {
			this.$el.find('.js_send_message').removeClass('not_valid');
		},
		createDone: function() {
			this.$el.find('.js_send_message').addClass('not_valid');
		},
		saveMessage: function() {
			var $form = this.$el.find('.js_form_message');
			var message = $form.val();
			if(!message){
				return false;
			}
			var date = new Date();
			this.collection.create({message: message, date: date});
			$form.val('');
		},
		limit: function() {
			var model_limit = this.collection.length;
			if(model_limit > this.limiter){
				$('.js_send_message').remove();
				$('.js_form_message').after('<p class="limit_message">制限を超えました</p>');
			}
		},
		deleteAll: function() {
			if(window.confirm('すべて削除されます')){
				var cloneModels = _.clone(this.collection.models);
				_.each(cloneModels, function(model) {
					model.destroy();
				});
			}else{
				return false;
			}
		},
		dragover: function(e) {
			if (e.originalEvent) e = e.originalEvent;
			 e.preventDefault();
		},
		drop: function(e) {
			if (e.originalEvent) e = e.originalEvent;
			e.preventDefault();
		}
	});

	var models = new Models();
	// models.fetch();
	new AppView({collection: models});

	//　モデルの設定
	var Model2 = Backbone.Model.extend({
		idAttribute: '_id'
	});

	// コレクションの設定
	var Models2 = Backbone.Collection.extend({
		model: Model2,
		backend: 'mybackend2',
		initialize: function() {
			this.bindBackend();
		}
	});

	// モデルのビュー
	var View2 = Backbone.View.extend({
		tagName: 'li',
		className: 'message_data',
		template : new EJS({url: 'javascripts/templates/view.ejs'}),
		events: {
			'click .delete': 'delete',
			'dblclick .message': 'editMode',
			'blur .edit_form': 'editDone'
		},
		initialize: function() {
			_.bindAll(this, 'render', 'delete', 'editMode', 'editDone', 'updata', 'convertDate', 'mousedown', 'dragStart', 'dragend');
			this.$el.bind('dragstart', _.bind(this.dragStart, this));
			this.$el.bind('dragend', _.bind(this.dragend, this));
			this.$el.bind('mousedown', _.bind(this.mousedown, this));
			this.$el.bind('mouseup', _.bind(this.mouseup, this));
		},
		render: function() {
			var data = this.model.toJSON();
			data.form_message = data.message;
			var message = data.message;
			data.message = message.replace(/(\n|\r)/g, '<br />');
			var date = this.convertDate(data.date);
			data.newDate = date;
			if(data.isDrag){
				this.$el.css({'position': 'absolute', 'top': data.top + 'px', 'left': data.left + 'px'});
			}
			this.$el.html((this.template).render(data));
			return this;
		},
		delete: function() {
			this.model.destroy();
		},
		editMode: function(e) {
			var $message = $(e.target);
			var $edit_fomr = $(e.target).next();
			var height = $message.height();
			$edit_fomr.height(height);
			$message.hide();
			$edit_fomr.show().focus();
		},
		editDone: function(e) {
			$(e.target).hide().prev().show();
			this.updata();
		},
		updata: function() {
			var message = this.$el.find('.edit_form').val();
			var date = new Date();
			this.model.save({message: message, date: date});
		},
		convertDate: function(date) {
			var date = new Date(date);
			var year = date.getFullYear()
				, month = date.getMonth()
				, day = date.getDate()
				, hour = date.getHours()
				, minute = date.getMinutes();
			var newDate = {
					'year': year
				,	'month': month + 1
				, 'day': day
				, 'hour': hour
				, 'minute': minute
			}
			return newDate;
		},
		mousedown: function(e) {
			var $target = $(e.target);
			var $currentTarget = $(e.currentTarget);
			var className = $target[0].className;
			if((className !== 'message') && (className !== 'edit_form')){
				this.$el.attr('draggable', 'true');
				this.$el.css('z-index', '100');
				this.offsetX = e.currentTarget.offsetLeft;
				this.offsetY = e.currentTarget.offsetTop;
				console.log(this.offsetX + '/' + this.offsetY);
			}
		},
		mouseup: function(e) {
			this.$el.attr('draggable', 'false');
		},
		dragStart: function(e) {
			this.$el.attr('draggable', 'true');
		},
		dragend: function(e) {
			if (e.originalEvent) e = e.originalEvent;
			console.log(e);
			var $target = $(e.currentTarget);
			var moveX = e.layerX;
			var moveY = e.layerY - e.target.offsetHeight;
			var positionX = this.offsetX + moveX;
			var positionY = this.offsetY + moveY;
			console.log(moveX + '/' + moveY + '-' + positionX + '/' + positionY);
			$target.css({'position': 'absolute' , 'top': positionY, 'left': positionX});
			this.model.save({top: positionY, left: positionX, isDrag: true}, {silent: true});
			this.$el.attr('draggable', 'false');
		}
	});

	// アプリのビュー
	var AppView2 = Backbone.View.extend({
		el: '.memo_wrap2',
		events: {
		  'click .js_send_message': 'saveMessage',
		  'click .js_delete_all': 'deleteAll',
		  'focus .js_form_message': 'createMode',
		  'blur .js_form_message': 'createDone'
		},
		initialize:function () {
			this.limiter = 10;
			_.bindAll(this, 'render');
			this.collection.on('add change remove reset', this.render);
			this.$el.bind('dragover', _.bind(this.dragover, this));
			this.$el.bind('drop', _.bind(this.drop, this));
			this.collection.fetch();
		},
		render: function() {
			console.log(this.collection);
			var that = this;
			this.$el.find('.js_send_message').addClass('not_valid');
			this.$el.find('.js_message_list').empty();
			var isEmpty = this.collection.length;
			if(isEmpty === 0){
				this.$el.find('.js_delete_all').addClass('not_valid');
			}else{
				this.$el.find('.js_delete_all').removeClass('not_valid');
			}
			this.collection.each(function(message) {
				var view = new View2({ model: message });
				that.$el.find('.js_message_list').prepend(view.render().el);
			});
			this.limit();
		},
		createMode: function() {
			console.log("tetete");
			this.$el.find('.js_send_message').removeClass('not_valid');
		},
		createDone: function() {
			this.$el.find('.js_send_message').addClass('not_valid');
		},
		saveMessage: function() {
			var $form = this.$el.find('.js_form_message');
			var message = $form.val();
			if(!message){
				return false;
			}
			var date = new Date();
			this.collection.create({message: message, date: date});
			$form.val('');
		},
		limit: function() {
			var model_limit = this.collection.length;
			if(model_limit > this.limiter){
				$('.js_send_message').remove();
				$('.js_form_message').after('<p class="limit_message">制限を超えました</p>');
			}
		},
		deleteAll: function() {
			if(window.confirm('すべて削除されます')){
				var cloneModels = _.clone(this.collection.models);
				_.each(cloneModels, function(model) {
					model.destroy();
				});
			}else{
				return false;
			}
		},
		dragover: function(e) {
			if (e.originalEvent) e = e.originalEvent;
			 e.preventDefault();
		},
		drop: function(e) {
			if (e.originalEvent) e = e.originalEvent;
			e.preventDefault();
		}
	});

	var models2 = new Models2();
	// models2.fetch();
	new AppView2({collection: models2});

});
