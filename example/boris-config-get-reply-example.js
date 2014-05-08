// use Redis CONFIG GET * reply
var log = console.log
    , util = require( 'util' )
    , Boris = require( '../' )
    , b = Boris()
    , config_get_reply = "*112\r\n$10\r\ndbfilename\r\n$8\r\ndump.rdb\r\n$11\r\nrequirepass\r\n$0\r\n\r\n$10\r\nmasterauth\r\n$0\r\n\r\n$10\r\nunixsocket\r\n$0\r\n\r\n$7\r\nlogfile\r\n$0\r\n\r\n$7\r\npidfile\r\n$18\r\n/var/run/redis.pid\r\n$9\r\nmaxmemory\r\n$1\r\n0\r\n$17\r\nmaxmemory-samples\r\n$1\r\n3\r\n$7\r\ntimeout\r\n$1\r\n0\r\n$13\r\ntcp-keepalive\r\n$1\r\n0\r\n$27\r\nauto-aof-rewrite-percentage\r\n$3\r\n100\r\n$25\r\nauto-aof-rewrite-min-size\r\n$8\r\n67108864\r\n$24\r\nhash-max-ziplist-entries\r\n$3\r\n512\r\n$22\r\nhash-max-ziplist-value\r\n$2\r\n64\r\n$24\r\nlist-max-ziplist-entries\r\n$3\r\n512\r\n$22\r\nlist-max-ziplist-value\r\n$2\r\n64\r\n$22\r\nset-max-intset-entries\r\n$3\r\n512\r\n$24\r\nzset-max-ziplist-entries\r\n$3\r\n128\r\n$22\r\nzset-max-ziplist-value\r\n$2\r\n64\r\n$14\r\nlua-time-limit\r\n$4\r\n5000\r\n$23\r\nslowlog-log-slower-than\r\n$5\r\n10000\r\n$15\r\nslowlog-max-len\r\n$3\r\n128\r\n$4\r\nport\r\n$4\r\n6379\r\n$11\r\ntcp-backlog\r\n$3\r\n511\r\n$9\r\ndatabases\r\n$2\r\n16\r\n$22\r\nrepl-ping-slave-period\r\n$2\r\n10\r\n$12\r\nrepl-timeout\r\n$2\r\n60\r\n$17\r\nrepl-backlog-size\r\n$7\r\n1048576\r\n$16\r\nrepl-backlog-ttl\r\n$4\r\n3600\r\n$10\r\nmaxclients\r\n$4\r\n3984\r\n$15\r\nwatchdog-period\r\n$1\r\n0\r\n$14\r\nslave-priority\r\n$3\r\n100\r\n$19\r\nmin-slaves-to-write\r\n$1\r\n0\r\n$18\r\nmin-slaves-max-lag\r\n$2\r\n10\r\n$2\r\nhz\r\n$2\r\n10\r\n$25\r\nno-appendfsync-on-rewrite\r\n$2\r\nno\r\n$22\r\nslave-serve-stale-data\r\n$3\r\nyes\r\n$15\r\nslave-read-only\r\n$3\r\nyes\r\n$27\r\nstop-writes-on-bgsave-error\r\n$3\r\nyes\r\n$9\r\ndaemonize\r\n$2\r\nno\r\n$14\r\nrdbcompression\r\n$3\r\nyes\r\n$11\r\nrdbchecksum\r\n$3\r\nyes\r\n$15\r\nactiverehashing\r\n$3\r\nyes\r\n$24\r\nrepl-disable-tcp-nodelay\r\n$2\r\nno\r\n$29\r\naof-rewrite-incremental-fsync\r\n$3\r\nyes\r\n$10\r\nappendonly\r\n$2\r\nno\r\n$3\r\ndir\r\n$4\r\n/tmp\r\n$16\r\nmaxmemory-policy\r\n$12\r\nvolatile-lru\r\n$11\r\nappendfsync\r\n$8\r\neverysec\r\n$4\r\nsave\r\n$23\r\n3600 1 300 100 60 10000\r\n$8\r\nloglevel\r\n$6\r\nnotice\r\n$26\r\nclient-output-buffer-limit\r\n$67\r\nnormal 0 0 0 slave 268435456 67108864 60 pubsub 33554432 8388608 60\r\n$14\r\nunixsocketperm\r\n$1\r\n0\r\n$7\r\nslaveof\r\n$0\r\n\r\n$22\r\nnotify-keyspace-events\r\n$0\r\n\r\n$4\r\nbind\r\n$0\r\n\r\n"
    , rdata = new Buffer( config_get_reply )
    ;


b.on( 'end', function () {
    log( '- ok, buffer ends' );
} );

b.on( 'miss', function ( r, i ) {
    log( '- "%s" rule needs data, index: "%s"', r.cid, i );
} );

b.on( 'match', function ( e, d, convert ) {
    log( '\n- data match%s: %j"', e ? ' (Redis error)' : '', d + '' );
} );

b.parse( rdata );
