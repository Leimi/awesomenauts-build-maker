/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * copyright (c) 2013, Emmanuel Pelletier
 */
leiminauts.CharactersView = Backbone.View.extend({
	className: 'chars-list-container',

	events: {
		"click .char[data-id]": "selectCharacter"
	},

	initialize: function(options) {
		this.options = options || {};

		this.template = _.template( $('#chars-tpl').html() );
		this.listenTo(this.collection, 'add remove reset', this.render);

		if (this.options.character !== undefined)
			this.character = this.options.character.model.toJSON();
		this.console = this.options.console !== undefined ? this.options.console : false;

		this.currentChar = null;

		this.mouseOverTimeout = null;

		this.mini = this.options.mini || false;

		this.$el.on('mouseover', '.char', _.bind(_.debounce(this.showCharInfo, 50), this));
		this.$el.on('click', '.current-char', _.bind(this.reset, this));
	},

	render: function(opts) {
		opts = _.extend({}, { currentCharOnly: false }, (opts || {}) );
		var newHtml = this.template({
			characters: this.collection.toJSON(),
			currentChar: this.currentChar,
			character: this.character,
			console: this.options.console,
			mini: this.mini
		});
		if (opts.currentCharOnly) {
			this.$('.current-char').html( $( $.parseHTML('<div>' + newHtml + '</div>') ).find('.current-char').html() );
		}
		else
			this.$el.html(newHtml);
		return this;
	},

	selectCharacter: function(e) {
		this.collection.trigger('selected', $(e.currentTarget).attr('data-id'));
	},

	showCharInfo: function(e) {
		if (this.character) return false;
		var character = $(e.currentTarget).attr('data-char');
		if (character && (!this.currentChar || this.currentChar.get('name') !== character)) {
			this.currentChar = this.collection.findWhere({name: character});
			this.render({ currentCharOnly: true });
		}
	},

	reset: function(e) {
		this.currentChar = null;
		this.render();
	}
});
