function urlToSelect(url, ignorePrefix, delimiter, target, display_col, value_col) {
	var contents;
	jQuery.ajax({
		async: true,
		url: url,
		cache: false,
		dataType: 'text'
	})
	.done(function(data) {
		var selector=jQuery(target);
		selector.empty();
		selector.append("<option></option>");
		var lines=data.split(/[\r\n?]/);
		for ( var i=1; i < lines.length; i++ ) {
			if ( lines[i]==="" ) { continue; }
			if ( lines[i].substr(0,1)===ignorePrefix ) { continue; }
			var param=lines[i].split(delimiter);
			var option='<option value="'+param[value_col]+'">'+param[display_col]+'</option>';
			selector.append(option);
		}
	})
	.fail(function(XMLHttpRequest, textStatus, errorThrown) {
		alert(errorThrown.message);
		console.log(errorThrown.message);
	})
	.always(function() {
	});
	return contents;
}

function urlToArray(url, ignorePrefix, delimiter) {
	var contents;
	jQuery.ajax({
		async: true,
		url: url,
		cache: false,
		dataType: 'text'
	})
	.done(function(data) {
		var lines=data.split(/[\r\n?]/);
		for ( var i=1; i < lines.length; i++ ) {
			if ( lines[i]==="" ) { continue; }
			if ( lines[i].substr(0,1)===ignorePrefix ) { continue; }
			contents.push(lines[i].split(delimiter));
		}
	})
	.fail(function(XMLHttpRequest, textStatus, errorThrown) {
		alert(errorThrown.message);
		console.log(errorThrown.message);
	})
	.always(function() {
	});
	return contents;
}
