/*
 * RULE for BULK REPLY ( $ )
 */

exports.BulkRule = ( function () {
    var Rule = require('./rule').Rule
        , util = require( 'util' )
        , BulkRule = function ( char ) {
            var me = this
                , is = me instanceof BulkRule
                ;
            if ( ! is ) return new BulkRule( char );
            me.constructor.super_.apply( me, arguments );
            // value length
            me.vlen = 0;
            me.cpos = 0;
            me.isBulk = true;
        }
        , bproto = null
        ;

    util.inherits( BulkRule, Rule );

    bproto = BulkRule.prototype;

    bproto.reset = function () {
        var me = this;
        me.vlen = me.cpos = 0;
    };

    bproto.parse = function ( data, pos ) {
        var me = this
            , dlen = data.length
            , p = pos || 0
            , curry = 0
            , m = 0
            , v = 0
            , d = null
            , cpos = 0
            ;

        if ( me.vlen ) {
            curry = dlen - ( me.cpos + 2 );
            // check if bulk data are partial
            if ( curry < me.vlen ) return null;
            cpos = me.cpos;
            v = cpos + me.vlen;
            d = data.slice( cpos, v );
            me.reset();

            return [ me, false, d, v + 2, data ];
        }

        // match CRLF to obtain value length
        m = me.match( data, p );

        if ( ! ~ m ) return null;

        me.cpos = m + 2;
        me.vlen = me.parseInt( data, 10, p + 1, m );

        if ( me.vlen >= 0 ) {
             /*
             * If vlen = 0 then reply is : $0\r\n\r\n.
             * It represents an empty string '', as for 
             * requirepassword field from config.get( '*' );
             * data should contain double CRLF, curry is 2
             * units longer.
             */
            curry = dlen - ( me.cpos + ( me.vlen ? 2 : 0 ) );

            // check if bulk data are partial
            if ( curry < me.vlen ) return null;
            cpos = me.cpos;
            v = cpos + me.vlen;
            d = data.slice( cpos, v );
            me.reset();

            return [ me, false, d, v + 2, data ];
        }
        /*
         * reply is like $-1\r\n. -1 represents null.
         *
         * Example: *1\r\n$-1\r\n is [ null ]
         */
        v = me.vlen;
        d = v ? null : '';
        m += v ? 2 : 4;
        me.reset();

        return [ me, false, d, m, data ];
    };

    return BulkRule;
} )();