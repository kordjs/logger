/**
 * ANSI color codes and styling for terminal output
 *
 * @description Complete collection of ANSI escape codes for terminal styling.
 * Includes colors for log levels, text formatting, and background colors.
 * All codes are raw ANSI escape sequences for zero-dependency operation.
 *
 * @example
 * ```typescript
 * import { Colors, colorize } from '@kordjs/tracekit';
 *
 * console.log(colorize('Error message', Colors.red));
 * console.log(`${Colors.bold}Bold text${Colors.reset}`);
 * ```
 */
export const Colors = {
        /** Reset all styling */
        reset: '\x1b[0m',

        // Log level colors
        /** Cyan color for debug messages */
        debug: '\x1b[36m',
        /** Magenta color for trace messages */
        trace: '\x1b[35m',
        /** Blue color for info messages */
        info: '\x1b[34m',
        /** Green color for success messages */
        success: '\x1b[32m',
        /** Yellow color for warning messages */
        warn: '\x1b[33m',
        /** Red color for error messages */
        error: '\x1b[31m',
        /** Bright red color for fatal messages */
        fatal: '\x1b[91m',

        // Style modifiers
        /** Bold text styling */
        bold: '\x1b[1m',
        /** Dimmed text styling */
        dim: '\x1b[2m',
        /** Underlined text styling */
        underline: '\x1b[4m',

        // Background colors
        /** Red background color */
        bgRed: '\x1b[41m',
        /** Green background color */
        bgGreen: '\x1b[42m',
        /** Yellow background color */
        bgYellow: '\x1b[43m',
        /** Blue background color */
        bgBlue: '\x1b[44m',

        // Text colors
        /** Black text color */
        black: '\x1b[30m',
        /** Red text color */
        red: '\x1b[31m',
        /** Green text color */
        green: '\x1b[32m',
        /** Yellow text color */
        yellow: '\x1b[33m',
        /** Blue text color */
        blue: '\x1b[34m',
        /** Magenta text color */
        magenta: '\x1b[35m',
        /** Cyan text color */
        cyan: '\x1b[36m',
        /** White text color */
        white: '\x1b[37m',
        /** Gray text color */
        gray: '\x1b[90m'
} as const;

/**
 * Unicode emojis and symbols for log level indicators
 *
 * @description Maps each log level to an appropriate emoji for visual identification.
 * These icons are displayed before the log level text to provide quick visual context.
 */
export const LogIcons = {
        /** Debug icon - bug emoji for debugging information */
        debug: '🐛',
        /** Trace icon - magnifying glass for detailed tracing */
        trace: '🔍',
        /** Info icon - information symbol for general information */
        info: 'ℹ️',
        /** Success icon - check mark for successful operations */
        success: '✅',
        /** Warning icon - warning triangle for potential issues */
        warn: '⚠️',
        /** Error icon - X mark for errors and failures */
        error: '❌',
        /** Fatal icon - skull for critical/fatal errors */
        fatal: '💀'
} as const;

/**
 * Apply ANSI color codes to text
 *
 * @param text - The text to colorize
 * @param color - ANSI color code to apply
 * @param enableColors - Whether to apply colors (default: true)
 * @returns Colorized text with ANSI codes, or plain text if colors disabled
 *
 * @description Wraps text with the specified ANSI color code and reset sequence.
 * If colors are disabled, returns the original text unchanged. This function
 * handles the common pattern of applying colors conditionally.
 *
 * @example
 * ```typescript
 * const redText = colorize('Error!', Colors.red);
 * const plainText = colorize('No color', Colors.red, false);
 * ```
 */
export function colorize(text: string, color: string, enableColors: boolean = true): string {
        if (!enableColors) return text;
        return `${color}${text}${Colors.reset}`;
}

/**
 * Get the appropriate color for a log level
 *
 * @param level - The log level to get color for
 * @returns ANSI color code for the log level
 *
 * @description Maps log levels to their corresponding colors from the Colors object.
 * Falls back to info color (blue) if the level is not recognized.
 *
 * @example
 * ```typescript
 * const errorColor = getLevelColor('error'); // Returns Colors.error (red)
 * const customColor = getLevelColor('custom'); // Returns Colors.info (blue)
 * ```
 */
export function getLevelColor(level: string): string {
        return (Colors as any)[level] || Colors.info;
}
