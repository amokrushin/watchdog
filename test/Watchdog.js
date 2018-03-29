const test = require('tape');
const EventEmitter = require('events');
const Watchdog = require('../libs/Watchdog');

test('constructor', (t) => {
    t.equal(typeof Watchdog, 'function', 'is function');
    t.equal(Watchdog.name, 'Watchdog', 'name match');
    t.end();
});

test('instance', (t) => {
    const watchdog = new Watchdog(500);

    t.equal(typeof watchdog.start, 'function', 'has start method');
    t.equal(typeof watchdog.reset, 'function', 'has reset method');
    t.equal(typeof watchdog.cancel, 'function', 'has cancel method');

    t.ok(watchdog instanceof EventEmitter, 'instance of EventEmitter');

    t.equal(watchdog.isActive, true, 'watchdog is active by default');

    t.end();
});


test('params', (t) => {
    t.equal(new Watchdog().timeout, 1000, 'default timeout value match');
    t.equal(new Watchdog(500).timeout, 500, 'timeout value match');
    t.end();
});

test.skip('trigger event', (t) => {
    const timeout = 100;
    const watchdog = new Watchdog(timeout);
    const startedAt = Date.now();
    watchdog.once('trigger', () => {
        const triggeredAt = Date.now();
        t.ok((triggeredAt - startedAt) > timeout, 'triggered after timeout');
        watchdog.cancel();
        t.end();
    });
});

test('reset + trigger event', (t) => {
    const timeout = 200;
    const watchdog = new Watchdog(15);
    const startedAt = Date.now();
    const intervalId = setInterval(() => {
        watchdog.reset();
    }, 10);
    setTimeout(() => {
        clearInterval(intervalId);
    }, 1000);
    watchdog.once('trigger', () => {
        const triggeredAt = Date.now();
        t.ok((triggeredAt - startedAt) > timeout, 'triggered after timeout');
        watchdog.cancel();
        t.end();
    });
});

test('cancel', (t) => {
    const watchdog = new Watchdog(100);
    watchdog.once('trigger', () => {
        t.fail('triggered too early');
    });
    setTimeout(() => {
        t.equal(watchdog.isActive, true, 'wathdod is active');
        watchdog.cancel();
    }, 50);
    setTimeout(() => {
        t.equal(watchdog.isActive, false, 'wathdod is not active');
        t.pass('trigger event not emitted');
        t.end();
    }, 200);
});
