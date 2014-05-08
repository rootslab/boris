#!/usr/bin/env node

/* 
 * Boris Multi Data Chunk Config get Replies Test
 */

var log = console.log
    , assert = require( 'assert' )
    , util = require( 'util' )
    , Bolgia = require( 'bolgia' )
    , Boris = require( '../' )
    , b = Boris()
    // expected result from "CONFIG GET *""
    , expected = [
        'dbfilename', 'dump.rdb',
        'requirepass', '',
        'masterauth', '',
        'unixsocket', '',
        'logfile', '',
        'pidfile', '/var/run/redis.pid',
        'maxmemory', 0,
        'maxmemory-samples',3,
        'timeout', 0,
        'tcp-keepalive', 0,
        'auto-aof-rewrite-percentage', 100,
        'auto-aof-rewrite-min-size', 67108864,
        'hash-max-ziplist-entries', 512,
        'hash-max-ziplist-value', 64,
        'list-max-ziplist-entries', 512,
        'list-max-ziplist-value', 64,
        'set-max-intset-entries', 512,
        'zset-max-ziplist-entries', 128,
        'zset-max-ziplist-value', 64,
        'lua-time-limit', 5000,
        'slowlog-log-slower-than', 10000,
        'slowlog-max-len', 128,
        'port', 6379,
        'tcp-backlog', 511,
        'databases', 16,
        'repl-ping-slave-period', 10,
        'repl-timeout', 60,
        'repl-backlog-size', 1048576,
        'repl-backlog-ttl', 3600,
        'maxclients', 3984,
        'watchdog-period', 0,
        'slave-priority', 100,
        'min-slaves-to-write', 0,
        'min-slaves-max-lag', 10,
        'hz', 10,
        'no-appendfsync-on-rewrite', 'no',
        'slave-serve-stale-data', 'yes',
        'slave-read-only', 'yes',
        'stop-writes-on-bgsave-error', 'yes',
        'daemonize', 'no',
        'rdbcompression', 'yes',
        'rdbchecksum', 'yes',
        'activerehashing', 'yes',
        'repl-disable-tcp-nodelay', 'no',
        'aof-rewrite-incremental-fsync', 'yes',
        'appendonly', 'no',
        'dir', '/tmp',
        'maxmemory-policy', 'volatile-lru',
        'appendfsync', 'everysec',
        'save', '3600 1 300 100 60 10000',
        'loglevel', 'notice',
        'client-output-buffer-limit', 'normal 0 0 0 slave 268435456 67108864 60 pubsub 33554432 8388608 60',
        'unixsocketperm', 0,
        'slaveof', '',
        'notify-keyspace-events', '',
        'bind', ''
    ]
    // parse encoded Redis reply to CONFIG GET *
    , config_get_reply = "*112\r\n$10\r\ndbfilename\r\n$8\r\ndump.rdb\r\n$11\r\nrequirepass\r\n$0\r\n\r\n$10\r\nmasterauth\r\n$0\r\n\r\n$10\r\nunixsocket\r\n$0\r\n\r\n$7\r\nlogfile\r\n$0\r\n\r\n$7\r\npidfile\r\n$18\r\n/var/run/redis.pid\r\n$9\r\nmaxmemory\r\n$1\r\n0\r\n$17\r\nmaxmemory-samples\r\n$1\r\n3\r\n$7\r\ntimeout\r\n$1\r\n0\r\n$13\r\ntcp-keepalive\r\n$1\r\n0\r\n$27\r\nauto-aof-rewrite-percentage\r\n$3\r\n100\r\n$25\r\nauto-aof-rewrite-min-size\r\n$8\r\n67108864\r\n$24\r\nhash-max-ziplist-entries\r\n$3\r\n512\r\n$22\r\nhash-max-ziplist-value\r\n$2\r\n64\r\n$24\r\nlist-max-ziplist-entries\r\n$3\r\n512\r\n$22\r\nlist-max-ziplist-value\r\n$2\r\n64\r\n$22\r\nset-max-intset-entries\r\n$3\r\n512\r\n$24\r\nzset-max-ziplist-entries\r\n$3\r\n128\r\n$22\r\nzset-max-ziplist-value\r\n$2\r\n64\r\n$14\r\nlua-time-limit\r\n$4\r\n5000\r\n$23\r\nslowlog-log-slower-than\r\n$5\r\n10000\r\n$15\r\nslowlog-max-len\r\n$3\r\n128\r\n$4\r\nport\r\n$4\r\n6379\r\n$11\r\ntcp-backlog\r\n$3\r\n511\r\n$9\r\ndatabases\r\n$2\r\n16\r\n$22\r\nrepl-ping-slave-period\r\n$2\r\n10\r\n$12\r\nrepl-timeout\r\n$2\r\n60\r\n$17\r\nrepl-backlog-size\r\n$7\r\n1048576\r\n$16\r\nrepl-backlog-ttl\r\n$4\r\n3600\r\n$10\r\nmaxclients\r\n$4\r\n3984\r\n$15\r\nwatchdog-period\r\n$1\r\n0\r\n$14\r\nslave-priority\r\n$3\r\n100\r\n$19\r\nmin-slaves-to-write\r\n$1\r\n0\r\n$18\r\nmin-slaves-max-lag\r\n$2\r\n10\r\n$2\r\nhz\r\n$2\r\n10\r\n$25\r\nno-appendfsync-on-rewrite\r\n$2\r\nno\r\n$22\r\nslave-serve-stale-data\r\n$3\r\nyes\r\n$15\r\nslave-read-only\r\n$3\r\nyes\r\n$27\r\nstop-writes-on-bgsave-error\r\n$3\r\nyes\r\n$9\r\ndaemonize\r\n$2\r\nno\r\n$14\r\nrdbcompression\r\n$3\r\nyes\r\n$11\r\nrdbchecksum\r\n$3\r\nyes\r\n$15\r\nactiverehashing\r\n$3\r\nyes\r\n$24\r\nrepl-disable-tcp-nodelay\r\n$2\r\nno\r\n$29\r\naof-rewrite-incremental-fsync\r\n$3\r\nyes\r\n$10\r\nappendonly\r\n$2\r\nno\r\n$3\r\ndir\r\n$4\r\n/tmp\r\n$16\r\nmaxmemory-policy\r\n$12\r\nvolatile-lru\r\n$11\r\nappendfsync\r\n$8\r\neverysec\r\n$4\r\nsave\r\n$23\r\n3600 1 300 100 60 10000\r\n$8\r\nloglevel\r\n$6\r\nnotice\r\n$26\r\nclient-output-buffer-limit\r\n$67\r\nnormal 0 0 0 slave 268435456 67108864 60 pubsub 33554432 8388608 60\r\n$14\r\nunixsocketperm\r\n$1\r\n0\r\n$7\r\nslaveof\r\n$0\r\n\r\n$22\r\nnotify-keyspace-events\r\n$0\r\n\r\n$4\r\nbind\r\n$0\r\n\r\n"
    , rdata = new Buffer( config_get_reply )
    , result = null
    ;


b.on( 'end', function () {
    log( '\n- ok, buffer ends' );

    log( '\n- deeply equality check between parsed obj/hash and expected result.\n' );
    assert.deepEqual( result, Bolgia.toHash( expected ) );
} );

b.on( 'miss', function ( r, i ) {
    // log( '- "%s" rule needs data, index: "%s"', r.cid, i );
} );

b.on( 'match', function ( e, d, convert ) {
    log( '\n- data matched%s: ', e ? ' (Redis error)' : '' );
    result = Bolgia.toHash( d, true, null, true );
    log( util.inspect( result, false, 3, true ) );
} );

log( '- test parsing of a "CONFIG GET *" multichunk reply.' );

b.parse( rdata );

