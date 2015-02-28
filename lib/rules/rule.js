/*
 *  GENERIC RULE 
 */

exports.Rule = ( function () {
    var emitter = require('events').EventEmitter
        , util = require( 'util' )
        , Abaco = require( 'abaco' )
        // match CRLF value
        , crlf = new Buffer( '\r\n' ).readUInt16BE()
        , Rule = function ( char ) {
            var me = this
                , is =  me instanceof Rule
                , ctable = null
                ;
            if ( ! is ) return new Rule( char );
            ctable = new Buffer( 255 );
            ctable.fill( 0 );
            ctable[ 0x0d ] = 1;
            me.cid = char ? char : '';
            me.ccode = me.cid.charCodeAt( 0 );
            me.ctable = ctable;
        }
        , rproto = null
        ;

    util.inherits( Rule, emitter );

    rproto = Rule.prototype;

    rproto.parse = function () {
    };

    // match CRLF
    rproto.match = function ( buff, spos ) {
        var b = buff
            , len = Math.max( 0, b.length - 1 )
            , i = spos || 0
            ;
        /* 
         * Complexity is O(K) for any K-length input
         * it is the best method when input is dense of crlf 
         * sequences; for sparse inputs it could be switched
         * to an algorithm like quicksearch; in this way,
         * it could gain a ~2x boost in matching performance.
         */
        for ( ; i < len; ++i )
            if ( ( b[ i ] === 0x0d ) && ( b[ i + 1 ] === 0x0a ) )
                return i;
        return -1;
    };

    rproto.parseInt = Abaco.parseInt;

    rproto.reset = function () {
    };

    return Rule;
} )();