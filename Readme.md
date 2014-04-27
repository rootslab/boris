###Boris
[![build status](https://secure.travis-ci.org/rootslab/boris.png?branch=master)](http://travis-ci.org/rootslab/boris) 
[![NPM version](https://badge.fury.io/js/boris.png)](http://badge.fury.io/js/boris)

[![NPM](https://nodei.co/npm/boris.png?downloads=true&stars=true)](https://nodei.co/npm/boris/)

[![NPM](https://nodei.co/npm-dl/boris.png)](https://nodei.co/npm/boris/)

> _Boris_, a Redis Protocol Parser.

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

###Private Properties

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
 * the current executing rule has found a result.
 */
Boris.on( 'match', function ( Boolean error, Buffer || Array result ) { .. } )

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

> Copyright (c) 2014 &lt; Guglielmo Ferri : 44gatti@gmail.com &gt;

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
> SOFTWARE OR THE USE OR OTHER DEALINGS IN T