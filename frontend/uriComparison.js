'use strict';

const SCHEME_SEPARATOR = '://';
const AUTH_SEPARATOR = '@';
const PATH_SEPARATOR = '/';
const QUERY_SEPARATOR = '?';
const PORT_SEPARATOR = ':';
const QUERY_AND = '&';
const QUERY_EQUAL = '=';
const FRAGMENT_SEPARATOR = '#';
const PREV_DIR = '..';
const CURR_DIR = '.';

function parseScheme(uri) {
  let scheme = null;
  if (!uri) {
    return [scheme, uri];
  }
  const tokens = uri.split(SCHEME_SEPARATOR);
  scheme = tokens[0];
  const remaining = tokens[1];
  return [scheme, remaining];
}

function parseAuth(remaining) {
  let auth = null;
  if (!remaining) {
    return [auth, remaining];
  }
  const idx = remaining.indexOf(AUTH_SEPARATOR);
  if (idx !== -1) {
    auth = remaining.substr(0, idx);
    remaining = remaining.substr(idx + 1);
  }
  return [auth, remaining];
}

function parseHostAndPort(remaining) {
  let host = null;
  let port = null;
  let idx;
  if (!remaining) {
    return [host, port, remaining];
  }
  idx = remaining.indexOf(PATH_SEPARATOR);
  if (idx === -1) {
    idx = remaining.indexOf(QUERY_SEPARATOR);
  }
  if (idx === -1) {
    idx = remaining.indexOf(FRAGMENT_SEPARATOR);
  }
  if (idx !== -1) {
    host = remaining.substr(0, idx);
    remaining = remaining.substr(idx);
  } else {
    host = remaining;
    remaining = null;
  }
  if (host.indexOf(PORT_SEPARATOR) > -1) {
    const tokens = host.split(PORT_SEPARATOR);
    host = tokens[0];
    port = tokens[1];
  }
  port = !port ? 80 : parseInt(port);
  return [host, port, remaining];
}

function parseFragment(remaining) {
  let fragment = '';
  if (!remaining) {
    return [fragment, remaining];
  }
  const idx = remaining.indexOf(FRAGMENT_SEPARATOR);
  if (idx !== -1) {
    fragment = remaining.substr(idx + 1);
    remaining = remaining.substr(0, idx);
  }
  return [fragment, remaining];
}

function constructQueryMap(queryStr) {
  const queryMap = {};
  if (queryStr.indexOf(QUERY_EQUAL) < 0) {
    return null;
  }
  queryStr.split(QUERY_AND).forEach((query) => {
    const tokens = query.split(QUERY_EQUAL);
    const key = tokens[0];
    const val = tokens[1];
    if (!(key in queryMap)) {
      queryMap[key] = [];
    }
    queryMap[key].push(val);
  });
  return queryMap;
}

function parseQuery(remaining) {
  let query = null;
  if (!remaining) {
    return [query, remaining];
  }
  const idx = remaining.indexOf(QUERY_SEPARATOR);
  if (idx !== -1) {
    const queryStr = remaining.substr(idx + 1);
    remaining = remaining.substr(0, idx);
    query = constructQueryMap(queryStr);
  }
  return [query, remaining];
}

function parsePath(remaining) {
  const path = [];
  if (!remaining) {
    return path;
  }
  const idx = remaining.indexOf(PATH_SEPARATOR);
  if (idx !== -1) {
    const pathStr = remaining.substr(idx + 1);
    pathStr.split(PATH_SEPARATOR).forEach((directory) => {
      if (path.length > 0 && directory === PREV_DIR) {
        path.pop();
      } else if (directory === CURR_DIR) {
        return;
      } else if (directory) {
        path.push(directory);
      }
    });
  }
  return path;
}

function parse(uri) {
  // Parse scheme, auth, host and port starting from the left
  let arr = parseScheme(unescape(uri));
  let remaining;

  const scheme = arr[0];
  remaining = arr[1];

  arr = parseAuth(remaining);
  const auth = arr[0];
  remaining = arr[1];

  arr = parseHostAndPort(remaining);
  const host = arr[0];
  const port = arr[1];
  remaining = arr[2];
  // Parse fragment, query and path starting from the right
  arr = parseFragment(remaining);
  const fragment = arr[0];
  remaining = arr[1];

  arr = parseQuery(remaining);
  const query = arr[0];
  remaining = arr[1];

  const path = parsePath(remaining);
  const data = {
    scheme: scheme.toLowerCase(),
    host: host.toLowerCase(),
    auth,
    port,
    path,
    query,
    fragment,
  };
  console.log(uri);
  console.log(data);
  return data;
}

function sortObjectByKey(unordered) {
  const ordered = { };
  Object.keys(unordered).sort().forEach((key) => {
    ordered[key] = unordered[key];
  });
  return ordered;
}

function areObjectsEqual(query1, query2) {
  if (!query1) {
    return query1 === query2;
  }
  const orderedQuery1 = sortObjectByKey(query1);
  const orderedQuery2 = sortObjectByKey(query2);
  return JSON.stringify(orderedQuery1) === JSON.stringify(orderedQuery2);
}

function checkURIs(uri1, uri2) {
  console.log(Array(50).join('-'));
  const uriData1 = parse(uri1);
  console.log();
  const uriData2 = parse(uri2);
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
  if (JSON.stringify(uriData1.path) !== JSON.stringify(uriData2.path)) {
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
console.assert(checkURIs('http://abc.com/drill/further/../down/./foo.html', 'http://abc.com/drill/down/foo.html'));
console.assert(checkURIs('http://abc.com/drill/further/../../down/././foo.html', 'http://abc.com/down/foo.html'));

// test query
console.assert(checkURIs('http://abc.com/foo.html?a=1&b=2', 'http://abc.com/foo.html?b=2&a=1'));
console.assert(!checkURIs('http://abc.com/foo.html?a=1&b=2&a=3', 'http://abc.com/foo.html?a=3&a=1&b=2'));
console.assert(checkURIs('http://abc.com/foo.html?a=1&b=2&a=3', 'http://abc.com/foo.html?a=1&a=3&b=2'));

// test HEX encoding
console.assert(checkURIs('http://abc.com:80/~smith/home.html', 'http://ABC.com/%7Esmith/home.html'));
console.assert(checkURIs('http://www.abc.com/down/further/data?a=1&b=2#frag1', 
  'http%3A%2F%2Fwww.abc.com%2Fdown%2Ffurther%2Fdata%3Fa%3D1%26b%3D2%23frag1'));

// test empty fragment/query
console.assert(checkURIs('http://uname:passwd@host.com/foo/bar.html', 'http://uname:passwd@host.com/foo/bar.html#'));
console.assert(checkURIs('http://uname:passwd@host.com/foo/bar.html', 'http://uname:passwd@host.com/foo/bar.html?'));
console.assert(checkURIs('http://uname:passwd@host.com/', 'http://uname:passwd@host.com/?#'));

// test non-empty fragment and empty query
console.assert(checkURIs('http://uname:passwd@host.com#frag2', 'http://uname:passwd@host.com/?#frag2'));

// test non-empty query and empty fragment
console.assert(checkURIs('http://uname:passwd@host.com?a=1#', 'http://uname:passwd@host.com?a=1'));

// test wrong auth
console.assert(!checkURIs('http://uname:wrongpw@host.com', 'http://uname:passwd@host.com'));

// test all features
console.assert(checkURIs('abc://username:password@example.com:123/path/data?key=value&key2=value2#fragid1',
  'abc://username:password@example.com:123/path/down/../data?key2=value2&key=value#fragid1'));
