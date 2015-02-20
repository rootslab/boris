###Boris

[![NPM VERSION](http://img.shields.io/npm/v/boris.svg?style=flat)](https://www.npmjs.org/package/boris)
[![CODACY BADGE](https://img.shields.io/codacy/b18ed7d95b0a4707a0ff7b88b30d3def.svg?style=flat)](https://www.codacy.com/public/44gatti/boris)
[![CODECLIMATE](http://img.shields.io/codeclimate/github/rootslab/boris.svg?style=flat)](https://codeclimate.com/github/rootslab/boris)
[![CODECLIMATE-TEST-COVERAGE](https://img.shields.io/codeclimate/coverage/github/rootslab/boris.svg?style=flat)](https://codeclimate.com/github/rootslab/boris)
[![LICENSE](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](https://github.com/rootslab/boris#mit-license)

[![TRAVIS CI BUILD](http://img.shields.io/travis/rootslab/boris.svg?style=flat)](http://travis-ci.org/rootslab/boris)
[![BUILD STATUS](http://img.shields.io/david/rootslab/boris.svg?style=flat)](https://david-dm.org/rootslab/boris)
[![DEVDEPENDENCY STATUS](http://img.shields.io/david/dev/rootslab/boris.svg?style=flat)](https://david-dm.org/rootslab/boris#info=devDependencies)
[![NPM DOWNLOADS](http://img.shields.io/npm/dm/boris.svg?style=flat)](http://npm-stat.com/charts.html?package=boris)

[![NPM GRAPH1](https://nodei.co/npm-dl/boris.png)](https://nodei.co/npm/boris/)

[![NPM GRAPH2](https://nodei.co/npm/boris.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/boris/)

[![status](https://sourcegraph.com/api/repos/github.com/rootslab/boris/.badges/status.png)](https://sourcegraph.com/github.com/rootslab/boris)
[![views](https://sourcegraph.com/api/repos/github.com/rootslab/boris/.counters/views.png)](https://sourcegraph.com/github.com/rootslab/boris)
[![views 24h](https://sourcegraph.com/api/repos/github.com/rootslab/boris/.counters/views-24h.png)](https://sourcegraph.com/github.com/rootslab/boris)

> _**Boris**_, a pure javascript parser for the Redis serialization protocol __[RESP](http://redis.io/topics/protocol)__.

> __Boris__ is able to parse all kinds of __Redis__ replies, also __deeply nested multi-bulk__ replies.

###Install

```bash
$ npm install boris [-g]
// clone repo
$ git clone git@github.com:rootslab/boris.git
```
> __require__ 

```javascript
var Boris = require( 'boris' );
```
> See [examples](example/).

###Run Tests

```bash
$ cd boris/
$ npm test
```
###Constructor

> Create an instance.

```javascript
var b = Boris()
// or
var b = new Boris()
```
####Options

> Default options are listed.

```javascript
opt = {
    /*
     * For default, the parser returns Buffers,
     */
    return_buffers : true
}
```

###Properties

> __WARNING__: Don't mess with these properties.

```javascript
/*
 * Protocol rules: bulk, multibulk, status, integer, error.
 */
Boris.rules : Object

/*
 * Current rule in execution.
 */
Boris.crule : Rule

/*
 * Current parser data.
 */
Boris.cdata : Buffer

/*
 * Boolean to signal that data is fragmented,
 * then another chunk is expected.
 */
Boris.mchk : Boolean

/*
 * Current parser position in the data.
 */
Boris.cpos : Number

/*
 * Current parser stack for multibulk replies.
 */
Boris.peela : Peela
```

###Methods

> Arguments within [ ] are optional.

```javascript
/*
 * parse a chunk of data.
 */
Boris#parse( Buffer data ) : undefined

/*
 * reset parser state.
 */
Boris#reset() : undefined

```

###Events

```javascript
/*
 * The current executing rule has found a result.
 * The convert function argument is an utility that
 * scans an array and turns all Buffers into Strings.
 *
 * NOTE: the boolean 'isError' signals a Redis error reply,
 * not a runtime Error.
 */
Boris.on( 'match', function ( Boolean isError, Array result, Function convert ) { .. } )

/*
 * A parse error occurred, the parser wasn't able to recognize
 * the current control char.
 *
 * NOTE: on error, parser state ( stack, rules ) will be reset.
 */
Boris.on( 'error', function ( String emsg, Buffer data ) { .. } )

/*
 * NOTE: events below are disabled for perfomance reasons.
 * If you need them, decomment statements in the code.
 */

/*
 * the current executing rule needs further data to continue.
 */
Boris.on( 'miss', function ( Rule rule, Number position ) { .. } )

/*
 * Data was totally parsed.
 */
Boris.on( 'end', function () { .. } )

``` 

------------------------------------------------------------------------


### MIT License

> Copyright (c) 2015 &lt; Guglielmo Ferri : 44gatti@gmail.com &gt;

> Permission is hereby granted, free of charge, to any person obtaining
> a copy of this software and associated documentation files (the
> 'Software'), to deal in the Software without restriction, including
> without limitation the rights to use, copy, modify, merge, publish,
> distribute, sublicense, and/or sell copies of the Software, and to
> permit persons to whom the Software is furnished to do so, subject to
> the following conditions:

> __The above copyright notice and this permission notice shall be
> included in all copies or substantial portions of the Software.__

> THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
> EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
> MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
> IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
> CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
> TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
> SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[![GA](https://ga-beacon.appspot.com/UA-53998692-1/boris/Readme?pixel)](https://github.com/igrigorik/ga-beacon)