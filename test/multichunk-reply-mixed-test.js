#!/usr/bin/env node

/* 
 * Boris Multi Data Chunk Mixed Replies Test
 */

var log = console.log
    , assert = require( 'assert' )
    , util = require( 'util' )
    , Boris = require( '../' )
    , b = Boris()
    , status = new Buffer( "+OK\r\n" )
    , error = new Buffer( "-ERR wrong number of arguments for 'get' command\r\n" )
    , bulk = new Buffer( "$1\r\n1\r\n" )
    , integer = new Buffer( ":1\r\n" )
    , multibulk = new Buffer( "*3\r\n$3\r\nted\r\n$3\r\nbob\r\n$5\r\nalice\r\n" )
    , smultibulk = new Buffer( "*3\r\n$9\r\nsubscribe\r\n$8\r\nchannel1\r\n:1\r\n*3\r\n$9\r\nsubscribe\r\n$8\r\nchannel2\r\n:2\r\n*3\r\n$9\r\nsubscribe\r\n$8\r\nchannel3\r\n:3\r\n*3\r\n$9\r\nsubscribe\r\n$8\r\nchannel1\r\n:3\r\n" )
    , nmultibulk = new Buffer( "*2\r\n*4\r\n:1\r\n:1398634705\r\n:15137\r\n*4\r\n$6\r\nLRANGE\r\n$4\r\nlist\r\n$1\r\n0\r\n$5\r\n16000\r\n*4\r\n:0\r\n:1398634583\r\n:14186\r\n*4\r\n$6\r\nLRANGE\r\n$4\r\nlist\r\n$1\r\n0\r\n$5\r\n16000\r\n" )
    , mix = Buffer.concat( [ status, error, bulk, integer, multibulk, smultibulk, nmultibulk ] )
    , char = null
    , i = 0
    , result = []
    , tresult = null
    ;

b.on( 'end', function () {
} );

b.on( 'miss', function ( r, i ) {
} );

b.on( 'match', function ( e, d, convert ) {
    // push result
    result.push( convert( d ) );
} );

log( '- created mixed test string: .', util.inspect( mix + '', false, 0, true ) );

log( '- parse the entire string in a single chunk of data to get results. ' );
b.parse( mix );

// store result
tresult = Array.prototype.slice.call( result );

result = [];

log( '- now test multi-chunk reply, parsing string 1 char at a time: (%d chunks/bytes).', mix.length );


for ( ; i < mix.length; ) {
    char = new Buffer( [ mix[ i++ ] ] );
    b.parse( char );
};

log( '- %d bytes parsed, %d differents results were found.', mix.length, result.length );

log( '- result is:', util.inspect( tresult, false, Infinity, true ) );

log( '- deep check if parsed result are correct (%d items).', tresult.length );

assert.deepEqual( result, tresult );