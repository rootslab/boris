/*
 * Boris, a Redis Protocol Parser.
 *
 * Copyright(c) 2014 Guglielmo Ferri <44gatti@gmail.com>
 * MIT Licensed
 */

exports.version = require( '../package' ).version;
exports.Boris = ( function () {
    var log = console.log
        // Buffer concat, node >= 0.8
        , bconcat = Buffer.concat
        , util = require( 'util' )
        , emitter = require( 'events' ).EventEmitter
        , Peela = require( 'peela' )
        // require parser rules
        , Rules = require( './rules/' ).Rules
        // build lookup table for rules chars
        , ltable = Rules.lookupTable( '*$+-:' )
        // stack for multibulk replies
        , stack = Peela()
        // result list
        , result = null
        // get results
        , collectResult = function ( rule, error, data, index, stripe ) {
            var me = this
                , arr = null
                , head = stack.head()
                , slen = stack.size()
                , IaN = typeof data === 'number'
                ;
            if ( rule.isMultiBulk && IaN ) {
                // some elements are expected
                arr = [];
                if ( slen ) {
                    head.list.push( arr );
                    --head.left;
                } else {
                    result = arr;
                }
                stack.push( {
                    list : arr
                    , left : data
                } );
                return;
            }
            if ( slen === 0 ) {
                me.emit( 'match', rule, error, data );
                return;
            }
            // add result to the head of stack
            head.list.push( data );
            --head.left;
            // pop current stack head if done.
            while ( slen ) {
                if ( stack.head().left === 0 ) {
                    stack.pop();
                    if ( --slen === 0 ) {
                        me.emit( 'match', rule, false, result );
                        result = null;
                        break;
                    }
                    continue;
                }
                break;
            };
        }
        , parseResult = function ( me ) {
            var tpos = 0
                , result = me.crule.parse( me.cdata, me.cpos )
                , i = null
                ;
            if ( result ) {
                me.mchk = false;
                collectResult.apply( me, result );
                // get result index and update position
                i = result[ 3 ];
                tpos = ( i < me.cdata.length ) ? i : -1;
                if ( ~ tpos ) {
                    me.cpos = tpos;
                    return true;
                }
                // buffer ends
                me.cdata = null;
                me.cpos = 0;
                return;
            }
            me.mchk = true;
            return;
        }
        , Boris = function () {
            var me = this
                ;
            if ( ! ( me instanceof Boris ) ) {
                return new Boris();
            }
            // rules, with charCodeAt( 0 )
            me.rules = {};
            me.rules[ 36 ] = Rules.bulk( '$' );
            me.rules[ 42 ] = Rules.mbulk( '*' );
            me.rules[ 43 ] = Rules.status( '+' );
            me.rules[ 45 ] = Rules.basic( '-' );
            me.rules[ 58 ] = Rules.basic( ':' );
            me.crule = null;
            me.cdata = null;
            me.mchk = false;
            me.cpos = 0;
        }
        , bproto = null
        ;

    util.inherits( Boris, emitter );

    bproto = Boris.prototype;

    bproto.reset = function () {
        var me = this
            , rules = me.rules
            , r = null
            ;
        me.crule = me.cdata = null;
        me.mchk = false;
        me.cpos = 0;
        for ( r in rules ) {
            rules[ r ].reset();
        };
    };

    // parse method uses an iterative approach for every chunks received
    bproto.parse = function ( data ) {
        var me = this
            , ccode = null
            , val = null
            , emsg = null
            ;
        while ( true ) {
            if ( me.mchk ) {
                /*
                * multi chunk reply, a parser rule needs further data,
                * join current data buffer with the received one. 
                */
                me.cdata = bconcat( [ me.cdata, data ], me.cdata.length + data.length );
                if ( parseResult( me ) ) continue;
                me.emit( 'miss', me.crule );
                break;
            }
            me.cdata = me.cdata || data;
            ccode = me.cdata[ me.cpos ];
            // check if there's a rule that matches first char
            val = ltable[ ccode ];
            if ( val ) {
                me.crule = me.rules[ val ];
                if ( parseResult( me ) ) continue;
                me.emit( 'miss', me.crule );
                break;
            }
            // return an error and reset parser
            emsg = 'parse error, current char: %s (code: %d), pos: %d';
            emsg = util.format( emsg, String.fromCharCode( ccode ), ccode, me.cpos );
            me.emit( 'error', emsg, me.cdata.slice( 0, me.cpos + 2 ) + '' );
            me.reset();
            break;
        };
    };

    return Boris;
} )();