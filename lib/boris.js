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
        // stack to collect multibulk and nested multibulk replies
        , stack = Peela()
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
                }
                stack.push( {
                    list : arr
                    , left : data
                } );
                return;
            }
            if ( slen === 0 ) {
                me.emit( 'match', error, [ data ] );
                return;
            }
            // add result to the head of stack
            head.list.push( data );
            --head.left;
            // pop current stack head if done.
            while ( slen ) {
                head = stack.head();
                if ( head.left ) { break; }
                stack.pop();
                if ( --slen === 0 ) {
                    me.emit( 'match', false, head.list );
                    break;
                }
            };
        }
        , scanData = function ( me ) {
            var rpos = 0
                , i = null
                , result = me.crule.parse( me.cdata, me.cpos )
                ;
            if ( result ) {
                me.mchk = false;
                collectResult.apply( me, result );
                // get result index, then update position
                i = result[ 3 ];
                rpos = ( i < me.cdata.length ) ? i : -1;
                if ( ~ rpos ) {
                    me.cpos = rpos;
                    me.emit( 'miss', me.crule, me.cpos );
                    return true;
                }
                // buffer ends
                me.cdata = null;
                me.cpos = 0;
                me.emit( 'end' );
                return;
            }
            me.mchk = true;
            me.emit( 'miss', me.crule, me.cpos );
            return;
        }
        , emitError = function ( ccode ) {
            var me = this
                , format = util.format
                , fcc =  String.fromCharCode
                , msg = 'parse error, current char: %s (code: %d), pos: %d.'
                , emsg = format( emsg, fcc( ccode ), ccode, me.cpos )
                ;
            me.emit( 'error', emsg, me.cdata.slice( 0, me.cpos + 2 ) );
        }
        , Boris = function () {
            var me = this
                ;
            if ( ! ( me instanceof Boris ) ) {
                return new Boris();
            }
            // init rules, with charCodeAt( 0 )
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
        me.stack.flush();
        for ( r in rules ) {
            rules[ r ].reset();
        };
    };

    bproto.parse = function ( data ) {
        var me = this
            , ccode = null
            , val = null
            ;

        while ( true ) {
            if ( me.mchk ) {
                /*
                * multi chunk reply, a parser rule needs further data,
                * join current data buffer with the received one. 
                */
                me.cdata = bconcat( [ me.cdata, data ], me.cdata.length + data.length );
                if ( scanData( me ) ) { continue; }
                break;
            }
            /*
             * set current data, get current char code, then
             * check data if there is a rule that matches the
             * first char.
             */
            me.cdata = me.cdata || data;
            ccode = me.cdata[ me.cpos ];
            val = ltable[ ccode ];
            if ( val ) {
                me.crule = me.rules[ val ];
                if ( scanData( me ) ) { continue; }
                break;
            }
            emitError.call( me, ccode );
            me.reset();
            break;
        };
    };

    return Boris;
} )();