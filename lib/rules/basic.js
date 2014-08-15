/*
 * BASIC RULE for ERROR and INTEGER REPLIES ( - , : )
 */

exports.BasicRule = ( function () {
    var Rule = require('./rule').Rule
        , util = require( 'util' )
        , BasicRule = function ( char ) {
            var me = this
                , is = me instanceof BasicRule
                ;
            if ( ! is ) return new BasicRule( char );
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
            ;
        // check if it is an error reply
        return ~ m ? [ me, me.ccode === 0x2d, data.slice( p + 1, m ), m + 2, data ] : null;
    };

    return BasicRule;
} )();
