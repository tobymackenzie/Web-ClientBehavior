/* global define, QUnit */
define([
	'jquery'
	,'tmlib/ui/Dialog'
], function(
	jQuery
	,Dialog
){
	QUnit.module('tmlib.ui.Dialog');
	var _body = jQuery('body');
	QUnit.test('Show jQuery object', function(_assert){
		//==setup
		var _testContent = jQuery(
			'<div>'
				+ ' <button class="showObjectDialogAction">Show _dialogContent object</button>'
			+ '</div>'
		);
		var _dialogContent = jQuery('<div id="dialogContent">Hello, world! From _dialogContent.</div>');
		_body.append(_testContent);

		var _dialog = new Dialog();
		_body.on('click', '.showObjectDialogAction', function(_event){
			_event.preventDefault();
			_dialog.show(_dialogContent);
		});

		//==tests
		jQuery('.showObjectDialogAction').click();
		_dialogContent = jQuery('.dialogContent');
		_assert.ok(_dialogContent.is(':visible'), 'Dialog should be visible.');
		_assert.equal(_dialogContent.text(), 'Hello, world! From _dialogContent.', 'Dialog should have correct content.');

		//==teardown
		_testContent.remove();
		_dialog.getEl().remove();
	});
	QUnit.test('Show ID URL', function(_assert){
		//==setup
		var _testContent = jQuery(
			'<div>'
				+ ' <a class="showHrefDialogAction showIdDialogAction" href="#dialogContent">Show #dialogContent</a>'
				+ ' <div id="dialogContent">Hello, world! From #dialogContent.</div>'
			+ '</div>'
		);
		_body.append(_testContent);

		var _dialog = new Dialog();
		_body.on('click', '.showHrefDialogAction', function(_event){
			_event.preventDefault();
			_dialog.show(jQuery(this).attr('href'));
		});

		//==tests
		jQuery('.showIdDialogAction').click();
		var _dialogContent = jQuery('.dialogContent');
		_assert.ok(_dialogContent.is(':visible'), 'Dialog should be visible.');
		_assert.equal(_dialogContent.text(), 'Hello, world! From #dialogContent.', 'Dialog should have correct content.');


		//==teardown
		_testContent.remove();
		_dialog.getEl().remove();
	});
	QUnit.test('Show HTML URL', function(_assert){
		//==setup
		var _testContent = jQuery(
			'<div>'
				+ '<a class="showHrefDialogAction showHtmlDialogAction" href="./dialogContent.html">Show dialogContent.html</a>'
			+ '</div>'
		);
		_body.append(_testContent);

		var _dialog = new Dialog();
		var _promise;
		_body.on('click', '.showHrefDialogAction', function(_event){
			_event.preventDefault();
			_promise = _dialog.show(this.href);
		});

		//==tests
		_assert.expect(2);
		var _done = _assert.async();
		var _teardownPromise = jQuery.Deferred();
		jQuery('.showHtmlDialogAction').click();
		_promise.done(function(){
			var _dialogContent = jQuery('.dialogContent');
			_assert.ok(_dialogContent.is(':visible'), 'Dialog should be visible.');
			_assert.equal(_dialogContent.text(), 'Hello, world! From HTML.', 'Dialog should have correct content.');
			_done();
			_teardownPromise.resolve();
		});
		//==teardown
		_teardownPromise.done(function(){
			_testContent.remove();
			_dialog.getEl().remove();
		});
	});
	QUnit.test('Show JSON URL', function(_assert){
		//==setup
		var _testContent = jQuery(
			'<div>'
				+ ' <a class="showHrefDialogAction showJsonDialogAction" href="./dialogContent.json">Show dialogContent.json</a>'
			+ '</div>'
		);
		_body.append(_testContent);

		var _dialog = new Dialog();
		var _promise;
		_body.on('click', '.showHrefDialogAction', function(_event){
			_event.preventDefault();
			_promise = _dialog.show(this.href);
		});

		//==tests
		_assert.expect(2);
		var _done = _assert.async();
		var _teardownPromise = jQuery.Deferred();
		jQuery('.showJsonDialogAction').click();
		_promise.done(function(){
			var _dialogContent = jQuery('.dialogContent');
			_assert.ok(_dialogContent.is(':visible'), 'Dialog should be visible.');
			_assert.equal(_dialogContent.text(), 'Hello, world! From JSON.', 'Dialog should have correct content.');
			_done();
			_teardownPromise.resolve();
		});


		_teardownPromise.done(function(){
			_testContent.remove();
			_dialog.getEl().remove();
		});
	});
});
