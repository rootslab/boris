/* 
 * Boris Example
 *
 *   - Simple Strings "+"
 *   - Errors "-"
 *   - Integers ":"
 *   - Bulk Strings "$"
 *   - Arrays "*"
 *
 *  - produce some real replies to parse, using Spade client:
 *
 *    var s = require( './' )( { debug : { level : 0 } } ).connect();
 *
 *    s.set('a',1)        "+OK\r\n"
 *    s.get('a',1)        "-ERR wrong number of arguments for 'get' command\r\n"
 *    s.get('a')          "$1\r\n1\r\n"
 *    s.lpush('l', 1)     ":1\r\n"
 *
 *    s.lpush('list', ['alice','bob','ted'])  ":3\r\n"
 *
 *    s.lrange('list', 0, 4)      "*3\r\n$3\r\nted\r\n$3\r\nbob\r\n$5\r\nalice\r\n"
 *
 *    var fn = function(k) { var i = 0; for ( ; i < 16 * 1024; ++i ) { s.lpush('list', i ); } }
 *
 *    s.lrange( 'list', 0, 16000 );
 *    s.lrange( 'list', 0, 16000 );
 *
 *    s.slowlog.get(0);   "*2\r\n*4\r\n:1\r\n:1398634705\r\n:15137\r\n*4\r\n$6\r\nLRANGE\r\n$4\r\nlist\r\n$1\r\n0\r\n$5\r\n16000\r\n*4\r\n:0\r\n:1398634583\r\n:14186\r\n*4\r\n$6\r\nLRANGE\r\n$4\r\nlist\r\n$1\r\n0\r\n$5\r\n16000\r\n"
 *
 * - other strings:
 *
 *    "*3\r\n$9\r\nsubscribe\r\n$8\r\nchannel1\r\n:1\r\n*3\r\n$9\r\nsubscribe\r\n$8\r\nchannel2\r\n:2\r\n*3\r\n$9\r\nsubscribe\r\n$8\r\nchannel3\r\n:3\r\n*3\r\n$9\r\nsubscribe\r\n$8\r\nchannel1\r\n:3\r\n"
 *	  "*4\r\n$8\r\npmessage\r\n$9\r\n*-channel\r\n$12\r\nfake-channel\r\n$12\r\nHello Fakes!\r\n"
 */

var log = console.log
    , util = require( 'util' )
    , Boris = require( '../' )
    , b = Boris()
    , status = new Buffer( "+OK\r\n" )
    , error = new Buffer( "-ERR wrong number of arguments for 'get' command\r\n" )
    , bulk = new Buffer( "$1\r\n1\r\n" )
    , integer = new Buffer( ":1\r\n" )
    , multibulk = new Buffer( "*3\r\n$3\r\nted\r\n$3\r\nbob\r\n$5\r\nalice\r\n" )
    , nmultibulk1 = new Buffer( "*2\r\n*4\r\n:1\r\n:1398634705\r\n:15137\r\n*4\r\n$6\r\nLRANGE\r\n$4\r\nlist\r\n$1\r\n0\r\n$5\r\n16000\r\n*4\r\n:0\r\n:1398634583\r\n:14186\r\n*4\r\n$6\r\nLRANGE\r\n$4\r\nlist\r\n$1\r\n0\r\n$5\r\n16000\r\n" )
    , nmultibulk2 = new Buffer( "*3\r\n$9\r\nsubscribe\r\n$8\r\nchannel1\r\n:1\r\n*3\r\n$9\r\nsubscribe\r\n$8\r\nchannel2\r\n:2\r\n*3\r\n$9\r\nsubscribe\r\n$8\r\nchannel3\r\n:3\r\n*3\r\n$9\r\nsubscribe\r\n$8\r\nchannel1\r\n:3\r\n" );
    ;

b.on( 'end', function () {
    log( '- ok, buffer ends' );
} );

b.on( 'miss', function ( r, i ) {
    log( '- "%s" rule needs data, index: "%s"', r.cid, i );
} );

b.on( 'match', function ( e, d ) {
    if ( e ) {
        log( '- data match (Redis error): "%s"', d );
        return;
    }
    log( '- data match: "%s"', d );
} );

log( '\n- run all parser rules using a single chunk of data.' );

b.parse( status );
b.parse( error );
b.parse( bulk );
b.parse( integer );
b.parse( multibulk );
b.parse( nmultibulk1 );
b.parse( nmultibulk2 );

log( '\n- run some parser rules using multiple chunks of data.' );

b.parse( status.slice( 0, 3 ) );
b.parse( Buffer.concat( [ status.slice( 3 ), error.slice( 0, 13 ) ] )  );
b.parse( error.slice( 13 ) );

b.parse( nmultibulk1.slice( 0, 13 ) );
b.parse( nmultibulk1.slice( 13 ) );
