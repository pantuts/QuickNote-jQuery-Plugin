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
			// DETECTING localStorage
			if (Storage === void(0)) {
				this.config.storage = false;
			}
			this.appendElem();
			this.completeNote();
		},
		isURL: function(str) {
			// CHECKING IF NOTE IS HAS URL FORMAT
			if(/(http|https|ftp):\/\/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i.test(str)) {
			    return true;
			} else {
			    return false;
			}
		},
		appendElem: function() {
			var isURL = this.isURL;

			// THEME
			if (this.config.theme == 'light') {
				this.$el.addClass('qn_container_light').addClass('qn_container');
			} else if (this.config.theme == 'dark') {
				this.$el.addClass('qn_container');
			} else {
				console.log('Error: Theme >> ' + this.config.theme + ' not found.');
				// SET DEFAULT
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
			var notesInp = '<p><input type="text" name="qn_input" maxlength="500" placeholder="Your notes..."></p>';
			$(showHide).appendTo(this.$el);
			$(divNotes).appendTo(this.$el);
			$(notesInp).appendTo(this.$el.find('#notes'));

			// CHECK EXISTING NOTES IN localStorage
			if (this.config.storage === true) {
				var ls = JSON.parse(localStorage.getItem('quicknote')) || [];
				if (ls) {
					// LOAD THE NOTES
					$.each(ls, function(index, obj) {
						$('<span class="quicknote" id="' + ls[index].id + '"></span>').css({ display: 'table' }).stop().fadeIn('fast').appendTo('.qn_container #notes').text(ls[index].note);
						$('<span class="close"></span>').prependTo('#' + ls[index].id);
						var qnText = ls[index].note;
						if (isURL(qnText)) {
							$('#' + ls[index].id).addClass('quicknote-bword');
						}
					});
				}
			}
		},
		completeNote: function() {
			var storage = this.config.storage;
			var isURL = this.isURL;

			this.$el.on('keypress', '#notes input', function(e) {
				// RETURN KEY PRESSED
				if (e.which == 13 || e.keyCode == 13) {
					var notesInpVal = $('#notes input').val();

					if (notesInpVal) {
						var uniqid = Date.now();

						// CREATE NOTES
						$('<span class="quicknote" id="qn_' + uniqid + '"></span>').css({ display: 'table' }).stop().fadeIn('fast').appendTo('.qn_container #notes').text(notesInpVal);
						$('<span class="close"></span>').prependTo('#qn_' + uniqid);
						// word-break: break-all IF HAS URL FORMAT
						var qnText = $('#qn_' + uniqid).text();
						if (isURL(qnText)) {
							$('#qn_' + uniqid).addClass('quicknote-bword');
						}
						$('.qn_container #notes input').val('');

						var id = 'qn_' + uniqid;
                        var note = $('#qn_' + uniqid).text();
                        var newNote = {
                            'id': id,
                            'note': note
                        };

                        // SAVE TO localStorage
                        if (storage === true) {
                            var prevNotes = JSON.parse(localStorage.getItem('quicknote')) || [];
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
						var id = $(this).attr('id');
						var note = $(this).text();
						var theNote = {
                            'id': id,
                            'note': note
                        };

						// REMOVAL OF ITEM IN localStorage
						if (storage === true) {
							var ls = JSON.parse(localStorage.getItem('quicknote')) || [];
							if (ls) {
								$.each(ls, function(index, obj) {
									// console.log(ID);
									if (obj.id == id) {
										ls.splice(index, 1);
										localStorage.setItem('quicknote', JSON.stringify(ls));
										return false;
									}
								});
							}
						}

						// REMOVE CURRENT ELEMENT FROM DOM
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
