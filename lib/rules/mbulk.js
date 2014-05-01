/*
 * RULE for MULTIBULK REPLY ( * )
 */

exports.MultiBulkRule = ( function () {
    var Rule = require('./rule').Rule
        , util = require( 'util' )
        , MultiBulkRule = function ( char ) {
            var me = this;
            if ( ! ( me instanceof MultiBulkRule ) ) {
                return new MultiBulkRule( char );
            }
            me.constructor.super_.apply( me, arguments );
            me.count = 0;
            me.isMultiBulk = true;
        }
        , mproto = null
        ;

    util.inherits( MultiBulkRule, Rule );

    mproto = MultiBulkRule.prototype;

    mproto.reset = function () {
        var me = this;
        me.count = 0;
    };

    mproto.parse = function ( data, pos ) {
        var me = this
            , p = pos || 0
            , m = me.match( data, p )
            , count = null
            ;

        if ( ! ~m ) {
            return null;
        }
        /*
         * Get the expected number of bulk replies.
         * Reply could be *0 or *-1
         */
        me.count = count = me.parseInt( data, 10, p + 1, m );

        if ( count === -1 ) {
            // *-1 -> null, the list is null
            return [ me, false, null, m + 2, data ];
        }
        if ( count === 0 ) {
            // *0 -> [], the list is empty
            return [ me, false, [], m + 2, data ];
        }
        // return bulks count
        return [ me, false, me.count, m + 2, data ];
    };

    return MultiBulkRule;
} )();
