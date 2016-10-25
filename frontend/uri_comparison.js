function parseScheme(uri) {
	// TODO: use a more flexible separator
	var scheme = null;
	if (!uri) {
		return [scheme, uri];
	}
	var tokens = uri.split("://");
	scheme = tokens[0];
	var remaining = tokens[1];
	return [scheme, remaining];
}

function parseAuth(remaining) {
	var auth = null;
	if (!remaining) {
		return [auth, remaining];
	}
	var idx = remaining.indexOf("@");
	if (idx > -1) {
		auth = remaining.substr(0, idx);
		remaining = remaining.substr(idx+1);
	}
	return [auth, remaining];
}

function parseHostAndPort(remaining) {
	var host = null, port = null;
	if (!remaining) {
		return [host, port, remaining];
	}
	var idx = remaining.indexOf("/");
	if (idx < 0) {
		idx = remaining.indexOf("?");
	}
	if (idx < 0) {
		idx = remaining.indexOf("#");
	}
	if (idx > -1) {
		host = remaining.substr(0, idx);
		remaining = remaining.substr(idx);
	} else {
		host = remaining;
		remaining = null;
	}
	if (host.indexOf(":") > -1) {
		var tokens = host.split(":");
		host = tokens[0];
		port = tokens[1];
	}
	port = !port ? 80 : parseInt(port);
	return [host, port, remaining];
}

function parseFragment(remaining) {
	var fragment = "";
	if (!remaining) {
		return [fragment, remaining];
	}
	var idx = remaining.indexOf("#");
	if (idx > -1) {
		fragment = remaining.substr(idx+1);
		remaining = remaining.substr(0, idx);
	}
	return [fragment, remaining];
}

function constructQueryMap(queryStr) {
	if (queryStr.indexOf("=") < 0) {
		return null;
	}
	var queryMap = {};
	queryStr.split("&").forEach((query) => {
		var tokens = query.split("=");
		var key = tokens[0], val = tokens[1];
		if (!(key in queryMap)) {
			queryMap[key] = [];
		}
		queryMap[key].push(val);
	});
	return queryMap;
}

function parseQuery(remaining) {
	var query = null;
	if (!remaining) {
		return [query, remaining];
	}
	var idx = remaining.indexOf("?");
	if (idx > -1) {
		var queryStr = remaining.substr(idx+1);
		remaining = remaining.substr(0, idx);
		query = constructQueryMap(queryStr);
	}
	return [query, remaining];
}

function parsePath(remaining) {
	var path = [];
	if (!remaining) {
		return path;
	}
	var idx = remaining.indexOf("/");
	if (idx > -1) {
		var pathStr = remaining.substr(idx+1);
		pathStr.split("/").forEach(function(directory) {
			if (path.length > 0 && directory === "..") {
				path.pop();
			} else if (directory === ".") {
				return;
			} else if (directory) {
				path.push(directory);
			}
		});
	}
	return path;
}

function parse(uri) {
	var scheme, auth, host, port, 
		path, query, fragment, remaining;
	var arr = parseScheme(uri);

	scheme = arr[0];
	remaining = arr[1];

	arr = parseAuth(remaining);
	auth = arr[0];
	remaining = arr[1];

	arr = parseHostAndPort(remaining);
	host = arr[0];
	port = arr[1];
	remaining = arr[2];

	arr = parseFragment(remaining);
	fragment = arr[0];
	remaining = arr[1];

	arr = parseQuery(remaining);
	query = arr[0];
	remaining = arr[1];

	path = parsePath(remaining);
	var data = {
		scheme: scheme.toLowerCase(),
		host: host.toLowerCase(),
		auth: auth,
		port: port,
		path: path,
		query: query,
		fragment: fragment
	};
	console.log(uri);
	console.log(data);
	console.log();
	return data;
}

function sortObjectByKey(unordered) {
	var ordered = {};
	Object.keys(unordered).sort().forEach((key) =>{
	  ordered[key] = unordered[key];
	});
	return ordered;
}

function areObjectsEqual(query1, query2) {
	if (!query1) {
		return query1 === query2;
	}
	var orderedQuery1 = sortObjectByKey(query1);
	var orderedQuery2 = sortObjectByKey(query2);
	return JSON.stringify(orderedQuery1) === JSON.stringify(orderedQuery2);
}

function checkURIs(uri1, uri2) {
	var uriData1 = parse(unescape(uri1));
	var uriData2 = parse(unescape(uri2));
	if (uriData1.scheme !== uriData2.scheme) {
		return false;
	}
	if (uriData1.host !== uriData2.host) {
		return false;
	}
	if (uriData1.auth !== uriData2.auth) {
		return false;
	}
	if (uriData1.port !== uriData2.port) {
		return false;
	}
	if (JSON.stringify(uriData1.path) !== 
		JSON.stringify(uriData2.path)) {
		return false;
	}
	if (!areObjectsEqual(uriData1.query, uriData2.query)) {
		return false;
	}
	if (uriData1.fragment !== uriData2.fragment) {
		return false;
	}
	return true;

}

// test path
console.assert(checkURIs("http://abc.com/drill/further/../down/./foo.html", "http://abc.com/drill/down/foo.html"));
console.assert(checkURIs("http://abc.com/drill/further/../../down/././foo.html", "http://abc.com/down/foo.html"));

// test query
console.assert(checkURIs("http://abc.com/foo.html?a=1&b=2", "http://abc.com/foo.html?b=2&a=1"));
console.assert(!checkURIs("http://abc.com/foo.html?a=1&b=2&a=3", "http://abc.com/foo.html?a=3&a=1&b=2"));
console.assert(checkURIs("http://abc.com/foo.html?a=1&b=2&a=3", "http://abc.com/foo.html?a=1&a=3&b=2"));

// test HEX encoding
console.assert(checkURIs("http://abc.com:80/~smith/home.html", "http://ABC.com/%7Esmith/home.html"));

// test empty fragment/query
console.assert(checkURIs("http://uname:passwd@host.com/foo/bar.html", "http://uname:passwd@host.com/foo/bar.html#"));
console.assert(checkURIs("http://uname:passwd@host.com/foo/bar.html", "http://uname:passwd@host.com/foo/bar.html?"));
console.assert(checkURIs("http://uname:passwd@host.com/", "http://uname:passwd@host.com/?#"));

// test non-empty fragment and empty query
console.assert(checkURIs("http://uname:passwd@host.com#frag2", "http://uname:passwd@host.com/?#frag2"));

// test non-empty query and empty fragment
console.assert(checkURIs("http://uname:passwd@host.com?a=1#", "http://uname:passwd@host.com?a=1"));

// test wrong auth
console.assert(!checkURIs("http://uname:wrongpw@host.com", "http://uname:passwd@host.com"));

// test multiple features
console.assert(checkURIs("abc://username:password@example.com:123/path/data?key=value&key2=value2#fragid1", 
	"abc://username:password@example.com:123/path/down/../data?key2=value2&key=value#fragid1"));
