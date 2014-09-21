/**
 * QuickNote - jQuery plugin that lets you add quick note or todo note.
 * This plugin is useful for admin panel dashboard.
 *
 * Copyright 2014 Pantuts
 * Licensed under GNU GPLv3
 * https://github.com/pantuts
 * http://pantuts.com
 */

;(function($, window, document, undefined) {

	'use strict';

	var QuickNote = function(el, options) {
		this.el = el;
		this.$el = $(el);
		this.options = options;
	};

	QuickNote.prototype = {
		defaults: {
			theme: 'dark',
			pos: 'right'
		},
		init: function() {
			this.config = $.extend({}, this.defaults, this.options);
			this.appendElem();
			this.completeNote();
		},
		appendElem: function() {
			// THEME
			if (this.config.theme == 'light') {
				this.$el.addClass('qn_container_light').addClass('qn_container');
			} else if (this.config.theme == 'dark') {
				this.$el.addClass('qn_container');
			} else {
				console.log('Error: Theme >> ' + this.config.theme + ' not found.');
				// set default
				this.$el.addClass('qn_container');
			}

			// POSITION
			if (this.config.pos == 'left') {
				this.$el.css({ 'left':'0', 'bottom':'0', 'margin-left':'5px' });
			} else if (this.config.pos == 'right') {
			} else {
				console.log('Error: Position >> ' + this.config.pos + ' not found.');
			}

			var showHide = '<div id="qn_sh"><span>Show/Hide</span></div>';
			var divNotes = '<div id="notes"></div>';
			var notesInp = '<p><input type="text" name="qn_input" maxlength="200" placeholder="Your notes...[Click to close]"></p>';
			$(showHide).appendTo(this.$el);
			$(divNotes).appendTo(this.$el);
			$(notesInp).appendTo(this.$el.find('#notes'));
		},
		completeNote: function() {
			// i USED FOR NOTES ID
			var i = 0;
			this.$el.on('keypress', '#notes input', function(e) {
				// RETURN KEY PRESSED
				if (e.which == 13 || e.keyCode == 13) {
					var notesInpVal = $('#notes input').val();
					if (notesInpVal) {
						$('<span class="quicknote" id="qn_' + i + '"></span>').css({ display: 'table' }).stop().fadeIn('fast').appendTo('.qn_container #notes').text(notesInpVal);
						$('.qn_container #notes input').val('');
						i++;
					} else {
						console.log('Empty note!');
					}
				}
			});

			// SHOW AND HIDE
			this.$el.on('click', '#qn_sh span', function(){
				$('.qn_container #notes').slideToggle(100);
			});

			// CLICK TO CLOSE NOTES
			this.$el.on('click', '#notes .quicknote', function(){
				$(this).each(function(){
					$(this).stop().fadeOut('fast', function() {
						$(this).remove();
					});
				});
			});
		}
	};

	$.fn.quicknote = function(options) {
		return this.each(function() {
			new QuickNote(this, options).init();
		});
	};

})(jQuery, window, document);
