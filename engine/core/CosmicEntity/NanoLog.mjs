// nanolog.mjs
export class NanoLog {
    constructor(phase) {
        this.phase = phase
    }
    setPhase(phase) {
        this.phase = phase
    }

    log(...args) {
        console.logp(
            `%c[${this.phase()} time]`,
            this.phase() === 'init' ? 'color: orange' : 'color: cyan',
            ...args
        );
    }

    warn(...args) {
        console.warn(
            `%c[${this.phase()} time]`,
            this.phase() === 'init' ? 'color: orange' : 'color: cyan',
            ...args
        );
    }

    error(...args) {
        console.error(
            `%c[${this.phase()} time]`,
            this.phase() === 'init' ? 'color: orange' : 'color: cyan',
            ...args
        );
    }
}
export let nano = new NanoLog() 