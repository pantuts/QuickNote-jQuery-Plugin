/**
 * QuickNote - jQuery plugin that lets you add quick note or todo note.
 * This plugin is useful for admin panel dashboard.
 *
 * Copyright 2014 Pantuts
 * Licensed under GNU GPLv3
 * https://github.com/pantuts
 * http://pantuts.com
 * Version 1.1
 * Changelog:
 * 	Added support for localStorage
 *   	Added close button instead of directly clicking on note
 *    	Changed font to Open Sans
 * 	Text wrapping
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
			pos: 'right',
			storage: true || false
		},
		init: function() {
			this.config = $.extend({}, this.defaults, this.options);
			// detecting local storage
			if (Storage === void(0)) {
				this.config.storage = false;
			}
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
			var notesInp = '<p><input type="text" name="qn_input" maxlength="200" placeholder="Your notes..."></p>';
			$(showHide).appendTo(this.$el);
			$(divNotes).appendTo(this.$el);
			$(notesInp).appendTo(this.$el.find('#notes'));

			// check localStorage
			if (this.config.storage === true) {
				var ls = JSON.parse(localStorage.getItem('quicknote')) || [];
				if (ls) {
					$.each(ls, function(i, obj) {
						$('<span class="quicknote" id="' + ls[i].id + '"></span>').css({ display: 'table' }).stop().fadeIn('fast').appendTo('.qn_container #notes').text(ls[i].note);
						$('<span class="close"></span>').prependTo('#' + ls[i].id);
					})
				}
			}
		},
		completeNote: function() {
			var storage = this.config.storage;
			this.$el.on('keypress', '#notes input', function(e) {
				// RETURN KEY PRESSED
				if (e.which == 13 || e.keyCode == 13) {
					var notesInpVal = $('#notes input').val();
					if (notesInpVal) {
						var uniqid = Date.now();
						$('<span class="quicknote" id="qn_' + uniqid + '"></span>').css({ display: 'table' }).stop().fadeIn('fast').appendTo('.qn_container #notes').text(notesInpVal);
						$('<span class="close"></span>').prependTo('#qn_' + uniqid);
						$('.qn_container #notes input').val('');

						// save to localStorage
						if (storage === true) {
							var prevNotes = JSON.parse(localStorage.getItem('quicknote')) || [];
							var newNote = {
								'id': 'qn_' + uniqid,
								'note': $('#qn_' + uniqid).text()
							};
							prevNotes.push(newNote);
							localStorage.setItem('quicknote', JSON.stringify(prevNotes));
						}
					} else {
						console.log('Empty note!');
					}
				}
			});

			// SHOW AND HIDE
			this.$el.on('click', '#qn_sh span', function() {
				$('.qn_container #notes').slideToggle(100);
			});

			// CLICK TO CLOSE NOTES
			this.$el.on('click', '#notes .close', function() {
				$(this).each(function() {
					$(this).parent('.quicknote').stop().fadeOut(100, function() {
						var ID = $(this).attr('id');
						// removal of item in localStorage
						if (storage === true) {
							var ls = JSON.parse(localStorage.getItem('quicknote')) || [];
							if (ls) {
								$.each(ls, function(i, obj) {
									// console.log(ID);
									if (obj.id == ID) {
										ls.splice(i, 1);
										localStorage.setItem('quicknote', JSON.stringify(ls));
										return false;
									}
								});
							}
						}
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
