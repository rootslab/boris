/*
 * RULE for STATUS ( + )
 */

exports.StatusRule = ( function () {
    var Rule = require('./rule').Rule
        , util = require( 'util' )
        , StatusRule = function ( char ) {
            var me = this
                , is = me instanceof StatusRule
                ;
            if ( ! is ) return new StatusRule( char );
            me.constructor.super_.apply( me, arguments );
            me.isStatus = true;
        }
        , sproto = null
        ;

    util.inherits( StatusRule, Rule );

    sproto = StatusRule.prototype;

    sproto.parse = function ( data, pos ) {
        var me = this
            , p = pos || 0
            , m = me.match( data, p )
            ;

        return ~ m ? [ me, false, data.slice( p + 1, m ), m + 2, data ] : null; 
    };

    return StatusRule;
} )();