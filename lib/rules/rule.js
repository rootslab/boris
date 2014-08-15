/*
 *  GENERIC RULE 
 */

exports.Rule = ( function () {
    var emitter = require('events').EventEmitter
        , util = require( 'util' )
        , Abaco = require( 'abaco' )
        , max = Math.max
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

    // match CR(LF)
    rproto.match = function ( buff, spos ) {
        var me = this
            , ctable = me.ctable
            , blen = buff.length
            , i = spos || 0
            ;
        // check for '\r' char presence ( 0x0d ).
        for ( ; i < blen; ++i ) if ( ctable[ buff[ i ] ] ) return i;
        return -1;
    };

    rproto.parseInt = Abaco.parseInt;

    rproto.reset = function () {
    };

    return Rule;
} )();