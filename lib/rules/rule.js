/*
 *  GENERIC RULE 
 */

exports.Rule = ( function () {
    var emitter = require('events').EventEmitter
        , util = require( 'util' )
        , Abaco = require( 'abaco' )
        // match CRLF value
        , crlf = new Buffer( '\r\n' ).readUInt16BE( 0 )
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

    rproto.match = function ( buff, offset ) {
        var b = buff
            , blen = b.length
            , l = blen ? blen - 1 : 0
            , o = offset || 0
            ;
        for ( ; o < l; ++o )
            if ( ! ( crlf ^ ( b[ o ] << 8 | b[ o + 1 ] ) ) ) return o;
        return -1;
    };

    rproto.parseInt = Abaco.parseInt;

    rproto.reset = function () {
    };

    return Rule;
} )();