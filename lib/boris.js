/*
 * Boris, a pure javascript parser for the Redis serialization protocol (RESP).
 *
 * Copyright(c) 2015 Guglielmo Ferri <44gatti@gmail.com>
 * MIT Licensed
 */

exports.version = require( '../package' ).version;
exports.Boris = ( function () {
    // Buffer concat, node >= 0.8
    var bconcat = Buffer.concat
        , util = require( 'util' )
        , emitter = require( 'events' ).EventEmitter
        , Bolgia = require( 'bolgia' )
        , Peela = require( 'peela' )
        // require parser rules
        , Rules = require( './rules/' ).Rules
        // build lookup table for rules chars
        , ltable = Rules.lookupTable( '*$+-:' )
        /*
         * An utility fn to convert a nested array 
         * with Buffer results to strings and numbers.
         */
        , reveal = Bolgia.reveal
        , clone = Bolgia.clone
        , improve = Bolgia.improve
        // emit Error event
        , emitError = function ( ccode ) {
            var me = this
                , format = util.format
                , fcc =  String.fromCharCode
                , msg = 'Boris parser error, current char: %s (code: %d), pos: %d.'
                , emsg = format( msg, fcc( ccode ), ccode, me.cpos )
                ;
            me.emit( 'error', emsg, me.cdata.slice( 0, me.cpos + 2 ) );
        }
        // get results
        , collectResult = function ( rule, error, data ) {
            var me = this
                , arr = null
                , peela = me.peela
                , head = peela.head()
                , slen = peela.size()
                , IaN = typeof data === 'number'
                , return_buffers = me.options.return_buffers
                /** /
                , debug = function ( op ) {
                    var msg = '\n- %s stack head (size %d):'
                        , stack = peela.stack
                        , inspect = util.inspect( stack, false, Infinity, true )
                        ;
                    log( msg, op, peela.size(), inspect );
                }
                /**/
                ;

            if ( rule.isMultiBulk && IaN ) {
                // some elements are expected
                arr = [];
                if ( slen ) {
                    head.list.push( arr );
                    --head.left;
                }
                peela.push( {
                    list : arr
                    , left : data
                } );
                // debug( 'new' );
                return;
            }
            // check data, "*0\r\n" returns [], "*-1\r\n" returns [ null ]
            if ( slen === 0 ) return me.emit( 'match', error, data && data.length ? return_buffers ? [ data ] : reveal( [ data ] ) : [], reveal );
            
            // add result to the head of stack
            head.list.push( data );
            // debug( 'update' );
            --head.left;
            // pop current stack head if done.
            while ( slen ) {
                head = peela.head();
                if ( head.left ) break;
                peela.pop();
                // debug( 'pop' );
                if ( --slen === 0 ) {
                    me.emit( 'match', false, return_buffers ? head.list : reveal( head.list ), reveal );
                    break;
                }
            }
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
                    // me.emit( 'miss', me.crule, me.cpos );
                    return true;
                }
                // buffer ends
                me.cdata = null;
                me.cpos = 0;
                // me.emit( 'end' );
                return;
            }
            me.mchk = true;
            // me.emit( 'miss', me.crule, me.cpos );
            return;
        }
        , boris_opt = {
            return_buffers : true
        }
        // Boris Parser
        , Boris = function ( opt ) {
            var me = this
                , is = me instanceof Boris
                ;
            if ( ! is ) return new Boris( opt );
            me.options = improve( clone( opt ), boris_opt );
            me.cdata = null;
            me.cpos = 0;
            me.crule = null;
            me.mchk = false;
            /* 
             * init stack to collect multibulk
             * and nested multibulk replies
             */
            me.peela = Peela();
            /*
             * init lookup table for parser rules,
             * using the result of charCodeAt( 0 ).
             */
            me.rules = {};
            me.rules[ 36 ] = Rules.bulk( '$' );
            me.rules[ 42 ] = Rules.mbulk( '*' );
            me.rules[ 43 ] = Rules.status( '+' );
            me.rules[ 45 ] = Rules.basic( '-' );
            me.rules[ 58 ] = Rules.basic( ':' );
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
        me.peela.flush();
        for ( r in rules ) rules[ r ].reset();
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
                if ( scanData( me ) ) continue;
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
                if ( scanData( me ) ) continue;
                break;
            }
            emitError.call( me, ccode );
            me.reset();
            break;
        }
    };

    return Boris;
} )();