const EventEmitter = require('events');

class Watchdog extends EventEmitter {
    constructor(params) {
        super();

        const {
            timeout = 1000,
            continuous = false,
        } = typeof params === 'object' ? params : { timeout: params };

        this._timeout = timeout;
        this._isContinuous = continuous;
        this._timerId = null;
        this._trigger = this._trigger.bind(this);
        this.start();
    }

    reset() {
        if (this._timerId) {
            this.start();
        }
    }

    cancel() {
        clearTimeout(this._timerId);
        this._timerId = null;
        this.emit('cancel');
    }

    start() {
        this.cancel();
        this._timerId = setTimeout(this._trigger, this._timeout);
    }

    _trigger() {
        this.emit('trigger');
        if (this._isContinuous) {
            this.start();
        } else {
            this.cancel();
        }
    }

    get isActive() {
        return Boolean(this._timerId);
    }

    get timeout() {
        return this._timeout;
    }
}

module.exports = Watchdog;
