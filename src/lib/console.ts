import colors from "colors";

colors.setTheme({
	log: "grey",
	success: "green",
	warn: "yellow",
	debug: "cyan",
	error: "red"
});
import log from "fancy-log";

const name = "Wolfy";

/**
 *
 *
 * @class Logger
 */
class Logger {
	constructor() {}

	/**
	 *
	 *
	 * @param {any} source
	 * @param {any} msg
	 * @memberof Logger
	 */
	log(msg: any) {
		// @ts-ignore
		let message = colors.log(msg);
		log(`${name} | ${message}`);
	}
	/**
	 *
	 *
	 * @param {any} source
	 * @param {any} msg
	 * @memberof Logger
	 */
	success(msg: any) {
		// @ts-ignore
		let message = colors.success(msg);
		log(`${name} | ${message}`);
	}
	/**
	 *
	 *
	 * @param {any} source
	 * @param {any} msg
	 * @memberof Logger
	 */
	warn(msg: any) {
		// @ts-ignore
		let message = colors.warn(msg);
		log(`${name} | ${message}`);
	}
	/**
	 *
	 *
	 * @param {any} source
	 * @param {any} msg
	 * @memberof Logger
	 */
	error(msg: any) {
		// @ts-ignore
		let message = colors.bgRed(msg);
		log(`${name} | ${message}`);
	}
	/**
	 *
	 *
	 * @param {any} source
	 * @param {any} msg
	 * @memberof Logger
	 */
	debug(msg: any) {
		// @ts-ignore
		let message = colors.debug(msg);
		log(`${name} | ${message}`);
	}
}

const customConsole = new Logger();

// Extend console object with custom logger methods
console.info = customConsole.success.bind(customConsole);
console.log = customConsole.log.bind(customConsole);
console.warn = customConsole.warn.bind(customConsole);
console.error = customConsole.error.bind(customConsole);
console.debug = customConsole.debug.bind(customConsole);

export default new Logger();
