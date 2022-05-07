'use strict';

var	request = require('request'),
	cheerio = require('cheerio');


var shorthandProperties = {
	"image": "image:url",
	"video": "video:url",
	"audio": "audio:url"
}

var keyBlacklist = [
	'__proto__',
	'constructor',
	'prototype'
]

exports = module.exports = function(url, cb, options){
  var userAgent = (options || {}).userAgent || 'NodeOpenGraphCrawler (https://github.com/samholmes/node-open-graph)'
	exports.getHTML(url, userAgent, function(err, html){
		if (err) return cb(err);

		try {
			var parsedMeta = exports.parse(html, options);
		}
		catch (parseErr) {
			cb(parseErr);
		}

		cb(null, parsedMeta);
	})
}


exports.getHTML = function(url, userAgent, cb){
	var purl = require('url').parse(url);

	if (!purl.protocol)
		purl = require('url').parse("http://"+url);

	url = require('url').format(purl);

	request({
			url: url,
			encoding: 'utf8',
			gzip: true,
      jar: true,
      headers: { 'User-Agent': userAgent },
		},
		function(err, res, body) {
			if (err) return cb(err);

			if (res.statusCode === 200) {
				cb(null, body);
			}
			else {
				cb(new Error("Request failed with HTTP status code: "+res.statusCode));
			}
		})
}


exports.parse = function($, options){
	options = options || {};

	if (typeof $ === 'string')
		$ = cheerio.load($);

	// Check for xml namespace
	var namespace,
		$html = $('html');

	if ($html.length)
	{
		var attribKeys = Object.keys($html[0].attribs);

		attribKeys.some(function(attrName){
			var attrValue = $html.attr(attrName);

			if (attrValue.toLowerCase() === 'http://opengraphprotocol.org/schema/'
				&& attrName.substring(0, 6) == 'xmlns:')
			{
				namespace = attrName.substring(6);
				return false;
			}
		})
	}
	else if (options.strict)
		return null;

	if (!namespace)
		// If no namespace is explicitly set..
		if (options.strict)
			// and strict mode is specified, abort parse.
			return null;
		else
			// and strict mode is not specific, then default to "og"
			namespace = "og";

	var meta = {},
		metaTags = $('meta');

	metaTags.each(function() {
		var element = $(this),
			propertyAttr = element.attr('property');

		// If meta element isn't an "og:" property, skip it
		if (!propertyAttr || propertyAttr.substring(0, namespace.length) !== namespace)
			return;

		var property = propertyAttr.substring(namespace.length+1),
			content = element.attr('content');

		// If property is a shorthand for a longer property,
		// Use the full property
		property = shorthandProperties[property] || property;


		var key, tmp,
			ptr = meta,
			keys = property.split(':', 4);

		// we want to leave one key to assign to so we always use references
		// as long as there's one key left, we're dealing with a sub-node and not a value

		while (keys.length > 1) {
			key = keys.shift();

			if (keyBlacklist.includes(key)) continue

			if (Array.isArray(ptr[key])) {
				// the last index of ptr[key] should become
				// the object we are examining.
				tmp = ptr[key].length-1;
				ptr = ptr[key];
				key = tmp;
			}

			if (typeof ptr[key] === 'string') {
				// if it's a string, convert it
				ptr[key] = { '': ptr[key] };
			} else if (ptr[key] === undefined) {
				// create a new key
				ptr[key] = {};
			}

			// move our pointer to the next subnode
			ptr = ptr[key];
		}

		// deal with the last key
		key = keys.shift();

		if (ptr[key] === undefined) {
			ptr[key] = content;
		} else if (Array.isArray(ptr[key])) {
			ptr[key].push(content);
		} else {
			ptr[key] = [ ptr[key], content ];
		}
	});


	// If no 'og:title', use title tag
	if(!meta.hasOwnProperty('title')){
		meta['title'] = $('title').text();
	}


	// Temporary fallback for image meta.
	// Fallback to the first image on the page.
	// In the future, the image property could be populated
	// with an array of images, maybe.
	if(!meta.hasOwnProperty('image')){
		var img = $('img');

		// If there are image elements in the page
		if(img.length){
			var imgObj = {};
			imgObj.url = $('img').attr('src');

			// Set image width and height properties if respective attributes exist
			if($('img').attr('width'))
				imgObj.width = $('img').attr('width');
			if($('img').attr('height'))
				imgObj.height = $('img').attr('height');

			meta['image'] = imgObj;
		}

	}

	return meta;
}
