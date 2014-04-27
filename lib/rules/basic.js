/*
 * BASIC RULE for ERROR and INTEGER REPLIES ( - , : )
 */

exports.BasicRule = ( function () {
    var Rule = require('./rule').Rule
        , util = require( 'util' )
        , BasicRule = function ( char ) {
            var me = this;
            if ( ! ( me instanceof BasicRule ) ) {
                return new BasicRule( char );
            }
            me.constructor.super_.apply( me, arguments );
            me.isBasic = true;
        }
        , bproto = null
        ;

    util.inherits( BasicRule, Rule );

    bproto = BasicRule.prototype;

    bproto.parse = function ( data, pos ) {
        var me = this
            , p = pos || 0
            , m = me.match( data, p )
            // is an error reply?
            , e = me.ccode === 0x2d
            ;

        if ( ! ~m ) {
            return null;
        }
        return [ me, e, data.slice( p + 1, m ), m + 2, data ];
    };

    return BasicRule;
} )();
