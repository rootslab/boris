/*
 *  GENERIC RULE 
 */

exports.Rule = ( function () {
    var emitter = require('events').EventEmitter
        , util = require( 'util' )
        , Abaco = require( 'abaco' )
 
        , Rule = function ( char ) {
            var me = this;
            if ( ! ( me instanceof Rule ) ) {
                return new Rule( char );
            }
            me.cid = char ? char : '';
            me.ccode = me.cid.charCodeAt( 0 );
        }
        , rproto = null
        ;

    util.inherits( Rule, emitter );

    rproto = Rule.prototype;

    rproto.parse = function () {
    };

    // match CRLF
    rproto.match = function ( buff, spos ) {
        var me = this
            , b = buff
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
        for ( ; i < len; ++i ) {
            if ( ( b[ i ] === 0x0d ) &&
                 ( b[ i + 1 ] === 0x0a ) ) {
                return i;
            }
        };
        return -1;
    };

    rproto.parseInt = Abaco.parseInt;

    rproto.reset = function () {
    };

    return Rule;
} )();