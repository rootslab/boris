exports.Rules = {
    'basic' : require( './basic' ).BasicRule
    , 'status' : require( './status' ).StatusRule
    , 'bulk' : require( './bulk' ).BulkRule
    , 'mbulk' : require( './mbulk' ).MultiBulkRule
    // buffer lookup table for chars
    , 'lookupTable' : function ( chars ) {
            var i = 0
                , p = new Buffer( chars )
                , b = new Buffer( 255 )
                , l = p.length
                , c = p[ 0 ]
                ;
            for ( ; i ^ 255; b[ i++ ] = 0x0 );
            for ( i = 0; i < l; b[ c ] = c, c = p[ ++i ] );
            return b;
        }
};