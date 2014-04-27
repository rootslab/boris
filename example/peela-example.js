var log = console.log
    , Peela = require( '../' )
    , p = Peela( [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ] )
    ;

log( '\n- Peela: %j', p );
log( '- current size is: %j', p.size() );
log( '- current head is: %s', p.head() );

log( '\n- pop() head element from stack:', p.pop() );
log( '- Peela: %j', p );
log( '- current size is: %j', p.size() );
log( '- current head is: %s', p.head() );

log( '\n- pop(%d) elements from stack: %j', 5, p.pop( 5 ) );
log( '- Peela: %j', p );
log( '- current size is: %j', p.size() );
log( '- current head is: %s', p.head() );

log( '\n- push(%d) elements to stack: %j', 3, p.push( 'a', 'b', 'c' ) );
log( '- Peela: %j', p );
log( '- current size is: %j', p.size() );
log( '- current head is: %s', p.head() );

log( '\n- flush(%d) all elements', p.flush() );
log( '- Peela: %j', p );
log( '- current size is: %j', p.size() );
log( '- current head is: %s\n', p.head() );