module.exports =
    /******/ (function(modules, runtime) { // webpackBootstrap
    /******/ 	"use strict";
    /******/ 	// The module cache
    /******/ 	var installedModules = {};
    /******/
    /******/ 	// The require function
    /******/ 	function __webpack_require__(moduleId) {
        /******/
        /******/ 		// Check if module is in cache
        /******/ 		if(installedModules[moduleId]) {
            /******/ 			return installedModules[moduleId].exports;
            /******/ 		}
        /******/ 		// Create a new module (and put it into the cache)
        /******/ 		var module = installedModules[moduleId] = {
            /******/ 			i: moduleId,
            /******/ 			l: false,
            /******/ 			exports: {}
            /******/ 		};
        /******/
        /******/ 		// Execute the module function
        /******/ 		var threw = true;
        /******/ 		try {
            /******/ 			modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
            /******/ 			threw = false;
            /******/ 		} finally {
            /******/ 			if(threw) delete installedModules[moduleId];
            /******/ 		}
        /******/
        /******/ 		// Flag the module as loaded
        /******/ 		module.l = true;
        /******/
        /******/ 		// Return the exports of the module
        /******/ 		return module.exports;
        /******/ 	}
    /******/
    /******/
    /******/ 	__webpack_require__.ab = __dirname + "/";
    /******/
    /******/ 	// the startup function
    /******/ 	function startup() {
        /******/ 		// Load entry module and return exports
        /******/ 		return __webpack_require__(104);
        /******/ 	};
    /******/ 	// initialize runtime
    /******/ 	runtime(__webpack_require__);
    /******/
    /******/ 	// run startup
    /******/ 	return startup();
    /******/ })
    /************************************************************************/
    /******/ ({

            /***/ 1:
            /***/ (function(__unusedmodule, exports, __webpack_require__) {

                "use strict";

                var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
                    if (k2 === undefined) k2 = k;
                    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
                }) : (function(o, m, k, k2) {
                    if (k2 === undefined) k2 = k;
                    o[k2] = m[k];
                }));
                var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
                    Object.defineProperty(o, "default", { enumerable: true, value: v });
                }) : function(o, v) {
                    o["default"] = v;
                });
                var __importStar = (this && this.__importStar) || function (mod) {
                    if (mod && mod.__esModule) return mod;
                    var result = {};
                    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
                    __setModuleDefault(result, mod);
                    return result;
                };
                var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
                    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
                    return new (P || (P = Promise))(function (resolve, reject) {
                        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
                        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
                        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
                        step((generator = generator.apply(thisArg, _arguments || [])).next());
                    });
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                exports.findInPath = exports.which = exports.mkdirP = exports.rmRF = exports.mv = exports.cp = void 0;
                const assert_1 = __webpack_require__(357);
                const path = __importStar(__webpack_require__(622));
                const ioUtil = __importStar(__webpack_require__(672));
                /**
                 * Copies a file or folder.
                 * Based off of shelljs - https://github.com/shelljs/shelljs/blob/9237f66c52e5daa40458f94f9565e18e8132f5a6/src/cp.js
                 *
                 * @param     source    source path
                 * @param     dest      destination path
                 * @param     options   optional. See CopyOptions.
                 */
                function cp(source, dest, options = {}) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const { force, recursive, copySourceDirectory } = readCopyOptions(options);
                        const destStat = (yield ioUtil.exists(dest)) ? yield ioUtil.stat(dest) : null;
                        // Dest is an existing file, but not forcing
                        if (destStat && destStat.isFile() && !force) {
                            return;
                        }
                        // If dest is an existing directory, should copy inside.
                        const newDest = destStat && destStat.isDirectory() && copySourceDirectory
                            ? path.join(dest, path.basename(source))
                            : dest;
                        if (!(yield ioUtil.exists(source))) {
                            throw new Error(`no such file or directory: ${source}`);
                        }
                        const sourceStat = yield ioUtil.stat(source);
                        if (sourceStat.isDirectory()) {
                            if (!recursive) {
                                throw new Error(`Failed to copy. ${source} is a directory, but tried to copy without recursive flag.`);
                            }
                            else {
                                yield cpDirRecursive(source, newDest, 0, force);
                            }
                        }
                        else {
                            if (path.relative(source, newDest) === '') {
                                // a file cannot be copied to itself
                                throw new Error(`'${newDest}' and '${source}' are the same file`);
                            }
                            yield copyFile(source, newDest, force);
                        }
                    });
                }
                exports.cp = cp;
                /**
                 * Moves a path.
                 *
                 * @param     source    source path
                 * @param     dest      destination path
                 * @param     options   optional. See MoveOptions.
                 */
                function mv(source, dest, options = {}) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (yield ioUtil.exists(dest)) {
                            let destExists = true;
                            if (yield ioUtil.isDirectory(dest)) {
                                // If dest is directory copy src into dest
                                dest = path.join(dest, path.basename(source));
                                destExists = yield ioUtil.exists(dest);
                            }
                            if (destExists) {
                                if (options.force == null || options.force) {
                                    yield rmRF(dest);
                                }
                                else {
                                    throw new Error('Destination already exists');
                                }
                            }
                        }
                        yield mkdirP(path.dirname(dest));
                        yield ioUtil.rename(source, dest);
                    });
                }
                exports.mv = mv;
                /**
                 * Remove a path recursively with force
                 *
                 * @param inputPath path to remove
                 */
                function rmRF(inputPath) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (ioUtil.IS_WINDOWS) {
                            // Check for invalid characters
                            // https://docs.microsoft.com/en-us/windows/win32/fileio/naming-a-file
                            if (/[*"<>|]/.test(inputPath)) {
                                throw new Error('File path must not contain `*`, `"`, `<`, `>` or `|` on Windows');
                            }
                        }
                        try {
                            // note if path does not exist, error is silent
                            yield ioUtil.rm(inputPath, {
                                force: true,
                                maxRetries: 3,
                                recursive: true,
                                retryDelay: 300
                            });
                        }
                        catch (err) {
                            throw new Error(`File was unable to be removed ${err}`);
                        }
                    });
                }
                exports.rmRF = rmRF;
                /**
                 * Make a directory.  Creates the full path with folders in between
                 * Will throw if it fails
                 *
                 * @param   fsPath        path to create
                 * @returns Promise<void>
                 */
                function mkdirP(fsPath) {
                    return __awaiter(this, void 0, void 0, function* () {
                        assert_1.ok(fsPath, 'a path argument must be provided');
                        yield ioUtil.mkdir(fsPath, { recursive: true });
                    });
                }
                exports.mkdirP = mkdirP;
                /**
                 * Returns path of a tool had the tool actually been invoked.  Resolves via paths.
                 * If you check and the tool does not exist, it will throw.
                 *
                 * @param     tool              name of the tool
                 * @param     check             whether to check if tool exists
                 * @returns   Promise<string>   path to tool
                 */
                function which(tool, check) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (!tool) {
                            throw new Error("parameter 'tool' is required");
                        }
                        // recursive when check=true
                        if (check) {
                            const result = yield which(tool, false);
                            if (!result) {
                                if (ioUtil.IS_WINDOWS) {
                                    throw new Error(`Unable to locate executable file: ${tool}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also verify the file has a valid extension for an executable file.`);
                                }
                                else {
                                    throw new Error(`Unable to locate executable file: ${tool}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also check the file mode to verify the file is executable.`);
                                }
                            }
                            return result;
                        }
                        const matches = yield findInPath(tool);
                        if (matches && matches.length > 0) {
                            return matches[0];
                        }
                        return '';
                    });
                }
                exports.which = which;
                /**
                 * Returns a list of all occurrences of the given tool on the system path.
                 *
                 * @returns   Promise<string[]>  the paths of the tool
                 */
                function findInPath(tool) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (!tool) {
                            throw new Error("parameter 'tool' is required");
                        }
                        // build the list of extensions to try
                        const extensions = [];
                        if (ioUtil.IS_WINDOWS && process.env['PATHEXT']) {
                            for (const extension of process.env['PATHEXT'].split(path.delimiter)) {
                                if (extension) {
                                    extensions.push(extension);
                                }
                            }
                        }
                        // if it's rooted, return it if exists. otherwise return empty.
                        if (ioUtil.isRooted(tool)) {
                            const filePath = yield ioUtil.tryGetExecutablePath(tool, extensions);
                            if (filePath) {
                                return [filePath];
                            }
                            return [];
                        }
                        // if any path separators, return empty
                        if (tool.includes(path.sep)) {
                            return [];
                        }
                        // build the list of directories
                        //
                        // Note, technically "where" checks the current directory on Windows. From a toolkit perspective,
                        // it feels like we should not do this. Checking the current directory seems like more of a use
                        // case of a shell, and the which() function exposed by the toolkit should strive for consistency
                        // across platforms.
                        const directories = [];
                        if (process.env.PATH) {
                            for (const p of process.env.PATH.split(path.delimiter)) {
                                if (p) {
                                    directories.push(p);
                                }
                            }
                        }
                        // find all matches
                        const matches = [];
                        for (const directory of directories) {
                            const filePath = yield ioUtil.tryGetExecutablePath(path.join(directory, tool), extensions);
                            if (filePath) {
                                matches.push(filePath);
                            }
                        }
                        return matches;
                    });
                }
                exports.findInPath = findInPath;
                function readCopyOptions(options) {
                    const force = options.force == null ? true : options.force;
                    const recursive = Boolean(options.recursive);
                    const copySourceDirectory = options.copySourceDirectory == null
                        ? true
                        : Boolean(options.copySourceDirectory);
                    return { force, recursive, copySourceDirectory };
                }
                function cpDirRecursive(sourceDir, destDir, currentDepth, force) {
                    return __awaiter(this, void 0, void 0, function* () {
                        // Ensure there is not a run away recursive copy
                        if (currentDepth >= 255)
                            return;
                        currentDepth++;
                        yield mkdirP(destDir);
                        const files = yield ioUtil.readdir(sourceDir);
                        for (const fileName of files) {
                            const srcFile = `${sourceDir}/${fileName}`;
                            const destFile = `${destDir}/${fileName}`;
                            const srcFileStat = yield ioUtil.lstat(srcFile);
                            if (srcFileStat.isDirectory()) {
                                // Recurse
                                yield cpDirRecursive(srcFile, destFile, currentDepth, force);
                            }
                            else {
                                yield copyFile(srcFile, destFile, force);
                            }
                        }
                        // Change the mode for the newly created directory
                        yield ioUtil.chmod(destDir, (yield ioUtil.stat(sourceDir)).mode);
                    });
                }
// Buffered file copy
                function copyFile(srcFile, destFile, force) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if ((yield ioUtil.lstat(srcFile)).isSymbolicLink()) {
                            // unlink/re-link it
                            try {
                                yield ioUtil.lstat(destFile);
                                yield ioUtil.unlink(destFile);
                            }
                            catch (e) {
                                // Try to override file permission
                                if (e.code === 'EPERM') {
                                    yield ioUtil.chmod(destFile, '0666');
                                    yield ioUtil.unlink(destFile);
                                }
                                // other errors = it doesn't exist, no work to do
                            }
                            // Copy over symlink
                            const symlinkFull = yield ioUtil.readlink(srcFile);
                            yield ioUtil.symlink(symlinkFull, destFile, ioUtil.IS_WINDOWS ? 'junction' : null);
                        }
                        else if (!(yield ioUtil.exists(destFile)) || force) {
                            yield ioUtil.copyFile(srcFile, destFile);
                        }
                    });
                }
//# sourceMappingURL=io.js.map

                /***/ }),

            /***/ 2:
            /***/ (function(module, __unusedexports, __webpack_require__) {

                "use strict";

                const os = __webpack_require__(87);
                const macosRelease = __webpack_require__(118);
                const winRelease = __webpack_require__(49);

                const osName = (platform, release) => {
                    if (!platform && release) {
                        throw new Error('You can\'t specify a `release` without specifying `platform`');
                    }

                    platform = platform || os.platform();

                    let id;

                    if (platform === 'darwin') {
                        if (!release && os.platform() === 'darwin') {
                            release = os.release();
                        }

                        const prefix = release ? (Number(release.split('.')[0]) > 15 ? 'macOS' : 'OS X') : 'macOS';
                        id = release ? macosRelease(release).name : '';
                        return prefix + (id ? ' ' + id : '');
                    }

                    if (platform === 'linux') {
                        if (!release && os.platform() === 'linux') {
                            release = os.release();
                        }

                        id = release ? release.replace(/^(\d+\.\d+).*/, '$1') : '';
                        return 'Linux' + (id ? ' ' + id : '');
                    }

                    if (platform === 'win32') {
                        if (!release && os.platform() === 'win32') {
                            release = os.release();
                        }

                        id = release ? winRelease(release) : '';
                        return 'Windows' + (id ? ' ' + id : '');
                    }

                    return platform;
                };

                module.exports = osName;


                /***/ }),

            /***/ 9:
            /***/ (function(__unusedmodule, exports, __webpack_require__) {

                "use strict";

                var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
                    if (k2 === undefined) k2 = k;
                    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
                }) : (function(o, m, k, k2) {
                    if (k2 === undefined) k2 = k;
                    o[k2] = m[k];
                }));
                var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
                    Object.defineProperty(o, "default", { enumerable: true, value: v });
                }) : function(o, v) {
                    o["default"] = v;
                });
                var __importStar = (this && this.__importStar) || function (mod) {
                    if (mod && mod.__esModule) return mod;
                    var result = {};
                    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
                    __setModuleDefault(result, mod);
                    return result;
                };
                var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
                    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
                    return new (P || (P = Promise))(function (resolve, reject) {
                        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
                        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
                        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
                        step((generator = generator.apply(thisArg, _arguments || [])).next());
                    });
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                exports.argStringToArray = exports.ToolRunner = void 0;
                const os = __importStar(__webpack_require__(87));
                const events = __importStar(__webpack_require__(614));
                const child = __importStar(__webpack_require__(129));
                const path = __importStar(__webpack_require__(622));
                const io = __importStar(__webpack_require__(1));
                const ioUtil = __importStar(__webpack_require__(672));
                const timers_1 = __webpack_require__(213);
                /* eslint-disable @typescript-eslint/unbound-method */
                const IS_WINDOWS = process.platform === 'win32';
                /*
 * Class for running command line tools. Handles quoting and arg parsing in a platform agnostic way.
 */
                class ToolRunner extends events.EventEmitter {
                    constructor(toolPath, args, options) {
                        super();
                        if (!toolPath) {
                            throw new Error("Parameter 'toolPath' cannot be null or empty.");
                        }
                        this.toolPath = toolPath;
                        this.args = args || [];
                        this.options = options || {};
                    }
                    _debug(message) {
                        if (this.options.listeners && this.options.listeners.debug) {
                            this.options.listeners.debug(message);
                        }
                    }
                    _getCommandString(options, noPrefix) {
                        const toolPath = this._getSpawnFileName();
                        const args = this._getSpawnArgs(options);
                        let cmd = noPrefix ? '' : '[command]'; // omit prefix when piped to a second tool
                        if (IS_WINDOWS) {
                            // Windows + cmd file
                            if (this._isCmdFile()) {
                                cmd += toolPath;
                                for (const a of args) {
                                    cmd += ` ${a}`;
                                }
                            }
                            // Windows + verbatim
                            else if (options.windowsVerbatimArguments) {
                                cmd += `"${toolPath}"`;
                                for (const a of args) {
                                    cmd += ` ${a}`;
                                }
                            }
                            // Windows (regular)
                            else {
                                cmd += this._windowsQuoteCmdArg(toolPath);
                                for (const a of args) {
                                    cmd += ` ${this._windowsQuoteCmdArg(a)}`;
                                }
                            }
                        }
                        else {
                            // OSX/Linux - this can likely be improved with some form of quoting.
                            // creating processes on Unix is fundamentally different than Windows.
                            // on Unix, execvp() takes an arg array.
                            cmd += toolPath;
                            for (const a of args) {
                                cmd += ` ${a}`;
                            }
                        }
                        return cmd;
                    }
                    _processLineBuffer(data, strBuffer, onLine) {
                        try {
                            let s = strBuffer + data.toString();
                            let n = s.indexOf(os.EOL);
                            while (n > -1) {
                                const line = s.substring(0, n);
                                onLine(line);
                                // the rest of the string ...
                                s = s.substring(n + os.EOL.length);
                                n = s.indexOf(os.EOL);
                            }
                            return s;
                        }
                        catch (err) {
                            // streaming lines to console is best effort.  Don't fail a build.
                            this._debug(`error processing line. Failed with error ${err}`);
                            return '';
                        }
                    }
                    _getSpawnFileName() {
                        if (IS_WINDOWS) {
                            if (this._isCmdFile()) {
                                return process.env['COMSPEC'] || 'cmd.exe';
                            }
                        }
                        return this.toolPath;
                    }
                    _getSpawnArgs(options) {
                        if (IS_WINDOWS) {
                            if (this._isCmdFile()) {
                                let argline = `/D /S /C "${this._windowsQuoteCmdArg(this.toolPath)}`;
                                for (const a of this.args) {
                                    argline += ' ';
                                    argline += options.windowsVerbatimArguments
                                        ? a
                                        : this._windowsQuoteCmdArg(a);
                                }
                                argline += '"';
                                return [argline];
                            }
                        }
                        return this.args;
                    }
                    _endsWith(str, end) {
                        return str.endsWith(end);
                    }
                    _isCmdFile() {
                        const upperToolPath = this.toolPath.toUpperCase();
                        return (this._endsWith(upperToolPath, '.CMD') ||
                            this._endsWith(upperToolPath, '.BAT'));
                    }
                    _windowsQuoteCmdArg(arg) {
                        // for .exe, apply the normal quoting rules that libuv applies
                        if (!this._isCmdFile()) {
                            return this._uvQuoteCmdArg(arg);
                        }
                        // otherwise apply quoting rules specific to the cmd.exe command line parser.
                        // the libuv rules are generic and are not designed specifically for cmd.exe
                        // command line parser.
                        //
                        // for a detailed description of the cmd.exe command line parser, refer to
                        // http://stackoverflow.com/questions/4094699/how-does-the-windows-command-interpreter-cmd-exe-parse-scripts/7970912#7970912
                        // need quotes for empty arg
                        if (!arg) {
                            return '""';
                        }
                        // determine whether the arg needs to be quoted
                        const cmdSpecialChars = [
                            ' ',
                            '\t',
                            '&',
                            '(',
                            ')',
                            '[',
                            ']',
                            '{',
                            '}',
                            '^',
                            '=',
                            ';',
                            '!',
                            "'",
                            '+',
                            ',',
                            '`',
                            '~',
                            '|',
                            '<',
                            '>',
                            '"'
                        ];
                        let needsQuotes = false;
                        for (const char of arg) {
                            if (cmdSpecialChars.some(x => x === char)) {
                                needsQuotes = true;
                                break;
                            }
                        }
                        // short-circuit if quotes not needed
                        if (!needsQuotes) {
                            return arg;
                        }
                        // the following quoting rules are very similar to the rules that by libuv applies.
                        //
                        // 1) wrap the string in quotes
                        //
                        // 2) double-up quotes - i.e. " => ""
                        //
                        //    this is different from the libuv quoting rules. libuv replaces " with \", which unfortunately
                        //    doesn't work well with a cmd.exe command line.
                        //
                        //    note, replacing " with "" also works well if the arg is passed to a downstream .NET console app.
                        //    for example, the command line:
                        //          foo.exe "myarg:""my val"""
                        //    is parsed by a .NET console app into an arg array:
                        //          [ "myarg:\"my val\"" ]
                        //    which is the same end result when applying libuv quoting rules. although the actual
                        //    command line from libuv quoting rules would look like:
                        //          foo.exe "myarg:\"my val\""
                        //
                        // 3) double-up slashes that precede a quote,
                        //    e.g.  hello \world    => "hello \world"
                        //          hello\"world    => "hello\\""world"
                        //          hello\\"world   => "hello\\\\""world"
                        //          hello world\    => "hello world\\"
                        //
                        //    technically this is not required for a cmd.exe command line, or the batch argument parser.
                        //    the reasons for including this as a .cmd quoting rule are:
                        //
                        //    a) this is optimized for the scenario where the argument is passed from the .cmd file to an
                        //       external program. many programs (e.g. .NET console apps) rely on the slash-doubling rule.
                        //
                        //    b) it's what we've been doing previously (by deferring to node default behavior) and we
                        //       haven't heard any complaints about that aspect.
                        //
                        // note, a weakness of the quoting rules chosen here, is that % is not escaped. in fact, % cannot be
                        // escaped when used on the command line directly - even though within a .cmd file % can be escaped
                        // by using %%.
                        //
                        // the saving grace is, on the command line, %var% is left as-is if var is not defined. this contrasts
                        // the line parsing rules within a .cmd file, where if var is not defined it is replaced with nothing.
                        //
                        // one option that was explored was replacing % with ^% - i.e. %var% => ^%var^%. this hack would
                        // often work, since it is unlikely that var^ would exist, and the ^ character is removed when the
                        // variable is used. the problem, however, is that ^ is not removed when %* is used to pass the args
                        // to an external program.
                        //
                        // an unexplored potential solution for the % escaping problem, is to create a wrapper .cmd file.
                        // % can be escaped within a .cmd file.
                        let reverse = '"';
                        let quoteHit = true;
                        for (let i = arg.length; i > 0; i--) {
                            // walk the string in reverse
                            reverse += arg[i - 1];
                            if (quoteHit && arg[i - 1] === '\\') {
                                reverse += '\\'; // double the slash
                            }
                            else if (arg[i - 1] === '"') {
                                quoteHit = true;
                                reverse += '"'; // double the quote
                            }
                            else {
                                quoteHit = false;
                            }
                        }
                        reverse += '"';
                        return reverse
                            .split('')
                            .reverse()
                            .join('');
                    }
                    _uvQuoteCmdArg(arg) {
                        // Tool runner wraps child_process.spawn() and needs to apply the same quoting as
                        // Node in certain cases where the undocumented spawn option windowsVerbatimArguments
                        // is used.
                        //
                        // Since this function is a port of quote_cmd_arg from Node 4.x (technically, lib UV,
                        // see https://github.com/nodejs/node/blob/v4.x/deps/uv/src/win/process.c for details),
                        // pasting copyright notice from Node within this function:
                        //
                        //      Copyright Joyent, Inc. and other Node contributors. All rights reserved.
                        //
                        //      Permission is hereby granted, free of charge, to any person obtaining a copy
                        //      of this software and associated documentation files (the "Software"), to
                        //      deal in the Software without restriction, including without limitation the
                        //      rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
                        //      sell copies of the Software, and to permit persons to whom the Software is
                        //      furnished to do so, subject to the following conditions:
                        //
                        //      The above copyright notice and this permission notice shall be included in
                        //      all copies or substantial portions of the Software.
                        //
                        //      THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
                        //      IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
                        //      FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
                        //      AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
                        //      LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
                        //      FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
                        //      IN THE SOFTWARE.
                        if (!arg) {
                            // Need double quotation for empty argument
                            return '""';
                        }
                        if (!arg.includes(' ') && !arg.includes('\t') && !arg.includes('"')) {
                            // No quotation needed
                            return arg;
                        }
                        if (!arg.includes('"') && !arg.includes('\\')) {
                            // No embedded double quotes or backslashes, so I can just wrap
                            // quote marks around the whole thing.
                            return `"${arg}"`;
                        }
                        // Expected input/output:
                        //   input : hello"world
                        //   output: "hello\"world"
                        //   input : hello""world
                        //   output: "hello\"\"world"
                        //   input : hello\world
                        //   output: hello\world
                        //   input : hello\\world
                        //   output: hello\\world
                        //   input : hello\"world
                        //   output: "hello\\\"world"
                        //   input : hello\\"world
                        //   output: "hello\\\\\"world"
                        //   input : hello world\
                        //   output: "hello world\\" - note the comment in libuv actually reads "hello world\"
                        //                             but it appears the comment is wrong, it should be "hello world\\"
                        let reverse = '"';
                        let quoteHit = true;
                        for (let i = arg.length; i > 0; i--) {
                            // walk the string in reverse
                            reverse += arg[i - 1];
                            if (quoteHit && arg[i - 1] === '\\') {
                                reverse += '\\';
                            }
                            else if (arg[i - 1] === '"') {
                                quoteHit = true;
                                reverse += '\\';
                            }
                            else {
                                quoteHit = false;
                            }
                        }
                        reverse += '"';
                        return reverse
                            .split('')
                            .reverse()
                            .join('');
                    }
                    _cloneExecOptions(options) {
                        options = options || {};
                        const result = {
                            cwd: options.cwd || process.cwd(),
                            env: options.env || process.env,
                            silent: options.silent || false,
                            windowsVerbatimArguments: options.windowsVerbatimArguments || false,
                            failOnStdErr: options.failOnStdErr || false,
                            ignoreReturnCode: options.ignoreReturnCode || false,
                            delay: options.delay || 10000
                        };
                        result.outStream = options.outStream || process.stdout;
                        result.errStream = options.errStream || process.stderr;
                        return result;
                    }
                    _getSpawnOptions(options, toolPath) {
                        options = options || {};
                        const result = {};
                        result.cwd = options.cwd;
                        result.env = options.env;
                        result['windowsVerbatimArguments'] =
                            options.windowsVerbatimArguments || this._isCmdFile();
                        if (options.windowsVerbatimArguments) {
                            result.argv0 = `"${toolPath}"`;
                        }
                        return result;
                    }
                    /**
                     * Exec a tool.
                     * Output will be streamed to the live console.
                     * Returns promise with return code
                     *
                     * @param     tool     path to tool to exec
                     * @param     options  optional exec options.  See ExecOptions
                     * @returns   number
                     */
                    exec() {
                        return __awaiter(this, void 0, void 0, function* () {
                            // root the tool path if it is unrooted and contains relative pathing
                            if (!ioUtil.isRooted(this.toolPath) &&
                                (this.toolPath.includes('/') ||
                                    (IS_WINDOWS && this.toolPath.includes('\\')))) {
                                // prefer options.cwd if it is specified, however options.cwd may also need to be rooted
                                this.toolPath = path.resolve(process.cwd(), this.options.cwd || process.cwd(), this.toolPath);
                            }
                            // if the tool is only a file name, then resolve it from the PATH
                            // otherwise verify it exists (add extension on Windows if necessary)
                            this.toolPath = yield io.which(this.toolPath, true);
                            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                                this._debug(`exec tool: ${this.toolPath}`);
                                this._debug('arguments:');
                                for (const arg of this.args) {
                                    this._debug(`   ${arg}`);
                                }
                                const optionsNonNull = this._cloneExecOptions(this.options);
                                if (!optionsNonNull.silent && optionsNonNull.outStream) {
                                    optionsNonNull.outStream.write(this._getCommandString(optionsNonNull) + os.EOL);
                                }
                                const state = new ExecState(optionsNonNull, this.toolPath);
                                state.on('debug', (message) => {
                                    this._debug(message);
                                });
                                if (this.options.cwd && !(yield ioUtil.exists(this.options.cwd))) {
                                    return reject(new Error(`The cwd: ${this.options.cwd} does not exist!`));
                                }
                                const fileName = this._getSpawnFileName();
                                const cp = child.spawn(fileName, this._getSpawnArgs(optionsNonNull), this._getSpawnOptions(this.options, fileName));
                                let stdbuffer = '';
                                if (cp.stdout) {
                                    cp.stdout.on('data', (data) => {
                                        if (this.options.listeners && this.options.listeners.stdout) {
                                            this.options.listeners.stdout(data);
                                        }
                                        if (!optionsNonNull.silent && optionsNonNull.outStream) {
                                            optionsNonNull.outStream.write(data);
                                        }
                                        stdbuffer = this._processLineBuffer(data, stdbuffer, (line) => {
                                            if (this.options.listeners && this.options.listeners.stdline) {
                                                this.options.listeners.stdline(line);
                                            }
                                        });
                                    });
                                }
                                let errbuffer = '';
                                if (cp.stderr) {
                                    cp.stderr.on('data', (data) => {
                                        state.processStderr = true;
                                        if (this.options.listeners && this.options.listeners.stderr) {
                                            this.options.listeners.stderr(data);
                                        }
                                        if (!optionsNonNull.silent &&
                                            optionsNonNull.errStream &&
                                            optionsNonNull.outStream) {
                                            const s = optionsNonNull.failOnStdErr
                                                ? optionsNonNull.errStream
                                                : optionsNonNull.outStream;
                                            s.write(data);
                                        }
                                        errbuffer = this._processLineBuffer(data, errbuffer, (line) => {
                                            if (this.options.listeners && this.options.listeners.errline) {
                                                this.options.listeners.errline(line);
                                            }
                                        });
                                    });
                                }
                                cp.on('error', (err) => {
                                    state.processError = err.message;
                                    state.processExited = true;
                                    state.processClosed = true;
                                    state.CheckComplete();
                                });
                                cp.on('exit', (code) => {
                                    state.processExitCode = code;
                                    state.processExited = true;
                                    this._debug(`Exit code ${code} received from tool '${this.toolPath}'`);
                                    state.CheckComplete();
                                });
                                cp.on('close', (code) => {
                                    state.processExitCode = code;
                                    state.processExited = true;
                                    state.processClosed = true;
                                    this._debug(`STDIO streams have closed for tool '${this.toolPath}'`);
                                    state.CheckComplete();
                                });
                                state.on('done', (error, exitCode) => {
                                    if (stdbuffer.length > 0) {
                                        this.emit('stdline', stdbuffer);
                                    }
                                    if (errbuffer.length > 0) {
                                        this.emit('errline', errbuffer);
                                    }
                                    cp.removeAllListeners();
                                    if (error) {
                                        reject(error);
                                    }
                                    else {
                                        resolve(exitCode);
                                    }
                                });
                                if (this.options.input) {
                                    if (!cp.stdin) {
                                        throw new Error('child process missing stdin');
                                    }
                                    cp.stdin.end(this.options.input);
                                }
                            }));
                        });
                    }
                }
                exports.ToolRunner = ToolRunner;
                /**
                 * Convert an arg string to an array of args. Handles escaping
                 *
                 * @param    argString   string of arguments
                 * @returns  string[]    array of arguments
                 */
                function argStringToArray(argString) {
                    const args = [];
                    let inQuotes = false;
                    let escaped = false;
                    let arg = '';
                    function append(c) {
                        // we only escape double quotes.
                        if (escaped && c !== '"') {
                            arg += '\\';
                        }
                        arg += c;
                        escaped = false;
                    }
                    for (let i = 0; i < argString.length; i++) {
                        const c = argString.charAt(i);
                        if (c === '"') {
                            if (!escaped) {
                                inQuotes = !inQuotes;
                            }
                            else {
                                append(c);
                            }
                            continue;
                        }
                        if (c === '\\' && escaped) {
                            append(c);
                            continue;
                        }
                        if (c === '\\' && inQuotes) {
                            escaped = true;
                            continue;
                        }
                        if (c === ' ' && !inQuotes) {
                            if (arg.length > 0) {
                                args.push(arg);
                                arg = '';
                            }
                            continue;
                        }
                        append(c);
                    }
                    if (arg.length > 0) {
                        args.push(arg.trim());
                    }
                    return args;
                }
                exports.argStringToArray = argStringToArray;
                class ExecState extends events.EventEmitter {
                    constructor(options, toolPath) {
                        super();
                        this.processClosed = false; // tracks whether the process has exited and stdio is closed
                        this.processError = '';
                        this.processExitCode = 0;
                        this.processExited = false; // tracks whether the process has exited
                        this.processStderr = false; // tracks whether stderr was written to
                        this.delay = 10000; // 10 seconds
                        this.done = false;
                        this.timeout = null;
                        if (!toolPath) {
                            throw new Error('toolPath must not be empty');
                        }
                        this.options = options;
                        this.toolPath = toolPath;
                        if (options.delay) {
                            this.delay = options.delay;
                        }
                    }
                    CheckComplete() {
                        if (this.done) {
                            return;
                        }
                        if (this.processClosed) {
                            this._setResult();
                        }
                        else if (this.processExited) {
                            this.timeout = timers_1.setTimeout(ExecState.HandleTimeout, this.delay, this);
                        }
                    }
                    _debug(message) {
                        this.emit('debug', message);
                    }
                    _setResult() {
                        // determine whether there is an error
                        let error;
                        if (this.processExited) {
                            if (this.processError) {
                                error = new Error(`There was an error when attempting to execute the process '${this.toolPath}'. This may indicate the process failed to start. Error: ${this.processError}`);
                            }
                            else if (this.processExitCode !== 0 && !this.options.ignoreReturnCode) {
                                error = new Error(`The process '${this.toolPath}' failed with exit code ${this.processExitCode}`);
                            }
                            else if (this.processStderr && this.options.failOnStdErr) {
                                error = new Error(`The process '${this.toolPath}' failed because one or more lines were written to the STDERR stream`);
                            }
                        }
                        // clear the timeout
                        if (this.timeout) {
                            clearTimeout(this.timeout);
                            this.timeout = null;
                        }
                        this.done = true;
                        this.emit('done', error, this.processExitCode);
                    }
                    static HandleTimeout(state) {
                        if (state.done) {
                            return;
                        }
                        if (!state.processClosed && state.processExited) {
                            const message = `The STDIO streams did not close within ${state.delay /
                            1000} seconds of the exit event from process '${state.toolPath}'. This may indicate a child process inherited the STDIO streams and has not yet exited.`;
                            state._debug(message);
                        }
                        state._setResult();
                    }
                }
//# sourceMappingURL=toolrunner.js.map

                /***/ }),

            /***/ 11:
            /***/ (function(module) {

// Returns a wrapper function that returns a wrapped callback
// The wrapper function should do some stuff, and return a
// presumably different callback function.
// This makes sure that own properties are retained, so that
// decorations and such are not lost along the way.
                module.exports = wrappy
                function wrappy (fn, cb) {
                    if (fn && cb) return wrappy(fn)(cb)

                    if (typeof fn !== 'function')
                        throw new TypeError('need wrapper function')

                    Object.keys(fn).forEach(function (k) {
                        wrapper[k] = fn[k]
                    })

                    return wrapper

                    function wrapper() {
                        var args = new Array(arguments.length)
                        for (var i = 0; i < args.length; i++) {
                            args[i] = arguments[i]
                        }
                        var ret = fn.apply(this, args)
                        var cb = args[args.length-1]
                        if (typeof ret === 'function' && ret !== cb) {
                            Object.keys(cb).forEach(function (k) {
                                ret[k] = cb[k]
                            })
                        }
                        return ret
                    }
                }


                /***/ }),

            /***/ 16:
            /***/ (function(module) {

                module.exports = require("tls");

                /***/ }),

            /***/ 18:
            /***/ (function(module) {

                module.exports = eval("require")("encoding");


                /***/ }),

            /***/ 20:
            /***/ (function(module, __unusedexports, __webpack_require__) {

                "use strict";


                const cp = __webpack_require__(129);
                const parse = __webpack_require__(568);
                const enoent = __webpack_require__(881);

                function spawn(command, args, options) {
                    // Parse the arguments
                    const parsed = parse(command, args, options);

                    // Spawn the child process
                    const spawned = cp.spawn(parsed.command, parsed.args, parsed.options);

                    // Hook into child process "exit" event to emit an error if the command
                    // does not exists, see: https://github.com/IndigoUnited/node-cross-spawn/issues/16
                    enoent.hookChildProcess(spawned, parsed);

                    return spawned;
                }

                function spawnSync(command, args, options) {
                    // Parse the arguments
                    const parsed = parse(command, args, options);

                    // Spawn the child process
                    const result = cp.spawnSync(parsed.command, parsed.args, parsed.options);

                    // Analyze if the command does not exist, see: https://github.com/IndigoUnited/node-cross-spawn/issues/16
                    result.error = result.error || enoent.verifyENOENTSync(result.status, parsed);

                    return result;
                }

                module.exports = spawn;
                module.exports.spawn = spawn;
                module.exports.sync = spawnSync;

                module.exports._parse = parse;
                module.exports._enoent = enoent;


                /***/ }),

            /***/ 22:
            /***/ (function(__unusedmodule, exports, __webpack_require__) {

                "use strict";


                Object.defineProperty(exports, "__esModule", {
                    value: true
                });
                exports.default = void 0;

                var _validate = _interopRequireDefault(__webpack_require__(78));

                function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

                function parse(uuid) {
                    if (!(0, _validate.default)(uuid)) {
                        throw TypeError('Invalid UUID');
                    }

                    let v;
                    const arr = new Uint8Array(16); // Parse ########-....-....-....-............

                    arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
                    arr[1] = v >>> 16 & 0xff;
                    arr[2] = v >>> 8 & 0xff;
                    arr[3] = v & 0xff; // Parse ........-####-....-....-............

                    arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
                    arr[5] = v & 0xff; // Parse ........-....-####-....-............

                    arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
                    arr[7] = v & 0xff; // Parse ........-....-....-####-............

                    arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
                    arr[9] = v & 0xff; // Parse ........-....-....-....-############
                    // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)

                    arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000 & 0xff;
                    arr[11] = v / 0x100000000 & 0xff;
                    arr[12] = v >>> 24 & 0xff;
                    arr[13] = v >>> 16 & 0xff;
                    arr[14] = v >>> 8 & 0xff;
                    arr[15] = v & 0xff;
                    return arr;
                }

                var _default = parse;
                exports.default = _default;

                /***/ }),

            /***/ 25:
            /***/ (function(__unusedmodule, exports) {

                "use strict";

                Object.defineProperty(exports, "__esModule", { value: true });
                exports.getBody = void 0;
                /**
                 * Get the body of the relevant comment, review, issue or pull request
                 * @param payload - Webhook payload
                 */
                function getBody(payload) {
                    if (payload.comment)
                        return payload.comment.body;
                    if (payload.review)
                        return payload.review.body;
                    // If neither of those comments are present, check the body
                    if (payload.issue)
                        return payload.issue.body;
                    if (payload.pull_request)
                        return payload.pull_request.body;
                    return undefined;
                }
                exports.getBody = getBody;
//# sourceMappingURL=get-body.js.map

                /***/ }),

            /***/ 32:
            /***/ (function(module, __unusedexports, __webpack_require__) {

                "use strict";

                const errorEx = __webpack_require__(612);
                const fallback = __webpack_require__(80);

                const JSONError = errorEx('JSONError', {
                    fileName: errorEx.append('in %s')
                });

                module.exports = (input, reviver, filename) => {
                    if (typeof reviver === 'string') {
                        filename = reviver;
                        reviver = null;
                    }

                    try {
                        try {
                            return JSON.parse(input, reviver);
                        } catch (err) {
                            fallback(input, reviver);

                            throw err;
                        }
                    } catch (err) {
                        err.message = err.message.replace(/\n/g, '');

                        const jsonErr = new JSONError(err);
                        if (filename) {
                            jsonErr.fileName = filename;
                        }

                        throw jsonErr;
                    }
                };


                /***/ }),

            /***/ 37:
            /***/ (function(module, __unusedexports, __webpack_require__) {

                "use strict";

                const path = __webpack_require__(622);
                const fs = __webpack_require__(598);
                const stripBom = __webpack_require__(528);
                const parseJson = __webpack_require__(32);
                const pify = __webpack_require__(802);

                const parse = (data, fp) => parseJson(stripBom(data), path.relative('.', fp));

                module.exports = fp => pify(fs.readFile)(fp, 'utf8').then(data => parse(data, fp));
                module.exports.sync = fp => parse(fs.readFileSync(fp, 'utf8'), fp);


                /***/ }),

            /***/ 39:
            /***/ (function(module) {

                "use strict";

                module.exports = opts => {
                    opts = opts || {};

                    const env = opts.env || process.env;
                    const platform = opts.platform || process.platform;

                    if (platform !== 'win32') {
                        return 'PATH';
                    }

                    return Object.keys(env).find(x => x.toUpperCase() === 'PATH') || 'Path';
                };


                /***/ }),

            /***/ 49:
            /***/ (function(module, __unusedexports, __webpack_require__) {

                "use strict";

                const os = __webpack_require__(87);
                const execa = __webpack_require__(955);

// Reference: https://www.gaijin.at/en/lstwinver.php
                const names = new Map([
                    ['10.0', '10'],
                    ['6.3', '8.1'],
                    ['6.2', '8'],
                    ['6.1', '7'],
                    ['6.0', 'Vista'],
                    ['5.2', 'Server 2003'],
                    ['5.1', 'XP'],
                    ['5.0', '2000'],
                    ['4.9', 'ME'],
                    ['4.1', '98'],
                    ['4.0', '95']
                ]);

                const windowsRelease = release => {
                    const version = /\d+\.\d/.exec(release || os.release());

                    if (release && !version) {
                        throw new Error('`release` argument doesn\'t match `n.n`');
                    }

                    const ver = (version || [])[0];

                    // Server 2008, 2012, 2016, and 2019 versions are ambiguous with desktop versions and must be detected at runtime.
                    // If `release` is omitted or we're on a Windows system, and the version number is an ambiguous version
                    // then use `wmic` to get the OS caption: https://msdn.microsoft.com/en-us/library/aa394531(v=vs.85).aspx
                    // If `wmic` is obsoloete (later versions of Windows 10), use PowerShell instead.
                    // If the resulting caption contains the year 2008, 2012, 2016 or 2019, it is a server version, so return a server OS name.
                    if ((!release || release === os.release()) && ['6.1', '6.2', '6.3', '10.0'].includes(ver)) {
                        let stdout;
                        try {
                            stdout = execa.sync('wmic', ['os', 'get', 'Caption']).stdout || '';
                        } catch (_) {
                            stdout = execa.sync('powershell', ['(Get-CimInstance -ClassName Win32_OperatingSystem).caption']).stdout || '';
                        }

                        const year = (stdout.match(/2008|2012|2016|2019/) || [])[0];

                        if (year) {
                            return `Server ${year}`;
                        }
                    }

                    return names.get(ver);
                };

                module.exports = windowsRelease;


                /***/ }),

            /***/ 58:
            /***/ (function(module) {

                module.exports = require("readline");

                /***/ }),

            /***/ 62:
            /***/ (function(__unusedmodule, exports, __webpack_require__) {

                "use strict";


                Object.defineProperty(exports, "__esModule", {
                    value: true
                });
                Object.defineProperty(exports, "v1", {
                    enumerable: true,
                    get: function () {
                        return _v.default;
                    }
                });
                Object.defineProperty(exports, "v3", {
                    enumerable: true,
                    get: function () {
                        return _v2.default;
                    }
                });
                Object.defineProperty(exports, "v4", {
                    enumerable: true,
                    get: function () {
                        return _v3.default;
                    }
                });
                Object.defineProperty(exports, "v5", {
                    enumerable: true,
                    get: function () {
                        return _v4.default;
                    }
                });
                Object.defineProperty(exports, "NIL", {
                    enumerable: true,
                    get: function () {
                        return _nil.default;
                    }
                });
                Object.defineProperty(exports, "version", {
                    enumerable: true,
                    get: function () {
                        return _version.default;
                    }
                });
                Object.defineProperty(exports, "validate", {
                    enumerable: true,
                    get: function () {
                        return _validate.default;
                    }
                });
                Object.defineProperty(exports, "stringify", {
                    enumerable: true,
                    get: function () {
                        return _stringify.default;
                    }
                });
                Object.defineProperty(exports, "parse", {
                    enumerable: true,
                    get: function () {
                        return _parse.default;
                    }
                });

                var _v = _interopRequireDefault(__webpack_require__(893));

                var _v2 = _interopRequireDefault(__webpack_require__(209));

                var _v3 = _interopRequireDefault(__webpack_require__(733));

                var _v4 = _interopRequireDefault(__webpack_require__(384));

                var _nil = _interopRequireDefault(__webpack_require__(327));

                var _version = _interopRequireDefault(__webpack_require__(695));

                var _validate = _interopRequireDefault(__webpack_require__(78));

                var _stringify = _interopRequireDefault(__webpack_require__(411));

                var _parse = _interopRequireDefault(__webpack_require__(22));

                function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

                /***/ }),

            /***/ 72:
            /***/ (function(module) {

                "use strict";

                module.exports = cb => new Promise(resolve => {
                    resolve(cb());
                });


                /***/ }),

            /***/ 78:
            /***/ (function(__unusedmodule, exports, __webpack_require__) {

                "use strict";


                Object.defineProperty(exports, "__esModule", {
                    value: true
                });
                exports.default = void 0;

                var _regex = _interopRequireDefault(__webpack_require__(456));

                function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

                function validate(uuid) {
                    return typeof uuid === 'string' && _regex.default.test(uuid);
                }

                var _default = validate;
                exports.default = _default;

                /***/ }),

            /***/ 80:
            /***/ (function(module) {

                "use strict";


                module.exports = parseJson
                function parseJson (txt, reviver, context) {
                    context = context || 20
                    try {
                        return JSON.parse(txt, reviver)
                    } catch (e) {
                        if (typeof txt !== 'string') {
                            const isEmptyArray = Array.isArray(txt) && txt.length === 0
                            const errorMessage = 'Cannot parse ' +
                                (isEmptyArray ? 'an empty array' : String(txt))
                            throw new TypeError(errorMessage)
                        }
                        const syntaxErr = e.message.match(/^Unexpected token.*position\s+(\d+)/i)
                        const errIdx = syntaxErr
                            ? +syntaxErr[1]
                            : e.message.match(/^Unexpected end of JSON.*/i)
                                ? txt.length - 1
                                : null
                        if (errIdx != null) {
                            const start = errIdx <= context
                                ? 0
                                : errIdx - context
                            const end = errIdx + context >= txt.length
                                ? txt.length
                                : errIdx + context
                            e.message += ` while parsing near '${
                                start === 0 ? '' : '...'
                            }${txt.slice(start, end)}${
                                end === txt.length ? '' : '...'
                            }'`
                        } else {
                            e.message += ` while parsing '${txt.slice(0, context * 2)}'`
                        }
                        throw e
                    }
                }


                /***/ }),

            /***/ 82:
            /***/ (function(__unusedmodule, exports) {

                "use strict";

// We use any as a valid input type
                /* eslint-disable @typescript-eslint/no-explicit-any */
                Object.defineProperty(exports, "__esModule", { value: true });
                exports.toCommandProperties = exports.toCommandValue = void 0;
                /**
                 * Sanitizes an input into a string so it can be passed into issueCommand safely
                 * @param input input to sanitize into a string
                 */
                function toCommandValue(input) {
                    if (input === null || input === undefined) {
                        return '';
                    }
                    else if (typeof input === 'string' || input instanceof String) {
                        return input;
                    }
                    return JSON.stringify(input);
                }
                exports.toCommandValue = toCommandValue;
                /**
                 *
                 * @param annotationProperties
                 * @returns The command properties to send with the actual annotation command
                 * See IssueCommandProperties: https://github.com/actions/runner/blob/main/src/Runner.Worker/ActionCommandManager.cs#L646
                 */
                function toCommandProperties(annotationProperties) {
                    if (!Object.keys(annotationProperties).length) {
                        return {};
                    }
                    return {
                        title: annotationProperties.title,
                        file: annotationProperties.file,
                        line: annotationProperties.startLine,
                        endLine: annotationProperties.endLine,
                        col: annotationProperties.startColumn,
                        endColumn: annotationProperties.endColumn
                    };
                }
                exports.toCommandProperties = toCommandProperties;
//# sourceMappingURL=utils.js.map

                /***/ }),

            /***/ 87:
            /***/ (function(module) {

                module.exports = require("os");

                /***/ }),

            /***/ 93:
            /***/ (function(module, __unusedexports, __webpack_require__) {

                var Stream = __webpack_require__(794).Stream

                module.exports = legacy

                function legacy (fs) {
                    return {
                        ReadStream: ReadStream,
                        WriteStream: WriteStream
                    }

                    function ReadStream (path, options) {
                        if (!(this instanceof ReadStream)) return new ReadStream(path, options);

                        Stream.call(this);

                        var self = this;

                        this.path = path;
                        this.fd = null;
                        this.readable = true;
                        this.paused = false;

                        this.flags = 'r';
                        this.mode = 438; /*=0666*/
                        this.bufferSize = 64 * 1024;

                        options = options || {};

                        // Mixin options into this
                        var keys = Object.keys(options);
                        for (var index = 0, length = keys.length; index < length; index++) {
                            var key = keys[index];
                            this[key] = options[key];
                        }

                        if (this.encoding) this.setEncoding(this.encoding);

                        if (this.start !== undefined) {
                            if ('number' !== typeof this.start) {
                                throw TypeError('start must be a Number');
                            }
                            if (this.end === undefined) {
                                this.end = Infinity;
                            } else if ('number' !== typeof this.end) {
                                throw TypeError('end must be a Number');
                            }

                            if (this.start > this.end) {
                                throw new Error('start must be <= end');
                            }

                            this.pos = this.start;
                        }

                        if (this.fd !== null) {
                            process.nextTick(function() {
                                self._read();
                            });
                            return;
                        }

                        fs.open(this.path, this.flags, this.mode, function (err, fd) {
                            if (err) {
                                self.emit('error', err);
                                self.readable = false;
                                return;
                            }

                            self.fd = fd;
                            self.emit('open', fd);
                            self._read();
                        })
                    }

                    function WriteStream (path, options) {
                        if (!(this instanceof WriteStream)) return new WriteStream(path, options);

                        Stream.call(this);

                        this.path = path;
                        this.fd = null;
                        this.writable = true;

                        this.flags = 'w';
                        this.encoding = 'binary';
                        this.mode = 438; /*=0666*/
                        this.bytesWritten = 0;

                        options = options || {};

                        // Mixin options into this
                        var keys = Object.keys(options);
                        for (var index = 0, length = keys.length; index < length; index++) {
                            var key = keys[index];
                            this[key] = options[key];
                        }

                        if (this.start !== undefined) {
                            if ('number' !== typeof this.start) {
                                throw TypeError('start must be a Number');
                            }
                            if (this.start < 0) {
                                throw new Error('start must be >= zero');
                            }

                            this.pos = this.start;
                        }

                        this.busy = false;
                        this._queue = [];

                        if (this.fd === null) {
                            this._open = fs.open;
                            this._queue.push([this._open, this.path, this.flags, this.mode, undefined]);
                            this.flush();
                        }
                    }
                }


                /***/ }),

            /***/ 102:
            /***/ (function(__unusedmodule, exports, __webpack_require__) {

                "use strict";

// For internal use, subject to change.
                var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
                    if (k2 === undefined) k2 = k;
                    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
                }) : (function(o, m, k, k2) {
                    if (k2 === undefined) k2 = k;
                    o[k2] = m[k];
                }));
                var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
                    Object.defineProperty(o, "default", { enumerable: true, value: v });
                }) : function(o, v) {
                    o["default"] = v;
                });
                var __importStar = (this && this.__importStar) || function (mod) {
                    if (mod && mod.__esModule) return mod;
                    var result = {};
                    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
                    __setModuleDefault(result, mod);
                    return result;
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                exports.prepareKeyValueMessage = exports.issueFileCommand = void 0;
// We use any as a valid input type
                /* eslint-disable @typescript-eslint/no-explicit-any */
                const fs = __importStar(__webpack_require__(747));
                const os = __importStar(__webpack_require__(87));
                const uuid_1 = __webpack_require__(62);
                const utils_1 = __webpack_require__(82);
                function issueFileCommand(command, message) {
                    const filePath = process.env[`GITHUB_${command}`];
                    if (!filePath) {
                        throw new Error(`Unable to find environment variable for file command ${command}`);
                    }
                    if (!fs.existsSync(filePath)) {
                        throw new Error(`Missing file at path: ${filePath}`);
                    }
                    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
                        encoding: 'utf8'
                    });
                }
                exports.issueFileCommand = issueFileCommand;
                function prepareKeyValueMessage(key, value) {
                    const delimiter = `ghadelimiter_${uuid_1.v4()}`;
                    const convertedValue = utils_1.toCommandValue(value);
                    // These should realistically never happen, but just in case someone finds a
                    // way to exploit uuid generation let's not allow keys or values that contain
                    // the delimiter.
                    if (key.includes(delimiter)) {
                        throw new Error(`Unexpected input: name should not contain the delimiter "${delimiter}"`);
                    }
                    if (convertedValue.includes(delimiter)) {
                        throw new Error(`Unexpected input: value should not contain the delimiter "${delimiter}"`);
                    }
                    return `${key}<<${delimiter}${os.EOL}${convertedValue}${os.EOL}${delimiter}`;
                }
                exports.prepareKeyValueMessage = prepareKeyValueMessage;
//# sourceMappingURL=file-command.js.map

                /***/ }),

            /***/ 104:
            /***/ (function(__unusedmodule, __unusedexports, __webpack_require__) {

                const core = __webpack_require__(470);
                const fs = __webpack_require__(747);
                const path = __webpack_require__(622);
                const { spawn } = __webpack_require__(129);
                const { Toolkit } = __webpack_require__(461);

// Get config
                const GH_USERNAME = core.getInput("GH_USERNAME");
                const COMMIT_NAME = core.getInput("COMMIT_NAME");
                const COMMIT_EMAIL = core.getInput("COMMIT_EMAIL");
                const COMMIT_MSG = core.getInput("COMMIT_MSG");
                const MAX_LINES = core.getInput("MAX_LINES");
                const TARGET_FILE = core.getInput("TARGET_FILE");

                /**
                 * Returns the sentence case representation
                 * @param {String} str - the string
                 *
                 * @returns {String}
                 */

                const capitalize = (str) => str.slice(0, 1).toUpperCase() + str.slice(1);

                /**
                 * Returns a URL in markdown format for PR's and issues
                 * @param {Object | String} item - holds information concerning the issue/PR
                 *
                 * @returns {String}
                 */
                const toUrlFormat = (item) => {
                    if (typeof item !== "object") {
                        return `[${item}](https://github.com/${item})`;
                    }
                    if (Object.hasOwnProperty.call(item.payload, "comment")) {
                        return `[#${item.payload.issue.number}](${item.payload.comment.html_url})`;
                    }
                    if (Object.hasOwnProperty.call(item.payload, "issue")) {
                        return `[#${item.payload.issue.number}](${item.payload.issue.html_url})`;
                    }
                    if (Object.hasOwnProperty.call(item.payload, "pull_request")) {
                        return `[#${item.payload.pull_request.number}](${item.payload.pull_request.html_url})`;
                    }

                    if (Object.hasOwnProperty.call(item.payload, "release")) {
                        const release = item.payload.release.name || item.payload.release.tag_name;
                        return `[${release}](${item.payload.release.html_url})`;
                    }
                };

                /**
                 * Execute shell command
                 * @param {String} cmd - root command
                 * @param {String[]} args - args to be passed along with
                 *
                 * @returns {Promise<void>}
                 */

                const exec = (cmd, args = []) =>
                    new Promise((resolve, reject) => {
                        const app = spawn(cmd, args);

                        let stdout = "";
                        if (app.stdout) {
                            app.stdout.on("data", (data) => {
                                stdout += data.toString();
                            });
                        }

                        let stderr = "";
                        if (app.stderr) {
                            app.stderr.on("data", (data) => {
                                stderr += data.toString();
                            });
                        }

                        app.on("close", (code) => {
                            if (code !== 0 && !stdout.includes("nothing to commit")) {
                                return reject({ code, stderr });
                            }

                            return resolve();
                        });

                        app.on("error", () => reject({ code: 1, stderr }));
                    });

                /**
                 * Make a commit
                 *
                 * @returns {Promise<void>}
                 */

                const commitFile = async () => {
                    await exec("git", ["config", "--global", "user.email", COMMIT_EMAIL]);
                    await exec("git", ["config", "--global", "user.name", COMMIT_NAME]);
                    await exec("git", ["add", TARGET_FILE]);
                    await exec("git", ["commit", "-m", COMMIT_MSG]);
                    await exec("git", ["push"]);
                };

                const serializers = {
                    IssueCommentEvent: (item) => {
                        return `🗣 Commented on ${toUrlFormat(item)} in ${toUrlFormat(
                            item.repo.name
                        )}`;
                    },
                    IssuesEvent: (item) => {
                        let emoji = "";

                        switch (item.payload.action) {
                            case "opened":
                                emoji = "❗";
                                break;
                            case "reopened":
                                emoji = "🔓";
                                break;
                            case "closed":
                                emoji = "🔒";
                                break;
                        }

                        return `${emoji} ${capitalize(item.payload.action)} issue ${toUrlFormat(
                            item
                        )} in ${toUrlFormat(item.repo.name)}`;
                    },
                    PullRequestEvent: (item) => {
                        const emoji = item.payload.action === "opened" ? "💪" : "❌";
                        const line = item.payload.pull_request.merged
                            ? "🎉 Merged"
                            : `${emoji} ${capitalize(item.payload.action)}`;
                        return `${line} PR ${toUrlFormat(item)} in ${toUrlFormat(item.repo.name)}`;
                    },
                    ReleaseEvent: (item) => {
                        return `🚀 ${capitalize(item.payload.action)} release ${toUrlFormat(
                            item
                        )} in ${toUrlFormat(item.repo.name)}`;
                    },
                };

                Toolkit.run(
                    async (tools) => {
                        // Get the user's public events
                        tools.log.debug(`Getting activity for ${GH_USERNAME}`);
                        const events = await tools.github.activity.listPublicEventsForUser({
                            username: GH_USERNAME,
                            per_page: 100,
                        });
                        tools.log.debug(
                            `Activity for ${GH_USERNAME}, ${events.data.length} events found.`
                        );

                        const content = events.data
                            // Filter out any boring activity
                            .filter((event) => serializers.hasOwnProperty(event.type))
                            // We only have five lines to work with
                            .slice(0, MAX_LINES)
                            // Call the serializer to construct a string
                            .map((item) => serializers[item.type](item));

                        const readmeContent = fs
                            .readFileSync(`./${TARGET_FILE}`, "utf-8")
                            .split("\n");

                        // Find the index corresponding to <!--START_SECTION:activity--> comment
                        let startIdx = readmeContent.findIndex(
                            (content) => content.trim() === "<!--START_SECTION:activity-->"
                        );

                        // Early return in case the <!--START_SECTION:activity--> comment was not found
                        if (startIdx === -1) {
                            return tools.exit.failure(
                                `Couldn't find the <!--START_SECTION:activity--> comment. Exiting!`
                            );
                        }

                        // Find the index corresponding to <!--END_SECTION:activity--> comment
                        const endIdx = readmeContent.findIndex(
                            (content) => content.trim() === "<!--END_SECTION:activity-->"
                        );

                        if (!content.length) {
                            tools.exit.success(
                                "No PullRequest/Issue/IssueComment/Release events found. Leaving README unchanged with previous activity"
                            );
                        }

                        if (content.length < 5) {
                            tools.log.info("Found less than 5 activities");
                        }

                        if (startIdx !== -1 && endIdx === -1) {
                            // Add one since the content needs to be inserted just after the initial comment
                            startIdx++;
                            content.forEach((line, idx) =>
                                readmeContent.splice(startIdx + idx, 0, `${idx + 1}. ${line}`)
                            );

                            // Append <!--END_SECTION:activity--> comment
                            readmeContent.splice(
                                startIdx + content.length,
                                0,
                                "<!--END_SECTION:activity-->"
                            );

                            // Update README
                            fs.writeFileSync(`./${TARGET_FILE}`, readmeContent.join("\n"));

                            // Commit to the remote repository
                            try {
                                await commitFile();
                            } catch (err) {
                                const message = `Exit code: ${err.code}\n${err.stderr}`;
                                return tools.exit.failure(message);
                            }
                            tools.exit.success("Wrote to README");
                        }

                        const oldContent = readmeContent.slice(startIdx + 1, endIdx).join("\n");
                        const newContent = content
                            .map((line, idx) => `${idx + 1}. ${line}`)
                            .join("\n");

                        if (oldContent.trim() === newContent.trim())
                            tools.exit.success("No changes detected");

                        startIdx++;

                        // Recent GitHub Activity content between the comments
                        const readmeActivitySection = readmeContent.slice(startIdx, endIdx);
                        if (!readmeActivitySection.length) {
                            content.some((line, idx) => {
                                // User doesn't have 5 public events
                                if (!line) {
                                    return true;
                                }
                                readmeContent.splice(startIdx + idx, 0, `${idx + 1}. ${line}`);
                            });
                            tools.log.success(`Wrote to ${TARGET_FILE}`);
                        } else {
                            // It is likely that a newline is inserted after the <!--START_SECTION:activity--> comment (code formatter)
                            let count = 0;

                            readmeActivitySection.some((line, idx) => {
                                // User doesn't have 5 public events
                                if (!content[count]) {
                                    return true;
                                }
                                if (line !== "") {
                                    readmeContent[startIdx + idx] = `${count + 1}. ${content[count]}`;
                                    count++;
                                }
                            });
                            tools.log.success(`Updated ${TARGET_FILE} with the recent activity`);
                        }

                        // Update README
                        fs.writeFileSync(`./${TARGET_FILE}`, readmeContent.join("\n"));

                        // Commit to the remote repository
                        try {
                            await commitFile();
                        } catch (err) {
                            const message = `Exit code: ${err.code}\n${err.stderr}`;
                            return tools.exit.failure(message);
                        }
                        tools.exit.success("Pushed to remote repository");
                    },
                    {
                        event: ["schedule", "workflow_dispatch"],
                        secrets: ["GITHUB_TOKEN"],
                    }
                );


                /***/ }),

            /***/ 109:
            /***/ (function(module) {

                "use strict";


                function hasKey(obj, keys) {
                    var o = obj;
                    keys.slice(0, -1).forEach(function (key) {
                        o = o[key] || {};
                    });

                    var key = keys[keys.length - 1];
                    return key in o;
                }

                function isNumber(x) {
                    if (typeof x === 'number') { return true; }
                    if ((/^0x[0-9a-f]+$/i).test(x)) { return true; }
                    return (/^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(e[-+]?\d+)?$/).test(x);
                }

                function isConstructorOrProto(obj, key) {
                    return (key === 'constructor' && typeof obj[key] === 'function') || key === '__proto__';
                }

                module.exports = function (args, opts) {
                    if (!opts) { opts = {}; }

                    var flags = {
                        bools: {},
                        strings: {},
                        unknownFn: null,
                    };

                    if (typeof opts.unknown === 'function') {
                        flags.unknownFn = opts.unknown;
                    }

                    if (typeof opts.boolean === 'boolean' && opts.boolean) {
                        flags.allBools = true;
                    } else {
                        [].concat(opts.boolean).filter(Boolean).forEach(function (key) {
                            flags.bools[key] = true;
                        });
                    }

                    var aliases = {};

                    function aliasIsBoolean(key) {
                        return aliases[key].some(function (x) {
                            return flags.bools[x];
                        });
                    }

                    Object.keys(opts.alias || {}).forEach(function (key) {
                        aliases[key] = [].concat(opts.alias[key]);
                        aliases[key].forEach(function (x) {
                            aliases[x] = [key].concat(aliases[key].filter(function (y) {
                                return x !== y;
                            }));
                        });
                    });

                    [].concat(opts.string).filter(Boolean).forEach(function (key) {
                        flags.strings[key] = true;
                        if (aliases[key]) {
                            [].concat(aliases[key]).forEach(function (k) {
                                flags.strings[k] = true;
                            });
                        }
                    });

                    var defaults = opts.default || {};

                    var argv = { _: [] };

                    function argDefined(key, arg) {
                        return (flags.allBools && (/^--[^=]+$/).test(arg))
                            || flags.strings[key]
                            || flags.bools[key]
                            || aliases[key];
                    }

                    function setKey(obj, keys, value) {
                        var o = obj;
                        for (var i = 0; i < keys.length - 1; i++) {
                            var key = keys[i];
                            if (isConstructorOrProto(o, key)) { return; }
                            if (o[key] === undefined) { o[key] = {}; }
                            if (
                                o[key] === Object.prototype
                                || o[key] === Number.prototype
                                || o[key] === String.prototype
                            ) {
                                o[key] = {};
                            }
                            if (o[key] === Array.prototype) { o[key] = []; }
                            o = o[key];
                        }

                        var lastKey = keys[keys.length - 1];
                        if (isConstructorOrProto(o, lastKey)) { return; }
                        if (
                            o === Object.prototype
                            || o === Number.prototype
                            || o === String.prototype
                        ) {
                            o = {};
                        }
                        if (o === Array.prototype) { o = []; }
                        if (o[lastKey] === undefined || flags.bools[lastKey] || typeof o[lastKey] === 'boolean') {
                            o[lastKey] = value;
                        } else if (Array.isArray(o[lastKey])) {
                            o[lastKey].push(value);
                        } else {
                            o[lastKey] = [o[lastKey], value];
                        }
                    }

                    function setArg(key, val, arg) {
                        if (arg && flags.unknownFn && !argDefined(key, arg)) {
                            if (flags.unknownFn(arg) === false) { return; }
                        }

                        var value = !flags.strings[key] && isNumber(val)
                            ? Number(val)
                            : val;
                        setKey(argv, key.split('.'), value);

                        (aliases[key] || []).forEach(function (x) {
                            setKey(argv, x.split('.'), value);
                        });
                    }

                    Object.keys(flags.bools).forEach(function (key) {
                        setArg(key, defaults[key] === undefined ? false : defaults[key]);
                    });

                    var notFlags = [];

                    if (args.indexOf('--') !== -1) {
                        notFlags = args.slice(args.indexOf('--') + 1);
                        args = args.slice(0, args.indexOf('--'));
                    }

                    for (var i = 0; i < args.length; i++) {
                        var arg = args[i];
                        var key;
                        var next;

                        if ((/^--.+=/).test(arg)) {
                            // Using [\s\S] instead of . because js doesn't support the
                            // 'dotall' regex modifier. See:
                            // http://stackoverflow.com/a/1068308/13216
                            var m = arg.match(/^--([^=]+)=([\s\S]*)$/);
                            key = m[1];
                            var value = m[2];
                            if (flags.bools[key]) {
                                value = value !== 'false';
                            }
                            setArg(key, value, arg);
                        } else if ((/^--no-.+/).test(arg)) {
                            key = arg.match(/^--no-(.+)/)[1];
                            setArg(key, false, arg);
                        } else if ((/^--.+/).test(arg)) {
                            key = arg.match(/^--(.+)/)[1];
                            next = args[i + 1];
                            if (
                                next !== undefined
                                && !(/^(-|--)[^-]/).test(next)
                                && !flags.bools[key]
                                && !flags.allBools
                                && (aliases[key] ? !aliasIsBoolean(key) : true)
                            ) {
                                setArg(key, next, arg);
                                i += 1;
                            } else if ((/^(true|false)$/).test(next)) {
                                setArg(key, next === 'true', arg);
                                i += 1;
                            } else {
                                setArg(key, flags.strings[key] ? '' : true, arg);
                            }
                        } else if ((/^-[^-]+/).test(arg)) {
                            var letters = arg.slice(1, -1).split('');

                            var broken = false;
                            for (var j = 0; j < letters.length; j++) {
                                next = arg.slice(j + 2);

                                if (next === '-') {
                                    setArg(letters[j], next, arg);
                                    continue;
                                }

                                if ((/[A-Za-z]/).test(letters[j]) && next[0] === '=') {
                                    setArg(letters[j], next.slice(1), arg);
                                    broken = true;
                                    break;
                                }

                                if (
                                    (/[A-Za-z]/).test(letters[j])
                                    && (/-?\d+(\.\d*)?(e-?\d+)?$/).test(next)
                                ) {
                                    setArg(letters[j], next, arg);
                                    broken = true;
                                    break;
                                }

                                if (letters[j + 1] && letters[j + 1].match(/\W/)) {
                                    setArg(letters[j], arg.slice(j + 2), arg);
                                    broken = true;
                                    break;
                                } else {
                                    setArg(letters[j], flags.strings[letters[j]] ? '' : true, arg);
                                }
                            }

                            key = arg.slice(-1)[0];
                            if (!broken && key !== '-') {
                                if (
                                    args[i + 1]
                                    && !(/^(-|--)[^-]/).test(args[i + 1])
                                    && !flags.bools[key]
                                    && (aliases[key] ? !aliasIsBoolean(key) : true)
                                ) {
                                    setArg(key, args[i + 1], arg);
                                    i += 1;
                                } else if (args[i + 1] && (/^(true|false)$/).test(args[i + 1])) {
                                    setArg(key, args[i + 1] === 'true', arg);
                                    i += 1;
                                } else {
                                    setArg(key, flags.strings[key] ? '' : true, arg);
                                }
                            }
                        } else {
                            if (!flags.unknownFn || flags.unknownFn(arg) !== false) {
                                argv._.push(flags.strings._ || !isNumber(arg) ? arg : Number(arg));
                            }
                            if (opts.stopEarly) {
                                argv._.push.apply(argv._, args.slice(i + 1));
                                break;
                            }
                        }
                    }

                    Object.keys(defaults).forEach(function (k) {
                        if (!hasKey(argv, k.split('.'))) {
                            setKey(argv, k.split('.'), defaults[k]);

                            (aliases[k] || []).forEach(function (x) {
                                setKey(argv, x.split('.'), defaults[k]);
                            });
                        }
                    });

                    if (opts['--']) {
                        argv['--'] = notFlags.slice();
                    } else {
                        notFlags.forEach(function (k) {
                            argv._.push(k);
                        });
                    }

                    return argv;
                };


                /***/ }),

            /***/ 118:
            /***/ (function(module, __unusedexports, __webpack_require__) {

                "use strict";

                const os = __webpack_require__(87);

                const nameMap = new Map([
                    [21, ['Monterey', '12']],
                    [20, ['Big Sur', '11']],
                    [19, ['Catalina', '10.15']],
                    [18, ['Mojave', '10.14']],
                    [17, ['High Sierra', '10.13']],
                    [16, ['Sierra', '10.12']],
                    [15, ['El Capitan', '10.11']],
                    [14, ['Yosemite', '10.10']],
                    [13, ['Mavericks', '10.9']],
                    [12, ['Mountain Lion', '10.8']],
                    [11, ['Lion', '10.7']],
                    [10, ['Snow Leopard', '10.6']],
                    [9, ['Leopard', '10.5']],
                    [8, ['Tiger', '10.4']],
                    [7, ['Panther', '10.3']],
                    [6, ['Jaguar', '10.2']],
                    [5, ['Puma', '10.1']]
                ]);

                const macosRelease = release => {
                    release = Number((release || os.release()).split('.')[0]);

                    const [name, version] = nameMap.get(release) || ['Unknown', ''];

                    return {
                        name,
                        version
                    };
                };

                module.exports = macosRelease;
// TODO: remove this in the next major version
                module.exports.default = macosRelease;


                /***/ }),

            /***/ 120:
            /***/ (function(module) {

                "use strict";


                module.exports.mixin = function mixin(target, source) {
                    const keys = Object.getOwnPropertyNames(source);
                    for (let i = 0; i < keys.length; ++i) {
                        Object.defineProperty(target, keys[i], Object.getOwnPropertyDescriptor(source, keys[i]));
                    }
                };

                module.exports.wrapperSymbol = Symbol("wrapper");
                module.exports.implSymbol = Symbol("impl");

                module.exports.wrapperForImpl = function (impl) {
                    return impl[module.exports.wrapperSymbol];
                };

                module.exports.implForWrapper = function (wrapper) {
                    return wrapper[module.exports.implSymbol];
                };



                /***/ }),

            /***/ 129:
            /***/ (function(module) {

                module.exports = require("child_process");

                /***/ }),

            /***/ 138:
            /***/ (function(module) {

                "use strict";


                var matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;

                module.exports = function (str) {
                    if (typeof str !== 'string') {
                        throw new TypeError('Expected a string');
                    }

                    return str.replace(matchOperatorsRe, '\\$&');
                };


                /***/ }),

            /***/ 141:
            /***/ (function(__unusedmodule, exports, __webpack_require__) {

                "use strict";


                var net = __webpack_require__(631);
                var tls = __webpack_require__(16);
                var http = __webpack_require__(605);
                var https = __webpack_require__(211);
                var events = __webpack_require__(614);
                var assert = __webpack_require__(357);
                var util = __webpack_require__(669);


                exports.httpOverHttp = httpOverHttp;
                exports.httpsOverHttp = httpsOverHttp;
                exports.httpOverHttps = httpOverHttps;
                exports.httpsOverHttps = httpsOverHttps;


                function httpOverHttp(options) {
                    var agent = new TunnelingAgent(options);
                    agent.request = http.request;
                    return agent;
                }

                function httpsOverHttp(options) {
                    var agent = new TunnelingAgent(options);
                    agent.request = http.request;
                    agent.createSocket = createSecureSocket;
                    agent.defaultPort = 443;
                    return agent;
                }

                function httpOverHttps(options) {
                    var agent = new TunnelingAgent(options);
                    agent.request = https.request;
                    return agent;
                }

                function httpsOverHttps(options) {
                    var agent = new TunnelingAgent(options);
                    agent.request = https.request;
                    agent.createSocket = createSecureSocket;
                    agent.defaultPort = 443;
                    return agent;
                }


                function TunnelingAgent(options) {
                    var self = this;
                    self.options = options || {};
                    self.proxyOptions = self.options.proxy || {};
                    self.maxSockets = self.options.maxSockets || http.Agent.defaultMaxSockets;
                    self.requests = [];
                    self.sockets = [];

                    self.on('free', function onFree(socket, host, port, localAddress) {
                        var options = toOptions(host, port, localAddress);
                        for (var i = 0, len = self.requests.length; i < len; ++i) {
                            var pending = self.requests[i];
                            if (pending.host === options.host && pending.port === options.port) {
                                // Detect the request to connect same origin server,
                                // reuse the connection.
                                self.requests.splice(i, 1);
                                pending.request.onSocket(socket);
                                return;
                            }
                        }
                        socket.destroy();
                        self.removeSocket(socket);
                    });
                }
                util.inherits(TunnelingAgent, events.EventEmitter);

                TunnelingAgent.prototype.addRequest = function addRequest(req, host, port, localAddress) {
                    var self = this;
                    var options = mergeOptions({request: req}, self.options, toOptions(host, port, localAddress));

                    if (self.sockets.length >= this.maxSockets) {
                        // We are over limit so we'll add it to the queue.
                        self.requests.push(options);
                        return;
                    }

                    // If we are under maxSockets create a new one.
                    self.createSocket(options, function(socket) {
                        socket.on('free', onFree);
                        socket.on('close', onCloseOrRemove);
                        socket.on('agentRemove', onCloseOrRemove);
                        req.onSocket(socket);

                        function onFree() {
                            self.emit('free', socket, options);
                        }

                        function onCloseOrRemove(err) {
                            self.removeSocket(socket);
                            socket.removeListener('free', onFree);
                            socket.removeListener('close', onCloseOrRemove);
                            socket.removeListener('agentRemove', onCloseOrRemove);
                        }
                    });
                };

                TunnelingAgent.prototype.createSocket = function createSocket(options, cb) {
                    var self = this;
                    var placeholder = {};
                    self.sockets.push(placeholder);

                    var connectOptions = mergeOptions({}, self.proxyOptions, {
                        method: 'CONNECT',
                        path: options.host + ':' + options.port,
                        agent: false,
                        headers: {
                            host: options.host + ':' + options.port
                        }
                    });
                    if (options.localAddress) {
                        connectOptions.localAddress = options.localAddress;
                    }
                    if (connectOptions.proxyAuth) {
                        connectOptions.headers = connectOptions.headers || {};
                        connectOptions.headers['Proxy-Authorization'] = 'Basic ' +
                            new Buffer(connectOptions.proxyAuth).toString('base64');
                    }

                    debug('making CONNECT request');
                    var connectReq = self.request(connectOptions);
                    connectReq.useChunkedEncodingByDefault = false; // for v0.6
                    connectReq.once('response', onResponse); // for v0.6
                    connectReq.once('upgrade', onUpgrade);   // for v0.6
                    connectReq.once('connect', onConnect);   // for v0.7 or later
                    connectReq.once('error', onError);
                    connectReq.end();

                    function onResponse(res) {
                        // Very hacky. This is necessary to avoid http-parser leaks.
                        res.upgrade = true;
                    }

                    function onUpgrade(res, socket, head) {
                        // Hacky.
                        process.nextTick(function() {
                            onConnect(res, socket, head);
                        });
                    }

                    function onConnect(res, socket, head) {
                        connectReq.removeAllListeners();
                        socket.removeAllListeners();

                        if (res.statusCode !== 200) {
                            debug('tunneling socket could not be established, statusCode=%d',
                                res.statusCode);
                            socket.destroy();
                            var error = new Error('tunneling socket could not be established, ' +
                                'statusCode=' + res.statusCode);
                            error.code = 'ECONNRESET';
                            options.request.emit('error', error);
                            self.removeSocket(placeholder);
                            return;
                        }
                        if (head.length > 0) {
                            debug('got illegal response body from proxy');
                            socket.destroy();
                            var error = new Error('got illegal response body from proxy');
                            error.code = 'ECONNRESET';
                            options.request.emit('error', error);
                            self.removeSocket(placeholder);
                            return;
                        }
                        debug('tunneling connection has established');
                        self.sockets[self.sockets.indexOf(placeholder)] = socket;
                        return cb(socket);
                    }

                    function onError(cause) {
                        connectReq.removeAllListeners();

                        debug('tunneling socket could not be established, cause=%s\n',
                            cause.message, cause.stack);
                        var error = new Error('tunneling socket could not be established, ' +
                            'cause=' + cause.message);
                        error.code = 'ECONNRESET';
                        options.request.emit('error', error);
                        self.removeSocket(placeholder);
                    }
                };

                TunnelingAgent.prototype.removeSocket = function removeSocket(socket) {
                    var pos = this.sockets.indexOf(socket)
                    if (pos === -1) {
                        return;
                    }
                    this.sockets.splice(pos, 1);

                    var pending = this.requests.shift();
                    if (pending) {
                        // If we have pending requests and a socket gets closed a new one
                        // needs to be created to take over in the pool for the one that closed.
                        this.createSocket(pending, function(socket) {
                            pending.request.onSocket(socket);
                        });
                    }
                };

                function createSecureSocket(options, cb) {
                    var self = this;
                    TunnelingAgent.prototype.createSocket.call(self, options, function(socket) {
                        var hostHeader = options.request.getHeader('host');
                        var tlsOptions = mergeOptions({}, self.options, {
                            socket: socket,
                            servername: hostHeader ? hostHeader.replace(/:.*$/, '') : options.host
                        });

                        // 0 is dummy port for v0.6
                        var secureSocket = tls.connect(0, tlsOptions);
                        self.sockets[self.sockets.indexOf(socket)] = secureSocket;
                        cb(secureSocket);
                    });
                }


                function toOptions(host, port, localAddress) {
                    if (typeof host === 'string') { // since v0.10
                        return {
                            host: host,
                            port: port,
                            localAddress: localAddress
                        };
                    }
                    return host; // for v0.11 or later
                }

                function mergeOptions(target) {
                    for (var i = 1, len = arguments.length; i < len; ++i) {
                        var overrides = arguments[i];
                        if (typeof overrides === 'object') {
                            var keys = Object.keys(overrides);
                            for (var j = 0, keyLen = keys.length; j < keyLen; ++j) {
                                var k = keys[j];
                                if (overrides[k] !== undefined) {
                                    target[k] = overrides[k];
                                }
                            }
                        }
                    }
                    return target;
                }


                var debug;
                if (process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG)) {
                    debug = function() {
                        var args = Array.prototype.slice.call(arguments);
                        if (typeof args[0] === 'string') {
                            args[0] = 'TUNNEL: ' + args[0];
                        } else {
                            args.unshift('TUNNEL:');
                        }
                        console.error.apply(console, args);
                    }
                } else {
                    debug = function() {};
                }
                exports.debug = debug; // for test


                /***/ }),

            /***/ 145:
            /***/ (function(module, __unusedexports, __webpack_require__) {

                "use strict";

                const pump = __webpack_require__(453);
                const bufferStream = __webpack_require__(966);

                class MaxBufferError extends Error {
                    constructor() {
                        super('maxBuffer exceeded');
                        this.name = 'MaxBufferError';
                    }
                }

                function getStream(inputStream, options) {
                    if (!inputStream) {
                        return Promise.reject(new Error('Expected a stream'));
                    }

                    options = Object.assign({maxBuffer: Infinity}, options);

                    const {maxBuffer} = options;

                    let stream;
                    return new Promise((resolve, reject) => {
                        const rejectPromise = error => {
                            if (error) { // A null check
                                error.bufferedData = stream.getBufferedValue();
                            }
                            reject(error);
                        };

                        stream = pump(inputStream, bufferStream(options), error => {
                            if (error) {
                                rejectPromise(error);
                                return;
                            }

                            resolve();
                        });

                        stream.on('data', () => {
                            if (stream.getBufferedLength() > maxBuffer) {
                                rejectPromise(new MaxBufferError());
                            }
                        });
                    }).then(() => stream.getBufferedValue());
                }

                module.exports = getStream;
                module.exports.buffer = (stream, options) => getStream(stream, Object.assign({}, options, {encoding: 'buffer'}));
                module.exports.array = (stream, options) => getStream(stream, Object.assign({}, options, {array: true}));
                module.exports.MaxBufferError = MaxBufferError;


                /***/ }),

            /***/ 152:
            /***/ (function(__unusedmodule, exports, __webpack_require__) {

                "use strict";


                Object.defineProperty(exports, '__esModule', { value: true });

                var universalUserAgent = __webpack_require__(976);
                var beforeAfterHook = __webpack_require__(500);
                var request = __webpack_require__(298);
                var graphql = __webpack_require__(719);
                var authToken = __webpack_require__(699);

                function _defineProperty(obj, key, value) {
                    if (key in obj) {
                        Object.defineProperty(obj, key, {
                            value: value,
                            enumerable: true,
                            configurable: true,
                            writable: true
                        });
                    } else {
                        obj[key] = value;
                    }

                    return obj;
                }

                function ownKeys(object, enumerableOnly) {
                    var keys = Object.keys(object);

                    if (Object.getOwnPropertySymbols) {
                        var symbols = Object.getOwnPropertySymbols(object);
                        if (enumerableOnly) symbols = symbols.filter(function (sym) {
                            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
                        });
                        keys.push.apply(keys, symbols);
                    }

                    return keys;
                }

                function _objectSpread2(target) {
                    for (var i = 1; i < arguments.length; i++) {
                        var source = arguments[i] != null ? arguments[i] : {};

                        if (i % 2) {
                            ownKeys(Object(source), true).forEach(function (key) {
                                _defineProperty(target, key, source[key]);
                            });
                        } else if (Object.getOwnPropertyDescriptors) {
                            Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
                        } else {
                            ownKeys(Object(source)).forEach(function (key) {
                                Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
                            });
                        }
                    }

                    return target;
                }

                const VERSION = "2.5.4";

                class Octokit {
                    constructor(options = {}) {
                        const hook = new beforeAfterHook.Collection();
                        const requestDefaults = {
                            baseUrl: request.request.endpoint.DEFAULTS.baseUrl,
                            headers: {},
                            request: Object.assign({}, options.request, {
                                hook: hook.bind(null, "request")
                            }),
                            mediaType: {
                                previews: [],
                                format: ""
                            }
                        }; // prepend default user agent with `options.userAgent` if set

                        requestDefaults.headers["user-agent"] = [options.userAgent, `octokit-core.js/${VERSION} ${universalUserAgent.getUserAgent()}`].filter(Boolean).join(" ");

                        if (options.baseUrl) {
                            requestDefaults.baseUrl = options.baseUrl;
                        }

                        if (options.previews) {
                            requestDefaults.mediaType.previews = options.previews;
                        }

                        if (options.timeZone) {
                            requestDefaults.headers["time-zone"] = options.timeZone;
                        }

                        this.request = request.request.defaults(requestDefaults);
                        this.graphql = graphql.withCustomRequest(this.request).defaults(_objectSpread2(_objectSpread2({}, requestDefaults), {}, {
                            baseUrl: requestDefaults.baseUrl.replace(/\/api\/v3$/, "/api")
                        }));
                        this.log = Object.assign({
                            debug: () => {},
                            info: () => {},
                            warn: console.warn.bind(console),
                            error: console.error.bind(console)
                        }, options.log);
                        this.hook = hook; // (1) If neither `options.authStrategy` nor `options.auth` are set, the `octokit` instance
                        //     is unauthenticated. The `this.auth()` method is a no-op and no request hook is registred.
                        // (2) If only `options.auth` is set, use the default token authentication strategy.
                        // (3) If `options.authStrategy` is set then use it and pass in `options.auth`. Always pass own request as many strategies accept a custom request instance.
                        // TODO: type `options.auth` based on `options.authStrategy`.

                        if (!options.authStrategy) {
                            if (!options.auth) {
                                // (1)
                                this.auth = async () => ({
                                    type: "unauthenticated"
                                });
                            } else {
                                // (2)
                                const auth = authToken.createTokenAuth(options.auth); // @ts-ignore  ¯\_(ツ)_/¯

                                hook.wrap("request", auth.hook);
                                this.auth = auth;
                            }
                        } else {
                            const auth = options.authStrategy(Object.assign({
                                request: this.request
                            }, options.auth)); // @ts-ignore  ¯\_(ツ)_/¯

                            hook.wrap("request", auth.hook);
                            this.auth = auth;
                        } // apply plugins
                        // https://stackoverflow.com/a/16345172


                        const classConstructor = this.constructor;
                        classConstructor.plugins.forEach(plugin => {
                            Object.assign(this, plugin(this, options));
                        });
                    }

                    static defaults(defaults) {
                        const OctokitWithDefaults = class extends this {
                            constructor(...args) {
                                const options = args[0] || {};
                                super(Object.assign({}, defaults, options, options.userAgent && defaults.userAgent ? {
                                    userAgent: `${options.userAgent} ${defaults.userAgent}`
                                } : null));
                            }

                        };
                        return OctokitWithDefaults;
                    }
                    /**
                     * Attach a plugin (or many) to your Octokit instance.
                     *
                     * @example
                     * const API = Octokit.plugin(plugin1, plugin2, plugin3, ...)
                     */


                    static plugin(p1, ...p2) {
                        var _a;

                        if (p1 instanceof Array) {
                            console.warn(["Passing an array of plugins to Octokit.plugin() has been deprecated.", "Instead of:", "  Octokit.plugin([plugin1, plugin2, ...])", "Use:", "  Octokit.plugin(plugin1, plugin2, ...)"].join("\n"));
                        }

                        const currentPlugins = this.plugins;
                        let newPlugins = [...(p1 instanceof Array ? p1 : [p1]), ...p2];
                        const NewOctokit = (_a = class extends this {}, _a.plugins = currentPlugins.concat(newPlugins.filter(plugin => !currentPlugins.includes(plugin))), _a);
                        return NewOctokit;
                    }

                }
                Octokit.VERSION = VERSION;
                Octokit.plugins = [];

                exports.Octokit = Octokit;
//# sourceMappingURL=index.js.map


                /***/ }),

            /***/ 156:
            /***/ (function(module) {

                "use strict";


                module.exports = function isArrayish(obj) {
                    if (!obj) {
                        return false;
                    }

                    return obj instanceof Array || Array.isArray(obj) ||
                        (obj.length >= 0 && obj.splice instanceof Function);
                };


                /***/ }),

            /***/ 160:
            /***/ (function(__unusedmodule, exports) {

                "use strict";

                Object.defineProperty(exports, "__esModule", { value: true });
                exports.Exit = exports.NeutralCode = exports.FailureCode = exports.SuccessCode = void 0;
                /**
                 * The code to exit an action with a "success" state
                 */
                exports.SuccessCode = 0;
                /**
                 * The code to exit an action with a "failure" state
                 */
                exports.FailureCode = 1;
                /**
                 * The code to exit an action with a "neutral" state
                 */
                exports.NeutralCode = 78;
                var Exit = /** @class */ (function () {
                    function Exit(logger) {
                        this.logger = logger;
                    }
                    /**
                     * Stop the action with a "success" status
                     */
                    Exit.prototype.success = function (message) {
                        if (message)
                            this.logger.success(message);
                        process.exit(exports.SuccessCode);
                    };
                    /**
                     * Stop the action with a "neutral" status
                     */
                    Exit.prototype.neutral = function (message) {
                        if (message)
                            this.logger.info(message);
                        process.exit(exports.NeutralCode);
                    };
                    /**
                     * Stop the action with a "failed" status
                     */
                    Exit.prototype.failure = function (message) {
                        if (message)
                            this.logger.fatal(message);
                        process.exit(exports.FailureCode);
                    };
                    return Exit;
                }());
                exports.Exit = Exit;
//# sourceMappingURL=exit.js.map

                /***/ }),

            /***/ 168:
            /***/ (function(module) {

                "use strict";

                const alias = ['stdin', 'stdout', 'stderr'];

                const hasAlias = opts => alias.some(x => Boolean(opts[x]));

                module.exports = opts => {
                    if (!opts) {
                        return null;
                    }

                    if (opts.stdio && hasAlias(opts)) {
                        throw new Error(`It's not possible to provide \`stdio\` in combination with one of ${alias.map(x => `\`${x}\``).join(', ')}`);
                    }

                    if (typeof opts.stdio === 'string') {
                        return opts.stdio;
                    }

                    const stdio = opts.stdio || [];

                    if (!Array.isArray(stdio)) {
                        throw new TypeError(`Expected \`stdio\` to be of type \`string\` or \`Array\`, got \`${typeof stdio}\``);
                    }

                    const result = [];
                    const len = Math.max(stdio.length, alias.length);

                    for (let i = 0; i < len; i++) {
                        let value = null;

                        if (stdio[i] !== undefined) {
                            value = stdio[i];
                        } else if (opts[alias[i]] !== undefined) {
                            value = opts[alias[i]];
                        }

                        result[i] = value;
                    }

                    return result;
                };


                /***/ }),

            /***/ 176:
            /***/ (function(__unusedmodule, exports, __webpack_require__) {

                "use strict";


                exports.URL = __webpack_require__(880).interface;
                exports.serializeURL = __webpack_require__(856).serializeURL;
                exports.serializeURLOrigin = __webpack_require__(856).serializeURLOrigin;
                exports.basicURLParse = __webpack_require__(856).basicURLParse;
                exports.setTheUsername = __webpack_require__(856).setTheUsername;
                exports.setThePassword = __webpack_require__(856).setThePassword;
                exports.serializeHost = __webpack_require__(856).serializeHost;
                exports.serializeInteger = __webpack_require__(856).serializeInteger;
                exports.parseURL = __webpack_require__(856).parseURL;


                /***/ }),

            /***/ 177:
            /***/ (function(__unusedmodule, exports) {

                "use strict";

                Object.defineProperty(exports, "__esModule", { value: true });
                exports.checkBypass = exports.getProxyUrl = void 0;
                function getProxyUrl(reqUrl) {
                    const usingSsl = reqUrl.protocol === 'https:';
                    if (checkBypass(reqUrl)) {
                        return undefined;
                    }
                    const proxyVar = (() => {
                        if (usingSsl) {
                            return process.env['https_proxy'] || process.env['HTTPS_PROXY'];
                        }
                        else {
                            return process.env['http_proxy'] || process.env['HTTP_PROXY'];
                        }
                    })();
                    if (proxyVar) {
                        return new URL(proxyVar);
                    }
                    else {
                        return undefined;
                    }
                }
                exports.getProxyUrl = getProxyUrl;
                function checkBypass(reqUrl) {
                    if (!reqUrl.hostname) {
                        return false;
                    }
                    const reqHost = reqUrl.hostname;
                    if (isLoopbackAddress(reqHost)) {
                        return true;
                    }
                    const noProxy = process.env['no_proxy'] || process.env['NO_PROXY'] || '';
                    if (!noProxy) {
                        return false;
                    }
                    // Determine the request port
                    let reqPort;
                    if (reqUrl.port) {
                        reqPort = Number(reqUrl.port);
                    }
                    else if (reqUrl.protocol === 'http:') {
                        reqPort = 80;
                    }
                    else if (reqUrl.protocol === 'https:') {
                        reqPort = 443;
                    }
                    // Format the request hostname and hostname with port
                    const upperReqHosts = [reqUrl.hostname.toUpperCase()];
                    if (typeof reqPort === 'number') {
                        upperReqHosts.push(`${upperReqHosts[0]}:${reqPort}`);
                    }
                    // Compare request host against noproxy
                    for (const upperNoProxyItem of noProxy
                        .split(',')
                        .map(x => x.trim().toUpperCase())
                        .filter(x => x)) {
                        if (upperNoProxyItem === '*' ||
                            upperReqHosts.some(x => x === upperNoProxyItem ||
                                x.endsWith(`.${upperNoProxyItem}`) ||
                                (upperNoProxyItem.startsWith('.') &&
                                    x.endsWith(`${upperNoProxyItem}`)))) {
                            return true;
                        }
                    }
                    return false;
                }
                exports.checkBypass = checkBypass;
                function isLoopbackAddress(host) {
                    const hostLower = host.toLowerCase();
                    return (hostLower === 'localhost' ||
                        hostLower.startsWith('127.') ||
                        hostLower.startsWith('[::1]') ||
                        hostLower.startsWith('[0:0:0:0:0:0:0:1]'));
                }
//# sourceMappingURL=proxy.js.map

                /***/ }),

            /***/ 195:
            /***/ (function(__unusedmodule, exports, __webpack_require__) {

                "use strict";


                Object.defineProperty(exports, '__esModule', { value: true });

                function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

                var deprecation = __webpack_require__(692);
                var once = _interopDefault(__webpack_require__(370));

                const logOnceCode = once(deprecation => console.warn(deprecation));
                const logOnceHeaders = once(deprecation => console.warn(deprecation));
                /**
                 * Error with extra properties to help with debugging
                 */

                class RequestError extends Error {
                    constructor(message, statusCode, options) {
                        super(message); // Maintains proper stack trace (only available on V8)

                        /* istanbul ignore next */

                        if (Error.captureStackTrace) {
                            Error.captureStackTrace(this, this.constructor);
                        }

                        this.name = "HttpError";
                        this.status = statusCode;
                        let headers;

                        if ("headers" in options && typeof options.headers !== "undefined") {
                            headers = options.headers;
                        }

                        if ("response" in options) {
                            this.response = options.response;
                            headers = options.response.headers;
                        } // redact request credentials without mutating original request options


                        const requestCopy = Object.assign({}, options.request);

                        if (options.request.headers.authorization) {
                            requestCopy.headers = Object.assign({}, options.request.headers, {
                                authorization: options.request.headers.authorization.replace(/ .*$/, " [REDACTED]")
                            });
                        }

                        requestCopy.url = requestCopy.url // client_id & client_secret can be passed as URL query parameters to increase rate limit
                            // see https://developer.github.com/v3/#increasing-the-unauthenticated-rate-limit-for-oauth-applications
                            .replace(/\bclient_secret=\w+/g, "client_secret=[REDACTED]") // OAuth tokens can be passed as URL query parameters, although it is not recommended
                            // see https://developer.github.com/v3/#oauth2-token-sent-in-a-header
                            .replace(/\baccess_token=\w+/g, "access_token=[REDACTED]");
                        this.request = requestCopy; // deprecations

                        Object.defineProperty(this, "code", {
                            get() {
                                logOnceCode(new deprecation.Deprecation("[@octokit/request-error] `error.code` is deprecated, use `error.status`."));
                                return statusCode;
                            }

                        });
                        Object.defineProperty(this, "headers", {
                            get() {
                                logOnceHeaders(new deprecation.Deprecation("[@octokit/request-error] `error.headers` is deprecated, use `error.response.headers`."));
                                return headers || {};
                            }

                        });
                    }

                }

                exports.RequestError = RequestError;
//# sourceMappingURL=index.js.map


                /***/ }),

            /***/ 197:
            /***/ (function(module, __unusedexports, __webpack_require__) {

                module.exports = isexe
                isexe.sync = sync

                var fs = __webpack_require__(747)

                function isexe (path, options, cb) {
                    fs.stat(path, function (er, stat) {
                        cb(er, er ? false : checkStat(stat, options))
                    })
                }

                function sync (path, options) {
                    return checkStat(fs.statSync(path), options)
                }

                function checkStat (stat, options) {
                    return stat.isFile() && checkMode(stat, options)
                }

                function checkMode (stat, options) {
                    var mod = stat.mode
                    var uid = stat.uid
                    var gid = stat.gid

                    var myUid = options.uid !== undefined ?
                        options.uid : process.getuid && process.getuid()
                    var myGid = options.gid !== undefined ?
                        options.gid : process.getgid && process.getgid()

                    var u = parseInt('100', 8)
                    var g = parseInt('010', 8)
                    var o = parseInt('001', 8)
                    var ug = u | g

                    var ret = (mod & o) ||
                        (mod & g) && gid === myGid ||
                        (mod & u) && uid === myUid ||
                        (mod & ug) && myUid === 0

                    return ret
                }


                /***/ }),

            /***/ 209:
            /***/ (function(__unusedmodule, exports, __webpack_require__) {

                "use strict";


                Object.defineProperty(exports, "__esModule", {
                    value: true
                });
                exports.default = void 0;

                var _v = _interopRequireDefault(__webpack_require__(212));

                var _md = _interopRequireDefault(__webpack_require__(803));

                function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

                const v3 = (0, _v.default)('v3', 0x30, _md.default);
                var _default = v3;
                exports.default = _default;

                /***/ }),

            /***/ 211:
            /***/ (function(module) {

                module.exports = require("https");

                /***/ }),

            /***/ 212:
            /***/ (function(__unusedmodule, exports, __webpack_require__) {

                "use strict";


                Object.defineProperty(exports, "__esModule", {
                    value: true
                });
                exports.default = _default;
                exports.URL = exports.DNS = void 0;

                var _stringify = _interopRequireDefault(__webpack_require__(411));

                var _parse = _interopRequireDefault(__webpack_require__(22));

                function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

                function stringToBytes(str) {
                    str = unescape(encodeURIComponent(str)); // UTF8 escape

                    const bytes = [];

                    for (let i = 0; i < str.length; ++i) {
                        bytes.push(str.charCodeAt(i));
                    }

                    return bytes;
                }

                const DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
                exports.DNS = DNS;
                const URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
                exports.URL = URL;

                function _default(name, version, hashfunc) {
                    function generateUUID(value, namespace, buf, offset) {
                        if (typeof value === 'string') {
                            value = stringToBytes(value);
                        }

                        if (typeof namespace === 'string') {
                            namespace = (0, _parse.default)(namespace);
                        }

                        if (namespace.length !== 16) {
                            throw TypeError('Namespace must be array-like (16 iterable integer values, 0-255)');
                        } // Compute hash of namespace and value, Per 4.3
                        // Future: Use spread syntax when supported on all platforms, e.g. `bytes =
                        // hashfunc([...namespace, ... value])`


                        let bytes = new Uint8Array(16 + value.length);
                        bytes.set(namespace);
                        bytes.set(value, namespace.length);
                        bytes = hashfunc(bytes);
                        bytes[6] = bytes[6] & 0x0f | version;
                        bytes[8] = bytes[8] & 0x3f | 0x80;

                        if (buf) {
                            offset = offset || 0;

                            for (let i = 0; i < 16; ++i) {
                                buf[offset + i] = bytes[i];
                            }

                            return buf;
                        }

                        return (0, _stringify.default)(bytes);
                    } // Function#name is not settable on some platforms (#270)


                    try {
                        generateUUID.name = name; // eslint-disable-next-line no-empty
                    } catch (err) {} // For CommonJS default export support


                    generateUUID.DNS = DNS;
                    generateUUID.URL = URL;
                    return generateUUID;
                }

                /***/ }),

            /***/ 213:
            /***/ (function(module) {

                module.exports = require("timers");

                /***/ }),

            /***/ 247:
            /***/ (function(module, __unusedexports, __webpack_require__) {

                "use strict";

                const os = __webpack_require__(87);
                const hasFlag = __webpack_require__(364);

                const env = process.env;

                let forceColor;
                if (hasFlag('no-color') ||
                    hasFlag('no-colors') ||
                    hasFlag('color=false')) {
                    forceColor = false;
                } else if (hasFlag('color') ||
                    hasFlag('colors') ||
                    hasFlag('color=true') ||
                    hasFlag('color=always')) {
                    forceColor = true;
                }
                if ('FORCE_COLOR' in env) {
                    forceColor = env.FORCE_COLOR.length === 0 || parseInt(env.FORCE_COLOR, 10) !== 0;
                }

                function translateLevel(level) {
                    if (level === 0) {
                        return false;
                    }

                    return {
                        level,
                        hasBasic: true,
                        has256: level >= 2,
                        has16m: level >= 3
                    };
                }

                function supportsColor(stream) {
                    if (forceColor === false) {
                        return 0;
                    }

                    if (hasFlag('color=16m') ||
                        hasFlag('color=full') ||
                        hasFlag('color=truecolor')) {
                        return 3;
                    }

                    if (hasFlag('color=256')) {
                        return 2;
                    }

                    if (stream && !stream.isTTY && forceColor !== true) {
                        return 0;
                    }

                    const min = forceColor ? 1 : 0;

                    if (process.platform === 'win32') {
                        // Node.js 7.5.0 is the first version of Node.js to include a patch to
                        // libuv that enables 256 color output on Windows. Anything earlier and it
                        // won't work. However, here we target Node.js 8 at minimum as it is an LTS
                        // release, and Node.js 7 is not. Windows 10 build 10586 is the first Windows
                        // release that supports 256 colors. Windows 10 build 14931 is the first release
                        // that supports 16m/TrueColor.
                        const osRelease = os.release().split('.');
                        if (
                            Number(process.versions.node.split('.')[0]) >= 8 &&
                            Number(osRelease[0]) >= 10 &&
                            Number(osRelease[2]) >= 10586
                        ) {
                            return Number(osRelease[2]) >= 14931 ? 3 : 2;
                        }

                        return 1;
                    }

                    if ('CI' in env) {
                        if (['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI'].some(sign => sign in env) || env.CI_NAME === 'codeship') {
                            return 1;
                        }

                        return min;
                    }

                    if ('TEAMCITY_VERSION' in env) {
                        return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
                    }

                    if (env.COLORTERM === 'truecolor') {
                        return 3;
                    }

                    if ('TERM_PROGRAM' in env) {
                        const version = parseInt((env.TERM_PROGRAM_VERSION || '').split('.')[0], 10);

                        switch (env.TERM_PROGRAM) {
                            case 'iTerm.app':
                                return version >= 3 ? 3 : 2;
                            case 'Apple_Terminal':
                                return 2;
                            // No default
                        }
                    }

                    if (/-256(color)?$/i.test(env.TERM)) {
                        return 2;
                    }

                    if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
                        return 1;
                    }

                    if ('COLORTERM' in env) {
                        return 1;
                    }

                    if (env.TERM === 'dumb') {
                        return min;
                    }

                    return min;
                }

                function getSupportLevel(stream) {
                    const level = supportsColor(stream);
                    return translateLevel(level);
                }

                module.exports = {
                    supportsColor: getSupportLevel,
                    stdout: getSupportLevel(process.stdout),
                    stderr: getSupportLevel(process.stderr)
                };


                /***/ }),

            /***/ 250:
            /***/ (function(module, __unusedexports, __webpack_require__) {

                var constants = __webpack_require__(619)

                var origCwd = process.cwd
                var cwd = null

                var platform = process.env.GRACEFUL_FS_PLATFORM || process.platform

                process.cwd = function() {
                    if (!cwd)
                        cwd = origCwd.call(process)
                    return cwd
                }
                try {
                    process.cwd()
                } catch (er) {}

// This check is needed until node.js 12 is required
                if (typeof process.chdir === 'function') {
                    var chdir = process.chdir
                    process.chdir = function (d) {
                        cwd = null
                        chdir.call(process, d)
                    }
                    if (Object.setPrototypeOf) Object.setPrototypeOf(process.chdir, chdir)
                }

                module.exports = patch

                function patch (fs) {
                    // (re-)implement some things that are known busted or missing.

                    // lchmod, broken prior to 0.6.2
                    // back-port the fix here.
                    if (constants.hasOwnProperty('O_SYMLINK') &&
                        process.version.match(/^v0\.6\.[0-2]|^v0\.5\./)) {
                        patchLchmod(fs)
                    }

                    // lutimes implementation, or no-op
                    if (!fs.lutimes) {
                        patchLutimes(fs)
                    }

                    // https://github.com/isaacs/node-graceful-fs/issues/4
                    // Chown should not fail on einval or eperm if non-root.
                    // It should not fail on enosys ever, as this just indicates
                    // that a fs doesn't support the intended operation.

                    fs.chown = chownFix(fs.chown)
                    fs.fchown = chownFix(fs.fchown)
                    fs.lchown = chownFix(fs.lchown)

                    fs.chmod = chmodFix(fs.chmod)
                    fs.fchmod = chmodFix(fs.fchmod)
                    fs.lchmod = chmodFix(fs.lchmod)

                    fs.chownSync = chownFixSync(fs.chownSync)
                    fs.fchownSync = chownFixSync(fs.fchownSync)
                    fs.lchownSync = chownFixSync(fs.lchownSync)

                    fs.chmodSync = chmodFixSync(fs.chmodSync)
                    fs.fchmodSync = chmodFixSync(fs.fchmodSync)
                    fs.lchmodSync = chmodFixSync(fs.lchmodSync)

                    fs.stat = statFix(fs.stat)
                    fs.fstat = statFix(fs.fstat)
                    fs.lstat = statFix(fs.lstat)

                    fs.statSync = statFixSync(fs.statSync)
                    fs.fstatSync = statFixSync(fs.fstatSync)
                    fs.lstatSync = statFixSync(fs.lstatSync)

                    // if lchmod/lchown do not exist, then make them no-ops
                    if (fs.chmod && !fs.lchmod) {
                        fs.lchmod = function (path, mode, cb) {
                            if (cb) process.nextTick(cb)
                        }
                        fs.lchmodSync = function () {}
                    }
                    if (fs.chown && !fs.lchown) {
                        fs.lchown = function (path, uid, gid, cb) {
                            if (cb) process.nextTick(cb)
                        }
                        fs.lchownSync = function () {}
                    }

                    // on Windows, A/V software can lock the directory, causing this
                    // to fail with an EACCES or EPERM if the directory contains newly
                    // created files.  Try again on failure, for up to 60 seconds.

                    // Set the timeout this long because some Windows Anti-Virus, such as Parity
                    // bit9, may lock files for up to a minute, causing npm package install
                    // failures. Also, take care to yield the scheduler. Windows scheduling gives
                    // CPU to a busy looping process, which can cause the program causing the lock
                    // contention to be starved of CPU by node, so the contention doesn't resolve.
                    if (platform === "win32") {
                        fs.rename = typeof fs.rename !== 'function' ? fs.rename
                            : (function (fs$rename) {
                                function rename (from, to, cb) {
                                    var start = Date.now()
                                    var backoff = 0;
                                    fs$rename(from, to, function CB (er) {
                                        if (er
                                            && (er.code === "EACCES" || er.code === "EPERM" || er.code === "EBUSY")
                                            && Date.now() - start < 60000) {
                                            setTimeout(function() {
                                                fs.stat(to, function (stater, st) {
                                                    if (stater && stater.code === "ENOENT")
                                                        fs$rename(from, to, CB);
                                                    else
                                                        cb(er)
                                                })
                                            }, backoff)
                                            if (backoff < 100)
                                                backoff += 10;
                                            return;
                                        }
                                        if (cb) cb(er)
                                    })
                                }
                                if (Object.setPrototypeOf) Object.setPrototypeOf(rename, fs$rename)
                                return rename
                            })(fs.rename)
                    }

                    // if read() returns EAGAIN, then just try it again.
                    fs.read = typeof fs.read !== 'function' ? fs.read
                        : (function (fs$read) {
                            function read (fd, buffer, offset, length, position, callback_) {
                                var callback
                                if (callback_ && typeof callback_ === 'function') {
                                    var eagCounter = 0
                                    callback = function (er, _, __) {
                                        if (er && er.code === 'EAGAIN' && eagCounter < 10) {
                                            eagCounter ++
                                            return fs$read.call(fs, fd, buffer, offset, length, position, callback)
                                        }
                                        callback_.apply(this, arguments)
                                    }
                                }
                                return fs$read.call(fs, fd, buffer, offset, length, position, callback)
                            }

                            // This ensures `util.promisify` works as it does for native `fs.read`.
                            if (Object.setPrototypeOf) Object.setPrototypeOf(read, fs$read)
                            return read
                        })(fs.read)

                    fs.readSync = typeof fs.readSync !== 'function' ? fs.readSync
                        : (function (fs$readSync) { return function (fd, buffer, offset, length, position) {
                            var eagCounter = 0
                            while (true) {
                                try {
                                    return fs$readSync.call(fs, fd, buffer, offset, length, position)
                                } catch (er) {
                                    if (er.code === 'EAGAIN' && eagCounter < 10) {
                                        eagCounter ++
                                        continue
                                    }
                                    throw er
                                }
                            }
                        }})(fs.readSync)

                    function patchLchmod (fs) {
                        fs.lchmod = function (path, mode, callback) {
                            fs.open( path
                                , constants.O_WRONLY | constants.O_SYMLINK
                                , mode
                                , function (err, fd) {
                                    if (err) {
                                        if (callback) callback(err)
                                        return
                                    }
                                    // prefer to return the chmod error, if one occurs,
                                    // but still try to close, and report closing errors if they occur.
                                    fs.fchmod(fd, mode, function (err) {
                                        fs.close(fd, function(err2) {
                                            if (callback) callback(err || err2)
                                        })
                                    })
                                })
                        }

                        fs.lchmodSync = function (path, mode) {
                            var fd = fs.openSync(path, constants.O_WRONLY | constants.O_SYMLINK, mode)

                            // prefer to return the chmod error, if one occurs,
                            // but still try to close, and report closing errors if they occur.
                            var threw = true
                            var ret
                            try {
                                ret = fs.fchmodSync(fd, mode)
                                threw = false
                            } finally {
                                if (threw) {
                                    try {
                                        fs.closeSync(fd)
                                    } catch (er) {}
                                } else {
                                    fs.closeSync(fd)
                                }
                            }
                            return ret
                        }
                    }

                    function patchLutimes (fs) {
                        if (constants.hasOwnProperty("O_SYMLINK") && fs.futimes) {
                            fs.lutimes = function (path, at, mt, cb) {
                                fs.open(path, constants.O_SYMLINK, function (er, fd) {
                                    if (er) {
                                        if (cb) cb(er)
                                        return
                                    }
                                    fs.futimes(fd, at, mt, function (er) {
                                        fs.close(fd, function (er2) {
                                            if (cb) cb(er || er2)
                                        })
                                    })
                                })
                            }

                            fs.lutimesSync = function (path, at, mt) {
                                var fd = fs.openSync(path, constants.O_SYMLINK)
                                var ret
                                var threw = true
                                try {
                                    ret = fs.futimesSync(fd, at, mt)
                                    threw = false
                                } finally {
                                    if (threw) {
                                        try {
                                            fs.closeSync(fd)
                                        } catch (er) {}
                                    } else {
                                        fs.closeSync(fd)
                                    }
                                }
                                return ret
                            }

                        } else if (fs.futimes) {
                            fs.lutimes = function (_a, _b, _c, cb) { if (cb) process.nextTick(cb) }
                            fs.lutimesSync = function () {}
                        }
                    }

                    function chmodFix (orig) {
                        if (!orig) return orig
                        return function (target, mode, cb) {
                            return orig.call(fs, target, mode, function (er) {
                                if (chownErOk(er)) er = null
                                if (cb) cb.apply(this, arguments)
                            })
                        }
                    }

                    function chmodFixSync (orig) {
                        if (!orig) return orig
                        return function (target, mode) {
                            try {
                                return orig.call(fs, target, mode)
                            } catch (er) {
                                if (!chownErOk(er)) throw er
                            }
                        }
                    }


                    function chownFix (orig) {
                        if (!orig) return orig
                        return function (target, uid, gid, cb) {
                            return orig.call(fs, target, uid, gid, function (er) {
                                if (chownErOk(er)) er = null
                                if (cb) cb.apply(this, arguments)
                            })
                        }
                    }

                    function chownFixSync (orig) {
                        if (!orig) return orig
                        return function (target, uid, gid) {
                            try {
                                return orig.call(fs, target, uid, gid)
                            } catch (er) {
                                if (!chownErOk(er)) throw er
                            }
                        }
                    }

                    function statFix (orig) {
                        if (!orig) return orig
                        // Older versions of Node erroneously returned signed integers for
                        // uid + gid.
                        return function (target, options, cb) {
                            if (typeof options === 'function') {
                                cb = options
                                options = null
                            }
                            function callback (er, stats) {
                                if (stats) {
                                    if (stats.uid < 0) stats.uid += 0x100000000
                                    if (stats.gid < 0) stats.gid += 0x100000000
                                }
                                if (cb) cb.apply(this, arguments)
                            }
                            return options ? orig.call(fs, target, options, callback)
                                : orig.call(fs, target, callback)
                        }
                    }

                    function statFixSync (orig) {
                        if (!orig) return orig
                        // Older versions of Node erroneously returned signed integers for
                        // uid + gid.
                        return function (target, options) {
                            var stats = options ? orig.call(fs, target, options)
                                : orig.call(fs, target)
                            if (stats) {
                                if (stats.uid < 0) stats.uid += 0x100000000
                                if (stats.gid < 0) stats.gid += 0x100000000
                            }
                            return stats;
                        }
                    }

                    // ENOSYS means that the fs doesn't support the op. Just ignore
                    // that, because it doesn't matter.
                    //
                    // if there's no getuid, or if getuid() is something other
                    // than 0, and the error is EINVAL or EPERM, then just ignore
                    // it.
                    //
                    // This specific case is a silent failure in cp, install, tar,
                    // and most other unix tools that manage permissions.
                    //
                    // When running as root, or if other types of errors are
                    // encountered, then it's strict.
                    function chownErOk (er) {
                        if (!er)
                            return true

                        if (er.code === "ENOSYS")
                            return true

                        var nonroot = !process.getuid || process.getuid() !== 0
                        if (nonroot) {
                            if (er.code === "EINVAL" || er.code === "EPERM")
                                return true
                        }

                        return false
                    }
                }


                /***/ }),

            /***/ 260:
            /***/ (function(module, __unusedexports, __webpack_require__) {

                var conversions = __webpack_require__(600);

                /*
	this function routes a model to all other models.

	all functions that are routed have a property `.conversion` attached
	to the returned synthetic function. This property is an array
	of strings, each with the steps in between the 'from' and 'to'
	color models (inclusive).

	conversions that are not possible simply are not included.
*/

                function buildGraph() {
                    var graph = {};
                    // https://jsperf.com/object-keys-vs-for-in-with-closure/3
                    var models = Object.keys(conversions);

                    for (var len = models.length, i = 0; i < len; i++) {
                        graph[models[i]] = {
                            // http://jsperf.com/1-vs-infinity
                            // micro-opt, but this is simple.
                            distance: -1,
                            parent: null
                        };
                    }

                    return graph;
                }

// https://en.wikipedia.org/wiki/Breadth-first_search
                function deriveBFS(fromModel) {
                    var graph = buildGraph();
                    var queue = [fromModel]; // unshift -> queue -> pop

                    graph[fromModel].distance = 0;

                    while (queue.length) {
                        var current = queue.pop();
                        var adjacents = Object.keys(conversions[current]);

                        for (var len = adjacents.length, i = 0; i < len; i++) {
                            var adjacent = adjacents[i];
                            var node = graph[adjacent];

                            if (node.distance === -1) {
                                node.distance = graph[current].distance + 1;
                                node.parent = current;
                                queue.unshift(adjacent);
                            }
                        }
                    }

                    return graph;
                }

                function link(from, to) {
                    return function (args) {
                        return to(from(args));
                    };
                }

                function wrapConversion(toModel, graph) {
                    var path = [graph[toModel].parent, toModel];
                    var fn = conversions[graph[toModel].parent][toModel];

                    var cur = graph[toModel].parent;
                    while (graph[cur].parent) {
                        path.unshift(graph[cur].parent);
                        fn = link(conversions[graph[cur].parent][cur], fn);
                        cur = graph[cur].parent;
                    }

                    fn.conversion = path;
                    return fn;
                }

                module.exports = function (fromModel) {
                    var graph = deriveBFS(fromModel);
                    var conversion = {};

                    var models = Object.keys(graph);
                    for (var len = models.length, i = 0; i < len; i++) {
                        var toModel = models[i];
                        var node = graph[toModel];

                        if (node.parent === null) {
                            // no possible conversion, or this node is the source model.
                            continue;
                        }

                        conversion[toModel] = wrapConversion(toModel, graph);
                    }

                    return conversion;
                };



                /***/ }),

            /***/ 276:
            /***/ (function(module, __unusedexports, __webpack_require__) {

                "use strict";

                const util = __webpack_require__(669);
                const path = __webpack_require__(622);
                const readline = __webpack_require__(58);
                const chalk = __webpack_require__(946);
                const figures = __webpack_require__(848);
                const pkgConf = __webpack_require__(385);
                const pkg = __webpack_require__(969);
                const defaultTypes = __webpack_require__(621);

                const {green, grey, red, underline, yellow} = chalk;

                let isPreviousLogInteractive = false;
                const defaults = pkg.options.default;
                const namespace = pkg.name;

                class Signale {
                    constructor(options = {}) {
                        this._interactive = options.interactive || false;
                        this._config = Object.assign(this.packageConfiguration, options.config);
                        this._customTypes = Object.assign({}, options.types);
                        this._disabled = options.disabled || false;
                        this._scopeName = options.scope || '';
                        this._timers = options.timers || new Map();
                        this._types = this._mergeTypes(defaultTypes, this._customTypes);
                        this._stream = options.stream || process.stdout;
                        this._longestLabel = this._getLongestLabel();
                        this._secrets = options.secrets || [];
                        this._generalLogLevel = this._validateLogLevel(options.logLevel);

                        Object.keys(this._types).forEach(type => {
                            this[type] = this._logger.bind(this, type);
                        });
                    }

                    get _now() {
                        return Date.now();
                    }

                    get scopeName() {
                        return this._scopeName;
                    }

                    get currentOptions() {
                        return Object.assign({}, {
                            config: this._config,
                            disabled: this._disabled,
                            types: this._customTypes,
                            interactive: this._interactive,
                            timers: this._timers,
                            stream: this._stream,
                            secrets: this._secrets,
                            logLevel: this._generalLogLevel
                        });
                    }

                    get date() {
                        return new Date().toLocaleDateString();
                    }

                    get timestamp() {
                        return new Date().toLocaleTimeString();
                    }

                    get filename() {
                        const _ = Error.prepareStackTrace;
                        Error.prepareStackTrace = (error, stack) => stack;
                        const {stack} = new Error();
                        Error.prepareStackTrace = _;

                        const callers = stack.map(x => x.getFileName());

                        const firstExternalFilePath = callers.find(x => {
                            return x !== callers[0];
                        });

                        return firstExternalFilePath ? path.basename(firstExternalFilePath) : 'anonymous';
                    }

                    get packageConfiguration() {
                        return pkgConf.sync(namespace, {defaults});
                    }

                    get _longestUnderlinedLabel() {
                        return underline(this._longestLabel);
                    }

                    get _logLevels() {
                        return {
                            info: 0,
                            timer: 1,
                            debug: 2,
                            warn: 3,
                            error: 4
                        };
                    }

                    set configuration(configObj) {
                        this._config = Object.assign(this.packageConfiguration, configObj);
                    }

                    _arrayify(x) {
                        return Array.isArray(x) ? x : [x];
                    }

                    _timeSpan(then) {
                        return (this._now - then);
                    }

                    _getLongestLabel() {
                        const {_types} = this;
                        const labels = Object.keys(_types).map(x => _types[x].label);
                        return labels.reduce((x, y) => x.length > y.length ? x : y);
                    }

                    _validateLogLevel(level) {
                        return Object.keys(this._logLevels).includes(level) ? level : 'info';
                    }

                    _mergeTypes(standard, custom) {
                        const types = Object.assign({}, standard);

                        Object.keys(custom).forEach(type => {
                            types[type] = Object.assign({}, types[type], custom[type]);
                        });

                        return types;
                    }

                    _filterSecrets(message) {
                        const {_secrets} = this;

                        if (_secrets.length === 0) {
                            return message;
                        }

                        let safeMessage = message;

                        _secrets.forEach(secret => {
                            safeMessage = safeMessage.replace(new RegExp(secret, 'g'), '[secure]');
                        });

                        return safeMessage;
                    }

                    _formatStream(stream) {
                        return this._arrayify(stream);
                    }

                    _formatDate() {
                        return `[${this.date}]`;
                    }

                    _formatFilename() {
                        return `[${this.filename}]`;
                    }

                    _formatScopeName() {
                        if (Array.isArray(this._scopeName)) {
                            const scopes = this._scopeName.filter(x => x.length !== 0);
                            return `${scopes.map(x => `[${x.trim()}]`).join(' ')}`;
                        }

                        return `[${this._scopeName}]`;
                    }

                    _formatTimestamp() {
                        return `[${this.timestamp}]`;
                    }

                    _formatMessage(str) {
                        return util.format(...this._arrayify(str));
                    }

                    _meta() {
                        const meta = [];

                        if (this._config.displayDate) {
                            meta.push(this._formatDate());
                        }

                        if (this._config.displayTimestamp) {
                            meta.push(this._formatTimestamp());
                        }

                        if (this._config.displayFilename) {
                            meta.push(this._formatFilename());
                        }

                        if (this._scopeName.length !== 0 && this._config.displayScope) {
                            meta.push(this._formatScopeName());
                        }

                        if (meta.length !== 0) {
                            meta.push(`${figures.pointerSmall}`);
                            return meta.map(item => grey(item));
                        }

                        return meta;
                    }

                    _hasAdditional({suffix, prefix}, args) {
                        return (suffix || prefix) ? '' : this._formatMessage(args);
                    }

                    _buildSignale(type, ...args) {
                        let [msg, additional] = [{}, {}];

                        if (args.length === 1 && typeof (args[0]) === 'object' && args[0] !== null) {
                            if (args[0] instanceof Error) {
                                [msg] = args;
                            } else {
                                const [{prefix, message, suffix}] = args;
                                additional = Object.assign({}, {suffix, prefix});
                                msg = message ? this._formatMessage(message) : this._hasAdditional(additional, args);
                            }
                        } else {
                            msg = this._formatMessage(args);
                        }

                        const signale = this._meta();

                        if (additional.prefix) {
                            if (this._config.underlinePrefix) {
                                signale.push(underline(additional.prefix));
                            } else {
                                signale.push(additional.prefix);
                            }
                        }

                        if (this._config.displayBadge && type.badge) {
                            signale.push(chalk[type.color](this._padEnd(type.badge, type.badge.length + 1)));
                        }

                        if (this._config.displayLabel && type.label) {
                            const label = this._config.uppercaseLabel ? type.label.toUpperCase() : type.label;
                            if (this._config.underlineLabel) {
                                signale.push(chalk[type.color](this._padEnd(underline(label), this._longestUnderlinedLabel.length + 1)));
                            } else {
                                signale.push(chalk[type.color](this._padEnd(label, this._longestLabel.length + 1)));
                            }
                        }

                        if (msg instanceof Error && msg.stack) {
                            const [name, ...rest] = msg.stack.split('\n');
                            if (this._config.underlineMessage) {
                                signale.push(underline(name));
                            } else {
                                signale.push(name);
                            }

                            signale.push(grey(rest.map(l => l.replace(/^/, '\n')).join('')));
                            return signale.join(' ');
                        }

                        if (this._config.underlineMessage) {
                            signale.push(underline(msg));
                        } else {
                            signale.push(msg);
                        }

                        if (additional.suffix) {
                            if (this._config.underlineSuffix) {
                                signale.push(underline(additional.suffix));
                            } else {
                                signale.push(additional.suffix);
                            }
                        }

                        return signale.join(' ');
                    }

                    _write(stream, message) {
                        if (this._interactive && stream.isTTY && isPreviousLogInteractive) {
                            readline.moveCursor(stream, 0, -1);
                            readline.clearLine(stream);
                            readline.cursorTo(stream, 0);
                        }

                        stream.write(message + '\n');
                        isPreviousLogInteractive = this._interactive;
                    }

                    _log(message, streams = this._stream, logLevel) {
                        if (this.isEnabled() && this._logLevels[logLevel] >= this._logLevels[this._generalLogLevel]) {
                            this._formatStream(streams).forEach(stream => {
                                this._write(stream, message);
                            });
                        }
                    }

                    _logger(type, ...messageObj) {
                        const {stream, logLevel} = this._types[type];
                        const message = this._buildSignale(this._types[type], ...messageObj);
                        this._log(this._filterSecrets(message), stream, this._validateLogLevel(logLevel));
                    }

                    _padEnd(str, targetLength) {
                        str = String(str);
                        targetLength = parseInt(targetLength, 10) || 0;

                        if (str.length >= targetLength) {
                            return str;
                        }

                        if (String.prototype.padEnd) {
                            return str.padEnd(targetLength);
                        }

                        targetLength -= str.length;
                        return str + ' '.repeat(targetLength);
                    }

                    addSecrets(secrets) {
                        if (!Array.isArray(secrets)) {
                            throw new TypeError('Argument must be an array.');
                        }

                        this._secrets.push(...secrets);
                    }

                    clearSecrets() {
                        this._secrets = [];
                    }

                    config(configObj) {
                        this.configuration = configObj;
                    }

                    disable() {
                        this._disabled = true;
                    }

                    enable() {
                        this._disabled = false;
                    }

                    isEnabled() {
                        return !this._disabled;
                    }

                    scope(...name) {
                        if (name.length === 0) {
                            throw new Error('No scope name was defined.');
                        }

                        return new Signale(Object.assign(this.currentOptions, {scope: name}));
                    }

                    unscope() {
                        this._scopeName = '';
                    }

                    time(label) {
                        if (!label) {
                            label = `timer_${this._timers.size}`;
                        }

                        this._timers.set(label, this._now);

                        const message = this._meta();
                        message.push(green(this._padEnd(this._types.start.badge, 2)));

                        if (this._config.underlineLabel) {
                            message.push(green(this._padEnd(underline(label), this._longestUnderlinedLabel.length + 1)));
                        } else {
                            message.push(green(this._padEnd(label, this._longestLabel.length + 1)));
                        }

                        message.push('Initialized timer...');
                        this._log(message.join(' '), this._stream, 'timer');

                        return label;
                    }

                    timeEnd(label) {
                        if (!label && this._timers.size) {
                            const is = x => x.includes('timer_');
                            label = [...this._timers.keys()].reduceRight((x, y) => {
                                return is(x) ? x : (is(y) ? y : null);
                            });
                        }

                        if (this._timers.has(label)) {
                            const span = this._timeSpan(this._timers.get(label));
                            this._timers.delete(label);

                            const message = this._meta();
                            message.push(red(this._padEnd(this._types.pause.badge, 2)));

                            if (this._config.underlineLabel) {
                                message.push(red(this._padEnd(underline(label), this._longestUnderlinedLabel.length + 1)));
                            } else {
                                message.push(red(this._padEnd(label, this._longestLabel.length + 1)));
                            }

                            message.push('Timer run for:');
                            message.push(yellow(span < 1000 ? span + 'ms' : (span / 1000).toFixed(2) + 's'));
                            this._log(message.join(' '), this._stream, 'timer');

                            return {label, span};
                        }
                    }
                }

                module.exports = Signale;


                /***/ }),

            /***/ 280:
            /***/ (function(module, exports) {

                exports = module.exports = SemVer

                var debug
                /* istanbul ignore next */
                if (typeof process === 'object' &&
                    process.env &&
                    process.env.NODE_DEBUG &&
                    /\bsemver\b/i.test(process.env.NODE_DEBUG)) {
                    debug = function () {
                        var args = Array.prototype.slice.call(arguments, 0)
                        args.unshift('SEMVER')
                        console.log.apply(console, args)
                    }
                } else {
                    debug = function () {}
                }

// Note: this is the semver.org version of the spec that it implements
// Not necessarily the package version of this code.
                exports.SEMVER_SPEC_VERSION = '2.0.0'

                var MAX_LENGTH = 256
                var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER ||
                    /* istanbul ignore next */ 9007199254740991

// Max safe segment length for coercion.
                var MAX_SAFE_COMPONENT_LENGTH = 16

                var MAX_SAFE_BUILD_LENGTH = MAX_LENGTH - 6

// The actual regexps go on exports.re
                var re = exports.re = []
                var safeRe = exports.safeRe = []
                var src = exports.src = []
                var R = 0

                var LETTERDASHNUMBER = '[a-zA-Z0-9-]'

// Replace some greedy regex tokens to prevent regex dos issues. These regex are
// used internally via the safeRe object since all inputs in this library get
// normalized first to trim and collapse all extra whitespace. The original
// regexes are exported for userland consumption and lower level usage. A
// future breaking change could export the safer regex only with a note that
// all input should have extra whitespace removed.
                var safeRegexReplacements = [
                    ['\\s', 1],
                    ['\\d', MAX_LENGTH],
                    [LETTERDASHNUMBER, MAX_SAFE_BUILD_LENGTH],
                ]

                function makeSafeRe (value) {
                    for (var i = 0; i < safeRegexReplacements.length; i++) {
                        var token = safeRegexReplacements[i][0]
                        var max = safeRegexReplacements[i][1]
                        value = value
                            .split(token + '*').join(token + '{0,' + max + '}')
                            .split(token + '+').join(token + '{1,' + max + '}')
                    }
                    return value
                }

// The following Regular Expressions can be used for tokenizing,
// validating, and parsing SemVer version strings.

// ## Numeric Identifier
// A single `0`, or a non-zero digit followed by zero or more digits.

                var NUMERICIDENTIFIER = R++
                src[NUMERICIDENTIFIER] = '0|[1-9]\\d*'
                var NUMERICIDENTIFIERLOOSE = R++
                src[NUMERICIDENTIFIERLOOSE] = '\\d+'

// ## Non-numeric Identifier
// Zero or more digits, followed by a letter or hyphen, and then zero or
// more letters, digits, or hyphens.

                var NONNUMERICIDENTIFIER = R++
                src[NONNUMERICIDENTIFIER] = '\\d*[a-zA-Z-]' + LETTERDASHNUMBER + '*'

// ## Main Version
// Three dot-separated numeric identifiers.

                var MAINVERSION = R++
                src[MAINVERSION] = '(' + src[NUMERICIDENTIFIER] + ')\\.' +
                    '(' + src[NUMERICIDENTIFIER] + ')\\.' +
                    '(' + src[NUMERICIDENTIFIER] + ')'

                var MAINVERSIONLOOSE = R++
                src[MAINVERSIONLOOSE] = '(' + src[NUMERICIDENTIFIERLOOSE] + ')\\.' +
                    '(' + src[NUMERICIDENTIFIERLOOSE] + ')\\.' +
                    '(' + src[NUMERICIDENTIFIERLOOSE] + ')'

// ## Pre-release Version Identifier
// A numeric identifier, or a non-numeric identifier.

                var PRERELEASEIDENTIFIER = R++
                src[PRERELEASEIDENTIFIER] = '(?:' + src[NUMERICIDENTIFIER] +
                    '|' + src[NONNUMERICIDENTIFIER] + ')'

                var PRERELEASEIDENTIFIERLOOSE = R++
                src[PRERELEASEIDENTIFIERLOOSE] = '(?:' + src[NUMERICIDENTIFIERLOOSE] +
                    '|' + src[NONNUMERICIDENTIFIER] + ')'

// ## Pre-release Version
// Hyphen, followed by one or more dot-separated pre-release version
// identifiers.

                var PRERELEASE = R++
                src[PRERELEASE] = '(?:-(' + src[PRERELEASEIDENTIFIER] +
                    '(?:\\.' + src[PRERELEASEIDENTIFIER] + ')*))'

                var PRERELEASELOOSE = R++
                src[PRERELEASELOOSE] = '(?:-?(' + src[PRERELEASEIDENTIFIERLOOSE] +
                    '(?:\\.' + src[PRERELEASEIDENTIFIERLOOSE] + ')*))'

// ## Build Metadata Identifier
// Any combination of digits, letters, or hyphens.

                var BUILDIDENTIFIER = R++
                src[BUILDIDENTIFIER] = LETTERDASHNUMBER + '+'

// ## Build Metadata
// Plus sign, followed by one or more period-separated build metadata
// identifiers.

                var BUILD = R++
                src[BUILD] = '(?:\\+(' + src[BUILDIDENTIFIER] +
                    '(?:\\.' + src[BUILDIDENTIFIER] + ')*))'

// ## Full Version String
// A main version, followed optionally by a pre-release version and
// build metadata.

// Note that the only major, minor, patch, and pre-release sections of
// the version string are capturing groups.  The build metadata is not a
// capturing group, because it should not ever be used in version
// comparison.

                var FULL = R++
                var FULLPLAIN = 'v?' + src[MAINVERSION] +
                    src[PRERELEASE] + '?' +
                    src[BUILD] + '?'

                src[FULL] = '^' + FULLPLAIN + '$'

// like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
// also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
// common in the npm registry.
                var LOOSEPLAIN = '[v=\\s]*' + src[MAINVERSIONLOOSE] +
                    src[PRERELEASELOOSE] + '?' +
                    src[BUILD] + '?'

                var LOOSE = R++
                src[LOOSE] = '^' + LOOSEPLAIN + '$'

                var GTLT = R++
                src[GTLT] = '((?:<|>)?=?)'

// Something like "2.*" or "1.2.x".
// Note that "x.x" is a valid xRange identifer, meaning "any version"
// Only the first item is strictly required.
                var XRANGEIDENTIFIERLOOSE = R++
                src[XRANGEIDENTIFIERLOOSE] = src[NUMERICIDENTIFIERLOOSE] + '|x|X|\\*'
                var XRANGEIDENTIFIER = R++
                src[XRANGEIDENTIFIER] = src[NUMERICIDENTIFIER] + '|x|X|\\*'

                var XRANGEPLAIN = R++
                src[XRANGEPLAIN] = '[v=\\s]*(' + src[XRANGEIDENTIFIER] + ')' +
                    '(?:\\.(' + src[XRANGEIDENTIFIER] + ')' +
                    '(?:\\.(' + src[XRANGEIDENTIFIER] + ')' +
                    '(?:' + src[PRERELEASE] + ')?' +
                    src[BUILD] + '?' +
                    ')?)?'

                var XRANGEPLAINLOOSE = R++
                src[XRANGEPLAINLOOSE] = '[v=\\s]*(' + src[XRANGEIDENTIFIERLOOSE] + ')' +
                    '(?:\\.(' + src[XRANGEIDENTIFIERLOOSE] + ')' +
                    '(?:\\.(' + src[XRANGEIDENTIFIERLOOSE] + ')' +
                    '(?:' + src[PRERELEASELOOSE] + ')?' +
                    src[BUILD] + '?' +
                    ')?)?'

                var XRANGE = R++
                src[XRANGE] = '^' + src[GTLT] + '\\s*' + src[XRANGEPLAIN] + '$'
                var XRANGELOOSE = R++
                src[XRANGELOOSE] = '^' + src[GTLT] + '\\s*' + src[XRANGEPLAINLOOSE] + '$'

// Coercion.
// Extract anything that could conceivably be a part of a valid semver
                var COERCE = R++
                src[COERCE] = '(?:^|[^\\d])' +
                    '(\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '})' +
                    '(?:\\.(\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '}))?' +
                    '(?:\\.(\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '}))?' +
                    '(?:$|[^\\d])'

// Tilde ranges.
// Meaning is "reasonably at or greater than"
                var LONETILDE = R++
                src[LONETILDE] = '(?:~>?)'

                var TILDETRIM = R++
                src[TILDETRIM] = '(\\s*)' + src[LONETILDE] + '\\s+'
                re[TILDETRIM] = new RegExp(src[TILDETRIM], 'g')
                safeRe[TILDETRIM] = new RegExp(makeSafeRe(src[TILDETRIM]), 'g')
                var tildeTrimReplace = '$1~'

                var TILDE = R++
                src[TILDE] = '^' + src[LONETILDE] + src[XRANGEPLAIN] + '$'
                var TILDELOOSE = R++
                src[TILDELOOSE] = '^' + src[LONETILDE] + src[XRANGEPLAINLOOSE] + '$'

// Caret ranges.
// Meaning is "at least and backwards compatible with"
                var LONECARET = R++
                src[LONECARET] = '(?:\\^)'

                var CARETTRIM = R++
                src[CARETTRIM] = '(\\s*)' + src[LONECARET] + '\\s+'
                re[CARETTRIM] = new RegExp(src[CARETTRIM], 'g')
                safeRe[CARETTRIM] = new RegExp(makeSafeRe(src[CARETTRIM]), 'g')
                var caretTrimReplace = '$1^'

                var CARET = R++
                src[CARET] = '^' + src[LONECARET] + src[XRANGEPLAIN] + '$'
                var CARETLOOSE = R++
                src[CARETLOOSE] = '^' + src[LONECARET] + src[XRANGEPLAINLOOSE] + '$'

// A simple gt/lt/eq thing, or just "" to indicate "any version"
                var COMPARATORLOOSE = R++
                src[COMPARATORLOOSE] = '^' + src[GTLT] + '\\s*(' + LOOSEPLAIN + ')$|^$'
                var COMPARATOR = R++
                src[COMPARATOR] = '^' + src[GTLT] + '\\s*(' + FULLPLAIN + ')$|^$'

// An expression to strip any whitespace between the gtlt and the thing
// it modifies, so that `> 1.2.3` ==> `>1.2.3`
                var COMPARATORTRIM = R++
                src[COMPARATORTRIM] = '(\\s*)' + src[GTLT] +
                    '\\s*(' + LOOSEPLAIN + '|' + src[XRANGEPLAIN] + ')'

// this one has to use the /g flag
                re[COMPARATORTRIM] = new RegExp(src[COMPARATORTRIM], 'g')
                safeRe[COMPARATORTRIM] = new RegExp(makeSafeRe(src[COMPARATORTRIM]), 'g')
                var comparatorTrimReplace = '$1$2$3'

// Something like `1.2.3 - 1.2.4`
// Note that these all use the loose form, because they'll be
// checked against either the strict or loose comparator form
// later.
                var HYPHENRANGE = R++
                src[HYPHENRANGE] = '^\\s*(' + src[XRANGEPLAIN] + ')' +
                    '\\s+-\\s+' +
                    '(' + src[XRANGEPLAIN] + ')' +
                    '\\s*$'

                var HYPHENRANGELOOSE = R++
                src[HYPHENRANGELOOSE] = '^\\s*(' + src[XRANGEPLAINLOOSE] + ')' +
                    '\\s+-\\s+' +
                    '(' + src[XRANGEPLAINLOOSE] + ')' +
                    '\\s*$'

// Star ranges basically just allow anything at all.
                var STAR = R++
                src[STAR] = '(<|>)?=?\\s*\\*'

// Compile to actual regexp objects.
// All are flag-free, unless they were created above with a flag.
                for (var i = 0; i < R; i++) {
                    debug(i, src[i])
                    if (!re[i]) {
                        re[i] = new RegExp(src[i])

                        // Replace all greedy whitespace to prevent regex dos issues. These regex are
                        // used internally via the safeRe object since all inputs in this library get
                        // normalized first to trim and collapse all extra whitespace. The original
                        // regexes are exported for userland consumption and lower level usage. A
                        // future breaking change could export the safer regex only with a note that
                        // all input should have extra whitespace removed.
                        safeRe[i] = new RegExp(makeSafeRe(src[i]))
                    }
                }

                exports.parse = parse
                function parse (version, options) {
                    if (!options || typeof options !== 'object') {
                        options = {
                            loose: !!options,
                            includePrerelease: false
                        }
                    }

                    if (version instanceof SemVer) {
                        return version
                    }

                    if (typeof version !== 'string') {
                        return null
                    }

                    if (version.length > MAX_LENGTH) {
                        return null
                    }

                    var r = options.loose ? safeRe[LOOSE] : safeRe[FULL]
                    if (!r.test(version)) {
                        return null
                    }

                    try {
                        return new SemVer(version, options)
                    } catch (er) {
                        return null
                    }
                }

                exports.valid = valid
                function valid (version, options) {
                    var v = parse(version, options)
                    return v ? v.version : null
                }

                exports.clean = clean
                function clean (version, options) {
                    var s = parse(version.trim().replace(/^[=v]+/, ''), options)
                    return s ? s.version : null
                }

                exports.SemVer = SemVer

                function SemVer (version, options) {
                    if (!options || typeof options !== 'object') {
                        options = {
                            loose: !!options,
                            includePrerelease: false
                        }
                    }
                    if (version instanceof SemVer) {
                        if (version.loose === options.loose) {
                            return version
                        } else {
                            version = version.version
                        }
                    } else if (typeof version !== 'string') {
                        throw new TypeError('Invalid Version: ' + version)
                    }

                    if (version.length > MAX_LENGTH) {
                        throw new TypeError('version is longer than ' + MAX_LENGTH + ' characters')
                    }

                    if (!(this instanceof SemVer)) {
                        return new SemVer(version, options)
                    }

                    debug('SemVer', version, options)
                    this.options = options
                    this.loose = !!options.loose

                    var m = version.trim().match(options.loose ? safeRe[LOOSE] : safeRe[FULL])

                    if (!m) {
                        throw new TypeError('Invalid Version: ' + version)
                    }

                    this.raw = version

                    // these are actually numbers
                    this.major = +m[1]
                    this.minor = +m[2]
                    this.patch = +m[3]

                    if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
                        throw new TypeError('Invalid major version')
                    }

                    if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
                        throw new TypeError('Invalid minor version')
                    }

                    if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
                        throw new TypeError('Invalid patch version')
                    }

                    // numberify any prerelease numeric ids
                    if (!m[4]) {
                        this.prerelease = []
                    } else {
                        this.prerelease = m[4].split('.').map(function (id) {
                            if (/^[0-9]+$/.test(id)) {
                                var num = +id
                                if (num >= 0 && num < MAX_SAFE_INTEGER) {
                                    return num
                                }
                            }
                            return id
                        })
                    }

                    this.build = m[5] ? m[5].split('.') : []
                    this.format()
                }

                SemVer.prototype.format = function () {
                    this.version = this.major + '.' + this.minor + '.' + this.patch
                    if (this.prerelease.length) {
                        this.version += '-' + this.prerelease.join('.')
                    }
                    return this.version
                }

                SemVer.prototype.toString = function () {
                    return this.version
                }

                SemVer.prototype.compare = function (other) {
                    debug('SemVer.compare', this.version, this.options, other)
                    if (!(other instanceof SemVer)) {
                        other = new SemVer(other, this.options)
                    }

                    return this.compareMain(other) || this.comparePre(other)
                }

                SemVer.prototype.compareMain = function (other) {
                    if (!(other instanceof SemVer)) {
                        other = new SemVer(other, this.options)
                    }

                    return compareIdentifiers(this.major, other.major) ||
                        compareIdentifiers(this.minor, other.minor) ||
                        compareIdentifiers(this.patch, other.patch)
                }

                SemVer.prototype.comparePre = function (other) {
                    if (!(other instanceof SemVer)) {
                        other = new SemVer(other, this.options)
                    }

                    // NOT having a prerelease is > having one
                    if (this.prerelease.length && !other.prerelease.length) {
                        return -1
                    } else if (!this.prerelease.length && other.prerelease.length) {
                        return 1
                    } else if (!this.prerelease.length && !other.prerelease.length) {
                        return 0
                    }

                    var i = 0
                    do {
                        var a = this.prerelease[i]
                        var b = other.prerelease[i]
                        debug('prerelease compare', i, a, b)
                        if (a === undefined && b === undefined) {
                            return 0
                        } else if (b === undefined) {
                            return 1
                        } else if (a === undefined) {
                            return -1
                        } else if (a === b) {
                            continue
                        } else {
                            return compareIdentifiers(a, b)
                        }
                    } while (++i)
                }

// preminor will bump the version up to the next minor release, and immediately
// down to pre-release. premajor and prepatch work the same way.
                SemVer.prototype.inc = function (release, identifier) {
                    switch (release) {
                        case 'premajor':
                            this.prerelease.length = 0
                            this.patch = 0
                            this.minor = 0
                            this.major++
                            this.inc('pre', identifier)
                            break
                        case 'preminor':
                            this.prerelease.length = 0
                            this.patch = 0
                            this.minor++
                            this.inc('pre', identifier)
                            break
                        case 'prepatch':
                            // If this is already a prerelease, it will bump to the next version
                            // drop any prereleases that might already exist, since they are not
                            // relevant at this point.
                            this.prerelease.length = 0
                            this.inc('patch', identifier)
                            this.inc('pre', identifier)
                            break
                        // If the input is a non-prerelease version, this acts the same as
                        // prepatch.
                        case 'prerelease':
                            if (this.prerelease.length === 0) {
                                this.inc('patch', identifier)
                            }
                            this.inc('pre', identifier)
                            break

                        case 'major':
                            // If this is a pre-major version, bump up to the same major version.
                            // Otherwise increment major.
                            // 1.0.0-5 bumps to 1.0.0
                            // 1.1.0 bumps to 2.0.0
                            if (this.minor !== 0 ||
                                this.patch !== 0 ||
                                this.prerelease.length === 0) {
                                this.major++
                            }
                            this.minor = 0
                            this.patch = 0
                            this.prerelease = []
                            break
                        case 'minor':
                            // If this is a pre-minor version, bump up to the same minor version.
                            // Otherwise increment minor.
                            // 1.2.0-5 bumps to 1.2.0
                            // 1.2.1 bumps to 1.3.0
                            if (this.patch !== 0 || this.prerelease.length === 0) {
                                this.minor++
                            }
                            this.patch = 0
                            this.prerelease = []
                            break
                        case 'patch':
                            // If this is not a pre-release version, it will increment the patch.
                            // If it is a pre-release it will bump up to the same patch version.
                            // 1.2.0-5 patches to 1.2.0
                            // 1.2.0 patches to 1.2.1
                            if (this.prerelease.length === 0) {
                                this.patch++
                            }
                            this.prerelease = []
                            break
                        // This probably shouldn't be used publicly.
                        // 1.0.0 "pre" would become 1.0.0-0 which is the wrong direction.
                        case 'pre':
                            if (this.prerelease.length === 0) {
                                this.prerelease = [0]
                            } else {
                                var i = this.prerelease.length
                                while (--i >= 0) {
                                    if (typeof this.prerelease[i] === 'number') {
                                        this.prerelease[i]++
                                        i = -2
                                    }
                                }
                                if (i === -1) {
                                    // didn't increment anything
                                    this.prerelease.push(0)
                                }
                            }
                            if (identifier) {
                                // 1.2.0-beta.1 bumps to 1.2.0-beta.2,
                                // 1.2.0-beta.fooblz or 1.2.0-beta bumps to 1.2.0-beta.0
                                if (this.prerelease[0] === identifier) {
                                    if (isNaN(this.prerelease[1])) {
                                        this.prerelease = [identifier, 0]
                                    }
                                } else {
                                    this.prerelease = [identifier, 0]
                                }
                            }
                            break

                        default:
                            throw new Error('invalid increment argument: ' + release)
                    }
                    this.format()
                    this.raw = this.version
                    return this
                }

                exports.inc = inc
                function inc (version, release, loose, identifier) {
                    if (typeof (loose) === 'string') {
                        identifier = loose
                        loose = undefined
                    }

                    try {
                        return new SemVer(version, loose).inc(release, identifier).version
                    } catch (er) {
                        return null
                    }
                }

                exports.diff = diff
                function diff (version1, version2) {
                    if (eq(version1, version2)) {
                        return null
                    } else {
                        var v1 = parse(version1)
                        var v2 = parse(version2)
                        var prefix = ''
                        if (v1.prerelease.length || v2.prerelease.length) {
                            prefix = 'pre'
                            var defaultResult = 'prerelease'
                        }
                        for (var key in v1) {
                            if (key === 'major' || key === 'minor' || key === 'patch') {
                                if (v1[key] !== v2[key]) {
                                    return prefix + key
                                }
                            }
                        }
                        return defaultResult // may be undefined
                    }
                }

                exports.compareIdentifiers = compareIdentifiers

                var numeric = /^[0-9]+$/
                function compareIdentifiers (a, b) {
                    var anum = numeric.test(a)
                    var bnum = numeric.test(b)

                    if (anum && bnum) {
                        a = +a
                        b = +b
                    }

                    return a === b ? 0
                        : (anum && !bnum) ? -1
                            : (bnum && !anum) ? 1
                                : a < b ? -1
                                    : 1
                }

                exports.rcompareIdentifiers = rcompareIdentifiers
                function rcompareIdentifiers (a, b) {
                    return compareIdentifiers(b, a)
                }

                exports.major = major
                function major (a, loose) {
                    return new SemVer(a, loose).major
                }

                exports.minor = minor
                function minor (a, loose) {
                    return new SemVer(a, loose).minor
                }

                exports.patch = patch
                function patch (a, loose) {
                    return new SemVer(a, loose).patch
                }

                exports.compare = compare
                function compare (a, b, loose) {
                    return new SemVer(a, loose).compare(new SemVer(b, loose))
                }

                exports.compareLoose = compareLoose
                function compareLoose (a, b) {
                    return compare(a, b, true)
                }

                exports.rcompare = rcompare
                function rcompare (a, b, loose) {
                    return compare(b, a, loose)
                }

                exports.sort = sort
                function sort (list, loose) {
                    return list.sort(function (a, b) {
                        return exports.compare(a, b, loose)
                    })
                }

                exports.rsort = rsort
                function rsort (list, loose) {
                    return list.sort(function (a, b) {
                        return exports.rcompare(a, b, loose)
                    })
                }

                exports.gt = gt
                function gt (a, b, loose) {
                    return compare(a, b, loose) > 0
                }

                exports.lt = lt
                function lt (a, b, loose) {
                    return compare(a, b, loose) < 0
                }

                exports.eq = eq
                function eq (a, b, loose) {
                    return compare(a, b, loose) === 0
                }

                exports.neq = neq
                function neq (a, b, loose) {
                    return compare(a, b, loose) !== 0
                }

                exports.gte = gte
                function gte (a, b, loose) {
                    return compare(a, b, loose) >= 0
                }

                exports.lte = lte
                function lte (a, b, loose) {
                    return compare(a, b, loose) <= 0
                }

                exports.cmp = cmp
                function cmp (a, op, b, loose) {
                    switch (op) {
                        case '===':
                            if (typeof a === 'object')
                                a = a.version
                            if (typeof b === 'object')
                                b = b.version
                            return a === b

                        case '!==':
                            if (typeof a === 'object')
                                a = a.version
                            if (typeof b === 'object')
                                b = b.version
                            return a !== b

                        case '':
                        case '=':
                        case '==':
                            return eq(a, b, loose)

                        case '!=':
                            return neq(a, b, loose)

                        case '>':
                            return gt(a, b, loose)

                        case '>=':
                            return gte(a, b, loose)

                        case '<':
                            return lt(a, b, loose)

                        case '<=':
                            return lte(a, b, loose)

                        default:
                            throw new TypeError('Invalid operator: ' + op)
                    }
                }

                exports.Comparator = Comparator
                function Comparator (comp, options) {
                    if (!options || typeof options !== 'object') {
                        options = {
                            loose: !!options,
                            includePrerelease: false
                        }
                    }

                    if (comp instanceof Comparator) {
                        if (comp.loose === !!options.loose) {
                            return comp
                        } else {
                            comp = comp.value
                        }
                    }

                    if (!(this instanceof Comparator)) {
                        return new Comparator(comp, options)
                    }

                    comp = comp.trim().split(/\s+/).join(' ')
                    debug('comparator', comp, options)
                    this.options = options
                    this.loose = !!options.loose
                    this.parse(comp)

                    if (this.semver === ANY) {
                        this.value = ''
                    } else {
                        this.value = this.operator + this.semver.version
                    }

                    debug('comp', this)
                }

                var ANY = {}
                Comparator.prototype.parse = function (comp) {
                    var r = this.options.loose ? safeRe[COMPARATORLOOSE] : safeRe[COMPARATOR]
                    var m = comp.match(r)

                    if (!m) {
                        throw new TypeError('Invalid comparator: ' + comp)
                    }

                    this.operator = m[1]
                    if (this.operator === '=') {
                        this.operator = ''
                    }

                    // if it literally is just '>' or '' then allow anything.
                    if (!m[2]) {
                        this.semver = ANY
                    } else {
                        this.semver = new SemVer(m[2], this.options.loose)
                    }
                }

                Comparator.prototype.toString = function () {
                    return this.value
                }

                Comparator.prototype.test = function (version) {
                    debug('Comparator.test', version, this.options.loose)

                    if (this.semver === ANY) {
                        return true
                    }

                    if (typeof version === 'string') {
                        version = new SemVer(version, this.options)
                    }

                    return cmp(version, this.operator, this.semver, this.options)
                }

                Comparator.prototype.intersects = function (comp, options) {
                    if (!(comp instanceof Comparator)) {
                        throw new TypeError('a Comparator is required')
                    }

                    if (!options || typeof options !== 'object') {
                        options = {
                            loose: !!options,
                            includePrerelease: false
                        }
                    }

                    var rangeTmp

                    if (this.operator === '') {
                        rangeTmp = new Range(comp.value, options)
                        return satisfies(this.value, rangeTmp, options)
                    } else if (comp.operator === '') {
                        rangeTmp = new Range(this.value, options)
                        return satisfies(comp.semver, rangeTmp, options)
                    }

                    var sameDirectionIncreasing =
                        (this.operator === '>=' || this.operator === '>') &&
                        (comp.operator === '>=' || comp.operator === '>')
                    var sameDirectionDecreasing =
                        (this.operator === '<=' || this.operator === '<') &&
                        (comp.operator === '<=' || comp.operator === '<')
                    var sameSemVer = this.semver.version === comp.semver.version
                    var differentDirectionsInclusive =
                        (this.operator === '>=' || this.operator === '<=') &&
                        (comp.operator === '>=' || comp.operator === '<=')
                    var oppositeDirectionsLessThan =
                        cmp(this.semver, '<', comp.semver, options) &&
                        ((this.operator === '>=' || this.operator === '>') &&
                            (comp.operator === '<=' || comp.operator === '<'))
                    var oppositeDirectionsGreaterThan =
                        cmp(this.semver, '>', comp.semver, options) &&
                        ((this.operator === '<=' || this.operator === '<') &&
                            (comp.operator === '>=' || comp.operator === '>'))

                    return sameDirectionIncreasing || sameDirectionDecreasing ||
                        (sameSemVer && differentDirectionsInclusive) ||
                        oppositeDirectionsLessThan || oppositeDirectionsGreaterThan
                }

                exports.Range = Range
                function Range (range, options) {
                    if (!options || typeof options !== 'object') {
                        options = {
                            loose: !!options,
                            includePrerelease: false
                        }
                    }

                    if (range instanceof Range) {
                        if (range.loose === !!options.loose &&
                            range.includePrerelease === !!options.includePrerelease) {
                            return range
                        } else {
                            return new Range(range.raw, options)
                        }
                    }

                    if (range instanceof Comparator) {
                        return new Range(range.value, options)
                    }

                    if (!(this instanceof Range)) {
                        return new Range(range, options)
                    }

                    this.options = options
                    this.loose = !!options.loose
                    this.includePrerelease = !!options.includePrerelease

                    // First reduce all whitespace as much as possible so we do not have to rely
                    // on potentially slow regexes like \s*. This is then stored and used for
                    // future error messages as well.
                    this.raw = range
                        .trim()
                        .split(/\s+/)
                        .join(' ')

                    // First, split based on boolean or ||
                    this.set = this.raw.split('||').map(function (range) {
                        return this.parseRange(range.trim())
                    }, this).filter(function (c) {
                        // throw out any that are not relevant for whatever reason
                        return c.length
                    })

                    if (!this.set.length) {
                        throw new TypeError('Invalid SemVer Range: ' + this.raw)
                    }

                    this.format()
                }

                Range.prototype.format = function () {
                    this.range = this.set.map(function (comps) {
                        return comps.join(' ').trim()
                    }).join('||').trim()
                    return this.range
                }

                Range.prototype.toString = function () {
                    return this.range
                }

                Range.prototype.parseRange = function (range) {
                    var loose = this.options.loose
                    // `1.2.3 - 1.2.4` => `>=1.2.3 <=1.2.4`
                    var hr = loose ? safeRe[HYPHENRANGELOOSE] : safeRe[HYPHENRANGE]
                    range = range.replace(hr, hyphenReplace)
                    debug('hyphen replace', range)
                    // `> 1.2.3 < 1.2.5` => `>1.2.3 <1.2.5`
                    range = range.replace(safeRe[COMPARATORTRIM], comparatorTrimReplace)
                    debug('comparator trim', range, safeRe[COMPARATORTRIM])

                    // `~ 1.2.3` => `~1.2.3`
                    range = range.replace(safeRe[TILDETRIM], tildeTrimReplace)

                    // `^ 1.2.3` => `^1.2.3`
                    range = range.replace(safeRe[CARETTRIM], caretTrimReplace)

                    // At this point, the range is completely trimmed and
                    // ready to be split into comparators.
                    var compRe = loose ? safeRe[COMPARATORLOOSE] : safeRe[COMPARATOR]
                    var set = range.split(' ').map(function (comp) {
                        return parseComparator(comp, this.options)
                    }, this).join(' ').split(/\s+/)
                    if (this.options.loose) {
                        // in loose mode, throw out any that are not valid comparators
                        set = set.filter(function (comp) {
                            return !!comp.match(compRe)
                        })
                    }
                    set = set.map(function (comp) {
                        return new Comparator(comp, this.options)
                    }, this)

                    return set
                }

                Range.prototype.intersects = function (range, options) {
                    if (!(range instanceof Range)) {
                        throw new TypeError('a Range is required')
                    }

                    return this.set.some(function (thisComparators) {
                        return thisComparators.every(function (thisComparator) {
                            return range.set.some(function (rangeComparators) {
                                return rangeComparators.every(function (rangeComparator) {
                                    return thisComparator.intersects(rangeComparator, options)
                                })
                            })
                        })
                    })
                }

// Mostly just for testing and legacy API reasons
                exports.toComparators = toComparators
                function toComparators (range, options) {
                    return new Range(range, options).set.map(function (comp) {
                        return comp.map(function (c) {
                            return c.value
                        }).join(' ').trim().split(' ')
                    })
                }

// comprised of xranges, tildes, stars, and gtlt's at this point.
// already replaced the hyphen ranges
// turn into a set of JUST comparators.
                function parseComparator (comp, options) {
                    debug('comp', comp, options)
                    comp = replaceCarets(comp, options)
                    debug('caret', comp)
                    comp = replaceTildes(comp, options)
                    debug('tildes', comp)
                    comp = replaceXRanges(comp, options)
                    debug('xrange', comp)
                    comp = replaceStars(comp, options)
                    debug('stars', comp)
                    return comp
                }

                function isX (id) {
                    return !id || id.toLowerCase() === 'x' || id === '*'
                }

// ~, ~> --> * (any, kinda silly)
// ~2, ~2.x, ~2.x.x, ~>2, ~>2.x ~>2.x.x --> >=2.0.0 <3.0.0
// ~2.0, ~2.0.x, ~>2.0, ~>2.0.x --> >=2.0.0 <2.1.0
// ~1.2, ~1.2.x, ~>1.2, ~>1.2.x --> >=1.2.0 <1.3.0
// ~1.2.3, ~>1.2.3 --> >=1.2.3 <1.3.0
// ~1.2.0, ~>1.2.0 --> >=1.2.0 <1.3.0
                function replaceTildes (comp, options) {
                    return comp.trim().split(/\s+/).map(function (comp) {
                        return replaceTilde(comp, options)
                    }).join(' ')
                }

                function replaceTilde (comp, options) {
                    var r = options.loose ? safeRe[TILDELOOSE] : safeRe[TILDE]
                    return comp.replace(r, function (_, M, m, p, pr) {
                        debug('tilde', comp, _, M, m, p, pr)
                        var ret

                        if (isX(M)) {
                            ret = ''
                        } else if (isX(m)) {
                            ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0'
                        } else if (isX(p)) {
                            // ~1.2 == >=1.2.0 <1.3.0
                            ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0'
                        } else if (pr) {
                            debug('replaceTilde pr', pr)
                            ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
                                ' <' + M + '.' + (+m + 1) + '.0'
                        } else {
                            // ~1.2.3 == >=1.2.3 <1.3.0
                            ret = '>=' + M + '.' + m + '.' + p +
                                ' <' + M + '.' + (+m + 1) + '.0'
                        }

                        debug('tilde return', ret)
                        return ret
                    })
                }

// ^ --> * (any, kinda silly)
// ^2, ^2.x, ^2.x.x --> >=2.0.0 <3.0.0
// ^2.0, ^2.0.x --> >=2.0.0 <3.0.0
// ^1.2, ^1.2.x --> >=1.2.0 <2.0.0
// ^1.2.3 --> >=1.2.3 <2.0.0
// ^1.2.0 --> >=1.2.0 <2.0.0
                function replaceCarets (comp, options) {
                    return comp.trim().split(/\s+/).map(function (comp) {
                        return replaceCaret(comp, options)
                    }).join(' ')
                }

                function replaceCaret (comp, options) {
                    debug('caret', comp, options)
                    var r = options.loose ? safeRe[CARETLOOSE] : safeRe[CARET]
                    return comp.replace(r, function (_, M, m, p, pr) {
                        debug('caret', comp, _, M, m, p, pr)
                        var ret

                        if (isX(M)) {
                            ret = ''
                        } else if (isX(m)) {
                            ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0'
                        } else if (isX(p)) {
                            if (M === '0') {
                                ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0'
                            } else {
                                ret = '>=' + M + '.' + m + '.0 <' + (+M + 1) + '.0.0'
                            }
                        } else if (pr) {
                            debug('replaceCaret pr', pr)
                            if (M === '0') {
                                if (m === '0') {
                                    ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
                                        ' <' + M + '.' + m + '.' + (+p + 1)
                                } else {
                                    ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
                                        ' <' + M + '.' + (+m + 1) + '.0'
                                }
                            } else {
                                ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
                                    ' <' + (+M + 1) + '.0.0'
                            }
                        } else {
                            debug('no pr')
                            if (M === '0') {
                                if (m === '0') {
                                    ret = '>=' + M + '.' + m + '.' + p +
                                        ' <' + M + '.' + m + '.' + (+p + 1)
                                } else {
                                    ret = '>=' + M + '.' + m + '.' + p +
                                        ' <' + M + '.' + (+m + 1) + '.0'
                                }
                            } else {
                                ret = '>=' + M + '.' + m + '.' + p +
                                    ' <' + (+M + 1) + '.0.0'
                            }
                        }

                        debug('caret return', ret)
                        return ret
                    })
                }

                function replaceXRanges (comp, options) {
                    debug('replaceXRanges', comp, options)
                    return comp.split(/\s+/).map(function (comp) {
                        return replaceXRange(comp, options)
                    }).join(' ')
                }

                function replaceXRange (comp, options) {
                    comp = comp.trim()
                    var r = options.loose ? safeRe[XRANGELOOSE] : safeRe[XRANGE]
                    return comp.replace(r, function (ret, gtlt, M, m, p, pr) {
                        debug('xRange', comp, ret, gtlt, M, m, p, pr)
                        var xM = isX(M)
                        var xm = xM || isX(m)
                        var xp = xm || isX(p)
                        var anyX = xp

                        if (gtlt === '=' && anyX) {
                            gtlt = ''
                        }

                        if (xM) {
                            if (gtlt === '>' || gtlt === '<') {
                                // nothing is allowed
                                ret = '<0.0.0'
                            } else {
                                // nothing is forbidden
                                ret = '*'
                            }
                        } else if (gtlt && anyX) {
                            // we know patch is an x, because we have any x at all.
                            // replace X with 0
                            if (xm) {
                                m = 0
                            }
                            p = 0

                            if (gtlt === '>') {
                                // >1 => >=2.0.0
                                // >1.2 => >=1.3.0
                                // >1.2.3 => >= 1.2.4
                                gtlt = '>='
                                if (xm) {
                                    M = +M + 1
                                    m = 0
                                    p = 0
                                } else {
                                    m = +m + 1
                                    p = 0
                                }
                            } else if (gtlt === '<=') {
                                // <=0.7.x is actually <0.8.0, since any 0.7.x should
                                // pass.  Similarly, <=7.x is actually <8.0.0, etc.
                                gtlt = '<'
                                if (xm) {
                                    M = +M + 1
                                } else {
                                    m = +m + 1
                                }
                            }

                            ret = gtlt + M + '.' + m + '.' + p
                        } else if (xm) {
                            ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0'
                        } else if (xp) {
                            ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0'
                        }

                        debug('xRange return', ret)

                        return ret
                    })
                }

// Because * is AND-ed with everything else in the comparator,
// and '' means "any version", just remove the *s entirely.
                function replaceStars (comp, options) {
                    debug('replaceStars', comp, options)
                    // Looseness is ignored here.  star is always as loose as it gets!
                    return comp.trim().replace(safeRe[STAR], '')
                }

// This function is passed to string.replace(safeRe[HYPHENRANGE])
// M, m, patch, prerelease, build
// 1.2 - 3.4.5 => >=1.2.0 <=3.4.5
// 1.2.3 - 3.4 => >=1.2.0 <3.5.0 Any 3.4.x will do
// 1.2 - 3.4 => >=1.2.0 <3.5.0
                function hyphenReplace ($0,
                                        from, fM, fm, fp, fpr, fb,
                                        to, tM, tm, tp, tpr, tb) {
                    if (isX(fM)) {
                        from = ''
                    } else if (isX(fm)) {
                        from = '>=' + fM + '.0.0'
                    } else if (isX(fp)) {
                        from = '>=' + fM + '.' + fm + '.0'
                    } else {
                        from = '>=' + from
                    }

                    if (isX(tM)) {
                        to = ''
                    } else if (isX(tm)) {
                        to = '<' + (+tM + 1) + '.0.0'
                    } else if (isX(tp)) {
                        to = '<' + tM + '.' + (+tm + 1) + '.0'
                    } else if (tpr) {
                        to = '<=' + tM + '.' + tm + '.' + tp + '-' + tpr
                    } else {
                        to = '<=' + to
                    }

                    return (from + ' ' + to).trim()
                }

// if ANY of the sets match ALL of its comparators, then pass
                Range.prototype.test = function (version) {
                    if (!version) {
                        return false
                    }

                    if (typeof version === 'string') {
                        version = new SemVer(version, this.options)
                    }

                    for (var i = 0; i < this.set.length; i++) {
                        if (testSet(this.set[i], version, this.options)) {
                            return true
                        }
                    }
                    return false
                }

                function testSet (set, version, options) {
                    for (var i = 0; i < set.length; i++) {
                        if (!set[i].test(version)) {
                            return false
                        }
                    }

                    if (version.prerelease.length && !options.includePrerelease) {
                        // Find the set of versions that are allowed to have prereleases
                        // For example, ^1.2.3-pr.1 desugars to >=1.2.3-pr.1 <2.0.0
                        // That should allow `1.2.3-pr.2` to pass.
                        // However, `1.2.4-alpha.notready` should NOT be allowed,
                        // even though it's within the range set by the comparators.
                        for (i = 0; i < set.length; i++) {
                            debug(set[i].semver)
                            if (set[i].semver === ANY) {
                                continue
                            }

                            if (set[i].semver.prerelease.length > 0) {
                                var allowed = set[i].semver
                                if (allowed.major === version.major &&
                                    allowed.minor === version.minor &&
                                    allowed.patch === version.patch) {
                                    return true
                                }
                            }
                        }

                        // Version has a -pre, but it's not one of the ones we like.
                        return false
                    }

                    return true
                }

                exports.satisfies = satisfies
                function satisfies (version, range, options) {
                    try {
                        range = new Range(range, options)
                    } catch (er) {
                        return false
                    }
                    return range.test(version)
                }

                exports.maxSatisfying = maxSatisfying
                function maxSatisfying (versions, range, options) {
                    var max = null
                    var maxSV = null
                    try {
                        var rangeObj = new Range(range, options)
                    } catch (er) {
                        return null
                    }
                    versions.forEach(function (v) {
                        if (rangeObj.test(v)) {
                            // satisfies(v, range, options)
                            if (!max || maxSV.compare(v) === -1) {
                                // compare(max, v, true)
                                max = v
                                maxSV = new SemVer(max, options)
                            }
                        }
                    })
                    return max
                }

                exports.minSatisfying = minSatisfying
                function minSatisfying (versions, range, options) {
                    var min = null
                    var minSV = null
                    try {
                        var rangeObj = new Range(range, options)
                    } catch (er) {
                        return null
                    }
                    versions.forEach(function (v) {
                        if (rangeObj.test(v)) {
                            // satisfies(v, range, options)
                            if (!min || minSV.compare(v) === 1) {
                                // compare(min, v, true)
                                min = v
                                minSV = new SemVer(min, options)
                            }
                        }
                    })
                    return min
                }

                exports.minVersion = minVersion
                function minVersion (range, loose) {
                    range = new Range(range, loose)

                    var minver = new SemVer('0.0.0')
                    if (range.test(minver)) {
                        return minver
                    }

                    minver = new SemVer('0.0.0-0')
                    if (range.test(minver)) {
                        return minver
                    }

                    minver = null
                    for (var i = 0; i < range.set.length; ++i) {
                        var comparators = range.set[i]

                        comparators.forEach(function (comparator) {
                            // Clone to avoid manipulating the comparator's semver object.
                            var compver = new SemVer(comparator.semver.version)
                            switch (comparator.operator) {
                                case '>':
                                    if (compver.prerelease.length === 0) {
                                        compver.patch++
                                    } else {
                                        compver.prerelease.push(0)
                                    }
                                    compver.raw = compver.format()
                                /* fallthrough */
                                case '':
                                case '>=':
                                    if (!minver || gt(minver, compver)) {
                                        minver = compver
                                    }
                                    break
                                case '<':
                                case '<=':
                                    /* Ignore maximum versions */
                                    break
                                /* istanbul ignore next */
                                default:
                                    throw new Error('Unexpected operation: ' + comparator.operator)
                            }
                        })
                    }

                    if (minver && range.test(minver)) {
                        return minver
                    }

                    return null
                }

                exports.validRange = validRange
                function validRange (range, options) {
                    try {
                        // Return '*' instead of '' so that truthiness works.
                        // This will throw if it's invalid anyway
                        return new Range(range, options).range || '*'
                    } catch (er) {
                        return null
                    }
                }

// Determine if version is less than all the versions possible in the range
                exports.ltr = ltr
                function ltr (version, range, options) {
                    return outside(version, range, '<', options)
                }

// Determine if version is greater than all the versions possible in the range.
                exports.gtr = gtr
                function gtr (version, range, options) {
                    return outside(version, range, '>', options)
                }

                exports.outside = outside
                function outside (version, range, hilo, options) {
                    version = new SemVer(version, options)
                    range = new Range(range, options)

                    var gtfn, ltefn, ltfn, comp, ecomp
                    switch (hilo) {
                        case '>':
                            gtfn = gt
                            ltefn = lte
                            ltfn = lt
                            comp = '>'
                            ecomp = '>='
                            break
                        case '<':
                            gtfn = lt
                            ltefn = gte
                            ltfn = gt
                            comp = '<'
                            ecomp = '<='
                            break
                        default:
                            throw new TypeError('Must provide a hilo val of "<" or ">"')
                    }

                    // If it satisifes the range it is not outside
                    if (satisfies(version, range, options)) {
                        return false
                    }

                    // From now on, variable terms are as if we're in "gtr" mode.
                    // but note that everything is flipped for the "ltr" function.

                    for (var i = 0; i < range.set.length; ++i) {
                        var comparators = range.set[i]

                        var high = null
                        var low = null

                        comparators.forEach(function (comparator) {
                            if (comparator.semver === ANY) {
                                comparator = new Comparator('>=0.0.0')
                            }
                            high = high || comparator
                            low = low || comparator
                            if (gtfn(comparator.semver, high.semver, options)) {
                                high = comparator
                            } else if (ltfn(comparator.semver, low.semver, options)) {
                                low = comparator
                            }
                        })

                        // If the edge version comparator has a operator then our version
                        // isn't outside it
                        if (high.operator === comp || high.operator === ecomp) {
                            return false
                        }

                        // If the lowest version comparator has an operator and our version
                        // is less than it then it isn't higher than the range
                        if ((!low.operator || low.operator === comp) &&
                            ltefn(version, low.semver)) {
                            return false
                        } else if (low.operator === ecomp && ltfn(version, low.semver)) {
                            return false
                        }
                    }
                    return true
                }

                exports.prerelease = prerelease
                function prerelease (version, options) {
                    var parsed = parse(version, options)
                    return (parsed && parsed.prerelease.length) ? parsed.prerelease : null
                }

                exports.intersects = intersects
                function intersects (r1, r2, options) {
                    r1 = new Range(r1, options)
                    r2 = new Range(r2, options)
                    return r1.intersects(r2)
                }

                exports.coerce = coerce
                function coerce (version) {
                    if (version instanceof SemVer) {
                        return version
                    }

                    if (typeof version !== 'string') {
                        return null
                    }

                    var match = version.match(safeRe[COERCE])

                    if (match == null) {
                        return null
                    }

                    return parse(match[1] +
                        '.' + (match[2] || '0') +
                        '.' + (match[3] || '0'))
                }


                /***/ }),

            /***/ 294:
            /***/ (function(module, __unusedexports, __webpack_require__) {

                "use strict";

                const fs = __webpack_require__(747);

                module.exports = fp => new Promise(resolve => {
                    fs.access(fp, err => {
                        resolve(!err);
                    });
                });

                module.exports.sync = fp => {
                    try {
                        fs.accessSync(fp);
                        return true;
                    } catch (err) {
                        return false;
                    }
                };


                /***/ }),

            /***/ 298:
            /***/ (function(__unusedmodule, exports, __webpack_require__) {

                "use strict";


                Object.defineProperty(exports, '__esModule', { value: true });

                function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

                var endpoint = __webpack_require__(723);
                var universalUserAgent = __webpack_require__(796);
                var isPlainObject = __webpack_require__(356);
                var nodeFetch = _interopDefault(__webpack_require__(454));
                var requestError = __webpack_require__(195);

                const VERSION = "5.6.3";

                function getBufferResponse(response) {
                    return response.arrayBuffer();
                }

                function fetchWrapper(requestOptions) {
                    const log = requestOptions.request && requestOptions.request.log ? requestOptions.request.log : console;

                    if (isPlainObject.isPlainObject(requestOptions.body) || Array.isArray(requestOptions.body)) {
                        requestOptions.body = JSON.stringify(requestOptions.body);
                    }

                    let headers = {};
                    let status;
                    let url;
                    const fetch = requestOptions.request && requestOptions.request.fetch || nodeFetch;
                    return fetch(requestOptions.url, Object.assign({
                            method: requestOptions.method,
                            body: requestOptions.body,
                            headers: requestOptions.headers,
                            redirect: requestOptions.redirect
                        }, // `requestOptions.request.agent` type is incompatible
                        // see https://github.com/octokit/types.ts/pull/264
                        requestOptions.request)).then(async response => {
                        url = response.url;
                        status = response.status;

                        for (const keyAndValue of response.headers) {
                            headers[keyAndValue[0]] = keyAndValue[1];
                        }

                        if ("deprecation" in headers) {
                            const matches = headers.link && headers.link.match(/<([^>]+)>; rel="deprecation"/);
                            const deprecationLink = matches && matches.pop();
                            log.warn(`[@octokit/request] "${requestOptions.method} ${requestOptions.url}" is deprecated. It is scheduled to be removed on ${headers.sunset}${deprecationLink ? `. See ${deprecationLink}` : ""}`);
                        }

                        if (status === 204 || status === 205) {
                            return;
                        } // GitHub API returns 200 for HEAD requests


                        if (requestOptions.method === "HEAD") {
                            if (status < 400) {
                                return;
                            }

                            throw new requestError.RequestError(response.statusText, status, {
                                response: {
                                    url,
                                    status,
                                    headers,
                                    data: undefined
                                },
                                request: requestOptions
                            });
                        }

                        if (status === 304) {
                            throw new requestError.RequestError("Not modified", status, {
                                response: {
                                    url,
                                    status,
                                    headers,
                                    data: await getResponseData(response)
                                },
                                request: requestOptions
                            });
                        }

                        if (status >= 400) {
                            const data = await getResponseData(response);
                            const error = new requestError.RequestError(toErrorMessage(data), status, {
                                response: {
                                    url,
                                    status,
                                    headers,
                                    data
                                },
                                request: requestOptions
                            });
                            throw error;
                        }

                        return getResponseData(response);
                    }).then(data => {
                        return {
                            status,
                            url,
                            headers,
                            data
                        };
                    }).catch(error => {
                        if (error instanceof requestError.RequestError) throw error;
                        throw new requestError.RequestError(error.message, 500, {
                            request: requestOptions
                        });
                    });
                }

                async function getResponseData(response) {
                    const contentType = response.headers.get("content-type");

                    if (/application\/json/.test(contentType)) {
                        return response.json();
                    }

                    if (!contentType || /^text\/|charset=utf-8$/.test(contentType)) {
                        return response.text();
                    }

                    return getBufferResponse(response);
                }

                function toErrorMessage(data) {
                    if (typeof data === "string") return data; // istanbul ignore else - just in case

                    if ("message" in data) {
                        if (Array.isArray(data.errors)) {
                            return `${data.message}: ${data.errors.map(JSON.stringify).join(", ")}`;
                        }

                        return data.message;
                    } // istanbul ignore next - just in case


                    return `Unknown error: ${JSON.stringify(data)}`;
                }

                function withDefaults(oldEndpoint, newDefaults) {
                    const endpoint = oldEndpoint.defaults(newDefaults);

                    const newApi = function (route, parameters) {
                        const endpointOptions = endpoint.merge(route, parameters);

                        if (!endpointOptions.request || !endpointOptions.request.hook) {
                            return fetchWrapper(endpoint.parse(endpointOptions));
                        }

                        const request = (route, parameters) => {
                            return fetchWrapper(endpoint.parse(endpoint.merge(route, parameters)));
                        };

                        Object.assign(request, {
                            endpoint,
                            defaults: withDefaults.bind(null, endpoint)
                        });
                        return endpointOptions.request.hook(request, endpointOptions);
                    };

                    return Object.assign(newApi, {
                        endpoint,
                        defaults: withDefaults.bind(null, endpoint)
                    });
                }

                const request = withDefaults(endpoint.endpoint, {
                    headers: {
                        "user-agent": `octokit-request.js/${VERSION} ${universalUserAgent.getUserAgent()}`
                    }
                });

                exports.request = request;
//# sourceMappingURL=index.js.map


                /***/ }),

            /***/ 299:
            /***/ (function(__unusedmodule, exports) {

                "use strict";


                Object.defineProperty(exports, '__esModule', { value: true });

                const VERSION = "2.21.3";

                function ownKeys(object, enumerableOnly) {
                    var keys = Object.keys(object);

                    if (Object.getOwnPropertySymbols) {
                        var symbols = Object.getOwnPropertySymbols(object);
                        enumerableOnly && (symbols = symbols.filter(function (sym) {
                            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
                        })), keys.push.apply(keys, symbols);
                    }

                    return keys;
                }

                function _objectSpread2(target) {
                    for (var i = 1; i < arguments.length; i++) {
                        var source = null != arguments[i] ? arguments[i] : {};
                        i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
                            _defineProperty(target, key, source[key]);
                        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
                            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
                        });
                    }

                    return target;
                }

                function _defineProperty(obj, key, value) {
                    if (key in obj) {
                        Object.defineProperty(obj, key, {
                            value: value,
                            enumerable: true,
                            configurable: true,
                            writable: true
                        });
                    } else {
                        obj[key] = value;
                    }

                    return obj;
                }

                /**
                 * Some “list” response that can be paginated have a different response structure
                 *
                 * They have a `total_count` key in the response (search also has `incomplete_results`,
                 * /installation/repositories also has `repository_selection`), as well as a key with
                 * the list of the items which name varies from endpoint to endpoint.
                 *
                 * Octokit normalizes these responses so that paginated results are always returned following
                 * the same structure. One challenge is that if the list response has only one page, no Link
                 * header is provided, so this header alone is not sufficient to check wether a response is
                 * paginated or not.
                 *
                 * We check if a "total_count" key is present in the response data, but also make sure that
                 * a "url" property is not, as the "Get the combined status for a specific ref" endpoint would
                 * otherwise match: https://developer.github.com/v3/repos/statuses/#get-the-combined-status-for-a-specific-ref
                 */
                function normalizePaginatedListResponse(response) {
                    // endpoints can respond with 204 if repository is empty
                    if (!response.data) {
                        return _objectSpread2(_objectSpread2({}, response), {}, {
                            data: []
                        });
                    }

                    const responseNeedsNormalization = "total_count" in response.data && !("url" in response.data);
                    if (!responseNeedsNormalization) return response; // keep the additional properties intact as there is currently no other way
                    // to retrieve the same information.

                    const incompleteResults = response.data.incomplete_results;
                    const repositorySelection = response.data.repository_selection;
                    const totalCount = response.data.total_count;
                    delete response.data.incomplete_results;
                    delete response.data.repository_selection;
                    delete response.data.total_count;
                    const namespaceKey = Object.keys(response.data)[0];
                    const data = response.data[namespaceKey];
                    response.data = data;

                    if (typeof incompleteResults !== "undefined") {
                        response.data.incomplete_results = incompleteResults;
                    }

                    if (typeof repositorySelection !== "undefined") {
                        response.data.repository_selection = repositorySelection;
                    }

                    response.data.total_count = totalCount;
                    return response;
                }

                function iterator(octokit, route, parameters) {
                    const options = typeof route === "function" ? route.endpoint(parameters) : octokit.request.endpoint(route, parameters);
                    const requestMethod = typeof route === "function" ? route : octokit.request;
                    const method = options.method;
                    const headers = options.headers;
                    let url = options.url;
                    return {
                        [Symbol.asyncIterator]: () => ({
                            async next() {
                                if (!url) return {
                                    done: true
                                };

                                try {
                                    const response = await requestMethod({
                                        method,
                                        url,
                                        headers
                                    });
                                    const normalizedResponse = normalizePaginatedListResponse(response); // `response.headers.link` format:
                                    // '<https://api.github.com/users/aseemk/followers?page=2>; rel="next", <https://api.github.com/users/aseemk/followers?page=2>; rel="last"'
                                    // sets `url` to undefined if "next" URL is not present or `link` header is not set

                                    url = ((normalizedResponse.headers.link || "").match(/<([^>]+)>;\s*rel="next"/) || [])[1];
                                    return {
                                        value: normalizedResponse
                                    };
                                } catch (error) {
                                    if (error.status !== 409) throw error;
                                    url = "";
                                    return {
                                        value: {
                                            status: 200,
                                            headers: {},
                                            data: []
                                        }
                                    };
                                }
                            }

                        })
                    };
                }

                function paginate(octokit, route, parameters, mapFn) {
                    if (typeof parameters === "function") {
                        mapFn = parameters;
                        parameters = undefined;
                    }

                    return gather(octokit, [], iterator(octokit, route, parameters)[Symbol.asyncIterator](), mapFn);
                }

                function gather(octokit, results, iterator, mapFn) {
                    return iterator.next().then(result => {
                        if (result.done) {
                            return results;
                        }

                        let earlyExit = false;

                        function done() {
                            earlyExit = true;
                        }

                        results = results.concat(mapFn ? mapFn(result.value, done) : result.value.data);

                        if (earlyExit) {
                            return results;
                        }

                        return gather(octokit, results, iterator, mapFn);
                    });
                }

                const composePaginateRest = Object.assign(paginate, {
                    iterator
                });

                const paginatingEndpoints = ["GET /app/hook/deliveries", "GET /app/installations", "GET /applications/grants", "GET /authorizations", "GET /enterprises/{enterprise}/actions/permissions/organizations", "GET /enterprises/{enterprise}/actions/runner-groups", "GET /enterprises/{enterprise}/actions/runner-groups/{runner_group_id}/organizations", "GET /enterprises/{enterprise}/actions/runner-groups/{runner_group_id}/runners", "GET /enterprises/{enterprise}/actions/runners", "GET /enterprises/{enterprise}/audit-log", "GET /enterprises/{enterprise}/secret-scanning/alerts", "GET /enterprises/{enterprise}/settings/billing/advanced-security", "GET /events", "GET /gists", "GET /gists/public", "GET /gists/starred", "GET /gists/{gist_id}/comments", "GET /gists/{gist_id}/commits", "GET /gists/{gist_id}/forks", "GET /installation/repositories", "GET /issues", "GET /licenses", "GET /marketplace_listing/plans", "GET /marketplace_listing/plans/{plan_id}/accounts", "GET /marketplace_listing/stubbed/plans", "GET /marketplace_listing/stubbed/plans/{plan_id}/accounts", "GET /networks/{owner}/{repo}/events", "GET /notifications", "GET /organizations", "GET /orgs/{org}/actions/cache/usage-by-repository", "GET /orgs/{org}/actions/permissions/repositories", "GET /orgs/{org}/actions/runner-groups", "GET /orgs/{org}/actions/runner-groups/{runner_group_id}/repositories", "GET /orgs/{org}/actions/runner-groups/{runner_group_id}/runners", "GET /orgs/{org}/actions/runners", "GET /orgs/{org}/actions/secrets", "GET /orgs/{org}/actions/secrets/{secret_name}/repositories", "GET /orgs/{org}/audit-log", "GET /orgs/{org}/blocks", "GET /orgs/{org}/code-scanning/alerts", "GET /orgs/{org}/codespaces", "GET /orgs/{org}/credential-authorizations", "GET /orgs/{org}/dependabot/secrets", "GET /orgs/{org}/dependabot/secrets/{secret_name}/repositories", "GET /orgs/{org}/events", "GET /orgs/{org}/external-groups", "GET /orgs/{org}/failed_invitations", "GET /orgs/{org}/hooks", "GET /orgs/{org}/hooks/{hook_id}/deliveries", "GET /orgs/{org}/installations", "GET /orgs/{org}/invitations", "GET /orgs/{org}/invitations/{invitation_id}/teams", "GET /orgs/{org}/issues", "GET /orgs/{org}/members", "GET /orgs/{org}/migrations", "GET /orgs/{org}/migrations/{migration_id}/repositories", "GET /orgs/{org}/outside_collaborators", "GET /orgs/{org}/packages", "GET /orgs/{org}/packages/{package_type}/{package_name}/versions", "GET /orgs/{org}/projects", "GET /orgs/{org}/public_members", "GET /orgs/{org}/repos", "GET /orgs/{org}/secret-scanning/alerts", "GET /orgs/{org}/settings/billing/advanced-security", "GET /orgs/{org}/team-sync/groups", "GET /orgs/{org}/teams", "GET /orgs/{org}/teams/{team_slug}/discussions", "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments", "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions", "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions", "GET /orgs/{org}/teams/{team_slug}/invitations", "GET /orgs/{org}/teams/{team_slug}/members", "GET /orgs/{org}/teams/{team_slug}/projects", "GET /orgs/{org}/teams/{team_slug}/repos", "GET /orgs/{org}/teams/{team_slug}/teams", "GET /projects/columns/{column_id}/cards", "GET /projects/{project_id}/collaborators", "GET /projects/{project_id}/columns", "GET /repos/{owner}/{repo}/actions/artifacts", "GET /repos/{owner}/{repo}/actions/caches", "GET /repos/{owner}/{repo}/actions/runners", "GET /repos/{owner}/{repo}/actions/runs", "GET /repos/{owner}/{repo}/actions/runs/{run_id}/artifacts", "GET /repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}/jobs", "GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs", "GET /repos/{owner}/{repo}/actions/secrets", "GET /repos/{owner}/{repo}/actions/workflows", "GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs", "GET /repos/{owner}/{repo}/assignees", "GET /repos/{owner}/{repo}/branches", "GET /repos/{owner}/{repo}/check-runs/{check_run_id}/annotations", "GET /repos/{owner}/{repo}/check-suites/{check_suite_id}/check-runs", "GET /repos/{owner}/{repo}/code-scanning/alerts", "GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/instances", "GET /repos/{owner}/{repo}/code-scanning/analyses", "GET /repos/{owner}/{repo}/codespaces", "GET /repos/{owner}/{repo}/codespaces/devcontainers", "GET /repos/{owner}/{repo}/codespaces/secrets", "GET /repos/{owner}/{repo}/collaborators", "GET /repos/{owner}/{repo}/comments", "GET /repos/{owner}/{repo}/comments/{comment_id}/reactions", "GET /repos/{owner}/{repo}/commits", "GET /repos/{owner}/{repo}/commits/{commit_sha}/comments", "GET /repos/{owner}/{repo}/commits/{commit_sha}/pulls", "GET /repos/{owner}/{repo}/commits/{ref}/check-runs", "GET /repos/{owner}/{repo}/commits/{ref}/check-suites", "GET /repos/{owner}/{repo}/commits/{ref}/status", "GET /repos/{owner}/{repo}/commits/{ref}/statuses", "GET /repos/{owner}/{repo}/contributors", "GET /repos/{owner}/{repo}/dependabot/secrets", "GET /repos/{owner}/{repo}/deployments", "GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses", "GET /repos/{owner}/{repo}/environments", "GET /repos/{owner}/{repo}/events", "GET /repos/{owner}/{repo}/forks", "GET /repos/{owner}/{repo}/git/matching-refs/{ref}", "GET /repos/{owner}/{repo}/hooks", "GET /repos/{owner}/{repo}/hooks/{hook_id}/deliveries", "GET /repos/{owner}/{repo}/invitations", "GET /repos/{owner}/{repo}/issues", "GET /repos/{owner}/{repo}/issues/comments", "GET /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions", "GET /repos/{owner}/{repo}/issues/events", "GET /repos/{owner}/{repo}/issues/{issue_number}/comments", "GET /repos/{owner}/{repo}/issues/{issue_number}/events", "GET /repos/{owner}/{repo}/issues/{issue_number}/labels", "GET /repos/{owner}/{repo}/issues/{issue_number}/reactions", "GET /repos/{owner}/{repo}/issues/{issue_number}/timeline", "GET /repos/{owner}/{repo}/keys", "GET /repos/{owner}/{repo}/labels", "GET /repos/{owner}/{repo}/milestones", "GET /repos/{owner}/{repo}/milestones/{milestone_number}/labels", "GET /repos/{owner}/{repo}/notifications", "GET /repos/{owner}/{repo}/pages/builds", "GET /repos/{owner}/{repo}/projects", "GET /repos/{owner}/{repo}/pulls", "GET /repos/{owner}/{repo}/pulls/comments", "GET /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions", "GET /repos/{owner}/{repo}/pulls/{pull_number}/comments", "GET /repos/{owner}/{repo}/pulls/{pull_number}/commits", "GET /repos/{owner}/{repo}/pulls/{pull_number}/files", "GET /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers", "GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews", "GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/comments", "GET /repos/{owner}/{repo}/releases", "GET /repos/{owner}/{repo}/releases/{release_id}/assets", "GET /repos/{owner}/{repo}/releases/{release_id}/reactions", "GET /repos/{owner}/{repo}/secret-scanning/alerts", "GET /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}/locations", "GET /repos/{owner}/{repo}/stargazers", "GET /repos/{owner}/{repo}/subscribers", "GET /repos/{owner}/{repo}/tags", "GET /repos/{owner}/{repo}/teams", "GET /repos/{owner}/{repo}/topics", "GET /repositories", "GET /repositories/{repository_id}/environments/{environment_name}/secrets", "GET /search/code", "GET /search/commits", "GET /search/issues", "GET /search/labels", "GET /search/repositories", "GET /search/topics", "GET /search/users", "GET /teams/{team_id}/discussions", "GET /teams/{team_id}/discussions/{discussion_number}/comments", "GET /teams/{team_id}/discussions/{discussion_number}/comments/{comment_number}/reactions", "GET /teams/{team_id}/discussions/{discussion_number}/reactions", "GET /teams/{team_id}/invitations", "GET /teams/{team_id}/members", "GET /teams/{team_id}/projects", "GET /teams/{team_id}/repos", "GET /teams/{team_id}/teams", "GET /user/blocks", "GET /user/codespaces", "GET /user/codespaces/secrets", "GET /user/emails", "GET /user/followers", "GET /user/following", "GET /user/gpg_keys", "GET /user/installations", "GET /user/installations/{installation_id}/repositories", "GET /user/issues", "GET /user/keys", "GET /user/marketplace_purchases", "GET /user/marketplace_purchases/stubbed", "GET /user/memberships/orgs", "GET /user/migrations", "GET /user/migrations/{migration_id}/repositories", "GET /user/orgs", "GET /user/packages", "GET /user/packages/{package_type}/{package_name}/versions", "GET /user/public_emails", "GET /user/repos", "GET /user/repository_invitations", "GET /user/starred", "GET /user/subscriptions", "GET /user/teams", "GET /users", "GET /users/{username}/events", "GET /users/{username}/events/orgs/{org}", "GET /users/{username}/events/public", "GET /users/{username}/followers", "GET /users/{username}/following", "GET /users/{username}/gists", "GET /users/{username}/gpg_keys", "GET /users/{username}/keys", "GET /users/{username}/orgs", "GET /users/{username}/packages", "GET /users/{username}/projects", "GET /users/{username}/received_events", "GET /users/{username}/received_events/public", "GET /users/{username}/repos", "GET /users/{username}/starred", "GET /users/{username}/subscriptions"];

                function isPaginatingEndpoint(arg) {
                    if (typeof arg === "string") {
                        return paginatingEndpoints.includes(arg);
                    } else {
                        return false;
                    }
                }

                /**
                 * @param octokit Octokit instance
                 * @param options Options passed to Octokit constructor
                 */

                function paginateRest(octokit) {
                    return {
                        paginate: Object.assign(paginate.bind(null, octokit), {
                            iterator: iterator.bind(null, octokit)
                        })
                    };
                }
                paginateRest.VERSION = VERSION;

                exports.composePaginateRest = composePaginateRest;
                exports.isPaginatingEndpoint = isPaginatingEndpoint;
                exports.paginateRest = paginateRest;
                exports.paginatingEndpoints = paginatingEndpoints;
//# sourceMappingURL=index.js.map


                /***/ }),

            /***/ 300:
            /***/ (function(__unusedmodule, exports, __webpack_require__) {

                "use strict";

                var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
                    if (k2 === undefined) k2 = k;
                    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
                }) : (function(o, m, k, k2) {
                    if (k2 === undefined) k2 = k;
                    o[k2] = m[k];
                }));
                var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
                    Object.defineProperty(o, "default", { enumerable: true, value: v });
                }) : function(o, v) {
                    o["default"] = v;
                });
                var __importStar = (this && this.__importStar) || function (mod) {
                    if (mod && mod.__esModule) return mod;
                    var result = {};
                    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
                    __setModuleDefault(result, mod);
                    return result;
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                exports.createOutputProxy = void 0;
                var core = __importStar(__webpack_require__(470));
                function createOutputProxy() {
                    return new Proxy({}, {
                        set: function (originalObject, name, value) {
                            // When we attempt to set `outputs.___`, instead
                            // we call `core.setOutput`.
                            core.setOutput(name, value);
                            originalObject[name] = value;
                            return true;
                        },
                        getOwnPropertyDescriptor: function () {
                            return {
                                enumerable: false,
                                configurable: true,
                                writable: true
                            };
                        }
                    });
                }
                exports.createOutputProxy = createOutputProxy;
//# sourceMappingURL=outputs.js.map

                /***/ }),

            /***/ 304:
            /***/ (function(module) {

                module.exports = require("string_decoder");

                /***/ }),

            /***/ 323:
            /***/ (function(module) {

                "use strict";


                var isStream = module.exports = function (stream) {
                    return stream !== null && typeof stream === 'object' && typeof stream.pipe === 'function';
                };

                isStream.writable = function (stream) {
                    return isStream(stream) && stream.writable !== false && typeof stream._write === 'function' && typeof stream._writableState === 'object';
                };

                isStream.readable = function (stream) {
                    return isStream(stream) && stream.readable !== false && typeof stream._read === 'function' && typeof stream._readableState === 'object';
                };

                isStream.duplex = function (stream) {
                    return isStream.writable(stream) && isStream.readable(stream);
                };

                isStream.transform = function (stream) {
                    return isStream.duplex(stream) && typeof stream._transform === 'function' && typeof stream._transformState === 'object';
                };


                /***/ }),

            /***/ 327:
            /***/ (function(__unusedmodule, exports) {

                "use strict";


                Object.defineProperty(exports, "__esModule", {
                    value: true
                });
                exports.default = void 0;
                var _default = '00000000-0000-0000-0000-000000000000';
                exports.default = _default;

                /***/ }),

            /***/ 341:
            /***/ (function(module, __unusedexports, __webpack_require__) {

                "use strict";

                const path = __webpack_require__(622);
                const locatePath = __webpack_require__(457);

                module.exports = (filename, opts) => {
                    opts = opts || {};

                    const startDir = path.resolve(opts.cwd || '');
                    const root = path.parse(startDir).root;

                    const filenames = [].concat(filename);

                    return new Promise(resolve => {
                        (function find(dir) {
                            locatePath(filenames, {cwd: dir}).then(file => {
                                if (file) {
                                    resolve(path.join(dir, file));
                                } else if (dir === root) {
                                    resolve(null);
                                } else {
                                    find(path.dirname(dir));
                                }
                            });
                        })(startDir);
                    });
                };

                module.exports.sync = (filename, opts) => {
                    opts = opts || {};

                    let dir = path.resolve(opts.cwd || '');
                    const root = path.parse(dir).root;

                    const filenames = [].concat(filename);

                    // eslint-disable-next-line no-constant-condition
                    while (true) {
                        const file = locatePath.sync(filenames, {cwd: dir});

                        if (file) {
                            return path.join(dir, file);
                        } else if (dir === root) {
                            return null;
                        }

                        dir = path.dirname(dir);
                    }
                };


                /***/ }),

            /***/ 356:
            /***/ (function(__unusedmodule, exports) {

                "use strict";


                Object.defineProperty(exports, '__esModule', { value: true });

                /*!
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

                function isObject(o) {
                    return Object.prototype.toString.call(o) === '[object Object]';
                }

                function isPlainObject(o) {
                    var ctor,prot;

                    if (isObject(o) === false) return false;

                    // If has modified constructor
                    ctor = o.constructor;
                    if (ctor === undefined) return true;

                    // If has modified prototype
                    prot = ctor.prototype;
                    if (isObject(prot) === false) return false;

                    // If constructor does not have an Object-specific method
                    if (prot.hasOwnProperty('isPrototypeOf') === false) {
                        return false;
                    }

                    // Most likely a plain Object
                    return true;
                }

                exports.isPlainObject = isPlainObject;


                /***/ }),

            /***/ 357:
            /***/ (function(module) {

                module.exports = require("assert");

                /***/ }),

            /***/ 363:
            /***/ (function(module) {

                module.exports = register;

                function register(state, name, method, options) {
                    if (typeof method !== "function") {
                        throw new Error("method for before hook must be a function");
                    }

                    if (!options) {
                        options = {};
                    }

                    if (Array.isArray(name)) {
                        return name.reverse().reduce(function (callback, name) {
                            return register.bind(null, state, name, callback, options);
                        }, method)();
                    }

                    return Promise.resolve().then(function () {
                        if (!state.registry[name]) {
                            return method(options);
                        }

                        return state.registry[name].reduce(function (method, registered) {
                            return registered.hook.bind(null, method, options);
                        }, method)();
                    });
                }


                /***/ }),

            /***/ 364:
            /***/ (function(module) {

                "use strict";

                module.exports = (flag, argv) => {
                    argv = argv || process.argv;
                    const prefix = flag.startsWith('-') ? '' : (flag.length === 1 ? '-' : '--');
                    const pos = argv.indexOf(prefix + flag);
                    const terminatorPos = argv.indexOf('--');
                    return pos !== -1 && (terminatorPos === -1 ? true : pos < terminatorPos);
                };


                /***/ }),

            /***/ 370:
            /***/ (function(module, __unusedexports, __webpack_require__) {

                var wrappy = __webpack_require__(11)
                module.exports = wrappy(once)
                module.exports.strict = wrappy(onceStrict)

                once.proto = once(function () {
                    Object.defineProperty(Function.prototype, 'once', {
                        value: function () {
                            return once(this)
                        },
                        configurable: true
                    })

                    Object.defineProperty(Function.prototype, 'onceStrict', {
                        value: function () {
                            return onceStrict(this)
                        },
                        configurable: true
                    })
                })

                function once (fn) {
                    var f = function () {
                        if (f.called) return f.value
                        f.called = true
                        return f.value = fn.apply(this, arguments)
                    }
                    f.called = false
                    return f
                }

                function onceStrict (fn) {
                    var f = function () {
                        if (f.called)
                            throw new Error(f.onceError)
                        f.called = true
                        return f.value = fn.apply(this, arguments)
                    }
                    var name = fn.name || 'Function wrapped with `once`'
                    f.onceError = name + " shouldn't be called more than once"
                    f.called = false
                    return f
                }


                /***/ }),

            /***/ 384:
            /***/ (function(__unusedmodule, exports, __webpack_require__) {

                "use strict";


                Object.defineProperty(exports, "__esModule", {
                    value: true
                });
                exports.default = void 0;

                var _v = _interopRequireDefault(__webpack_require__(212));

                var _sha = _interopRequireDefault(__webpack_require__(498));

                function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

                const v5 = (0, _v.default)('v5', 0x50, _sha.default);
                var _default = v5;
                exports.default = _default;

                /***/ }),

            /***/ 385:
            /***/ (function(module, __unusedexports, __webpack_require__) {

                "use strict";

                const path = __webpack_require__(622);
                const findUp = __webpack_require__(341);
                const loadJsonFile = __webpack_require__(37);

                const filepaths = new WeakMap();
                const filepath = conf => filepaths.get(conf);
                const findNextCwd = pkgPath => path.resolve(path.dirname(pkgPath), '..');

                const addFp = (obj, fp) => {
                    filepaths.set(obj, fp);
                    return obj;
                };

                const pkgConf = (namespace, opts) => {
                    if (!namespace) {
                        return Promise.reject(new TypeError('Expected a namespace'));
                    }

                    opts = opts || {};

                    return findUp('package.json', opts.cwd ? {cwd: opts.cwd} : {})
                        .then(fp => {
                            if (!fp) {
                                return addFp(Object.assign({}, opts.defaults), fp);
                            }

                            return loadJsonFile(fp).then(pkg => {
                                if (opts.skipOnFalse && pkg[namespace] === false) {
                                    const newOpts = Object.assign({}, opts, {cwd: findNextCwd(fp)});
                                    return pkgConf(namespace, newOpts);
                                }

                                return addFp(Object.assign({}, opts.defaults, pkg[namespace]), fp);
                            });
                        });
                };

                const sync = (namespace, opts) => {
                    if (!namespace) {
                        throw new TypeError('Expected a namespace');
                    }

                    opts = opts || {};

                    const fp = findUp.sync('package.json', opts.cwd ? {cwd: opts.cwd} : {});

                    if (!fp) {
                        return addFp(Object.assign({}, opts.defaults), fp);
                    }

                    const pkg = loadJsonFile.sync(fp);

                    if (opts.skipOnFalse && pkg[namespace] === false) {
                        const newOpts = Object.assign({}, opts, {cwd: findNextCwd(fp)});
                        return sync(namespace, newOpts);
                    }

                    return addFp(Object.assign({}, opts.defaults, pkg[namespace]), fp);
                };

                module.exports = pkgConf;
                module.exports.filepath = filepath;
                module.exports.sync = sync;


                /***/ }),

            /***/ 389:
            /***/ (function(module, __unusedexports, __webpack_require__) {

                "use strict";


                const fs = __webpack_require__(747);
                const shebangCommand = __webpack_require__(866);

                function readShebang(command) {
                    // Read the first 150 bytes from the file
                    const size = 150;
                    let buffer;

                    if (Buffer.alloc) {
                        // Node.js v4.5+ / v5.10+
                        buffer = Buffer.alloc(size);
                    } else {
                        // Old Node.js API
                        buffer = new Buffer(size);
                        buffer.fill(0); // zero-fill
                    }

                    let fd;

                    try {
                        fd = fs.openSync(command, 'r');
                        fs.readSync(fd, buffer, 0, size, 0);
                        fs.closeSync(fd);
                    } catch (e) { /* Empty */ }

                    // Attempt to extract shebang (null is returned if not a shebang)
                    return shebangCommand(buffer.toString());
                }

                module.exports = readShebang;


                /***/ }),

            /***/ 411:
            /***/ (function(__unusedmodule, exports, __webpack_require__) {

                "use strict";


                Object.defineProperty(exports, "__esModule", {
                    value: true
                });
                exports.default = void 0;

                var _validate = _interopRequireDefault(__webpack_require__(78));

                function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

                /**
                 * Convert array of 16 byte values to UUID string format of the form:
                 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
                 */
                const byteToHex = [];

                for (let i = 0; i < 256; ++i) {
                    byteToHex.push((i + 0x100).toString(16).substr(1));
                }

                function stringify(arr, offset = 0) {
                    // Note: Be careful editing this code!  It's been tuned for performance
                    // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
                    const uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
                    // of the following:
                    // - One or more input array values don't map to a hex octet (leading to
                    // "undefined" in the uuid)
                    // - Invalid input values for the RFC `version` or `variant` fields

                    if (!(0, _validate.default)(uuid)) {
                        throw TypeError('Stringified UUID is invalid');
                    }

                    return uuid;
                }

                var _default = stringify;
                exports.default = _default;

                /***/ }),

            /***/ 413:
            /***/ (function(module, __unusedexports, __webpack_require__) {

                module.exports = __webpack_require__(141);


                /***/ }),

            /***/ 417:
            /***/ (function(module) {

                module.exports = require("crypto");

                /***/ }),

            /***/ 425:
            /***/ (function(__unusedmodule, exports, __webpack_require__) {

                "use strict";

                /* eslint-disable @typescript-eslint/no-explicit-any */
                var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
                    if (k2 === undefined) k2 = k;
                    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
                }) : (function(o, m, k, k2) {
                    if (k2 === undefined) k2 = k;
                    o[k2] = m[k];
                }));
                var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
                    Object.defineProperty(o, "default", { enumerable: true, value: v });
                }) : function(o, v) {
                    o["default"] = v;
                });
                var __importStar = (this && this.__importStar) || function (mod) {
                    if (mod && mod.__esModule) return mod;
                    var result = {};
                    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
                    __setModuleDefault(result, mod);
                    return result;
                };
                var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
                    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
                    return new (P || (P = Promise))(function (resolve, reject) {
                        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
                        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
                        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
                        step((generator = generator.apply(thisArg, _arguments || [])).next());
                    });
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                exports.HttpClient = exports.isHttps = exports.HttpClientResponse = exports.HttpClientError = exports.getProxyUrl = exports.MediaTypes = exports.Headers = exports.HttpCodes = void 0;
                const http = __importStar(__webpack_require__(605));
                const https = __importStar(__webpack_require__(211));
                const pm = __importStar(__webpack_require__(177));
                const tunnel = __importStar(__webpack_require__(413));
                var HttpCodes;
                (function (HttpCodes) {
                    HttpCodes[HttpCodes["OK"] = 200] = "OK";
                    HttpCodes[HttpCodes["MultipleChoices"] = 300] = "MultipleChoices";
                    HttpCodes[HttpCodes["MovedPermanently"] = 301] = "MovedPermanently";
                    HttpCodes[HttpCodes["ResourceMoved"] = 302] = "ResourceMoved";
                    HttpCodes[HttpCodes["SeeOther"] = 303] = "SeeOther";
                    HttpCodes[HttpCodes["NotModified"] = 304] = "NotModified";
                    HttpCodes[HttpCodes["UseProxy"] = 305] = "UseProxy";
                    HttpCodes[HttpCodes["SwitchProxy"] = 306] = "SwitchProxy";
                    HttpCodes[HttpCodes["TemporaryRedirect"] = 307] = "TemporaryRedirect";
                    HttpCodes[HttpCodes["PermanentRedirect"] = 308] = "PermanentRedirect";
                    HttpCodes[HttpCodes["BadRequest"] = 400] = "BadRequest";
                    HttpCodes[HttpCodes["Unauthorized"] = 401] = "Unauthorized";
                    HttpCodes[HttpCodes["PaymentRequired"] = 402] = "PaymentRequired";
                    HttpCodes[HttpCodes["Forbidden"] = 403] = "Forbidden";
                    HttpCodes[HttpCodes["NotFound"] = 404] = "NotFound";
                    HttpCodes[HttpCodes["MethodNotAllowed"] = 405] = "MethodNotAllowed";
                    HttpCodes[HttpCodes["NotAcceptable"] = 406] = "NotAcceptable";
                    HttpCodes[HttpCodes["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
                    HttpCodes[HttpCodes["RequestTimeout"] = 408] = "RequestTimeout";
                    HttpCodes[HttpCodes["Conflict"] = 409] = "Conflict";
                    HttpCodes[HttpCodes["Gone"] = 410] = "Gone";
                    HttpCodes[HttpCodes["TooManyRequests"] = 429] = "TooManyRequests";
                    HttpCodes[HttpCodes["InternalServerError"] = 500] = "InternalServerError";
                    HttpCodes[HttpCodes["NotImplemented"] = 501] = "NotImplemented";
                    HttpCodes[HttpCodes["BadGateway"] = 502] = "BadGateway";
                    HttpCodes[HttpCodes["ServiceUnavailable"] = 503] = "ServiceUnavailable";
                    HttpCodes[HttpCodes["GatewayTimeout"] = 504] = "GatewayTimeout";
                })(HttpCodes = exports.HttpCodes || (exports.HttpCodes = {}));
                var Headers;
                (function (Headers) {
                    Headers["Accept"] = "accept";
                    Headers["ContentType"] = "content-type";
                })(Headers = exports.Headers || (exports.Headers = {}));
                var MediaTypes;
                (function (MediaTypes) {
                    MediaTypes["ApplicationJson"] = "application/json";
                })(MediaTypes = exports.MediaTypes || (exports.MediaTypes = {}));
                /**
                 * Returns the proxy URL, depending upon the supplied url and proxy environment variables.
                 * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
                 */
                function getProxyUrl(serverUrl) {
                    const proxyUrl = pm.getProxyUrl(new URL(serverUrl));
                    return proxyUrl ? proxyUrl.href : '';
                }
                exports.getProxyUrl = getProxyUrl;
                const HttpRedirectCodes = [
                    HttpCodes.MovedPermanently,
                    HttpCodes.ResourceMoved,
                    HttpCodes.SeeOther,
                    HttpCodes.TemporaryRedirect,
                    HttpCodes.PermanentRedirect
                ];
                const HttpResponseRetryCodes = [
                    HttpCodes.BadGateway,
                    HttpCodes.ServiceUnavailable,
                    HttpCodes.GatewayTimeout
                ];
                const RetryableHttpVerbs = ['OPTIONS', 'GET', 'DELETE', 'HEAD'];
                const ExponentialBackoffCeiling = 10;
                const ExponentialBackoffTimeSlice = 5;
                class HttpClientError extends Error {
                    constructor(message, statusCode) {
                        super(message);
                        this.name = 'HttpClientError';
                        this.statusCode = statusCode;
                        Object.setPrototypeOf(this, HttpClientError.prototype);
                    }
                }
                exports.HttpClientError = HttpClientError;
                class HttpClientResponse {
                    constructor(message) {
                        this.message = message;
                    }
                    readBody() {
                        return __awaiter(this, void 0, void 0, function* () {
                            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                                let output = Buffer.alloc(0);
                                this.message.on('data', (chunk) => {
                                    output = Buffer.concat([output, chunk]);
                                });
                                this.message.on('end', () => {
                                    resolve(output.toString());
                                });
                            }));
                        });
                    }
                }
                exports.HttpClientResponse = HttpClientResponse;
                function isHttps(requestUrl) {
                    const parsedUrl = new URL(requestUrl);
                    return parsedUrl.protocol === 'https:';
                }
                exports.isHttps = isHttps;
                class HttpClient {
                    constructor(userAgent, handlers, requestOptions) {
                        this._ignoreSslError = false;
                        this._allowRedirects = true;
                        this._allowRedirectDowngrade = false;
                        this._maxRedirects = 50;
                        this._allowRetries = false;
                        this._maxRetries = 1;
                        this._keepAlive = false;
                        this._disposed = false;
                        this.userAgent = userAgent;
                        this.handlers = handlers || [];
                        this.requestOptions = requestOptions;
                        if (requestOptions) {
                            if (requestOptions.ignoreSslError != null) {
                                this._ignoreSslError = requestOptions.ignoreSslError;
                            }
                            this._socketTimeout = requestOptions.socketTimeout;
                            if (requestOptions.allowRedirects != null) {
                                this._allowRedirects = requestOptions.allowRedirects;
                            }
                            if (requestOptions.allowRedirectDowngrade != null) {
                                this._allowRedirectDowngrade = requestOptions.allowRedirectDowngrade;
                            }
                            if (requestOptions.maxRedirects != null) {
                                this._maxRedirects = Math.max(requestOptions.maxRedirects, 0);
                            }
                            if (requestOptions.keepAlive != null) {
                                this._keepAlive = requestOptions.keepAlive;
                            }
                            if (requestOptions.allowRetries != null) {
                                this._allowRetries = requestOptions.allowRetries;
                            }
                            if (requestOptions.maxRetries != null) {
                                this._maxRetries = requestOptions.maxRetries;
                            }
                        }
                    }
                    options(requestUrl, additionalHeaders) {
                        return __awaiter(this, void 0, void 0, function* () {
                            return this.request('OPTIONS', requestUrl, null, additionalHeaders || {});
                        });
                    }
                    get(requestUrl, additionalHeaders) {
                        return __awaiter(this, void 0, void 0, function* () {
                            return this.request('GET', requestUrl, null, additionalHeaders || {});
                        });
                    }
                    del(requestUrl, additionalHeaders) {
                        return __awaiter(this, void 0, void 0, function* () {
                            return this.request('DELETE', requestUrl, null, additionalHeaders || {});
                        });
                    }
                    post(requestUrl, data, additionalHeaders) {
                        return __awaiter(this, void 0, void 0, function* () {
                            return this.request('POST', requestUrl, data, additionalHeaders || {});
                        });
                    }
                    patch(requestUrl, data, additionalHeaders) {
                        return __awaiter(this, void 0, void 0, function* () {
                            return this.request('PATCH', requestUrl, data, additionalHeaders || {});
                        });
                    }
                    put(requestUrl, data, additionalHeaders) {
                        return __awaiter(this, void 0, void 0, function* () {
                            return this.request('PUT', requestUrl, data, additionalHeaders || {});
                        });
                    }
                    head(requestUrl, additionalHeaders) {
                        return __awaiter(this, void 0, void 0, function* () {
                            return this.request('HEAD', requestUrl, null, additionalHeaders || {});
                        });
                    }
                    sendStream(verb, requestUrl, stream, additionalHeaders) {
                        return __awaiter(this, void 0, void 0, function* () {
                            return this.request(verb, requestUrl, stream, additionalHeaders);
                        });
                    }
                    /**
                     * Gets a typed object from an endpoint
                     * Be aware that not found returns a null.  Other errors (4xx, 5xx) reject the promise
                     */
                    getJson(requestUrl, additionalHeaders = {}) {
                        return __awaiter(this, void 0, void 0, function* () {
                            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
                            const res = yield this.get(requestUrl, additionalHeaders);
                            return this._processResponse(res, this.requestOptions);
                        });
                    }
                    postJson(requestUrl, obj, additionalHeaders = {}) {
                        return __awaiter(this, void 0, void 0, function* () {
                            const data = JSON.stringify(obj, null, 2);
                            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
                            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
                            const res = yield this.post(requestUrl, data, additionalHeaders);
                            return this._processResponse(res, this.requestOptions);
                        });
                    }
                    putJson(requestUrl, obj, additionalHeaders = {}) {
                        return __awaiter(this, void 0, void 0, function* () {
                            const data = JSON.stringify(obj, null, 2);
                            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
                            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
                            const res = yield this.put(requestUrl, data, additionalHeaders);
                            return this._processResponse(res, this.requestOptions);
                        });
                    }
                    patchJson(requestUrl, obj, additionalHeaders = {}) {
                        return __awaiter(this, void 0, void 0, function* () {
                            const data = JSON.stringify(obj, null, 2);
                            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
                            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
                            const res = yield this.patch(requestUrl, data, additionalHeaders);
                            return this._processResponse(res, this.requestOptions);
                        });
                    }
                    /**
                     * Makes a raw http request.
                     * All other methods such as get, post, patch, and request ultimately call this.
                     * Prefer get, del, post and patch
                     */
                    request(verb, requestUrl, data, headers) {
                        return __awaiter(this, void 0, void 0, function* () {
                            if (this._disposed) {
                                throw new Error('Client has already been disposed.');
                            }
                            const parsedUrl = new URL(requestUrl);
                            let info = this._prepareRequest(verb, parsedUrl, headers);
                            // Only perform retries on reads since writes may not be idempotent.
                            const maxTries = this._allowRetries && RetryableHttpVerbs.includes(verb)
                                ? this._maxRetries + 1
                                : 1;
                            let numTries = 0;
                            let response;
                            do {
                                response = yield this.requestRaw(info, data);
                                // Check if it's an authentication challenge
                                if (response &&
                                    response.message &&
                                    response.message.statusCode === HttpCodes.Unauthorized) {
                                    let authenticationHandler;
                                    for (const handler of this.handlers) {
                                        if (handler.canHandleAuthentication(response)) {
                                            authenticationHandler = handler;
                                            break;
                                        }
                                    }
                                    if (authenticationHandler) {
                                        return authenticationHandler.handleAuthentication(this, info, data);
                                    }
                                    else {
                                        // We have received an unauthorized response but have no handlers to handle it.
                                        // Let the response return to the caller.
                                        return response;
                                    }
                                }
                                let redirectsRemaining = this._maxRedirects;
                                while (response.message.statusCode &&
                                HttpRedirectCodes.includes(response.message.statusCode) &&
                                this._allowRedirects &&
                                redirectsRemaining > 0) {
                                    const redirectUrl = response.message.headers['location'];
                                    if (!redirectUrl) {
                                        // if there's no location to redirect to, we won't
                                        break;
                                    }
                                    const parsedRedirectUrl = new URL(redirectUrl);
                                    if (parsedUrl.protocol === 'https:' &&
                                        parsedUrl.protocol !== parsedRedirectUrl.protocol &&
                                        !this._allowRedirectDowngrade) {
                                        throw new Error('Redirect from HTTPS to HTTP protocol. This downgrade is not allowed for security reasons. If you want to allow this behavior, set the allowRedirectDowngrade option to true.');
                                    }
                                    // we need to finish reading the response before reassigning response
                                    // which will leak the open socket.
                                    yield response.readBody();
                                    // strip authorization header if redirected to a different hostname
                                    if (parsedRedirectUrl.hostname !== parsedUrl.hostname) {
                                        for (const header in headers) {
                                            // header names are case insensitive
                                            if (header.toLowerCase() === 'authorization') {
                                                delete headers[header];
                                            }
                                        }
                                    }
                                    // let's make the request with the new redirectUrl
                                    info = this._prepareRequest(verb, parsedRedirectUrl, headers);
                                    response = yield this.requestRaw(info, data);
                                    redirectsRemaining--;
                                }
                                if (!response.message.statusCode ||
                                    !HttpResponseRetryCodes.includes(response.message.statusCode)) {
                                    // If not a retry code, return immediately instead of retrying
                                    return response;
                                }
                                numTries += 1;
                                if (numTries < maxTries) {
                                    yield response.readBody();
                                    yield this._performExponentialBackoff(numTries);
                                }
                            } while (numTries < maxTries);
                            return response;
                        });
                    }
                    /**
                     * Needs to be called if keepAlive is set to true in request options.
                     */
                    dispose() {
                        if (this._agent) {
                            this._agent.destroy();
                        }
                        this._disposed = true;
                    }
                    /**
                     * Raw request.
                     * @param info
                     * @param data
                     */
                    requestRaw(info, data) {
                        return __awaiter(this, void 0, void 0, function* () {
                            return new Promise((resolve, reject) => {
                                function callbackForResult(err, res) {
                                    if (err) {
                                        reject(err);
                                    }
                                    else if (!res) {
                                        // If `err` is not passed, then `res` must be passed.
                                        reject(new Error('Unknown error'));
                                    }
                                    else {
                                        resolve(res);
                                    }
                                }
                                this.requestRawWithCallback(info, data, callbackForResult);
                            });
                        });
                    }
                    /**
                     * Raw request with callback.
                     * @param info
                     * @param data
                     * @param onResult
                     */
                    requestRawWithCallback(info, data, onResult) {
                        if (typeof data === 'string') {
                            if (!info.options.headers) {
                                info.options.headers = {};
                            }
                            info.options.headers['Content-Length'] = Buffer.byteLength(data, 'utf8');
                        }
                        let callbackCalled = false;
                        function handleResult(err, res) {
                            if (!callbackCalled) {
                                callbackCalled = true;
                                onResult(err, res);
                            }
                        }
                        const req = info.httpModule.request(info.options, (msg) => {
                            const res = new HttpClientResponse(msg);
                            handleResult(undefined, res);
                        });
                        let socket;
                        req.on('socket', sock => {
                            socket = sock;
                        });
                        // If we ever get disconnected, we want the socket to timeout eventually
                        req.setTimeout(this._socketTimeout || 3 * 60000, () => {
                            if (socket) {
                                socket.end();
                            }
                            handleResult(new Error(`Request timeout: ${info.options.path}`));
                        });
                        req.on('error', function (err) {
                            // err has statusCode property
                            // res should have headers
                            handleResult(err);
                        });
                        if (data && typeof data === 'string') {
                            req.write(data, 'utf8');
                        }
                        if (data && typeof data !== 'string') {
                            data.on('close', function () {
                                req.end();
                            });
                            data.pipe(req);
                        }
                        else {
                            req.end();
                        }
                    }
                    /**
                     * Gets an http agent. This function is useful when you need an http agent that handles
                     * routing through a proxy server - depending upon the url and proxy environment variables.
                     * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
                     */
                    getAgent(serverUrl) {
                        const parsedUrl = new URL(serverUrl);
                        return this._getAgent(parsedUrl);
                    }
                    _prepareRequest(method, requestUrl, headers) {
                        const info = {};
                        info.parsedUrl = requestUrl;
                        const usingSsl = info.parsedUrl.protocol === 'https:';
                        info.httpModule = usingSsl ? https : http;
                        const defaultPort = usingSsl ? 443 : 80;
                        info.options = {};
                        info.options.host = info.parsedUrl.hostname;
                        info.options.port = info.parsedUrl.port
                            ? parseInt(info.parsedUrl.port)
                            : defaultPort;
                        info.options.path =
                            (info.parsedUrl.pathname || '') + (info.parsedUrl.search || '');
                        info.options.method = method;
                        info.options.headers = this._mergeHeaders(headers);
                        if (this.userAgent != null) {
                            info.options.headers['user-agent'] = this.userAgent;
                        }
                        info.options.agent = this._getAgent(info.parsedUrl);
                        // gives handlers an opportunity to participate
                        if (this.handlers) {
                            for (const handler of this.handlers) {
                                handler.prepareRequest(info.options);
                            }
                        }
                        return info;
                    }
                    _mergeHeaders(headers) {
                        if (this.requestOptions && this.requestOptions.headers) {
                            return Object.assign({}, lowercaseKeys(this.requestOptions.headers), lowercaseKeys(headers || {}));
                        }
                        return lowercaseKeys(headers || {});
                    }
                    _getExistingOrDefaultHeader(additionalHeaders, header, _default) {
                        let clientHeader;
                        if (this.requestOptions && this.requestOptions.headers) {
                            clientHeader = lowercaseKeys(this.requestOptions.headers)[header];
                        }
                        return additionalHeaders[header] || clientHeader || _default;
                    }
                    _getAgent(parsedUrl) {
                        let agent;
                        const proxyUrl = pm.getProxyUrl(parsedUrl);
                        const useProxy = proxyUrl && proxyUrl.hostname;
                        if (this._keepAlive && useProxy) {
                            agent = this._proxyAgent;
                        }
                        if (this._keepAlive && !useProxy) {
                            agent = this._agent;
                        }
                        // if agent is already assigned use that agent.
                        if (agent) {
                            return agent;
                        }
                        const usingSsl = parsedUrl.protocol === 'https:';
                        let maxSockets = 100;
                        if (this.requestOptions) {
                            maxSockets = this.requestOptions.maxSockets || http.globalAgent.maxSockets;
                        }
                        // This is `useProxy` again, but we need to check `proxyURl` directly for TypeScripts's flow analysis.
                        if (proxyUrl && proxyUrl.hostname) {
                            const agentOptions = {
                                maxSockets,
                                keepAlive: this._keepAlive,
                                proxy: Object.assign(Object.assign({}, ((proxyUrl.username || proxyUrl.password) && {
                                    proxyAuth: `${proxyUrl.username}:${proxyUrl.password}`
                                })), { host: proxyUrl.hostname, port: proxyUrl.port })
                            };
                            let tunnelAgent;
                            const overHttps = proxyUrl.protocol === 'https:';
                            if (usingSsl) {
                                tunnelAgent = overHttps ? tunnel.httpsOverHttps : tunnel.httpsOverHttp;
                            }
                            else {
                                tunnelAgent = overHttps ? tunnel.httpOverHttps : tunnel.httpOverHttp;
                            }
                            agent = tunnelAgent(agentOptions);
                            this._proxyAgent = agent;
                        }
                        // if reusing agent across request and tunneling agent isn't assigned create a new agent
                        if (this._keepAlive && !agent) {
                            const options = { keepAlive: this._keepAlive, maxSockets };
                            agent = usingSsl ? new https.Agent(options) : new http.Agent(options);
                            this._agent = agent;
                        }
                        // if not using private agent and tunnel agent isn't setup then use global agent
                        if (!agent) {
                            agent = usingSsl ? https.globalAgent : http.globalAgent;
                        }
                        if (usingSsl && this._ignoreSslError) {
                            // we don't want to set NODE_TLS_REJECT_UNAUTHORIZED=0 since that will affect request for entire process
                            // http.RequestOptions doesn't expose a way to modify RequestOptions.agent.options
                            // we have to cast it to any and change it directly
                            agent.options = Object.assign(agent.options || {}, {
                                rejectUnauthorized: false
                            });
                        }
                        return agent;
                    }
                    _performExponentialBackoff(retryNumber) {
                        return __awaiter(this, void 0, void 0, function* () {
                            retryNumber = Math.min(ExponentialBackoffCeiling, retryNumber);
                            const ms = ExponentialBackoffTimeSlice * Math.pow(2, retryNumber);
                            return new Promise(resolve => setTimeout(() => resolve(), ms));
                        });
                    }
                    _processResponse(res, options) {
                        return __awaiter(this, void 0, void 0, function* () {
                            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                                const statusCode = res.message.statusCode || 0;
                                const response = {
                                    statusCode,
                                    result: null,
                                    headers: {}
                                };
                                // not found leads to null obj returned
                                if (statusCode === HttpCodes.NotFound) {
                                    resolve(response);
                                }
                                // get the result from the body
                                function dateTimeDeserializer(key, value) {
                                    if (typeof value === 'string') {
                                        const a = new Date(value);
                                        if (!isNaN(a.valueOf())) {
                                            return a;
                                        }
                                    }
                                    return value;
                                }
                                let obj;
                                let contents;
                                try {
                                    contents = yield res.readBody();
                                    if (contents && contents.length > 0) {
                                        if (options && options.deserializeDates) {
                                            obj = JSON.parse(contents, dateTimeDeserializer);
                                        }
                                        else {
                                            obj = JSON.parse(contents);
                                        }
                                        response.result = obj;
                                    }
                                    response.headers = res.message.headers;
                                }
                                catch (err) {
                                    // Invalid resource (contents not json);  leaving result obj null
                                }
                                // note that 3xx redirects are handled by the http layer.
                                if (statusCode > 299) {
                                    let msg;
                                    // if exception/error in body, attempt to get better error
                                    if (obj && obj.message) {
                                        msg = obj.message;
                                    }
                                    else if (contents && contents.length > 0) {
                                        // it may be the case that the exception is in the body message as string
                                        msg = contents;
                                    }
                                    else {
                                        msg = `Failed request: (${statusCode})`;
                                    }
                                    const err = new HttpClientError(msg, statusCode);
                                    err.result = response.result;
                                    reject(err);
                                }
                                else {
                                    resolve(response);
                                }
                            }));
                        });
                    }
                }
                exports.HttpClient = HttpClient;
                const lowercaseKeys = (obj) => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
//# sourceMappingURL=index.js.map

                /***/ }),

            /***/ 427:
            /***/ (function(module, __unusedexports, __webpack_require__) {

                "use strict";

// Older verions of Node.js might not have `util.getSystemErrorName()`.
// In that case, fall back to a deprecated internal.
                const util = __webpack_require__(669);

                let uv;

                if (typeof util.getSystemErrorName === 'function') {
                    module.exports = util.getSystemErrorName;
                } else {
                    try {
                        uv = process.binding('uv');

                        if (typeof uv.errname !== 'function') {
                            throw new TypeError('uv.errname is not a function');
                        }
                    } catch (err) {
                        console.error('execa/lib/errname: unable to establish process.binding(\'uv\')', err);
                        uv = null;
                    }

                    module.exports = code => errname(uv, code);
                }

// Used for testing the fallback behavior
                module.exports.__test__ = errname;

                function errname(uv, code) {
                    if (uv) {
                        return uv.errname(code);
                    }

                    if (!(code < 0)) {
                        throw new Error('err >= 0');
                    }

                    return `Unknown system error ${code}`;
                }



                /***/ }),

            /***/ 431:
            /***/ (function(__unusedmodule, exports, __webpack_require__) {

                "use strict";

                var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
                    if (k2 === undefined) k2 = k;
                    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
                }) : (function(o, m, k, k2) {
                    if (k2 === undefined) k2 = k;
                    o[k2] = m[k];
                }));
                var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
                    Object.defineProperty(o, "default", { enumerable: true, value: v });
                }) : function(o, v) {
                    o["default"] = v;
                });
                var __importStar = (this && this.__importStar) || function (mod) {
                    if (mod && mod.__esModule) return mod;
                    var result = {};
                    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
                    __setModuleDefault(result, mod);
                    return result;
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                exports.issue = exports.issueCommand = void 0;
                const os = __importStar(__webpack_require__(87));
                const utils_1 = __webpack_require__(82);
                /**
                 * Commands
                 *
                 * Command Format:
                 *   ::name key=value,key=value::message
                 *
                 * Examples:
                 *   ::warning::This is the message
                 *   ::set-env name=MY_VAR::some value
                 */
                function issueCommand(command, properties, message) {
                    const cmd = new Command(command, properties, message);
                    process.stdout.write(cmd.toString() + os.EOL);
                }
                exports.issueCommand = issueCommand;
                function issue(name, message = '') {
                    issueCommand(name, {}, message);
                }
                exports.issue = issue;
                const CMD_STRING = '::';
                class Command {
                    constructor(command, properties, message) {
                        if (!command) {
                            command = 'missing.command';
                        }
                        this.command = command;
                        this.properties = properties;
                        this.message = message;
                    }
                    toString() {
                        let cmdStr = CMD_STRING + this.command;
                        if (this.properties && Object.keys(this.properties).length > 0) {
                            cmdStr += ' ';
                            let first = true;
                            for (const key in this.properties) {
                                if (this.properties.hasOwnProperty(key)) {
                                    const val = this.properties[key];
                                    if (val) {
                                        if (first) {
                                            first = false;
                                        }
                                        else {
                                            cmdStr += ',';
                                        }
                                        cmdStr += `${key}=${escapeProperty(val)}`;
                                    }
                                }
                            }
                        }
                        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
                        return cmdStr;
                    }
                }
                function escapeData(s) {
                    return utils_1.toCommandValue(s)
                        .replace(/%/g, '%25')
                        .replace(/\r/g, '%0D')
                        .replace(/\n/g, '%0A');
                }
                function escapeProperty(s) {
                    return utils_1.toCommandValue(s)
                        .replace(/%/g, '%25')
                        .replace(/\r/g, '%0D')
                        .replace(/\n/g, '%0A')
                        .replace(/:/g, '%3A')
                        .replace(/,/g, '%2C');
                }
//# sourceMappingURL=command.js.map

                /***/ }),

            /***/ 453:
            /***/ (function(module, __unusedexports, __webpack_require__) {

                var once = __webpack_require__(370)
                var eos = __webpack_require__(562)
                var fs = __webpack_require__(747) // we only need fs to get the ReadStream and WriteStream prototypes

                var noop = function () {}
                var ancient = /^v?\.0/.test(process.version)

                var isFn = function (fn) {
                    return typeof fn === 'function'
                }

                var isFS = function (stream) {
                    if (!ancient) return false // newer node version do not need to care about fs is a special way
                    if (!fs) return false // browser
                    return (stream instanceof (fs.ReadStream || noop) || stream instanceof (fs.WriteStream || noop)) && isFn(stream.close)
                }

                var isRequest = function (stream) {
                    return stream.setHeader && isFn(stream.abort)
                }

                var destroyer = function (stream, reading, writing, callback) {
                    callback = once(callback)

                    var closed = false
                    stream.on('close', function () {
                        closed = true
                    })

                    eos(stream, {readable: reading, writable: writing}, function (err) {
                        if (err) return callback(err)
                        closed = true
                        callback()
                    })

                    var destroyed = false
                    return function (err) {
                        if (closed) return
                        if (destroyed) return
                        destroyed = true

                        if (isFS(stream)) return stream.close(noop) // use close for fs streams to avoid fd leaks
                        if (isRequest(stream)) return stream.abort() // request.destroy just do .end - .abort is what we want

                        if (isFn(stream.destroy)) return stream.destroy()

                        callback(err || new Error('stream was destroyed'))
                    }
                }

                var call = function (fn) {
                    fn()
                }

                var pipe = function (from, to) {
                    return from.pipe(to)
                }

                var pump = function () {
                    var streams = Array.prototype.slice.call(arguments)
                    var callback = isFn(streams[streams.length - 1] || noop) && streams.pop() || noop

                    if (Array.isArray(streams[0])) streams = streams[0]
                    if (streams.length < 2) throw new Error('pump requires two streams per minimum')

                    var error
                    var destroys = streams.map(function (stream, i) {
                        var reading = i < streams.length - 1
                        var writing = i > 0
                        return destroyer(stream, reading, writing, function (err) {
                            if (!error) error = err
                            if (err) destroys.forEach(call)
                            if (reading) return
                            destroys.forEach(call)
                            callback(error)
                        })
                    })

                    return streams.reduce(pipe)
                }

                module.exports = pump


                /***/ }),

            /***/ 454:
            /***/ (function(module, exports, __webpack_require__) {

                "use strict";


                Object.defineProperty(exports, '__esModule', { value: true });

                function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

                var Stream = _interopDefault(__webpack_require__(794));
                var http = _interopDefault(__webpack_require__(605));
                var Url = _interopDefault(__webpack_require__(835));
                var whatwgUrl = _interopDefault(__webpack_require__(176));
                var https = _interopDefault(__webpack_require__(211));
                var zlib = _interopDefault(__webpack_require__(761));

// Based on https://github.com/tmpvar/jsdom/blob/aa85b2abf07766ff7bf5c1f6daafb3726f2f2db5/lib/jsdom/living/blob.js

// fix for "Readable" isn't a named export issue
                const Readable = Stream.Readable;

                const BUFFER = Symbol('buffer');
                const TYPE = Symbol('type');

                class Blob {
                    constructor() {
                        this[TYPE] = '';

                        const blobParts = arguments[0];
                        const options = arguments[1];

                        const buffers = [];
                        let size = 0;

                        if (blobParts) {
                            const a = blobParts;
                            const length = Number(a.length);
                            for (let i = 0; i < length; i++) {
                                const element = a[i];
                                let buffer;
                                if (element instanceof Buffer) {
                                    buffer = element;
                                } else if (ArrayBuffer.isView(element)) {
                                    buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
                                } else if (element instanceof ArrayBuffer) {
                                    buffer = Buffer.from(element);
                                } else if (element instanceof Blob) {
                                    buffer = element[BUFFER];
                                } else {
                                    buffer = Buffer.from(typeof element === 'string' ? element : String(element));
                                }
                                size += buffer.length;
                                buffers.push(buffer);
                            }
                        }

                        this[BUFFER] = Buffer.concat(buffers);

                        let type = options && options.type !== undefined && String(options.type).toLowerCase();
                        if (type && !/[^\u0020-\u007E]/.test(type)) {
                            this[TYPE] = type;
                        }
                    }
                    get size() {
                        return this[BUFFER].length;
                    }
                    get type() {
                        return this[TYPE];
                    }
                    text() {
                        return Promise.resolve(this[BUFFER].toString());
                    }
                    arrayBuffer() {
                        const buf = this[BUFFER];
                        const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
                        return Promise.resolve(ab);
                    }
                    stream() {
                        const readable = new Readable();
                        readable._read = function () {};
                        readable.push(this[BUFFER]);
                        readable.push(null);
                        return readable;
                    }
                    toString() {
                        return '[object Blob]';
                    }
                    slice() {
                        const size = this.size;

                        const start = arguments[0];
                        const end = arguments[1];
                        let relativeStart, relativeEnd;
                        if (start === undefined) {
                            relativeStart = 0;
                        } else if (start < 0) {
                            relativeStart = Math.max(size + start, 0);
                        } else {
                            relativeStart = Math.min(start, size);
                        }
                        if (end === undefined) {
                            relativeEnd = size;
                        } else if (end < 0) {
                            relativeEnd = Math.max(size + end, 0);
                        } else {
                            relativeEnd = Math.min(end, size);
                        }
                        const span = Math.max(relativeEnd - relativeStart, 0);

                        const buffer = this[BUFFER];
                        const slicedBuffer = buffer.slice(relativeStart, relativeStart + span);
                        const blob = new Blob([], { type: arguments[2] });
                        blob[BUFFER] = slicedBuffer;
                        return blob;
                    }
                }

                Object.defineProperties(Blob.prototype, {
                    size: { enumerable: true },
                    type: { enumerable: true },
                    slice: { enumerable: true }
                });

                Object.defineProperty(Blob.prototype, Symbol.toStringTag, {
                    value: 'Blob',
                    writable: false,
                    enumerable: false,
                    configurable: true
                });

                /**
                 * fetch-error.js
                 *
                 * FetchError interface for operational errors
                 */

                /**
                 * Create FetchError instance
                 *
                 * @param   String      message      Error message for human
                 * @param   String      type         Error type for machine
                 * @param   String      systemError  For Node.js system error
                 * @return  FetchError
                 */
                function FetchError(message, type, systemError) {
                    Error.call(this, message);

                    this.message = message;
                    this.type = type;

                    // when err.type is `system`, err.code contains system error code
                    if (systemError) {
                        this.code = this.errno = systemError.code;
                    }

                    // hide custom error implementation details from end-users
                    Error.captureStackTrace(this, this.constructor);
                }

                FetchError.prototype = Object.create(Error.prototype);
                FetchError.prototype.constructor = FetchError;
                FetchError.prototype.name = 'FetchError';

                let convert;
                try {
                    convert = __webpack_require__(18).convert;
                } catch (e) {}

                const INTERNALS = Symbol('Body internals');

// fix an issue where "PassThrough" isn't a named export for node <10
                const PassThrough = Stream.PassThrough;

                /**
                 * Body mixin
                 *
                 * Ref: https://fetch.spec.whatwg.org/#body
                 *
                 * @param   Stream  body  Readable stream
                 * @param   Object  opts  Response options
                 * @return  Void
                 */
                function Body(body) {
                    var _this = this;

                    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
                        _ref$size = _ref.size;

                    let size = _ref$size === undefined ? 0 : _ref$size;
                    var _ref$timeout = _ref.timeout;
                    let timeout = _ref$timeout === undefined ? 0 : _ref$timeout;

                    if (body == null) {
                        // body is undefined or null
                        body = null;
                    } else if (isURLSearchParams(body)) {
                        // body is a URLSearchParams
                        body = Buffer.from(body.toString());
                    } else if (isBlob(body)) ; else if (Buffer.isBuffer(body)) ; else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
                        // body is ArrayBuffer
                        body = Buffer.from(body);
                    } else if (ArrayBuffer.isView(body)) {
                        // body is ArrayBufferView
                        body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
                    } else if (body instanceof Stream) ; else {
                        // none of the above
                        // coerce to string then buffer
                        body = Buffer.from(String(body));
                    }
                    this[INTERNALS] = {
                        body,
                        disturbed: false,
                        error: null
                    };
                    this.size = size;
                    this.timeout = timeout;

                    if (body instanceof Stream) {
                        body.on('error', function (err) {
                            const error = err.name === 'AbortError' ? err : new FetchError(`Invalid response body while trying to fetch ${_this.url}: ${err.message}`, 'system', err);
                            _this[INTERNALS].error = error;
                        });
                    }
                }

                Body.prototype = {
                    get body() {
                        return this[INTERNALS].body;
                    },

                    get bodyUsed() {
                        return this[INTERNALS].disturbed;
                    },

                    /**
                     * Decode response as ArrayBuffer
                     *
                     * @return  Promise
                     */
                    arrayBuffer() {
                        return consumeBody.call(this).then(function (buf) {
                            return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
                        });
                    },

                    /**
                     * Return raw response as Blob
                     *
                     * @return Promise
                     */
                    blob() {
                        let ct = this.headers && this.headers.get('content-type') || '';
                        return consumeBody.call(this).then(function (buf) {
                            return Object.assign(
                                // Prevent copying
                                new Blob([], {
                                    type: ct.toLowerCase()
                                }), {
                                    [BUFFER]: buf
                                });
                        });
                    },

                    /**
                     * Decode response as json
                     *
                     * @return  Promise
                     */
                    json() {
                        var _this2 = this;

                        return consumeBody.call(this).then(function (buffer) {
                            try {
                                return JSON.parse(buffer.toString());
                            } catch (err) {
                                return Body.Promise.reject(new FetchError(`invalid json response body at ${_this2.url} reason: ${err.message}`, 'invalid-json'));
                            }
                        });
                    },

                    /**
                     * Decode response as text
                     *
                     * @return  Promise
                     */
                    text() {
                        return consumeBody.call(this).then(function (buffer) {
                            return buffer.toString();
                        });
                    },

                    /**
                     * Decode response as buffer (non-spec api)
                     *
                     * @return  Promise
                     */
                    buffer() {
                        return consumeBody.call(this);
                    },

                    /**
                     * Decode response as text, while automatically detecting the encoding and
                     * trying to decode to UTF-8 (non-spec api)
                     *
                     * @return  Promise
                     */
                    textConverted() {
                        var _this3 = this;

                        return consumeBody.call(this).then(function (buffer) {
                            return convertBody(buffer, _this3.headers);
                        });
                    }
                };

// In browsers, all properties are enumerable.
                Object.defineProperties(Body.prototype, {
                    body: { enumerable: true },
                    bodyUsed: { enumerable: true },
                    arrayBuffer: { enumerable: true },
                    blob: { enumerable: true },
                    json: { enumerable: true },
                    text: { enumerable: true }
                });

                Body.mixIn = function (proto) {
                    for (const name of Object.getOwnPropertyNames(Body.prototype)) {
                        // istanbul ignore else: future proof
                        if (!(name in proto)) {
                            const desc = Object.getOwnPropertyDescriptor(Body.prototype, name);
                            Object.defineProperty(proto, name, desc);
                        }
                    }
                };

                /**
                 * Consume and convert an entire Body to a Buffer.
                 *
                 * Ref: https://fetch.spec.whatwg.org/#concept-body-consume-body
                 *
                 * @return  Promise
                 */
                function consumeBody() {
                    var _this4 = this;

                    if (this[INTERNALS].disturbed) {
                        return Body.Promise.reject(new TypeError(`body used already for: ${this.url}`));
                    }

                    this[INTERNALS].disturbed = true;

                    if (this[INTERNALS].error) {
                        return Body.Promise.reject(this[INTERNALS].error);
                    }

                    let body = this.body;

                    // body is null
                    if (body === null) {
                        return Body.Promise.resolve(Buffer.alloc(0));
                    }

                    // body is blob
                    if (isBlob(body)) {
                        body = body.stream();
                    }

                    // body is buffer
                    if (Buffer.isBuffer(body)) {
                        return Body.Promise.resolve(body);
                    }

                    // istanbul ignore if: should never happen
                    if (!(body instanceof Stream)) {
                        return Body.Promise.resolve(Buffer.alloc(0));
                    }

                    // body is stream
                    // get ready to actually consume the body
                    let accum = [];
                    let accumBytes = 0;
                    let abort = false;

                    return new Body.Promise(function (resolve, reject) {
                        let resTimeout;

                        // allow timeout on slow response body
                        if (_this4.timeout) {
                            resTimeout = setTimeout(function () {
                                abort = true;
                                reject(new FetchError(`Response timeout while trying to fetch ${_this4.url} (over ${_this4.timeout}ms)`, 'body-timeout'));
                            }, _this4.timeout);
                        }

                        // handle stream errors
                        body.on('error', function (err) {
                            if (err.name === 'AbortError') {
                                // if the request was aborted, reject with this Error
                                abort = true;
                                reject(err);
                            } else {
                                // other errors, such as incorrect content-encoding
                                reject(new FetchError(`Invalid response body while trying to fetch ${_this4.url}: ${err.message}`, 'system', err));
                            }
                        });

                        body.on('data', function (chunk) {
                            if (abort || chunk === null) {
                                return;
                            }

                            if (_this4.size && accumBytes + chunk.length > _this4.size) {
                                abort = true;
                                reject(new FetchError(`content size at ${_this4.url} over limit: ${_this4.size}`, 'max-size'));
                                return;
                            }

                            accumBytes += chunk.length;
                            accum.push(chunk);
                        });

                        body.on('end', function () {
                            if (abort) {
                                return;
                            }

                            clearTimeout(resTimeout);

                            try {
                                resolve(Buffer.concat(accum, accumBytes));
                            } catch (err) {
                                // handle streams that have accumulated too much data (issue #414)
                                reject(new FetchError(`Could not create Buffer from response body for ${_this4.url}: ${err.message}`, 'system', err));
                            }
                        });
                    });
                }

                /**
                 * Detect buffer encoding and convert to target encoding
                 * ref: http://www.w3.org/TR/2011/WD-html5-20110113/parsing.html#determining-the-character-encoding
                 *
                 * @param   Buffer  buffer    Incoming buffer
                 * @param   String  encoding  Target encoding
                 * @return  String
                 */
                function convertBody(buffer, headers) {
                    if (typeof convert !== 'function') {
                        throw new Error('The package `encoding` must be installed to use the textConverted() function');
                    }

                    const ct = headers.get('content-type');
                    let charset = 'utf-8';
                    let res, str;

                    // header
                    if (ct) {
                        res = /charset=([^;]*)/i.exec(ct);
                    }

                    // no charset in content type, peek at response body for at most 1024 bytes
                    str = buffer.slice(0, 1024).toString();

                    // html5
                    if (!res && str) {
                        res = /<meta.+?charset=(['"])(.+?)\1/i.exec(str);
                    }

                    // html4
                    if (!res && str) {
                        res = /<meta[\s]+?http-equiv=(['"])content-type\1[\s]+?content=(['"])(.+?)\2/i.exec(str);
                        if (!res) {
                            res = /<meta[\s]+?content=(['"])(.+?)\1[\s]+?http-equiv=(['"])content-type\3/i.exec(str);
                            if (res) {
                                res.pop(); // drop last quote
                            }
                        }

                        if (res) {
                            res = /charset=(.*)/i.exec(res.pop());
                        }
                    }

                    // xml
                    if (!res && str) {
                        res = /<\?xml.+?encoding=(['"])(.+?)\1/i.exec(str);
                    }

                    // found charset
                    if (res) {
                        charset = res.pop();

                        // prevent decode issues when sites use incorrect encoding
                        // ref: https://hsivonen.fi/encoding-menu/
                        if (charset === 'gb2312' || charset === 'gbk') {
                            charset = 'gb18030';
                        }
                    }

                    // turn raw buffers into a single utf-8 buffer
                    return convert(buffer, 'UTF-8', charset).toString();
                }

                /**
                 * Detect a URLSearchParams object
                 * ref: https://github.com/bitinn/node-fetch/issues/296#issuecomment-307598143
                 *
                 * @param   Object  obj     Object to detect by type or brand
                 * @return  String
                 */
                function isURLSearchParams(obj) {
                    // Duck-typing as a necessary condition.
                    if (typeof obj !== 'object' || typeof obj.append !== 'function' || typeof obj.delete !== 'function' || typeof obj.get !== 'function' || typeof obj.getAll !== 'function' || typeof obj.has !== 'function' || typeof obj.set !== 'function') {
                        return false;
                    }

                    // Brand-checking and more duck-typing as optional condition.
                    return obj.constructor.name === 'URLSearchParams' || Object.prototype.toString.call(obj) === '[object URLSearchParams]' || typeof obj.sort === 'function';
                }

                /**
                 * Check if `obj` is a W3C `Blob` object (which `File` inherits from)
                 * @param  {*} obj
                 * @return {boolean}
                 */
                function isBlob(obj) {
                    return typeof obj === 'object' && typeof obj.arrayBuffer === 'function' && typeof obj.type === 'string' && typeof obj.stream === 'function' && typeof obj.constructor === 'function' && typeof obj.constructor.name === 'string' && /^(Blob|File)$/.test(obj.constructor.name) && /^(Blob|File)$/.test(obj[Symbol.toStringTag]);
                }

                /**
                 * Clone body given Res/Req instance
                 *
                 * @param   Mixed  instance  Response or Request instance
                 * @return  Mixed
                 */
                function clone(instance) {
                    let p1, p2;
                    let body = instance.body;

                    // don't allow cloning a used body
                    if (instance.bodyUsed) {
                        throw new Error('cannot clone body after it is used');
                    }

                    // check that body is a stream and not form-data object
                    // note: we can't clone the form-data object without having it as a dependency
                    if (body instanceof Stream && typeof body.getBoundary !== 'function') {
                        // tee instance body
                        p1 = new PassThrough();
                        p2 = new PassThrough();
                        body.pipe(p1);
                        body.pipe(p2);
                        // set instance body to teed body and return the other teed body
                        instance[INTERNALS].body = p1;
                        body = p2;
                    }

                    return body;
                }

                /**
                 * Performs the operation "extract a `Content-Type` value from |object|" as
                 * specified in the specification:
                 * https://fetch.spec.whatwg.org/#concept-bodyinit-extract
                 *
                 * This function assumes that instance.body is present.
                 *
                 * @param   Mixed  instance  Any options.body input
                 */
                function extractContentType(body) {
                    if (body === null) {
                        // body is null
                        return null;
                    } else if (typeof body === 'string') {
                        // body is string
                        return 'text/plain;charset=UTF-8';
                    } else if (isURLSearchParams(body)) {
                        // body is a URLSearchParams
                        return 'application/x-www-form-urlencoded;charset=UTF-8';
                    } else if (isBlob(body)) {
                        // body is blob
                        return body.type || null;
                    } else if (Buffer.isBuffer(body)) {
                        // body is buffer
                        return null;
                    } else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
                        // body is ArrayBuffer
                        return null;
                    } else if (ArrayBuffer.isView(body)) {
                        // body is ArrayBufferView
                        return null;
                    } else if (typeof body.getBoundary === 'function') {
                        // detect form data input from form-data module
                        return `multipart/form-data;boundary=${body.getBoundary()}`;
                    } else if (body instanceof Stream) {
                        // body is stream
                        // can't really do much about this
                        return null;
                    } else {
                        // Body constructor defaults other things to string
                        return 'text/plain;charset=UTF-8';
                    }
                }

                /**
                 * The Fetch Standard treats this as if "total bytes" is a property on the body.
                 * For us, we have to explicitly get it with a function.
                 *
                 * ref: https://fetch.spec.whatwg.org/#concept-body-total-bytes
                 *
                 * @param   Body    instance   Instance of Body
                 * @return  Number?            Number of bytes, or null if not possible
                 */
                function getTotalBytes(instance) {
                    const body = instance.body;


                    if (body === null) {
                        // body is null
                        return 0;
                    } else if (isBlob(body)) {
                        return body.size;
                    } else if (Buffer.isBuffer(body)) {
                        // body is buffer
                        return body.length;
                    } else if (body && typeof body.getLengthSync === 'function') {
                        // detect form data input from form-data module
                        if (body._lengthRetrievers && body._lengthRetrievers.length == 0 || // 1.x
                            body.hasKnownLength && body.hasKnownLength()) {
                            // 2.x
                            return body.getLengthSync();
                        }
                        return null;
                    } else {
                        // body is stream
                        return null;
                    }
                }

                /**
                 * Write a Body to a Node.js WritableStream (e.g. http.Request) object.
                 *
                 * @param   Body    instance   Instance of Body
                 * @return  Void
                 */
                function writeToStream(dest, instance) {
                    const body = instance.body;


                    if (body === null) {
                        // body is null
                        dest.end();
                    } else if (isBlob(body)) {
                        body.stream().pipe(dest);
                    } else if (Buffer.isBuffer(body)) {
                        // body is buffer
                        dest.write(body);
                        dest.end();
                    } else {
                        // body is stream
                        body.pipe(dest);
                    }
                }

// expose Promise
                Body.Promise = global.Promise;

                /**
                 * headers.js
                 *
                 * Headers class offers convenient helpers
                 */

                const invalidTokenRegex = /[^\^_`a-zA-Z\-0-9!#$%&'*+.|~]/;
                const invalidHeaderCharRegex = /[^\t\x20-\x7e\x80-\xff]/;

                function validateName(name) {
                    name = `${name}`;
                    if (invalidTokenRegex.test(name) || name === '') {
                        throw new TypeError(`${name} is not a legal HTTP header name`);
                    }
                }

                function validateValue(value) {
                    value = `${value}`;
                    if (invalidHeaderCharRegex.test(value)) {
                        throw new TypeError(`${value} is not a legal HTTP header value`);
                    }
                }

                /**
                 * Find the key in the map object given a header name.
                 *
                 * Returns undefined if not found.
                 *
                 * @param   String  name  Header name
                 * @return  String|Undefined
                 */
                function find(map, name) {
                    name = name.toLowerCase();
                    for (const key in map) {
                        if (key.toLowerCase() === name) {
                            return key;
                        }
                    }
                    return undefined;
                }

                const MAP = Symbol('map');
                class Headers {
                    /**
                     * Headers class
                     *
                     * @param   Object  headers  Response headers
                     * @return  Void
                     */
                    constructor() {
                        let init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

                        this[MAP] = Object.create(null);

                        if (init instanceof Headers) {
                            const rawHeaders = init.raw();
                            const headerNames = Object.keys(rawHeaders);

                            for (const headerName of headerNames) {
                                for (const value of rawHeaders[headerName]) {
                                    this.append(headerName, value);
                                }
                            }

                            return;
                        }

                        // We don't worry about converting prop to ByteString here as append()
                        // will handle it.
                        if (init == null) ; else if (typeof init === 'object') {
                            const method = init[Symbol.iterator];
                            if (method != null) {
                                if (typeof method !== 'function') {
                                    throw new TypeError('Header pairs must be iterable');
                                }

                                // sequence<sequence<ByteString>>
                                // Note: per spec we have to first exhaust the lists then process them
                                const pairs = [];
                                for (const pair of init) {
                                    if (typeof pair !== 'object' || typeof pair[Symbol.iterator] !== 'function') {
                                        throw new TypeError('Each header pair must be iterable');
                                    }
                                    pairs.push(Array.from(pair));
                                }

                                for (const pair of pairs) {
                                    if (pair.length !== 2) {
                                        throw new TypeError('Each header pair must be a name/value tuple');
                                    }
                                    this.append(pair[0], pair[1]);
                                }
                            } else {
                                // record<ByteString, ByteString>
                                for (const key of Object.keys(init)) {
                                    const value = init[key];
                                    this.append(key, value);
                                }
                            }
                        } else {
                            throw new TypeError('Provided initializer must be an object');
                        }
                    }

                    /**
                     * Return combined header value given name
                     *
                     * @param   String  name  Header name
                     * @return  Mixed
                     */
                    get(name) {
                        name = `${name}`;
                        validateName(name);
                        const key = find(this[MAP], name);
                        if (key === undefined) {
                            return null;
                        }

                        return this[MAP][key].join(', ');
                    }

                    /**
                     * Iterate over all headers
                     *
                     * @param   Function  callback  Executed for each item with parameters (value, name, thisArg)
                     * @param   Boolean   thisArg   `this` context for callback function
                     * @return  Void
                     */
                    forEach(callback) {
                        let thisArg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

                        let pairs = getHeaders(this);
                        let i = 0;
                        while (i < pairs.length) {
                            var _pairs$i = pairs[i];
                            const name = _pairs$i[0],
                                value = _pairs$i[1];

                            callback.call(thisArg, value, name, this);
                            pairs = getHeaders(this);
                            i++;
                        }
                    }

                    /**
                     * Overwrite header values given name
                     *
                     * @param   String  name   Header name
                     * @param   String  value  Header value
                     * @return  Void
                     */
                    set(name, value) {
                        name = `${name}`;
                        value = `${value}`;
                        validateName(name);
                        validateValue(value);
                        const key = find(this[MAP], name);
                        this[MAP][key !== undefined ? key : name] = [value];
                    }

                    /**
                     * Append a value onto existing header
                     *
                     * @param   String  name   Header name
                     * @param   String  value  Header value
                     * @return  Void
                     */
                    append(name, value) {
                        name = `${name}`;
                        value = `${value}`;
                        validateName(name);
                        validateValue(value);
                        const key = find(this[MAP], name);
                        if (key !== undefined) {
                            this[MAP][key].push(value);
                        } else {
                            this[MAP][name] = [value];
                        }
                    }

                    /**
                     * Check for header name existence
                     *
                     * @param   String   name  Header name
                     * @return  Boolean
                     */
                    has(name) {
                        name = `${name}`;
                        validateName(name);
                        return find(this[MAP], name) !== undefined;
                    }

                    /**
                     * Delete all header values given name
                     *
                     * @param   String  name  Header name
                     * @return  Void
                     */
                    delete(name) {
                        name = `${name}`;
                        validateName(name);
                        const key = find(this[MAP], name);
                        if (key !== undefined) {
                            delete this[MAP][key];
                        }
                    }

                    /**
                     * Return raw headers (non-spec api)
                     *
                     * @return  Object
                     */
                    raw() {
                        return this[MAP];
                    }

                    /**
                     * Get an iterator on keys.
                     *
                     * @return  Iterator
                     */
                    keys() {
                        return createHeadersIterator(this, 'key');
                    }

                    /**
                     * Get an iterator on values.
                     *
                     * @return  Iterator
                     */
                    values() {
                        return createHeadersIterator(this, 'value');
                    }

                    /**
                     * Get an iterator on entries.
                     *
                     * This is the default iterator of the Headers object.
                     *
                     * @return  Iterator
                     */
                    [Symbol.iterator]() {
                        return createHeadersIterator(this, 'key+value');
                    }
                }
                Headers.prototype.entries = Headers.prototype[Symbol.iterator];

                Object.defineProperty(Headers.prototype, Symbol.toStringTag, {
                    value: 'Headers',
                    writable: false,
                    enumerable: false,
                    configurable: true
                });

                Object.defineProperties(Headers.prototype, {
                    get: { enumerable: true },
                    forEach: { enumerable: true },
                    set: { enumerable: true },
                    append: { enumerable: true },
                    has: { enumerable: true },
                    delete: { enumerable: true },
                    keys: { enumerable: true },
                    values: { enumerable: true },
                    entries: { enumerable: true }
                });

                function getHeaders(headers) {
                    let kind = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'key+value';

                    const keys = Object.keys(headers[MAP]).sort();
                    return keys.map(kind === 'key' ? function (k) {
                        return k.toLowerCase();
                    } : kind === 'value' ? function (k) {
                        return headers[MAP][k].join(', ');
                    } : function (k) {
                        return [k.toLowerCase(), headers[MAP][k].join(', ')];
                    });
                }

                const INTERNAL = Symbol('internal');

                function createHeadersIterator(target, kind) {
                    const iterator = Object.create(HeadersIteratorPrototype);
                    iterator[INTERNAL] = {
                        target,
                        kind,
                        index: 0
                    };
                    return iterator;
                }

                const HeadersIteratorPrototype = Object.setPrototypeOf({
                    next() {
                        // istanbul ignore if
                        if (!this || Object.getPrototypeOf(this) !== HeadersIteratorPrototype) {
                            throw new TypeError('Value of `this` is not a HeadersIterator');
                        }

                        var _INTERNAL = this[INTERNAL];
                        const target = _INTERNAL.target,
                            kind = _INTERNAL.kind,
                            index = _INTERNAL.index;

                        const values = getHeaders(target, kind);
                        const len = values.length;
                        if (index >= len) {
                            return {
                                value: undefined,
                                done: true
                            };
                        }

                        this[INTERNAL].index = index + 1;

                        return {
                            value: values[index],
                            done: false
                        };
                    }
                }, Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]())));

                Object.defineProperty(HeadersIteratorPrototype, Symbol.toStringTag, {
                    value: 'HeadersIterator',
                    writable: false,
                    enumerable: false,
                    configurable: true
                });

                /**
                 * Export the Headers object in a form that Node.js can consume.
                 *
                 * @param   Headers  headers
                 * @return  Object
                 */
                function exportNodeCompatibleHeaders(headers) {
                    const obj = Object.assign({ __proto__: null }, headers[MAP]);

                    // http.request() only supports string as Host header. This hack makes
                    // specifying custom Host header possible.
                    const hostHeaderKey = find(headers[MAP], 'Host');
                    if (hostHeaderKey !== undefined) {
                        obj[hostHeaderKey] = obj[hostHeaderKey][0];
                    }

                    return obj;
                }

                /**
                 * Create a Headers object from an object of headers, ignoring those that do
                 * not conform to HTTP grammar productions.
                 *
                 * @param   Object  obj  Object of headers
                 * @return  Headers
                 */
                function createHeadersLenient(obj) {
                    const headers = new Headers();
                    for (const name of Object.keys(obj)) {
                        if (invalidTokenRegex.test(name)) {
                            continue;
                        }
                        if (Array.isArray(obj[name])) {
                            for (const val of obj[name]) {
                                if (invalidHeaderCharRegex.test(val)) {
                                    continue;
                                }
                                if (headers[MAP][name] === undefined) {
                                    headers[MAP][name] = [val];
                                } else {
                                    headers[MAP][name].push(val);
                                }
                            }
                        } else if (!invalidHeaderCharRegex.test(obj[name])) {
                            headers[MAP][name] = [obj[name]];
                        }
                    }
                    return headers;
                }

                const INTERNALS$1 = Symbol('Response internals');

// fix an issue where "STATUS_CODES" aren't a named export for node <10
                const STATUS_CODES = http.STATUS_CODES;

                /**
                 * Response class
                 *
                 * @param   Stream  body  Readable stream
                 * @param   Object  opts  Response options
                 * @return  Void
                 */
                class Response {
                    constructor() {
                        let body = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
                        let opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

                        Body.call(this, body, opts);

                        const status = opts.status || 200;
                        const headers = new Headers(opts.headers);

                        if (body != null && !headers.has('Content-Type')) {
                            const contentType = extractContentType(body);
                            if (contentType) {
                                headers.append('Content-Type', contentType);
                            }
                        }

                        this[INTERNALS$1] = {
                            url: opts.url,
                            status,
                            statusText: opts.statusText || STATUS_CODES[status],
                            headers,
                            counter: opts.counter
                        };
                    }

                    get url() {
                        return this[INTERNALS$1].url || '';
                    }

                    get status() {
                        return this[INTERNALS$1].status;
                    }

                    /**
                     * Convenience property representing if the request ended normally
                     */
                    get ok() {
                        return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
                    }

                    get redirected() {
                        return this[INTERNALS$1].counter > 0;
                    }

                    get statusText() {
                        return this[INTERNALS$1].statusText;
                    }

                    get headers() {
                        return this[INTERNALS$1].headers;
                    }

                    /**
                     * Clone this response
                     *
                     * @return  Response
                     */
                    clone() {
                        return new Response(clone(this), {
                            url: this.url,
                            status: this.status,
                            statusText: this.statusText,
                            headers: this.headers,
                            ok: this.ok,
                            redirected: this.redirected
                        });
                    }
                }

                Body.mixIn(Response.prototype);

                Object.defineProperties(Response.prototype, {
                    url: { enumerable: true },
                    status: { enumerable: true },
                    ok: { enumerable: true },
                    redirected: { enumerable: true },
                    statusText: { enumerable: true },
                    headers: { enumerable: true },
                    clone: { enumerable: true }
                });

                Object.defineProperty(Response.prototype, Symbol.toStringTag, {
                    value: 'Response',
                    writable: false,
                    enumerable: false,
                    configurable: true
                });

                const INTERNALS$2 = Symbol('Request internals');
                const URL = Url.URL || whatwgUrl.URL;

// fix an issue where "format", "parse" aren't a named export for node <10
                const parse_url = Url.parse;
                const format_url = Url.format;

                /**
                 * Wrapper around `new URL` to handle arbitrary URLs
                 *
                 * @param  {string} urlStr
                 * @return {void}
                 */
                function parseURL(urlStr) {
                    /*
 	Check whether the URL is absolute or not
 		Scheme: https://tools.ietf.org/html/rfc3986#section-3.1
 	Absolute URL: https://tools.ietf.org/html/rfc3986#section-4.3
 */
                    if (/^[a-zA-Z][a-zA-Z\d+\-.]*:/.exec(urlStr)) {
                        urlStr = new URL(urlStr).toString();
                    }

                    // Fallback to old implementation for arbitrary URLs
                    return parse_url(urlStr);
                }

                const streamDestructionSupported = 'destroy' in Stream.Readable.prototype;

                /**
                 * Check if a value is an instance of Request.
                 *
                 * @param   Mixed   input
                 * @return  Boolean
                 */
                function isRequest(input) {
                    return typeof input === 'object' && typeof input[INTERNALS$2] === 'object';
                }

                function isAbortSignal(signal) {
                    const proto = signal && typeof signal === 'object' && Object.getPrototypeOf(signal);
                    return !!(proto && proto.constructor.name === 'AbortSignal');
                }

                /**
                 * Request class
                 *
                 * @param   Mixed   input  Url or Request instance
                 * @param   Object  init   Custom options
                 * @return  Void
                 */
                class Request {
                    constructor(input) {
                        let init = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

                        let parsedURL;

                        // normalize input
                        if (!isRequest(input)) {
                            if (input && input.href) {
                                // in order to support Node.js' Url objects; though WHATWG's URL objects
                                // will fall into this branch also (since their `toString()` will return
                                // `href` property anyway)
                                parsedURL = parseURL(input.href);
                            } else {
                                // coerce input to a string before attempting to parse
                                parsedURL = parseURL(`${input}`);
                            }
                            input = {};
                        } else {
                            parsedURL = parseURL(input.url);
                        }

                        let method = init.method || input.method || 'GET';
                        method = method.toUpperCase();

                        if ((init.body != null || isRequest(input) && input.body !== null) && (method === 'GET' || method === 'HEAD')) {
                            throw new TypeError('Request with GET/HEAD method cannot have body');
                        }

                        let inputBody = init.body != null ? init.body : isRequest(input) && input.body !== null ? clone(input) : null;

                        Body.call(this, inputBody, {
                            timeout: init.timeout || input.timeout || 0,
                            size: init.size || input.size || 0
                        });

                        const headers = new Headers(init.headers || input.headers || {});

                        if (inputBody != null && !headers.has('Content-Type')) {
                            const contentType = extractContentType(inputBody);
                            if (contentType) {
                                headers.append('Content-Type', contentType);
                            }
                        }

                        let signal = isRequest(input) ? input.signal : null;
                        if ('signal' in init) signal = init.signal;

                        if (signal != null && !isAbortSignal(signal)) {
                            throw new TypeError('Expected signal to be an instanceof AbortSignal');
                        }

                        this[INTERNALS$2] = {
                            method,
                            redirect: init.redirect || input.redirect || 'follow',
                            headers,
                            parsedURL,
                            signal
                        };

                        // node-fetch-only options
                        this.follow = init.follow !== undefined ? init.follow : input.follow !== undefined ? input.follow : 20;
                        this.compress = init.compress !== undefined ? init.compress : input.compress !== undefined ? input.compress : true;
                        this.counter = init.counter || input.counter || 0;
                        this.agent = init.agent || input.agent;
                    }

                    get method() {
                        return this[INTERNALS$2].method;
                    }

                    get url() {
                        return format_url(this[INTERNALS$2].parsedURL);
                    }

                    get headers() {
                        return this[INTERNALS$2].headers;
                    }

                    get redirect() {
                        return this[INTERNALS$2].redirect;
                    }

                    get signal() {
                        return this[INTERNALS$2].signal;
                    }

                    /**
                     * Clone this request
                     *
                     * @return  Request
                     */
                    clone() {
                        return new Request(this);
                    }
                }

                Body.mixIn(Request.prototype);

                Object.defineProperty(Request.prototype, Symbol.toStringTag, {
                    value: 'Request',
                    writable: false,
                    enumerable: false,
                    configurable: true
                });

                Object.defineProperties(Request.prototype, {
                    method: { enumerable: true },
                    url: { enumerable: true },
                    headers: { enumerable: true },
                    redirect: { enumerable: true },
                    clone: { enumerable: true },
                    signal: { enumerable: true }
                });

                /**
                 * Convert a Request to Node.js http request options.
                 *
                 * @param   Request  A Request instance
                 * @return  Object   The options object to be passed to http.request
                 */
                function getNodeRequestOptions(request) {
                    const parsedURL = request[INTERNALS$2].parsedURL;
                    const headers = new Headers(request[INTERNALS$2].headers);

                    // fetch step 1.3
                    if (!headers.has('Accept')) {
                        headers.set('Accept', '*/*');
                    }

                    // Basic fetch
                    if (!parsedURL.protocol || !parsedURL.hostname) {
                        throw new TypeError('Only absolute URLs are supported');
                    }

                    if (!/^https?:$/.test(parsedURL.protocol)) {
                        throw new TypeError('Only HTTP(S) protocols are supported');
                    }

                    if (request.signal && request.body instanceof Stream.Readable && !streamDestructionSupported) {
                        throw new Error('Cancellation of streamed requests with AbortSignal is not supported in node < 8');
                    }

                    // HTTP-network-or-cache fetch steps 2.4-2.7
                    let contentLengthValue = null;
                    if (request.body == null && /^(POST|PUT)$/i.test(request.method)) {
                        contentLengthValue = '0';
                    }
                    if (request.body != null) {
                        const totalBytes = getTotalBytes(request);
                        if (typeof totalBytes === 'number') {
                            contentLengthValue = String(totalBytes);
                        }
                    }
                    if (contentLengthValue) {
                        headers.set('Content-Length', contentLengthValue);
                    }

                    // HTTP-network-or-cache fetch step 2.11
                    if (!headers.has('User-Agent')) {
                        headers.set('User-Agent', 'node-fetch/1.0 (+https://github.com/bitinn/node-fetch)');
                    }

                    // HTTP-network-or-cache fetch step 2.15
                    if (request.compress && !headers.has('Accept-Encoding')) {
                        headers.set('Accept-Encoding', 'gzip,deflate');
                    }

                    let agent = request.agent;
                    if (typeof agent === 'function') {
                        agent = agent(parsedURL);
                    }

                    if (!headers.has('Connection') && !agent) {
                        headers.set('Connection', 'close');
                    }

                    // HTTP-network fetch step 4.2
                    // chunked encoding is handled by Node.js

                    return Object.assign({}, parsedURL, {
                        method: request.method,
                        headers: exportNodeCompatibleHeaders(headers),
                        agent
                    });
                }

                /**
                 * abort-error.js
                 *
                 * AbortError interface for cancelled requests
                 */

                /**
                 * Create AbortError instance
                 *
                 * @param   String      message      Error message for human
                 * @return  AbortError
                 */
                function AbortError(message) {
                    Error.call(this, message);

                    this.type = 'aborted';
                    this.message = message;

                    // hide custom error implementation details from end-users
                    Error.captureStackTrace(this, this.constructor);
                }

                AbortError.prototype = Object.create(Error.prototype);
                AbortError.prototype.constructor = AbortError;
                AbortError.prototype.name = 'AbortError';

                const URL$1 = Url.URL || whatwgUrl.URL;

// fix an issue where "PassThrough", "resolve" aren't a named export for node <10
                const PassThrough$1 = Stream.PassThrough;

                const isDomainOrSubdomain = function isDomainOrSubdomain(destination, original) {
                    const orig = new URL$1(original).hostname;
                    const dest = new URL$1(destination).hostname;

                    return orig === dest || orig[orig.length - dest.length - 1] === '.' && orig.endsWith(dest);
                };

                /**
                 * isSameProtocol reports whether the two provided URLs use the same protocol.
                 *
                 * Both domains must already be in canonical form.
                 * @param {string|URL} original
                 * @param {string|URL} destination
                 */
                const isSameProtocol = function isSameProtocol(destination, original) {
                    const orig = new URL$1(original).protocol;
                    const dest = new URL$1(destination).protocol;

                    return orig === dest;
                };

                /**
                 * Fetch function
                 *
                 * @param   Mixed    url   Absolute url or Request instance
                 * @param   Object   opts  Fetch options
                 * @return  Promise
                 */
                function fetch(url, opts) {

                    // allow custom promise
                    if (!fetch.Promise) {
                        throw new Error('native promise missing, set fetch.Promise to your favorite alternative');
                    }

                    Body.Promise = fetch.Promise;

                    // wrap http.request into fetch
                    return new fetch.Promise(function (resolve, reject) {
                        // build request object
                        const request = new Request(url, opts);
                        const options = getNodeRequestOptions(request);

                        const send = (options.protocol === 'https:' ? https : http).request;
                        const signal = request.signal;

                        let response = null;

                        const abort = function abort() {
                            let error = new AbortError('The user aborted a request.');
                            reject(error);
                            if (request.body && request.body instanceof Stream.Readable) {
                                destroyStream(request.body, error);
                            }
                            if (!response || !response.body) return;
                            response.body.emit('error', error);
                        };

                        if (signal && signal.aborted) {
                            abort();
                            return;
                        }

                        const abortAndFinalize = function abortAndFinalize() {
                            abort();
                            finalize();
                        };

                        // send request
                        const req = send(options);
                        let reqTimeout;

                        if (signal) {
                            signal.addEventListener('abort', abortAndFinalize);
                        }

                        function finalize() {
                            req.abort();
                            if (signal) signal.removeEventListener('abort', abortAndFinalize);
                            clearTimeout(reqTimeout);
                        }

                        if (request.timeout) {
                            req.once('socket', function (socket) {
                                reqTimeout = setTimeout(function () {
                                    reject(new FetchError(`network timeout at: ${request.url}`, 'request-timeout'));
                                    finalize();
                                }, request.timeout);
                            });
                        }

                        req.on('error', function (err) {
                            reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, 'system', err));

                            if (response && response.body) {
                                destroyStream(response.body, err);
                            }

                            finalize();
                        });

                        fixResponseChunkedTransferBadEnding(req, function (err) {
                            if (signal && signal.aborted) {
                                return;
                            }

                            if (response && response.body) {
                                destroyStream(response.body, err);
                            }
                        });

                        /* c8 ignore next 18 */
                        if (parseInt(process.version.substring(1)) < 14) {
                            // Before Node.js 14, pipeline() does not fully support async iterators and does not always
                            // properly handle when the socket close/end events are out of order.
                            req.on('socket', function (s) {
                                s.addListener('close', function (hadError) {
                                    // if a data listener is still present we didn't end cleanly
                                    const hasDataListener = s.listenerCount('data') > 0;

                                    // if end happened before close but the socket didn't emit an error, do it now
                                    if (response && hasDataListener && !hadError && !(signal && signal.aborted)) {
                                        const err = new Error('Premature close');
                                        err.code = 'ERR_STREAM_PREMATURE_CLOSE';
                                        response.body.emit('error', err);
                                    }
                                });
                            });
                        }

                        req.on('response', function (res) {
                            clearTimeout(reqTimeout);

                            const headers = createHeadersLenient(res.headers);

                            // HTTP fetch step 5
                            if (fetch.isRedirect(res.statusCode)) {
                                // HTTP fetch step 5.2
                                const location = headers.get('Location');

                                // HTTP fetch step 5.3
                                let locationURL = null;
                                try {
                                    locationURL = location === null ? null : new URL$1(location, request.url).toString();
                                } catch (err) {
                                    // error here can only be invalid URL in Location: header
                                    // do not throw when options.redirect == manual
                                    // let the user extract the errorneous redirect URL
                                    if (request.redirect !== 'manual') {
                                        reject(new FetchError(`uri requested responds with an invalid redirect URL: ${location}`, 'invalid-redirect'));
                                        finalize();
                                        return;
                                    }
                                }

                                // HTTP fetch step 5.5
                                switch (request.redirect) {
                                    case 'error':
                                        reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, 'no-redirect'));
                                        finalize();
                                        return;
                                    case 'manual':
                                        // node-fetch-specific step: make manual redirect a bit easier to use by setting the Location header value to the resolved URL.
                                        if (locationURL !== null) {
                                            // handle corrupted header
                                            try {
                                                headers.set('Location', locationURL);
                                            } catch (err) {
                                                // istanbul ignore next: nodejs server prevent invalid response headers, we can't test this through normal request
                                                reject(err);
                                            }
                                        }
                                        break;
                                    case 'follow':
                                        // HTTP-redirect fetch step 2
                                        if (locationURL === null) {
                                            break;
                                        }

                                        // HTTP-redirect fetch step 5
                                        if (request.counter >= request.follow) {
                                            reject(new FetchError(`maximum redirect reached at: ${request.url}`, 'max-redirect'));
                                            finalize();
                                            return;
                                        }

                                        // HTTP-redirect fetch step 6 (counter increment)
                                        // Create a new Request object.
                                        const requestOpts = {
                                            headers: new Headers(request.headers),
                                            follow: request.follow,
                                            counter: request.counter + 1,
                                            agent: request.agent,
                                            compress: request.compress,
                                            method: request.method,
                                            body: request.body,
                                            signal: request.signal,
                                            timeout: request.timeout,
                                            size: request.size
                                        };

                                        if (!isDomainOrSubdomain(request.url, locationURL) || !isSameProtocol(request.url, locationURL)) {
                                            for (const name of ['authorization', 'www-authenticate', 'cookie', 'cookie2']) {
                                                requestOpts.headers.delete(name);
                                            }
                                        }

                                        // HTTP-redirect fetch step 9
                                        if (res.statusCode !== 303 && request.body && getTotalBytes(request) === null) {
                                            reject(new FetchError('Cannot follow redirect with body being a readable stream', 'unsupported-redirect'));
                                            finalize();
                                            return;
                                        }

                                        // HTTP-redirect fetch step 11
                                        if (res.statusCode === 303 || (res.statusCode === 301 || res.statusCode === 302) && request.method === 'POST') {
                                            requestOpts.method = 'GET';
                                            requestOpts.body = undefined;
                                            requestOpts.headers.delete('content-length');
                                        }

                                        // HTTP-redirect fetch step 15
                                        resolve(fetch(new Request(locationURL, requestOpts)));
                                        finalize();
                                        return;
                                }
                            }

                            // prepare response
                            res.once('end', function () {
                                if (signal) signal.removeEventListener('abort', abortAndFinalize);
                            });
                            let body = res.pipe(new PassThrough$1());

                            const response_options = {
                                url: request.url,
                                status: res.statusCode,
                                statusText: res.statusMessage,
                                headers: headers,
                                size: request.size,
                                timeout: request.timeout,
                                counter: request.counter
                            };

                            // HTTP-network fetch step 12.1.1.3
                            const codings = headers.get('Content-Encoding');

                            // HTTP-network fetch step 12.1.1.4: handle content codings

                            // in following scenarios we ignore compression support
                            // 1. compression support is disabled
                            // 2. HEAD request
                            // 3. no Content-Encoding header
                            // 4. no content response (204)
                            // 5. content not modified response (304)
                            if (!request.compress || request.method === 'HEAD' || codings === null || res.statusCode === 204 || res.statusCode === 304) {
                                response = new Response(body, response_options);
                                resolve(response);
                                return;
                            }

                            // For Node v6+
                            // Be less strict when decoding compressed responses, since sometimes
                            // servers send slightly invalid responses that are still accepted
                            // by common browsers.
                            // Always using Z_SYNC_FLUSH is what cURL does.
                            const zlibOptions = {
                                flush: zlib.Z_SYNC_FLUSH,
                                finishFlush: zlib.Z_SYNC_FLUSH
                            };

                            // for gzip
                            if (codings == 'gzip' || codings == 'x-gzip') {
                                body = body.pipe(zlib.createGunzip(zlibOptions));
                                response = new Response(body, response_options);
                                resolve(response);
                                return;
                            }

                            // for deflate
                            if (codings == 'deflate' || codings == 'x-deflate') {
                                // handle the infamous raw deflate response from old servers
                                // a hack for old IIS and Apache servers
                                const raw = res.pipe(new PassThrough$1());
                                raw.once('data', function (chunk) {
                                    // see http://stackoverflow.com/questions/37519828
                                    if ((chunk[0] & 0x0F) === 0x08) {
                                        body = body.pipe(zlib.createInflate());
                                    } else {
                                        body = body.pipe(zlib.createInflateRaw());
                                    }
                                    response = new Response(body, response_options);
                                    resolve(response);
                                });
                                raw.on('end', function () {
                                    // some old IIS servers return zero-length OK deflate responses, so 'data' is never emitted.
                                    if (!response) {
                                        response = new Response(body, response_options);
                                        resolve(response);
                                    }
                                });
                                return;
                            }

                            // for br
                            if (codings == 'br' && typeof zlib.createBrotliDecompress === 'function') {
                                body = body.pipe(zlib.createBrotliDecompress());
                                response = new Response(body, response_options);
                                resolve(response);
                                return;
                            }

                            // otherwise, use response as-is
                            response = new Response(body, response_options);
                            resolve(response);
                        });

                        writeToStream(req, request);
                    });
                }
                function fixResponseChunkedTransferBadEnding(request, errorCallback) {
                    let socket;

                    request.on('socket', function (s) {
                        socket = s;
                    });

                    request.on('response', function (response) {
                        const headers = response.headers;

                        if (headers['transfer-encoding'] === 'chunked' && !headers['content-length']) {
                            response.once('close', function (hadError) {
                                // if a data listener is still present we didn't end cleanly
                                const hasDataListener = socket.listenerCount('data') > 0;

                                if (hasDataListener && !hadError) {
                                    const err = new Error('Premature close');
                                    err.code = 'ERR_STREAM_PREMATURE_CLOSE';
                                    errorCallback(err);
                                }
                            });
                        }
                    });
                }

                function destroyStream(stream, err) {
                    if (stream.destroy) {
                        stream.destroy(err);
                    } else {
                        // node < 8
                        stream.emit('error', err);
                        stream.end();
                    }
                }

                /**
                 * Redirect code matching
                 *
                 * @param   Number   code  Status code
                 * @return  Boolean
                 */
                fetch.isRedirect = function (code) {
                    return code === 301 || code === 302 || code === 303 || code === 307 || code === 308;
                };

// expose Promise
                fetch.Promise = global.Promise;

                module.exports = exports = fetch;
                Object.defineProperty(exports, "__esModule", { value: true });
                exports.default = exports;
                exports.Headers = Headers;
                exports.Request = Request;
                exports.Response = Response;
                exports.FetchError = FetchError;


                /***/ }),

            /***/ 456:
            /***/ (function(__unusedmodule, exports) {

                "use strict";


                Object.defineProperty(exports, "__esModule", {
                    value: true
                });
                exports.default = void 0;
                var _default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
                exports.default = _default;

                /***/ }),

            /***/ 457:
            /***/ (function(module, __unusedexports, __webpack_require__) {

                "use strict";

                const path = __webpack_require__(622);
                const pathExists = __webpack_require__(294);
                const pLocate = __webpack_require__(767);

                module.exports = (iterable, opts) => {
                    opts = Object.assign({
                        cwd: process.cwd()
                    }, opts);

                    return pLocate(iterable, el => pathExists(path.resolve(opts.cwd, el)), opts);
                };

                module.exports.sync = (iterable, opts) => {
                    opts = Object.assign({
                        cwd: process.cwd()
                    }, opts);

                    for (const el of iterable) {
                        if (pathExists.sync(path.resolve(opts.cwd, el))) {
                            return el;
                        }
                    }
                };


                /***/ }),

            /***/ 461:
            /***/ (function(__unusedmodule, exports, __webpack_require__) {

                "use strict";

                var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
                    if (k2 === undefined) k2 = k;
                    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
                }) : (function(o, m, k, k2) {
                    if (k2 === undefined) k2 = k;
                    o[k2] = m[k];
                }));
                var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
                    Object.defineProperty(o, "default", { enumerable: true, value: v });
                }) : function(o, v) {
                    o["default"] = v;
                });
                var __importStar = (this && this.__importStar) || function (mod) {
                    if (mod && mod.__esModule) return mod;
                    var result = {};
                    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
                    __setModuleDefault(result, mod);
                    return result;
                };
                var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
                    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
                    return new (P || (P = Promise))(function (resolve, reject) {
                        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
                        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
                        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
                        step((generator = generator.apply(thisArg, _arguments || [])).next());
                    });
                };
                var __generator = (this && this.__generator) || function (thisArg, body) {
                    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
                    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
                    function verb(n) { return function (v) { return step([n, v]); }; }
                    function step(op) {
                        if (f) throw new TypeError("Generator is already executing.");
                        while (_) try {
                            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                            if (y = 0, t) op = [op[0] & 2, t.value];
                            switch (op[0]) {
                                case 0: case 1: t = op; break;
                                case 4: _.label++; return { value: op[1], done: false };
                                case 5: _.label++; y = op[1]; op = [0]; continue;
                                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                                default:
                                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                                    if (t[2]) _.ops.pop();
                                    _.trys.pop(); continue;
                            }
                            op = body.call(thisArg, _);
                        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
                        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
                    }
                };
                var __importDefault = (this && this.__importDefault) || function (mod) {
                    return (mod && mod.__esModule) ? mod : { "default": mod };
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                exports.Toolkit = void 0;
                var core = __importStar(__webpack_require__(470));
                var exec = __importStar(__webpack_require__(986));
                var fs_1 = __importDefault(__webpack_require__(747));
                var minimist_1 = __importDefault(__webpack_require__(109));
                var path_1 = __importDefault(__webpack_require__(622));
                var signale_1 = __webpack_require__(759);
                var rest_1 = __webpack_require__(889);
                var context_1 = __webpack_require__(575);
                var exit_1 = __webpack_require__(160);
                var get_body_1 = __webpack_require__(25);
                var inputs_1 = __webpack_require__(861);
                var outputs_1 = __webpack_require__(300);
                var Toolkit = /** @class */ (function () {
                    function Toolkit(opts) {
                        if (opts === void 0) { opts = {}; }
                        this.opts = opts;
                        // Create the logging instance
                        this.log = this.wrapLogger(opts.logger || new signale_1.Signale({ config: { underlineLabel: false } }));
                        // Print a console warning for missing environment variables
                        this.warnForMissingEnvVars();
                        // Memoize environment variables and arguments
                        this.workspace = process.env.GITHUB_WORKSPACE;
                        // Memoize our Proxy instance
                        this.inputs = inputs_1.createInputProxy();
                        this.outputs = outputs_1.createOutputProxy();
                        // Memoize the GitHub API token
                        this.token = opts.token || this.inputs.github_token || process.env.GITHUB_TOKEN;
                        // Directly expose some other libraries
                        this.exec = exec.exec.bind(this);
                        // Setup nested objects
                        this.exit = new exit_1.Exit(this.log);
                        this.context = new context_1.Context();
                        this.github = new rest_1.Octokit({ auth: "token " + this.token });
                        // Check stuff
                        this.checkAllowedEvents(this.opts.event);
                        this.checkRequiredSecrets(this.opts.secrets);
                    }
                    /**
                     * Run an asynchronous function that accepts a toolkit as its argument, and fail if
                     * an error occurs.
                     *
                     * @param func - Async function to run
                     * @param [opts] - Options to pass to the toolkit
                     *
                     * @example This is generally used to run a `main` async function:
                     *
                     * ```js
                     * Toolkit.run(async tools => {
                     *   // Action code here.
                     * }, { event: 'push' })
                     * ```
                     */
                    Toolkit.run = function (func, opts) {
                        return __awaiter(this, void 0, void 0, function () {
                            var tools, ret, _a, err_1;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        tools = new Toolkit(opts);
                                        _b.label = 1;
                                    case 1:
                                        _b.trys.push([1, 5, , 6]);
                                        ret = func(tools);
                                        if (!(ret instanceof Promise)) return [3 /*break*/, 3];
                                        return [4 /*yield*/, ret];
                                    case 2:
                                        _a = _b.sent();
                                        return [3 /*break*/, 4];
                                    case 3:
                                        _a = ret;
                                        _b.label = 4;
                                    case 4:
                                        // If the return value of the provided function is an unresolved Promise
                                        // await that Promise before return the value, otherwise return as normal
                                        return [2 /*return*/, _a];
                                    case 5:
                                        err_1 = _b.sent();
                                        core.setFailed(err_1.message);
                                        tools.exit.failure(err_1);
                                        return [3 /*break*/, 6];
                                    case 6: return [2 /*return*/];
                                }
                            });
                        });
                    };
                    /**
                     * Gets the contents of a file in your project's workspace
                     *
                     * ```js
                     * const myFile = tools.readFile('README.md')
                     * ```
                     *
                     * @param filename - Name of the file
                     * @param encoding - Encoding (usually utf8)
                     */
                    Toolkit.prototype.readFile = function (filename, encoding) {
                        if (encoding === void 0) { encoding = 'utf8'; }
                        return __awaiter(this, void 0, void 0, function () {
                            var pathToFile;
                            return __generator(this, function (_a) {
                                pathToFile = path_1.default.join(this.workspace, filename);
                                if (!fs_1.default.existsSync(pathToFile)) {
                                    throw new Error("File " + filename + " could not be found in your project's workspace. You may need the actions/checkout action to clone the repository first.");
                                }
                                return [2 /*return*/, fs_1.default.promises.readFile(pathToFile, encoding)];
                            });
                        });
                    };
                    /**
                     * Get the package.json file in the project root
                     *
                     * ```js
                     * const pkg = toolkit.getPackageJSON()
                     * ```
                     */
                    Toolkit.prototype.getPackageJSON = function () {
                        var pathToPackage = path_1.default.join(this.workspace, 'package.json');
                        if (!fs_1.default.existsSync(pathToPackage))
                            throw new Error('package.json could not be found in your project\'s root.');
                        return require(pathToPackage);
                    };
                    /**
                     * Run the handler when someone triggers the `/command` in a comment body.
                     *
                     * @param command - Command to listen for
                     * @param handler - Handler to run when the command is used
                     */
                    Toolkit.prototype.command = function (command, handler) {
                        return __awaiter(this, void 0, void 0, function () {
                            var reg, body, match;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        // Don't trigger for bots
                                        if (this.context.payload.sender && this.context.payload.sender.type === 'Bot') {
                                            return [2 /*return*/];
                                        }
                                        this.checkAllowedEvents([
                                            'pull_request',
                                            'issues',
                                            'issue_comment',
                                            'commit_comment',
                                            'pull_request_review',
                                            'pull_request_review_comment'
                                        ]);
                                        reg = new RegExp("^/" + command + "(?:$|\\s(.*))", 'gm');
                                        body = get_body_1.getBody(this.context.payload);
                                        if (!body)
                                            return [2 /*return*/];
                                        _a.label = 1;
                                    case 1:
                                        if (!(match = reg.exec(body))) return [3 /*break*/, 6];
                                        if (!match[1]) return [3 /*break*/, 3];
                                        return [4 /*yield*/, handler(minimist_1.default(match[1].split(' ')), match)];
                                    case 2:
                                        _a.sent();
                                        return [3 /*break*/, 5];
                                    case 3: return [4 /*yield*/, handler({}, match)];
                                    case 4:
                                        _a.sent();
                                        _a.label = 5;
                                    case 5: return [3 /*break*/, 1];
                                    case 6: return [2 /*return*/];
                                }
                            });
                        });
                    };
                    /**
                     * Returns true if this event is allowed
                     */
                    Toolkit.prototype.eventIsAllowed = function (event) {
                        var _a = event.split('.'), eventName = _a[0], action = _a[1];
                        if (action) {
                            return eventName === this.context.event && this.context.payload.action === action;
                        }
                        return eventName === this.context.event;
                    };
                    Toolkit.prototype.checkAllowedEvents = function (event) {
                        var _this = this;
                        if (!event)
                            return;
                        var passed = Array.isArray(event)
                            ? event.some(function (e) { return _this.eventIsAllowed(e); })
                            : this.eventIsAllowed(event);
                        if (!passed) {
                            var actionStr = this.context.payload.action ? "." + this.context.payload.action : '';
                            this.log.error("Event `" + this.context.event + actionStr + "` is not supported by this action.");
                            this.exit.neutral();
                        }
                    };
                    /**
                     * Wrap a Signale logger so that its a callable class
                     */
                    Toolkit.prototype.wrapLogger = function (logger) {
                        // Create a callable function
                        var fn = logger.info.bind(logger);
                        // Add the log methods onto the function
                        var wrapped = Object.assign(fn, logger);
                        // Clone the prototype
                        Object.setPrototypeOf(wrapped, logger);
                        return wrapped;
                    };
                    /**
                     * Log warnings to the console for missing environment variables
                     */
                    Toolkit.prototype.warnForMissingEnvVars = function () {
                        var requiredEnvVars = [
                            'HOME',
                            'GITHUB_WORKFLOW',
                            'GITHUB_ACTION',
                            'GITHUB_ACTOR',
                            'GITHUB_REPOSITORY',
                            'GITHUB_EVENT_NAME',
                            'GITHUB_EVENT_PATH',
                            'GITHUB_WORKSPACE',
                            'GITHUB_SHA'
                        ];
                        var requiredButMissing = requiredEnvVars.filter(function (key) { return !Object.prototype.hasOwnProperty.call(process.env, key); });
                        if (requiredButMissing.length > 0) {
                            // This isn't being run inside of a GitHub Action environment!
                            var list = requiredButMissing.map(function (key) { return "- " + key; }).join('\n');
                            var warning = "There are environment variables missing from this runtime, but would be present on GitHub.\n" + list;
                            this.log.warn(warning);
                        }
                    };
                    /**
                     * The Action should fail if there are secrets it needs but does not have
                     */
                    Toolkit.prototype.checkRequiredSecrets = function (secrets) {
                        if (!secrets || secrets.length === 0)
                            return;
                        // Filter missing but required secrets
                        var requiredButMissing = secrets.filter(function (key) { return !Object.prototype.hasOwnProperty.call(process.env, key); });
                        // Everything we need is here
                        if (requiredButMissing.length === 0)
                            return;
                        // Exit with a failing status
                        var list = requiredButMissing.map(function (key) { return "- " + key; }).join('\n');
                        this.exit.failure("The following secrets are required for this GitHub Action to run:\n" + list);
                    };
                    return Toolkit;
                }());
                exports.Toolkit = Toolkit;
//# sourceMappingURL=index.js.map

                /***/ }),

            /***/ 462:
            /***/ (function(module) {

                "use strict";


// See http://www.robvanderwoude.com/escapechars.php
                const metaCharsRegExp = /([()\][%!^"`<>&|;, *?])/g;

                function escapeCommand(arg) {
                    // Escape meta chars
                    arg = arg.replace(metaCharsRegExp, '^$1');

                    return arg;
                }

                function escapeArgument(arg, doubleEscapeMetaChars) {
                    // Convert to string
                    arg = `${arg}`;

                    // Algorithm below is based on https://qntm.org/cmd

                    // Sequence of backslashes followed by a double quote:
                    // double up all the backslashes and escape the double quote
                    arg = arg.replace(/(\\*)"/g, '$1$1\\"');

                    // Sequence of backslashes followed by the end of the string
                    // (which will become a double quote later):
                    // double up all the backslashes
                    arg = arg.replace(/(\\*)$/, '$1$1');

                    // All other backslashes occur literally

                    // Quote the whole thing:
                    arg = `"${arg}"`;

                    // Escape meta chars
                    arg = arg.replace(metaCharsRegExp, '^$1');

                    // Double escape meta chars if necessary
                    if (doubleEscapeMetaChars) {
                        arg = arg.replace(metaCharsRegExp, '^$1');
                    }

                    return arg;
                }

                module.exports.command = escapeCommand;
                module.exports.argument = escapeArgument;


                /***/ }),

            /***/ 470:
            /***/ (function(__unusedmodule, exports, __webpack_require__) {

                "use strict";

                var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
                    if (k2 === undefined) k2 = k;
                    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
                }) : (function(o, m, k, k2) {
                    if (k2 === undefined) k2 = k;
                    o[k2] = m[k];
                }));
                var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
                    Object.defineProperty(o, "default", { enumerable: true, value: v });
                }) : function(o, v) {
                    o["default"] = v;
                });
                var __importStar = (this && this.__importStar) || function (mod) {
                    if (mod && mod.__esModule) return mod;
                    var result = {};
                    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
                    __setModuleDefault(result, mod);
                    return result;
                };
                var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
                    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
                    return new (P || (P = Promise))(function (resolve, reject) {
                        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
                        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
                        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
                        step((generator = generator.apply(thisArg, _arguments || [])).next());
                    });
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                exports.getIDToken = exports.getState = exports.saveState = exports.group = exports.endGroup = exports.startGroup = exports.info = exports.notice = exports.warning = exports.error = exports.debug = exports.isDebug = exports.setFailed = exports.setCommandEcho = exports.setOutput = exports.getBooleanInput = exports.getMultilineInput = exports.getInput = exports.addPath = exports.setSecret = exports.exportVariable = exports.ExitCode = void 0;
                const command_1 = __webpack_require__(431);
                const file_command_1 = __webpack_require__(102);
                const utils_1 = __webpack_require__(82);
                const os = __importStar(__webpack_require__(87));
                const path = __importStar(__webpack_require__(622));
                const oidc_utils_1 = __webpack_require__(742);
                /**
                 * The code to exit an action
                 */
                var ExitCode;
                (function (ExitCode) {
                    /**
                     * A code indicating that the action was successful
                     */
                    ExitCode[ExitCode["Success"] = 0] = "Success";
                    /**
                     * A code indicating that the action was a failure
                     */
                    ExitCode[ExitCode["Failure"] = 1] = "Failure";
                })(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
                /**
                 * Sets env variable for this action and future actions in the job
                 * @param name the name of the variable to set
                 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
                 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
                function exportVariable(name, val) {
                    const convertedVal = utils_1.toCommandValue(val);
                    process.env[name] = convertedVal;
                    const filePath = process.env['GITHUB_ENV'] || '';
                    if (filePath) {
                        return file_command_1.issueFileCommand('ENV', file_command_1.prepareKeyValueMessage(name, val));
                    }
                    command_1.issueCommand('set-env', { name }, convertedVal);
                }
                exports.exportVariable = exportVariable;
                /**
                 * Registers a secret which will get masked from logs
                 * @param secret value of the secret
                 */
                function setSecret(secret) {
                    command_1.issueCommand('add-mask', {}, secret);
                }
                exports.setSecret = setSecret;
                /**
                 * Prepends inputPath to the PATH (for this action and future actions)
                 * @param inputPath
                 */
                function addPath(inputPath) {
                    const filePath = process.env['GITHUB_PATH'] || '';
                    if (filePath) {
                        file_command_1.issueFileCommand('PATH', inputPath);
                    }
                    else {
                        command_1.issueCommand('add-path', {}, inputPath);
                    }
                    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
                }
                exports.addPath = addPath;
                /**
                 * Gets the value of an input.
                 * Unless trimWhitespace is set to false in InputOptions, the value is also trimmed.
                 * Returns an empty string if the value is not defined.
                 *
                 * @param     name     name of the input to get
                 * @param     options  optional. See InputOptions.
                 * @returns   string
                 */
                function getInput(name, options) {
                    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
                    if (options && options.required && !val) {
                        throw new Error(`Input required and not supplied: ${name}`);
                    }
                    if (options && options.trimWhitespace === false) {
                        return val;
                    }
                    return val.trim();
                }
                exports.getInput = getInput;
                /**
                 * Gets the values of an multiline input.  Each value is also trimmed.
                 *
                 * @param     name     name of the input to get
                 * @param     options  optional. See InputOptions.
                 * @returns   string[]
                 *
                 */
                function getMultilineInput(name, options) {
                    const inputs = getInput(name, options)
                        .split('\n')
                        .filter(x => x !== '');
                    if (options && options.trimWhitespace === false) {
                        return inputs;
                    }
                    return inputs.map(input => input.trim());
                }
                exports.getMultilineInput = getMultilineInput;
                /**
                 * Gets the input value of the boolean type in the YAML 1.2 "core schema" specification.
                 * Support boolean input list: `true | True | TRUE | false | False | FALSE` .
                 * The return value is also in boolean type.
                 * ref: https://yaml.org/spec/1.2/spec.html#id2804923
                 *
                 * @param     name     name of the input to get
                 * @param     options  optional. See InputOptions.
                 * @returns   boolean
                 */
                function getBooleanInput(name, options) {
                    const trueValue = ['true', 'True', 'TRUE'];
                    const falseValue = ['false', 'False', 'FALSE'];
                    const val = getInput(name, options);
                    if (trueValue.includes(val))
                        return true;
                    if (falseValue.includes(val))
                        return false;
                    throw new TypeError(`Input does not meet YAML 1.2 "Core Schema" specification: ${name}\n` +
                        `Support boolean input list: \`true | True | TRUE | false | False | FALSE\``);
                }
                exports.getBooleanInput = getBooleanInput;
                /**
                 * Sets the value of an output.
                 *
                 * @param     name     name of the output to set
                 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
                 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
                function setOutput(name, value) {
                    const filePath = process.env['GITHUB_OUTPUT'] || '';
                    if (filePath) {
                        return file_command_1.issueFileCommand('OUTPUT', file_command_1.prepareKeyValueMessage(name, value));
                    }
                    process.stdout.write(os.EOL);
                    command_1.issueCommand('set-output', { name }, utils_1.toCommandValue(value));
                }
                exports.setOutput = setOutput;
                /**
                 * Enables or disables the echoing of commands into stdout for the rest of the step.
                 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
                 *
                 */
                function setCommandEcho(enabled) {
                    command_1.issue('echo', enabled ? 'on' : 'off');
                }
                exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
                /**
                 * Sets the action status to failed.
                 * When the action exits it will be with an exit code of 1
                 * @param message add error issue message
                 */
                function setFailed(message) {
                    process.exitCode = ExitCode.Failure;
                    error(message);
                }
                exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
                /**
                 * Gets whether Actions Step Debug is on or not
                 */
                function isDebug() {
                    return process.env['RUNNER_DEBUG'] === '1';
                }
                exports.isDebug = isDebug;
                /**
                 * Writes debug message to user log
                 * @param message debug message
                 */
                function debug(message) {
                    command_1.issueCommand('debug', {}, message);
                }
                exports.debug = debug;
                /**
                 * Adds an error issue
                 * @param message error issue message. Errors will be converted to string via toString()
                 * @param properties optional properties to add to the annotation.
                 */
                function error(message, properties = {}) {
                    command_1.issueCommand('error', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
                }
                exports.error = error;
                /**
                 * Adds a warning issue
                 * @param message warning issue message. Errors will be converted to string via toString()
                 * @param properties optional properties to add to the annotation.
                 */
                function warning(message, properties = {}) {
                    command_1.issueCommand('warning', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
                }
                exports.warning = warning;
                /**
                 * Adds a notice issue
                 * @param message notice issue message. Errors will be converted to string via toString()
                 * @param properties optional properties to add to the annotation.
                 */
                function notice(message, properties = {}) {
                    command_1.issueCommand('notice', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
                }
                exports.notice = notice;
                /**
                 * Writes info to log with console.log.
                 * @param message info message
                 */
                function info(message) {
                    process.stdout.write(message + os.EOL);
                }
                exports.info = info;
                /**
                 * Begin an output group.
                 *
                 * Output until the next `groupEnd` will be foldable in this group
                 *
                 * @param name The name of the output group
                 */
                function startGroup(name) {
                    command_1.issue('group', name);
                }
                exports.startGroup = startGroup;
                /**
                 * End an output group.
                 */
                function endGroup() {
                    command_1.issue('endgroup');
                }
                exports.endGroup = endGroup;
                /**
                 * Wrap an asynchronous function call in a group.
                 *
                 * Returns the same type as the function itself.
                 *
                 * @param name The name of the group
                 * @param fn The function to wrap in the group
                 */
                function group(name, fn) {
                    return __awaiter(this, void 0, void 0, function* () {
                        startGroup(name);
                        let result;
                        try {
                            result = yield fn();
                        }
                        finally {
                            endGroup();
                        }
                        return result;
                    });
                }
                exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
                /**
                 * Saves state for current action, the state can only be retrieved by this action's post job execution.
                 *
                 * @param     name     name of the state to store
                 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
                 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
                function saveState(name, value) {
                    const filePath = process.env['GITHUB_STATE'] || '';
                    if (filePath) {
                        return file_command_1.issueFileCommand('STATE', file_command_1.prepareKeyValueMessage(name, value));
                    }
                    command_1.issueCommand('save-state', { name }, utils_1.toCommandValue(value));
                }
                exports.saveState = saveState;
                /**
                 * Gets the value of an state set by this action's main execution.
                 *
                 * @param     name     name of the state to get
                 * @returns   string
                 */
                function getState(name) {
                    return process.env[`STATE_${name}`] || '';
                }
                exports.getState = getState;
                function getIDToken(aud) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return yield oidc_utils_1.OidcClient.getIDToken(aud);
                    });
                }
                exports.getIDToken = getIDToken;
                /**
                 * Summary exports
                 */
                var summary_1 = __webpack_require__(665);
                Object.defineProperty(exports, "summary", { enumerable: true, get: function () { return summary_1.summary; } });
                /**
                 * @deprecated use core.summary
                 */
                var summary_2 = __webpack_require__(665);
                Object.defineProperty(exports, "markdownSummary", { enumerable: true, get: function () { return summary_2.markdownSummary; } });
                /**
                 * Path exports
                 */
                var path_utils_1 = __webpack_require__(573);
                Object.defineProperty(exports, "toPosixPath", { enumerable: true, get: function () { return path_utils_1.toPosixPath; } });
                Object.defineProperty(exports, "toWin32Path", { enumerable: true, get: function () { return path_utils_1.toWin32Path; } });
                Object.defineProperty(exports, "toPlatformPath", { enumerable: true, get: function () { return path_utils_1.toPlatformPath; } });
//# sourceMappingURL=core.js.map

                /***/ }),

            /***/ 489:
            /***/ (function(module, __unusedexports, __webpack_require__) {

                "use strict";


                const path = __webpack_require__(622);
                const which = __webpack_require__(814);
                const pathKey = __webpack_require__(39)();

                function resolveCommandAttempt(parsed, withoutPathExt) {
                    const cwd = process.cwd();
                    const hasCustomCwd = parsed.options.cwd != null;

                    // If a custom `cwd` was specified, we need to change the process cwd
                    // because `which` will do stat calls but does not support a custom cwd
                    if (hasCustomCwd) {
                        try {
                            process.chdir(parsed.options.cwd);
                        } catch (err) {
                            /* Empty */
                        }
                    }

                    let resolved;

                    try {
                        resolved = which.sync(parsed.command, {
                            path: (parsed.options.env || process.env)[pathKey],
                            pathExt: withoutPathExt ? path.delimiter : undefined,
                        });
                    } catch (e) {
                        /* Empty */
                    } finally {
                        process.chdir(cwd);
                    }

                    // If we successfully resolved, ensure that an absolute path is returned
                    // Note that when a custom `cwd` was used, we need to resolve to an absolute path based on it
                    if (resolved) {
                        resolved = path.resolve(hasCustomCwd ? parsed.options.cwd : '', resolved);
                    }

                    return resolved;
                }

                function resolveCommand(parsed) {
                    return resolveCommandAttempt(parsed) || resolveCommandAttempt(parsed, true);
                }

                module.exports = resolveCommand;


                /***/ }),

            /***/ 497:
            /***/ (function(module, __unusedexports, __webpack_require__) {

// Note: since nyc uses this module to output coverage, any lines
// that are in the direct sync flow of nyc's outputCoverage are
// ignored, since we can never get coverage for them.
// grab a reference to node's real process object right away
                var process = global.process

                const processOk = function (process) {
                    return process &&
                        typeof process === 'object' &&
                        typeof process.removeListener === 'function' &&
                        typeof process.emit === 'function' &&
                        typeof process.reallyExit === 'function' &&
                        typeof process.listeners === 'function' &&
                        typeof process.kill === 'function' &&
                        typeof process.pid === 'number' &&
                        typeof process.on === 'function'
                }

// some kind of non-node environment, just no-op
                /* istanbul ignore if */
                if (!processOk(process)) {
                    module.exports = function () {
                        return function () {}
                    }
                } else {
                    var assert = __webpack_require__(357)
                    var signals = __webpack_require__(654)
                    var isWin = /^win/i.test(process.platform)

                    var EE = __webpack_require__(614)
                    /* istanbul ignore if */
                    if (typeof EE !== 'function') {
                        EE = EE.EventEmitter
                    }

                    var emitter
                    if (process.__signal_exit_emitter__) {
                        emitter = process.__signal_exit_emitter__
                    } else {
                        emitter = process.__signal_exit_emitter__ = new EE()
                        emitter.count = 0
                        emitter.emitted = {}
                    }

                    // Because this emitter is a global, we have to check to see if a
                    // previous version of this library failed to enable infinite listeners.
                    // I know what you're about to say.  But literally everything about
                    // signal-exit is a compromise with evil.  Get used to it.
                    if (!emitter.infinite) {
                        emitter.setMaxListeners(Infinity)
                        emitter.infinite = true
                    }

                    module.exports = function (cb, opts) {
                        /* istanbul ignore if */
                        if (!processOk(global.process)) {
                            return function () {}
                        }
                        assert.equal(typeof cb, 'function', 'a callback must be provided for exit handler')

                        if (loaded === false) {
                            load()
                        }

                        var ev = 'exit'
                        if (opts && opts.alwaysLast) {
                            ev = 'afterexit'
                        }

                        var remove = function () {
                            emitter.removeListener(ev, cb)
                            if (emitter.listeners('exit').length === 0 &&
                                emitter.listeners('afterexit').length === 0) {
                                unload()
                            }
                        }
                        emitter.on(ev, cb)

                        return remove
                    }

                    var unload = function unload () {
                        if (!loaded || !processOk(global.process)) {
                            return
                        }
                        loaded = false

                        signals.forEach(function (sig) {
                            try {
                                process.removeListener(sig, sigListeners[sig])
                            } catch (er) {}
                        })
                        process.emit = originalProcessEmit
                        process.reallyExit = originalProcessReallyExit
                        emitter.count -= 1
                    }
                    module.exports.unload = unload

                    var emit = function emit (event, code, signal) {
                        /* istanbul ignore if */
                        if (emitter.emitted[event]) {
                            return
                        }
                        emitter.emitted[event] = true
                        emitter.emit(event, code, signal)
                    }

                    // { <signal>: <listener fn>, ... }
                    var sigListeners = {}
                    signals.forEach(function (sig) {
                        sigListeners[sig] = function listener () {
                            /* istanbul ignore if */
                            if (!processOk(global.process)) {
                                return
                            }
                            // If there are no other listeners, an exit is coming!
                            // Simplest way: remove us and then re-send the signal.
                            // We know that this will kill the process, so we can
                            // safely emit now.
                            var listeners = process.listeners(sig)
                            if (listeners.length === emitter.count) {
                                unload()
                                emit('exit', null, sig)
                                /* istanbul ignore next */
                                emit('afterexit', null, sig)
                                /* istanbul ignore next */
                                if (isWin && sig === 'SIGHUP') {
                                    // "SIGHUP" throws an `ENOSYS` error on Windows,
                                    // so use a supported signal instead
                                    sig = 'SIGINT'
                                }
                                /* istanbul ignore next */
                                process.kill(process.pid, sig)
                            }
                        }
                    })

                    module.exports.signals = function () {
                        return signals
                    }

                    var loaded = false

                    var load = function load () {
                        if (loaded || !processOk(global.process)) {
                            return
                        }
                        loaded = true

                        // This is the number of onSignalExit's that are in play.
                        // It's important so that we can count the correct number of
                        // listeners on signals, and don't wait for the other one to
                        // handle it instead of us.
                        emitter.count += 1

                        signals = signals.filter(function (sig) {
                            try {
                                process.on(sig, sigListeners[sig])
                                return true
                            } catch (er) {
                                return false
                            }
                        })

                        process.emit = processEmit
                        process.reallyExit = processReallyExit
                    }
                    module.exports.load = load

                    var originalProcessReallyExit = process.reallyExit
                    var processReallyExit = function processReallyExit (code) {
                        /* istanbul ignore if */
                        if (!processOk(global.process)) {
                            return
                        }
                        process.exitCode = code || /* istanbul ignore next */ 0
                        emit('exit', process.exitCode, null)
                        /* istanbul ignore next */
                        emit('afterexit', process.exitCode, null)
                        /* istanbul ignore next */
                        originalProcessReallyExit.call(process, process.exitCode)
                    }

                    var originalProcessEmit = process.emit
                    var processEmit = function processEmit (ev, arg) {
                        if (ev === 'exit' && processOk(global.process)) {
                            /* istanbul ignore else */
                            if (arg !== undefined) {
                                process.exitCode = arg
                            }
                            var ret = originalProcessEmit.apply(this, arguments)
                            /* istanbul ignore next */
                            emit('exit', process.exitCode, null)
                            /* istanbul ignore next */
                            emit('afterexit', process.exitCode, null)
                            /* istanbul ignore next */
                            return ret
                        } else {
                            return originalProcessEmit.apply(this, arguments)
                        }
                    }
                }


                /***/ }),

            /***/ 498:
            /***/ (function(__unusedmodule, exports, __webpack_require__) {

                "use strict";


                Object.defineProperty(exports, "__esModule", {
                    value: true
                });
                exports.default = void 0;

                var _crypto = _interopRequireDefault(__webpack_require__(417));

                function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

                function sha1(bytes) {
                    if (Array.isArray(bytes)) {
                        bytes = Buffer.from(bytes);
                    } else if (typeof bytes === 'string') {
                        bytes = Buffer.from(bytes, 'utf8');
                    }

                    return _crypto.default.createHash('sha1').update(bytes).digest();
                }

                var _default = sha1;
                exports.default = _default;

                /***/ }),

            /***/ 500:
            /***/ (function(module, __unusedexports, __webpack_require__) {

                var register = __webpack_require__(363);
                var addHook = __webpack_require__(510);
                var removeHook = __webpack_require__(763);

// bind with array of arguments: https://stackoverflow.com/a/21792913
                var bind = Function.bind;
                var bindable = bind.bind(bind);

                function bindApi(hook, state, name) {
                    var removeHookRef = bindable(removeHook, null).apply(
                        null,
                        name ? [state, name] : [state]
                    );
                    hook.api = { remove: removeHookRef };
                    hook.remove = removeHookRef;
                    ["before", "error", "after", "wrap"].forEach(function (kind) {
                        var args = name ? [state, kind, name] : [state, kind];
                        hook[kind] = hook.api[kind] = bindable(addHook, null).apply(null, args);
                    });
                }

                function HookSingular() {
                    var singularHookName = "h";
                    var singularHookState = {
                        registry: {},
                    };
                    var singularHook = register.bind(null, singularHookState, singularHookName);
                    bindApi(singularHook, singularHookState, singularHookName);
                    return singularHook;
                }

                function HookCollection() {
                    var state = {
                        registry: {},
                    };

                    var hook = register.bind(null, state);
                    bindApi(hook, state);

                    return hook;
                }

                var collectionHookDeprecationMessageDisplayed = false;
                function Hook() {
                    if (!collectionHookDeprecationMessageDisplayed) {
                        console.warn(
                            '[before-after-hook]: "Hook()" repurposing warning, use "Hook.Collection()". Read more: https://git.io/upgrade-before-after-hook-to-1.4'
                        );
                        collectionHookDeprecationMessageDisplayed = true;
                    }
                    return HookCollection();
                }

                Hook.Singular = HookSingular.bind();
                Hook.Collection = HookCollection.bind();

                module.exports = Hook;
// expose constructors as a named property for TypeScript
                module.exports.Hook = Hook;
                module.exports.Singular = Hook.Singular;
                module.exports.Collection = Hook.Collection;


                /***/ }),

            /***/ 510:
            /***/ (function(module) {

                module.exports = addHook;

                function addHook(state, kind, name, hook) {
                    var orig = hook;
                    if (!state.registry[name]) {
                        state.registry[name] = [];
                    }

                    if (kind === "before") {
                        hook = function (method, options) {
                            return Promise.resolve()
                                .then(orig.bind(null, options))
                                .then(method.bind(null, options));
                        };
                    }

                    if (kind === "after") {
                        hook = function (method, options) {
                            var result;
                            return Promise.resolve()
                                .then(method.bind(null, options))
                                .then(function (result_) {
                                    result = result_;
                                    return orig(result, options);
                                })
                                .then(function () {
                                    return result;
                                });
                        };
                    }

                    if (kind === "error") {
                        hook = function (method, options) {
                            return Promise.resolve()
                                .then(method.bind(null, options))
                                .catch(function (error) {
                                    return orig(error, options);
                                });
                        };
                    }

                    state.registry[name].push({
                        hook: hook,
                        orig: orig,
                    });
                }


                /***/ }),

            /***/ 512:
            /***/ (function(module, __unusedexports, __webpack_require__) {

                "use strict";

                const path = __webpack_require__(622);
                const pathKey = __webpack_require__(39);

                module.exports = opts => {
                    opts = Object.assign({
                        cwd: process.cwd(),
                        path: process.env[pathKey()]
                    }, opts);

                    let prev;
                    let pth = path.resolve(opts.cwd);
                    const ret = [];

                    while (prev !== pth) {
                        ret.push(path.join(pth, 'node_modules/.bin'));
                        prev = pth;
                        pth = path.resolve(pth, '..');
                    }

                    // ensure the running `node` binary is used
                    ret.push(path.dirname(process.execPath));

                    return ret.concat(opts.path).join(path.delimiter);
                };

                module.exports.env = opts => {
                    opts = Object.assign({
                        env: process.env
                    }, opts);

                    const env = Object.assign({}, opts.env);
                    const path = pathKey({env});

                    opts.path = env[path];
                    env[path] = module.exports(opts);

                    return env;
                };


                /***/ }),

            /***/ 523:
            /***/ (function(module, __unusedexports, __webpack_require__) {

                "use strict";

                const pTry = __webpack_require__(72);

                module.exports = concurrency => {
                    if (concurrency < 1) {
                        throw new TypeError('Expected `concurrency` to be a number from 1 and up');
                    }

                    const queue = [];
                    let activeCount = 0;

                    const next = () => {
                        activeCount--;

                        if (queue.length > 0) {
                            queue.shift()();
                        }
                    };

                    return fn => new Promise((resolve, reject) => {
                        const run = () => {
                            activeCount++;

                            pTry(fn).then(
                                val => {
                                    resolve(val);
                                    next();
                                },
                                err => {
                                    reject(err);
                                    next();
                                }
                            );
                        };

                        if (activeCount < concurrency) {
                            run();
                        } else {
                            queue.push(run);
                        }
                    });
                };


                /***/ }),

            /***/ 528:
            /***/ (function(module) {

                "use strict";

                module.exports = x => {
                    if (typeof x !== 'string') {
                        throw new TypeError('Expected a string, got ' + typeof x);
                    }

                    // Catches EFBBBF (UTF-8 BOM) because the buffer-to-string
                    // conversion translates it to FEFF (UTF-16 BOM)
                    if (x.charCodeAt(0) === 0xFEFF) {
                        return x.slice(1);
                    }

                    return x;
                };


                /***/ }),

            /***/ 530:
            /***/ (function(module, __unusedexports, __webpack_require__) {

                "use strict";


                var punycode = __webpack_require__(815);
                var mappingTable = __webpack_require__(967);

                var PROCESSING_OPTIONS = {
                    TRANSITIONAL: 0,
                    NONTRANSITIONAL: 1
                };

                function normalize(str) { // fix bug in v8
                    return str.split('\u0000').map(function (s) { return s.normalize('NFC'); }).join('\u0000');
                }

                function findStatus(val) {
                    var start = 0;
                    var end = mappingTable.length - 1;

                    while (start <= end) {
                        var mid = Math.floor((start + end) / 2);

                        var target = mappingTable[mid];
                        if (target[0][0] <= val && target[0][1] >= val) {
                            return target;
                        } else if (target[0][0] > val) {
                            end = mid - 1;
                        } else {
                            start = mid + 1;
                        }
                    }

                    return null;
                }

                var regexAstralSymbols = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;

                function countSymbols(string) {
                    return string
                        // replace every surrogate pair with a BMP symbol
                        .replace(regexAstralSymbols, '_')
                        // then get the length
                        .length;
                }

                function mapChars(domain_name, useSTD3, processing_option) {
                    var hasError = false;
                    var processed = "";

                    var len = countSymbols(domain_name);
                    for (var i = 0; i < len; ++i) {
                        var codePoint = domain_name.codePointAt(i);
                        var status = findStatus(codePoint);

                        switch (status[1]) {
                            case "disallowed":
                                hasError = true;
                                processed += String.fromCodePoint(codePoint);
                                break;
                            case "ignored":
                                break;
                            case "mapped":
                                processed += String.fromCodePoint.apply(String, status[2]);
                                break;
                            case "deviation":
                                if (processing_option === PROCESSING_OPTIONS.TRANSITIONAL) {
                                    processed += String.fromCodePoint.apply(String, status[2]);
                                } else {
                                    processed += String.fromCodePoint(codePoint);
                                }
                                break;
                            case "valid":
                                processed += String.fromCodePoint(codePoint);
                                break;
                            case "disallowed_STD3_mapped":
                                if (useSTD3) {
                                    hasError = true;
                                    processed += String.fromCodePoint(codePoint);
                                } else {
                                    processed += String.fromCodePoint.apply(String, status[2]);
                                }
                                break;
                            case "disallowed_STD3_valid":
                                if (useSTD3) {
                                    hasError = true;
                                }

                                processed += String.fromCodePoint(codePoint);
                                break;
                        }
                    }

                    return {
                        string: processed,
                        error: hasError
                    };
                }

                var combiningMarksRegex = /[\u0300-\u036F\u0483-\u0489\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u08E4-\u0903\u093A-\u093C\u093E-\u094F\u0951-\u0957\u0962\u0963\u0981-\u0983\u09BC\u09BE-\u09C4\u09C7\u09C8\u09CB-\u09CD\u09D7\u09E2\u09E3\u0A01-\u0A03\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81-\u0A83\u0ABC\u0ABE-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AE2\u0AE3\u0B01-\u0B03\u0B3C\u0B3E-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B62\u0B63\u0B82\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD7\u0C00-\u0C03\u0C3E-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C81-\u0C83\u0CBC\u0CBE-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0D01-\u0D03\u0D3E-\u0D44\u0D46-\u0D48\u0D4A-\u0D4D\u0D57\u0D62\u0D63\u0D82\u0D83\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2\u0DF3\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EB9\u0EBB\u0EBC\u0EC8-\u0ECD\u0F18\u0F19\u0F35\u0F37\u0F39\u0F3E\u0F3F\u0F71-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102B-\u103E\u1056-\u1059\u105E-\u1060\u1062-\u1064\u1067-\u106D\u1071-\u1074\u1082-\u108D\u108F\u109A-\u109D\u135D-\u135F\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4-\u17D3\u17DD\u180B-\u180D\u18A9\u1920-\u192B\u1930-\u193B\u19B0-\u19C0\u19C8\u19C9\u1A17-\u1A1B\u1A55-\u1A5E\u1A60-\u1A7C\u1A7F\u1AB0-\u1ABE\u1B00-\u1B04\u1B34-\u1B44\u1B6B-\u1B73\u1B80-\u1B82\u1BA1-\u1BAD\u1BE6-\u1BF3\u1C24-\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE8\u1CED\u1CF2-\u1CF4\u1CF8\u1CF9\u1DC0-\u1DF5\u1DFC-\u1DFF\u20D0-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\uA66F-\uA672\uA674-\uA67D\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA823-\uA827\uA880\uA881\uA8B4-\uA8C4\uA8E0-\uA8F1\uA926-\uA92D\uA947-\uA953\uA980-\uA983\uA9B3-\uA9C0\uA9E5\uAA29-\uAA36\uAA43\uAA4C\uAA4D\uAA7B-\uAA7D\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEB-\uAAEF\uAAF5\uAAF6\uABE3-\uABEA\uABEC\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE2D]|\uD800[\uDDFD\uDEE0\uDF76-\uDF7A]|\uD802[\uDE01-\uDE03\uDE05\uDE06\uDE0C-\uDE0F\uDE38-\uDE3A\uDE3F\uDEE5\uDEE6]|\uD804[\uDC00-\uDC02\uDC38-\uDC46\uDC7F-\uDC82\uDCB0-\uDCBA\uDD00-\uDD02\uDD27-\uDD34\uDD73\uDD80-\uDD82\uDDB3-\uDDC0\uDE2C-\uDE37\uDEDF-\uDEEA\uDF01-\uDF03\uDF3C\uDF3E-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF57\uDF62\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDCB0-\uDCC3\uDDAF-\uDDB5\uDDB8-\uDDC0\uDE30-\uDE40\uDEAB-\uDEB7]|\uD81A[\uDEF0-\uDEF4\uDF30-\uDF36]|\uD81B[\uDF51-\uDF7E\uDF8F-\uDF92]|\uD82F[\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD83A[\uDCD0-\uDCD6]|\uDB40[\uDD00-\uDDEF]/;

                function validateLabel(label, processing_option) {
                    if (label.substr(0, 4) === "xn--") {
                        label = punycode.toUnicode(label);
                        processing_option = PROCESSING_OPTIONS.NONTRANSITIONAL;
                    }

                    var error = false;

                    if (normalize(label) !== label ||
                        (label[3] === "-" && label[4] === "-") ||
                        label[0] === "-" || label[label.length - 1] === "-" ||
                        label.indexOf(".") !== -1 ||
                        label.search(combiningMarksRegex) === 0) {
                        error = true;
                    }

                    var len = countSymbols(label);
                    for (var i = 0; i < len; ++i) {
                        var status = findStatus(label.codePointAt(i));
                        if ((processing === PROCESSING_OPTIONS.TRANSITIONAL && status[1] !== "valid") ||
                            (processing === PROCESSING_OPTIONS.NONTRANSITIONAL &&
                                status[1] !== "valid" && status[1] !== "deviation")) {
                            error = true;
                            break;
                        }
                    }

                    return {
                        label: label,
                        error: error
                    };
                }

                function processing(domain_name, useSTD3, processing_option) {
                    var result = mapChars(domain_name, useSTD3, processing_option);
                    result.string = normalize(result.string);

                    var labels = result.string.split(".");
                    for (var i = 0; i < labels.length; ++i) {
                        try {
                            var validation = validateLabel(labels[i]);
                            labels[i] = validation.label;
                            result.error = result.error || validation.error;
                        } catch(e) {
                            result.error = true;
                        }
                    }

                    return {
                        string: labels.join("."),
                        error: result.error
                    };
                }

                module.exports.toASCII = function(domain_name, useSTD3, processing_option, verifyDnsLength) {
                    var result = processing(domain_name, useSTD3, processing_option);
                    var labels = result.string.split(".");
                    labels = labels.map(function(l) {
                        try {
                            return punycode.toASCII(l);
                        } catch(e) {
                            result.error = true;
                            return l;
                        }
                    });

                    if (verifyDnsLength) {
                        var total = labels.slice(0, labels.length - 1).join(".").length;
                        if (total.length > 253 || total.length === 0) {
                            result.error = true;
                        }

                        for (var i=0; i < labels.length; ++i) {
                            if (labels.length > 63 || labels.length === 0) {
                                result.error = true;
                                break;
                            }
                        }
                    }

                    if (result.error) return null;
                    return labels.join(".");
                };

                module.exports.toUnicode = function(domain_name, useSTD3) {
                    var result = processing(domain_name, useSTD3, PROCESSING_OPTIONS.NONTRANSITIONAL);

                    return {
                        domain: result.string,
                        error: result.error
                    };
                };

                module.exports.PROCESSING_OPTIONS = PROCESSING_OPTIONS;


                /***/ }),

            /***/ 554:
            /***/ (function(__unusedmodule, exports) {

                "use strict";

                var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
                    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
                    return new (P || (P = Promise))(function (resolve, reject) {
                        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
                        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
                        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
                        step((generator = generator.apply(thisArg, _arguments || [])).next());
                    });
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                exports.PersonalAccessTokenCredentialHandler = exports.BearerCredentialHandler = exports.BasicCredentialHandler = void 0;
                class BasicCredentialHandler {
                    constructor(username, password) {
                        this.username = username;
                        this.password = password;
                    }
                    prepareRequest(options) {
                        if (!options.headers) {
                            throw Error('The request has no headers');
                        }
                        options.headers['Authorization'] = `Basic ${Buffer.from(`${this.username}:${this.password}`).toString('base64')}`;
                    }
                    // This handler cannot handle 401
                    canHandleAuthentication() {
                        return false;
                    }
                    handleAuthentication() {
                        return __awaiter(this, void 0, void 0, function* () {
                            throw new Error('not implemented');
                        });
                    }
                }
                exports.BasicCredentialHandler = BasicCredentialHandler;
                class BearerCredentialHandler {
                    constructor(token) {
                        this.token = token;
                    }
                    // currently implements pre-authorization
                    // TODO: support preAuth = false where it hooks on 401
                    prepareRequest(options) {
                        if (!options.headers) {
                            throw Error('The request has no headers');
                        }
                        options.headers['Authorization'] = `Bearer ${this.token}`;
                    }
                    // This handler cannot handle 401
                    canHandleAuthentication() {
                        return false;
                    }
                    handleAuthentication() {
                        return __awaiter(this, void 0, void 0, function* () {
                            throw new Error('not implemented');
                        });
                    }
                }
                exports.BearerCredentialHandler = BearerCredentialHandler;
                class PersonalAccessTokenCredentialHandler {
                    constructor(token) {
                        this.token = token;
                    }
                    // currently implements pre-authorization
                    // TODO: support preAuth = false where it hooks on 401
                    prepareRequest(options) {
                        if (!options.headers) {
                            throw Error('The request has no headers');
                        }
                        options.headers['Authorization'] = `Basic ${Buffer.from(`PAT:${this.token}`).toString('base64')}`;
                    }
                    // This handler cannot handle 401
                    canHandleAuthentication() {
                        return false;
                    }
                    handleAuthentication() {
                        return __awaiter(this, void 0, void 0, function* () {
                            throw new Error('not implemented');
                        });
                    }
                }
                exports.PersonalAccessTokenCredentialHandler = PersonalAccessTokenCredentialHandler;
//# sourceMappingURL=auth.js.map

                /***/ }),

            /***/ 562:
            /***/ (function(module, __unusedexports, __webpack_require__) {

                var once = __webpack_require__(370);

                var noop = function() {};

                var isRequest = function(stream) {
                    return stream.setHeader && typeof stream.abort === 'function';
                };

                var isChildProcess = function(stream) {
                    return stream.stdio && Array.isArray(stream.stdio) && stream.stdio.length === 3
                };

                var eos = function(stream, opts, callback) {
                    if (typeof opts === 'function') return eos(stream, null, opts);
                    if (!opts) opts = {};

                    callback = once(callback || noop);

                    var ws = stream._writableState;
                    var rs = stream._readableState;
                    var readable = opts.readable || (opts.readable !== false && stream.readable);
                    var writable = opts.writable || (opts.writable !== false && stream.writable);
                    var cancelled = false;

                    var onlegacyfinish = function() {
                        if (!stream.writable) onfinish();
                    };

                    var onfinish = function() {
                        writable = false;
                        if (!readable) callback.call(stream);
                    };

                    var onend = function() {
                        readable = false;
                        if (!writable) callback.call(stream);
                    };

                    var onexit = function(exitCode) {
                        callback.call(stream, exitCode ? new Error('exited with error code: ' + exitCode) : null);
                    };

                    var onerror = function(err) {
                        callback.call(stream, err);
                    };

                    var onclose = function() {
                        process.nextTick(onclosenexttick);
                    };

                    var onclosenexttick = function() {
                        if (cancelled) return;
                        if (readable && !(rs && (rs.ended && !rs.destroyed))) return callback.call(stream, new Error('premature close'));
                        if (writable && !(ws && (ws.ended && !ws.destroyed))) return callback.call(stream, new Error('premature close'));
                    };

                    var onrequest = function() {
                        stream.req.on('finish', onfinish);
                    };

                    if (isRequest(stream)) {
                        stream.on('complete', onfinish);
                        stream.on('abort', onclose);
                        if (stream.req) onrequest();
                        else stream.on('request', onrequest);
                    } else if (writable && !ws) { // legacy streams
                        stream.on('end', onlegacyfinish);
                        stream.on('close', onlegacyfinish);
                    }

                    if (isChildProcess(stream)) stream.on('exit', onexit);

                    stream.on('end', onend);
                    stream.on('finish', onfinish);
                    if (opts.error !== false) stream.on('error', onerror);
                    stream.on('close', onclose);

                    return function() {
                        cancelled = true;
                        stream.removeListener('complete', onfinish);
                        stream.removeListener('abort', onclose);
                        stream.removeListener('request', onrequest);
                        if (stream.req) stream.req.removeListener('finish', onfinish);
                        stream.removeListener('end', onlegacyfinish);
                        stream.removeListener('close', onlegacyfinish);
                        stream.removeListener('finish', onfinish);
                        stream.removeListener('exit', onexit);
                        stream.removeListener('end', onend);
                        stream.removeListener('error', onerror);
                        stream.removeListener('close', onclose);
                    };
                };

                module.exports = eos;


                /***/ }),

            /***/ 568:
            /***/ (function(module, __unusedexports, __webpack_require__) {

                "use strict";


                const path = __webpack_require__(622);
                const niceTry = __webpack_require__(948);
                const resolveCommand = __webpack_require__(489);
                const escape = __webpack_require__(462);
                const readShebang = __webpack_require__(389);
                const semver = __webpack_require__(280);

                const isWin = process.platform === 'win32';
                const isExecutableRegExp = /\.(?:com|exe)$/i;
                const isCmdShimRegExp = /node_modules[\\/].bin[\\/][^\\/]+\.cmd$/i;

// `options.shell` is supported in Node ^4.8.0, ^5.7.0 and >= 6.0.0
                const supportsShellOption = niceTry(() => semver.satisfies(process.version, '^4.8.0 || ^5.7.0 || >= 6.0.0', true)) || false;

                function detectShebang(parsed) {
                    parsed.file = resolveCommand(parsed);

                    const shebang = parsed.file && readShebang(parsed.file);

                    if (shebang) {
                        parsed.args.unshift(parsed.file);
                        parsed.command = shebang;

                        return resolveCommand(parsed);
                    }

                    return parsed.file;
                }

                function parseNonShell(parsed) {
                    if (!isWin) {
                        return parsed;
                    }

                    // Detect & add support for shebangs
                    const commandFile = detectShebang(parsed);

                    // We don't need a shell if the command filename is an executable
                    const needsShell = !isExecutableRegExp.test(commandFile);

                    // If a shell is required, use cmd.exe and take care of escaping everything correctly
                    // Note that `forceShell` is an hidden option used only in tests
                    if (parsed.options.forceShell || needsShell) {
                        // Need to double escape meta chars if the command is a cmd-shim located in `node_modules/.bin/`
                        // The cmd-shim simply calls execute the package bin file with NodeJS, proxying any argument
                        // Because the escape of metachars with ^ gets interpreted when the cmd.exe is first called,
                        // we need to double escape them
                        const needsDoubleEscapeMetaChars = isCmdShimRegExp.test(commandFile);

                        // Normalize posix paths into OS compatible paths (e.g.: foo/bar -> foo\bar)
                        // This is necessary otherwise it will always fail with ENOENT in those cases
                        parsed.command = path.normalize(parsed.command);

                        // Escape command & arguments
                        parsed.command = escape.command(parsed.command);
                        parsed.args = parsed.args.map((arg) => escape.argument(arg, needsDoubleEscapeMetaChars));

                        const shellCommand = [parsed.command].concat(parsed.args).join(' ');

                        parsed.args = ['/d', '/s', '/c', `"${shellCommand}"`];
                        parsed.command = process.env.comspec || 'cmd.exe';
                        parsed.options.windowsVerbatimArguments = true; // Tell node's spawn that the arguments are already escaped
                    }

                    return parsed;
                }

                function parseShell(parsed) {
                    // If node supports the shell option, there's no need to mimic its behavior
                    if (supportsShellOption) {
                        return parsed;
                    }

                    // Mimic node shell option
                    // See https://github.com/nodejs/node/blob/b9f6a2dc059a1062776133f3d4fd848c4da7d150/lib/child_process.js#L335
                    const shellCommand = [parsed.command].concat(parsed.args).join(' ');

                    if (isWin) {
                        parsed.command = typeof parsed.options.shell === 'string' ? parsed.options.shell : process.env.comspec || 'cmd.exe';
                        parsed.args = ['/d', '/s', '/c', `"${shellCommand}"`];
                        parsed.options.windowsVerbatimArguments = true; // Tell node's spawn that the arguments are already escaped
                    } else {
                        if (typeof parsed.options.shell === 'string') {
                            parsed.command = parsed.options.shell;
                        } else if (process.platform === 'android') {
                            parsed.command = '/system/bin/sh';
                        } else {
                            parsed.command = '/bin/sh';
                        }

                        parsed.args = ['-c', shellCommand];
                    }

                    return parsed;
                }

                function parse(command, args, options) {
                    // Normalize arguments, similar to nodejs
                    if (args && !Array.isArray(args)) {
                        options = args;
                        args = null;
                    }

                    args = args ? args.slice(0) : []; // Clone array to avoid changing the original
                    options = Object.assign({}, options); // Clone object to avoid changing the original

                    // Build our parsed object
                    const parsed = {
                        command,
                        args,
                        options,
                        file: undefined,
                        original: {
                            command,
                            args,
                        },
                    };

                    // Delegate further parsing to shell or non-shell
                    return options.shell ? parseShell(parsed) : parseNonShell(parsed);
                }

                module.exports = parse;


                /***/ }),

            /***/ 573:
            /***/ (function(__unusedmodule, exports, __webpack_require__) {

                "use strict";

                var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
                    if (k2 === undefined) k2 = k;
                    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
                }) : (function(o, m, k, k2) {
                    if (k2 === undefined) k2 = k;
                    o[k2] = m[k];
                }));
                var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
                    Object.defineProperty(o, "default", { enumerable: true, value: v });
                }) : function(o, v) {
                    o["default"] = v;
                });
                var __importStar = (this && this.__importStar) || function (mod) {
                    if (mod && mod.__esModule) return mod;
                    var result = {};
                    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
                    __setModuleDefault(result, mod);
                    return result;
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                exports.toPlatformPath = exports.toWin32Path = exports.toPosixPath = void 0;
                const path = __importStar(__webpack_require__(622));
                /**
                 * toPosixPath converts the given path to the posix form. On Windows, \\ will be
                 * replaced with /.
                 *
                 * @param pth. Path to transform.
                 * @return string Posix path.
                 */
                function toPosixPath(pth) {
                    return pth.replace(/[\\]/g, '/');
                }
                exports.toPosixPath = toPosixPath;
                /**
                 * toWin32Path converts the given path to the win32 form. On Linux, / will be
                 * replaced with \\.
                 *
                 * @param pth. Path to transform.
                 * @return string Win32 path.
                 */
                function toWin32Path(pth) {
                    return pth.replace(/[/]/g, '\\');
                }
                exports.toWin32Path = toWin32Path;
                /**
                 * toPlatformPath converts the given path to a platform-specific path. It does
                 * this by replacing instances of / and \ with the platform-specific path
                 * separator.
                 *
                 * @param pth The path to platformize.
                 * @return string The platform-specific path.
                 */
                function toPlatformPath(pth) {
                    return pth.replace(/[/\\]/g, path.sep);
                }
                exports.toPlatformPath = toPlatformPath;
//# sourceMappingURL=path-utils.js.map

                /***/ }),

            /***/ 575:
            /***/ (function(__unusedmodule, exports) {

                "use strict";

                var __assign = (this && this.__assign) || function () {
                    __assign = Object.assign || function(t) {
                        for (var s, i = 1, n = arguments.length; i < n; i++) {
                            s = arguments[i];
                            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                                t[p] = s[p];
                        }
                        return t;
                    };
                    return __assign.apply(this, arguments);
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                exports.Context = void 0;
                var Context = /** @class */ (function () {
                    function Context() {
                        this.payload = process.env.GITHUB_EVENT_PATH ? require(process.env.GITHUB_EVENT_PATH) : {};
                        this.event = process.env.GITHUB_EVENT_NAME;
                        this.sha = process.env.GITHUB_SHA;
                        this.ref = process.env.GITHUB_REF;
                        this.workflow = process.env.GITHUB_WORKFLOW;
                        this.action = process.env.GITHUB_ACTION;
                        this.actor = process.env.GITHUB_ACTOR;
                    }
                    Object.defineProperty(Context.prototype, "issue", {
                        get: function () {
                            var payload = this.payload;
                            var data = __assign({}, this.repo);
                            if (payload.issue) {
                                // If it's an issue
                                data.issue_number = payload.issue.number;
                            }
                            else if (payload.pull_request) {
                                // If it's a PR
                                data.issue_number = payload.pull_request.number;
                            }
                            else if (payload.number) {
                                // Just sittin' there on the payload
                                data.issue_number = payload.number;
                            }
                            else {
                                throw new Error('tools.context.issue cannot be used with this event, there is no issue or pull_request object.');
                            }
                            return data;
                        },
                        enumerable: false,
                        configurable: true
                    });
                    Object.defineProperty(Context.prototype, "pullRequest", {
                        get: function () {
                            var payload = this.payload;
                            var data = __assign({}, this.repo);
                            if (payload.pull_request) {
                                // If it's a PR, the API expects pull_number
                                data.pull_number = payload.pull_request.number;
                            }
                            else {
                                throw new Error('tools.context.pullRequest cannot be used with this event, there is no pull_request object.');
                            }
                            return data;
                        },
                        enumerable: false,
                        configurable: true
                    });
                    Object.defineProperty(Context.prototype, "repo", {
                        get: function () {
                            if (process.env.GITHUB_REPOSITORY) {
                                var _a = process.env.GITHUB_REPOSITORY.split('/'), owner = _a[0], repo = _a[1];
                                return { owner: owner, repo: repo };
                            }
                            if (this.payload.repository) {
                                return {
                                    owner: this.payload.repository.owner.login,
                                    repo: this.payload.repository.name
                                };
                            }
                            throw new Error('context.repo requires a GITHUB_REPOSITORY environment variable like \'owner/repo\'');
                        },
                        enumerable: false,
                        configurable: true
                    });
                    return Context;
                }());
                exports.Context = Context;
//# sourceMappingURL=context.js.map

                /***/ }),

            /***/ 592:
            /***/ (function(module, __unusedexports, __webpack_require__) {

                var conversions = __webpack_require__(600);
                var route = __webpack_require__(260);

                var convert = {};

                var models = Object.keys(conversions);

                function wrapRaw(fn) {
                    var wrappedFn = function (args) {
                        if (args === undefined || args === null) {
                            return args;
                        }

                        if (arguments.length > 1) {
                            args = Array.prototype.slice.call(arguments);
                        }

                        return fn(args);
                    };

                    // preserve .conversion property if there is one
                    if ('conversion' in fn) {
                        wrappedFn.conversion = fn.conversion;
                    }

                    return wrappedFn;
                }

                function wrapRounded(fn) {
                    var wrappedFn = function (args) {
                        if (args === undefined || args === null) {
                            return args;
                        }

                        if (arguments.length > 1) {
                            args = Array.prototype.slice.call(arguments);
                        }

                        var result = fn(args);

                        // we're assuming the result is an array here.
                        // see notice in conversions.js; don't use box types
                        // in conversion functions.
                        if (typeof result === 'object') {
                            for (var len = result.length, i = 0; i < len; i++) {
                                result[i] = Math.round(result[i]);
                            }
                        }

                        return result;
                    };

                    // preserve .conversion property if there is one
                    if ('conversion' in fn) {
                        wrappedFn.conversion = fn.conversion;
                    }

                    return wrappedFn;
                }

                models.forEach(function (fromModel) {
                    convert[fromModel] = {};

                    Object.defineProperty(convert[fromModel], 'channels', {value: conversions[fromModel].channels});
                    Object.defineProperty(convert[fromModel], 'labels', {value: conversions[fromModel].labels});

                    var routes = route(fromModel);
                    var routeModels = Object.keys(routes);

                    routeModels.forEach(function (toModel) {
                        var fn = routes[toModel];

                        convert[fromModel][toModel] = wrapRounded(fn);
                        convert[fromModel][toModel].raw = wrapRaw(fn);
                    });
                });

                module.exports = convert;


                /***/ }),

            /***/ 598:
            /***/ (function(module, __unusedexports, __webpack_require__) {

                var fs = __webpack_require__(747)
                var polyfills = __webpack_require__(250)
                var legacy = __webpack_require__(93)
                var clone = __webpack_require__(608)

                var util = __webpack_require__(669)

                /* istanbul ignore next - node 0.x polyfill */
                var gracefulQueue
                var previousSymbol

                /* istanbul ignore else - node 0.x polyfill */
                if (typeof Symbol === 'function' && typeof Symbol.for === 'function') {
                    gracefulQueue = Symbol.for('graceful-fs.queue')
                    // This is used in testing by future versions
                    previousSymbol = Symbol.for('graceful-fs.previous')
                } else {
                    gracefulQueue = '___graceful-fs.queue'
                    previousSymbol = '___graceful-fs.previous'
                }

                function noop () {}

                function publishQueue(context, queue) {
                    Object.defineProperty(context, gracefulQueue, {
                        get: function() {
                            return queue
                        }
                    })
                }

                var debug = noop
                if (util.debuglog)
                    debug = util.debuglog('gfs4')
                else if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || ''))
                    debug = function() {
                        var m = util.format.apply(util, arguments)
                        m = 'GFS4: ' + m.split(/\n/).join('\nGFS4: ')
                        console.error(m)
                    }

// Once time initialization
                if (!fs[gracefulQueue]) {
                    // This queue can be shared by multiple loaded instances
                    var queue = global[gracefulQueue] || []
                    publishQueue(fs, queue)

                    // Patch fs.close/closeSync to shared queue version, because we need
                    // to retry() whenever a close happens *anywhere* in the program.
                    // This is essential when multiple graceful-fs instances are
                    // in play at the same time.
                    fs.close = (function (fs$close) {
                        function close (fd, cb) {
                            return fs$close.call(fs, fd, function (err) {
                                // This function uses the graceful-fs shared queue
                                if (!err) {
                                    resetQueue()
                                }

                                if (typeof cb === 'function')
                                    cb.apply(this, arguments)
                            })
                        }

                        Object.defineProperty(close, previousSymbol, {
                            value: fs$close
                        })
                        return close
                    })(fs.close)

                    fs.closeSync = (function (fs$closeSync) {
                        function closeSync (fd) {
                            // This function uses the graceful-fs shared queue
                            fs$closeSync.apply(fs, arguments)
                            resetQueue()
                        }

                        Object.defineProperty(closeSync, previousSymbol, {
                            value: fs$closeSync
                        })
                        return closeSync
                    })(fs.closeSync)

                    if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || '')) {
                        process.on('exit', function() {
                            debug(fs[gracefulQueue])
                            __webpack_require__(357).equal(fs[gracefulQueue].length, 0)
                        })
                    }
                }

                if (!global[gracefulQueue]) {
                    publishQueue(global, fs[gracefulQueue]);
                }

                module.exports = patch(clone(fs))
                if (process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !fs.__patched) {
                    module.exports = patch(fs)
                    fs.__patched = true;
                }

                function patch (fs) {
                    // Everything that references the open() function needs to be in here
                    polyfills(fs)
                    fs.gracefulify = patch

                    fs.createReadStream = createReadStream
                    fs.createWriteStream = createWriteStream
                    var fs$readFile = fs.readFile
                    fs.readFile = readFile
                    function readFile (path, options, cb) {
                        if (typeof options === 'function')
                            cb = options, options = null

                        return go$readFile(path, options, cb)

                        function go$readFile (path, options, cb, startTime) {
                            return fs$readFile(path, options, function (err) {
                                if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
                                    enqueue([go$readFile, [path, options, cb], err, startTime || Date.now(), Date.now()])
                                else {
                                    if (typeof cb === 'function')
                                        cb.apply(this, arguments)
                                }
                            })
                        }
                    }

                    var fs$writeFile = fs.writeFile
                    fs.writeFile = writeFile
                    function writeFile (path, data, options, cb) {
                        if (typeof options === 'function')
                            cb = options, options = null

                        return go$writeFile(path, data, options, cb)

                        function go$writeFile (path, data, options, cb, startTime) {
                            return fs$writeFile(path, data, options, function (err) {
                                if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
                                    enqueue([go$writeFile, [path, data, options, cb], err, startTime || Date.now(), Date.now()])
                                else {
                                    if (typeof cb === 'function')
                                        cb.apply(this, arguments)
                                }
                            })
                        }
                    }

                    var fs$appendFile = fs.appendFile
                    if (fs$appendFile)
                        fs.appendFile = appendFile
                    function appendFile (path, data, options, cb) {
                        if (typeof options === 'function')
                            cb = options, options = null

                        return go$appendFile(path, data, options, cb)

                        function go$appendFile (path, data, options, cb, startTime) {
                            return fs$appendFile(path, data, options, function (err) {
                                if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
                                    enqueue([go$appendFile, [path, data, options, cb], err, startTime || Date.now(), Date.now()])
                                else {
                                    if (typeof cb === 'function')
                                        cb.apply(this, arguments)
                                }
                            })
                        }
                    }

                    var fs$copyFile = fs.copyFile
                    if (fs$copyFile)
                        fs.copyFile = copyFile
                    function copyFile (src, dest, flags, cb) {
                        if (typeof flags === 'function') {
                            cb = flags
                            flags = 0
                        }
                        return go$copyFile(src, dest, flags, cb)

                        function go$copyFile (src, dest, flags, cb, startTime) {
                            return fs$copyFile(src, dest, flags, function (err) {
                                if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
                                    enqueue([go$copyFile, [src, dest, flags, cb], err, startTime || Date.now(), Date.now()])
                                else {
                                    if (typeof cb === 'function')
                                        cb.apply(this, arguments)
                                }
                            })
                        }
                    }

                    var fs$readdir = fs.readdir
                    fs.readdir = readdir
                    var noReaddirOptionVersions = /^v[0-5]\./
                    function readdir (path, options, cb) {
                        if (typeof options === 'function')
                            cb = options, options = null

                        var go$readdir = noReaddirOptionVersions.test(process.version)
                            ? function go$readdir (path, options, cb, startTime) {
                                return fs$readdir(path, fs$readdirCallback(
                                    path, options, cb, startTime
                                ))
                            }
                            : function go$readdir (path, options, cb, startTime) {
                                return fs$readdir(path, options, fs$readdirCallback(
                                    path, options, cb, startTime
                                ))
                            }

                        return go$readdir(path, options, cb)

                        function fs$readdirCallback (path, options, cb, startTime) {
                            return function (err, files) {
                                if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
                                    enqueue([
                                        go$readdir,
                                        [path, options, cb],
                                        err,
                                        startTime || Date.now(),
                                        Date.now()
                                    ])
                                else {
                                    if (files && files.sort)
                                        files.sort()

                                    if (typeof cb === 'function')
                                        cb.call(this, err, files)
                                }
                            }
                        }
                    }

                    if (process.version.substr(0, 4) === 'v0.8') {
                        var legStreams = legacy(fs)
                        ReadStream = legStreams.ReadStream
                        WriteStream = legStreams.WriteStream
                    }

                    var fs$ReadStream = fs.ReadStream
                    if (fs$ReadStream) {
                        ReadStream.prototype = Object.create(fs$ReadStream.prototype)
                        ReadStream.prototype.open = ReadStream$open
                    }

                    var fs$WriteStream = fs.WriteStream
                    if (fs$WriteStream) {
                        WriteStream.prototype = Object.create(fs$WriteStream.prototype)
                        WriteStream.prototype.open = WriteStream$open
                    }

                    Object.defineProperty(fs, 'ReadStream', {
                        get: function () {
                            return ReadStream
                        },
                        set: function (val) {
                            ReadStream = val
                        },
                        enumerable: true,
                        configurable: true
                    })
                    Object.defineProperty(fs, 'WriteStream', {
                        get: function () {
                            return WriteStream
                        },
                        set: function (val) {
                            WriteStream = val
                        },
                        enumerable: true,
                        configurable: true
                    })

                    // legacy names
                    var FileReadStream = ReadStream
                    Object.defineProperty(fs, 'FileReadStream', {
                        get: function () {
                            return FileReadStream
                        },
                        set: function (val) {
                            FileReadStream = val
                        },
                        enumerable: true,
                        configurable: true
                    })
                    var FileWriteStream = WriteStream
                    Object.defineProperty(fs, 'FileWriteStream', {
                        get: function () {
                            return FileWriteStream
                        },
                        set: function (val) {
                            FileWriteStream = val
                        },
                        enumerable: true,
                        configurable: true
                    })

                    function ReadStream (path, options) {
                        if (this instanceof ReadStream)
                            return fs$ReadStream.apply(this, arguments), this
                        else
                            return ReadStream.apply(Object.create(ReadStream.prototype), arguments)
                    }

                    function ReadStream$open () {
                        var that = this
                        open(that.path, that.flags, that.mode, function (err, fd) {
                            if (err) {
                                if (that.autoClose)
                                    that.destroy()

                                that.emit('error', err)
                            } else {
                                that.fd = fd
                                that.emit('open', fd)
                                that.read()
                            }
                        })
                    }

                    function WriteStream (path, options) {
                        if (this instanceof WriteStream)
                            return fs$WriteStream.apply(this, arguments), this
                        else
                            return WriteStream.apply(Object.create(WriteStream.prototype), arguments)
                    }

                    function WriteStream$open () {
                        var that = this
                        open(that.path, that.flags, that.mode, function (err, fd) {
                            if (err) {
                                that.destroy()
                                that.emit('error', err)
                            } else {
                                that.fd = fd
                                that.emit('open', fd)
                            }
                        })
                    }

                    function createReadStream (path, options) {
                        return new fs.ReadStream(path, options)
                    }

                    function createWriteStream (path, options) {
                        return new fs.WriteStream(path, options)
                    }

                    var fs$open = fs.open
                    fs.open = open
                    function open (path, flags, mode, cb) {
                        if (typeof mode === 'function')
                            cb = mode, mode = null

                        return go$open(path, flags, mode, cb)

                        function go$open (path, flags, mode, cb, startTime) {
                            return fs$open(path, flags, mode, function (err, fd) {
                                if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
                                    enqueue([go$open, [path, flags, mode, cb], err, startTime || Date.now(), Date.now()])
                                else {
                                    if (typeof cb === 'function')
                                        cb.apply(this, arguments)
                                }
                            })
                        }
                    }

                    return fs
                }

                function enqueue (elem) {
                    debug('ENQUEUE', elem[0].name, elem[1])
                    fs[gracefulQueue].push(elem)
                    retry()
                }

// keep track of the timeout between retry() calls
                var retryTimer

// reset the startTime and lastTime to now
// this resets the start of the 60 second overall timeout as well as the
// delay between attempts so that we'll retry these jobs sooner
                function resetQueue () {
                    var now = Date.now()
                    for (var i = 0; i < fs[gracefulQueue].length; ++i) {
                        // entries that are only a length of 2 are from an older version, don't
                        // bother modifying those since they'll be retried anyway.
                        if (fs[gracefulQueue][i].length > 2) {
                            fs[gracefulQueue][i][3] = now // startTime
                            fs[gracefulQueue][i][4] = now // lastTime
                        }
                    }
                    // call retry to make sure we're actively processing the queue
                    retry()
                }

                function retry () {
                    // clear the timer and remove it to help prevent unintended concurrency
                    clearTimeout(retryTimer)
                    retryTimer = undefined

                    if (fs[gracefulQueue].length === 0)
                        return

                    var elem = fs[gracefulQueue].shift()
                    var fn = elem[0]
                    var args = elem[1]
                    // these items may be unset if they were added by an older graceful-fs
                    var err = elem[2]
                    var startTime = elem[3]
                    var lastTime = elem[4]

                    // if we don't have a startTime we have no way of knowing if we've waited
                    // long enough, so go ahead and retry this item now
                    if (startTime === undefined) {
                        debug('RETRY', fn.name, args)
                        fn.apply(null, args)
                    } else if (Date.now() - startTime >= 60000) {
                        // it's been more than 60 seconds total, bail now
                        debug('TIMEOUT', fn.name, args)
                        var cb = args.pop()
                        if (typeof cb === 'function')
                            cb.call(null, err)
                    } else {
                        // the amount of time between the last attempt and right now
                        var sinceAttempt = Date.now() - lastTime
                        // the amount of time between when we first tried, and when we last tried
                        // rounded up to at least 1
                        var sinceStart = Math.max(lastTime - startTime, 1)
                        // backoff. wait longer than the total time we've been retrying, but only
                        // up to a maximum of 100ms
                        var desiredDelay = Math.min(sinceStart * 1.2, 100)
                        // it's been long enough since the last retry, do it again
                        if (sinceAttempt >= desiredDelay) {
                            debug('RETRY', fn.name, args)
                            fn.apply(null, args.concat([startTime]))
                        } else {
                            // if we can't do this job yet, push it to the end of the queue
                            // and let the next iteration check again
                            fs[gracefulQueue].push(elem)
                        }
                    }

                    // schedule our next run if one isn't already scheduled
                    if (retryTimer === undefined) {
                        retryTimer = setTimeout(retry, 0)
                    }
                }


                /***/ }),

            /***/ 600:
            /***/ (function(module, __unusedexports, __webpack_require__) {

                /* MIT license */
                var cssKeywords = __webpack_require__(885);

// NOTE: conversions should only return primitive values (i.e. arrays, or
//       values that give correct `typeof` results).
//       do not use box values types (i.e. Number(), String(), etc.)

                var reverseKeywords = {};
                for (var key in cssKeywords) {
                    if (cssKeywords.hasOwnProperty(key)) {
                        reverseKeywords[cssKeywords[key]] = key;
                    }
                }

                var convert = module.exports = {
                    rgb: {channels: 3, labels: 'rgb'},
                    hsl: {channels: 3, labels: 'hsl'},
                    hsv: {channels: 3, labels: 'hsv'},
                    hwb: {channels: 3, labels: 'hwb'},
                    cmyk: {channels: 4, labels: 'cmyk'},
                    xyz: {channels: 3, labels: 'xyz'},
                    lab: {channels: 3, labels: 'lab'},
                    lch: {channels: 3, labels: 'lch'},
                    hex: {channels: 1, labels: ['hex']},
                    keyword: {channels: 1, labels: ['keyword']},
                    ansi16: {channels: 1, labels: ['ansi16']},
                    ansi256: {channels: 1, labels: ['ansi256']},
                    hcg: {channels: 3, labels: ['h', 'c', 'g']},
                    apple: {channels: 3, labels: ['r16', 'g16', 'b16']},
                    gray: {channels: 1, labels: ['gray']}
                };

// hide .channels and .labels properties
                for (var model in convert) {
                    if (convert.hasOwnProperty(model)) {
                        if (!('channels' in convert[model])) {
                            throw new Error('missing channels property: ' + model);
                        }

                        if (!('labels' in convert[model])) {
                            throw new Error('missing channel labels property: ' + model);
                        }

                        if (convert[model].labels.length !== convert[model].channels) {
                            throw new Error('channel and label counts mismatch: ' + model);
                        }

                        var channels = convert[model].channels;
                        var labels = convert[model].labels;
                        delete convert[model].channels;
                        delete convert[model].labels;
                        Object.defineProperty(convert[model], 'channels', {value: channels});
                        Object.defineProperty(convert[model], 'labels', {value: labels});
                    }
                }

                convert.rgb.hsl = function (rgb) {
                    var r = rgb[0] / 255;
                    var g = rgb[1] / 255;
                    var b = rgb[2] / 255;
                    var min = Math.min(r, g, b);
                    var max = Math.max(r, g, b);
                    var delta = max - min;
                    var h;
                    var s;
                    var l;

                    if (max === min) {
                        h = 0;
                    } else if (r === max) {
                        h = (g - b) / delta;
                    } else if (g === max) {
                        h = 2 + (b - r) / delta;
                    } else if (b === max) {
                        h = 4 + (r - g) / delta;
                    }

                    h = Math.min(h * 60, 360);

                    if (h < 0) {
                        h += 360;
                    }

                    l = (min + max) / 2;

                    if (max === min) {
                        s = 0;
                    } else if (l <= 0.5) {
                        s = delta / (max + min);
                    } else {
                        s = delta / (2 - max - min);
                    }

                    return [h, s * 100, l * 100];
                };

                convert.rgb.hsv = function (rgb) {
                    var rdif;
                    var gdif;
                    var bdif;
                    var h;
                    var s;

                    var r = rgb[0] / 255;
                    var g = rgb[1] / 255;
                    var b = rgb[2] / 255;
                    var v = Math.max(r, g, b);
                    var diff = v - Math.min(r, g, b);
                    var diffc = function (c) {
                        return (v - c) / 6 / diff + 1 / 2;
                    };

                    if (diff === 0) {
                        h = s = 0;
                    } else {
                        s = diff / v;
                        rdif = diffc(r);
                        gdif = diffc(g);
                        bdif = diffc(b);

                        if (r === v) {
                            h = bdif - gdif;
                        } else if (g === v) {
                            h = (1 / 3) + rdif - bdif;
                        } else if (b === v) {
                            h = (2 / 3) + gdif - rdif;
                        }
                        if (h < 0) {
                            h += 1;
                        } else if (h > 1) {
                            h -= 1;
                        }
                    }

                    return [
                        h * 360,
                        s * 100,
                        v * 100
                    ];
                };

                convert.rgb.hwb = function (rgb) {
                    var r = rgb[0];
                    var g = rgb[1];
                    var b = rgb[2];
                    var h = convert.rgb.hsl(rgb)[0];
                    var w = 1 / 255 * Math.min(r, Math.min(g, b));

                    b = 1 - 1 / 255 * Math.max(r, Math.max(g, b));

                    return [h, w * 100, b * 100];
                };

                convert.rgb.cmyk = function (rgb) {
                    var r = rgb[0] / 255;
                    var g = rgb[1] / 255;
                    var b = rgb[2] / 255;
                    var c;
                    var m;
                    var y;
                    var k;

                    k = Math.min(1 - r, 1 - g, 1 - b);
                    c = (1 - r - k) / (1 - k) || 0;
                    m = (1 - g - k) / (1 - k) || 0;
                    y = (1 - b - k) / (1 - k) || 0;

                    return [c * 100, m * 100, y * 100, k * 100];
                };

                /**
                 * See https://en.m.wikipedia.org/wiki/Euclidean_distance#Squared_Euclidean_distance
                 * */
                function comparativeDistance(x, y) {
                    return (
                        Math.pow(x[0] - y[0], 2) +
                        Math.pow(x[1] - y[1], 2) +
                        Math.pow(x[2] - y[2], 2)
                    );
                }

                convert.rgb.keyword = function (rgb) {
                    var reversed = reverseKeywords[rgb];
                    if (reversed) {
                        return reversed;
                    }

                    var currentClosestDistance = Infinity;
                    var currentClosestKeyword;

                    for (var keyword in cssKeywords) {
                        if (cssKeywords.hasOwnProperty(keyword)) {
                            var value = cssKeywords[keyword];

                            // Compute comparative distance
                            var distance = comparativeDistance(rgb, value);

                            // Check if its less, if so set as closest
                            if (distance < currentClosestDistance) {
                                currentClosestDistance = distance;
                                currentClosestKeyword = keyword;
                            }
                        }
                    }

                    return currentClosestKeyword;
                };

                convert.keyword.rgb = function (keyword) {
                    return cssKeywords[keyword];
                };

                convert.rgb.xyz = function (rgb) {
                    var r = rgb[0] / 255;
                    var g = rgb[1] / 255;
                    var b = rgb[2] / 255;

                    // assume sRGB
                    r = r > 0.04045 ? Math.pow(((r + 0.055) / 1.055), 2.4) : (r / 12.92);
                    g = g > 0.04045 ? Math.pow(((g + 0.055) / 1.055), 2.4) : (g / 12.92);
                    b = b > 0.04045 ? Math.pow(((b + 0.055) / 1.055), 2.4) : (b / 12.92);

                    var x = (r * 0.4124) + (g * 0.3576) + (b * 0.1805);
                    var y = (r * 0.2126) + (g * 0.7152) + (b * 0.0722);
                    var z = (r * 0.0193) + (g * 0.1192) + (b * 0.9505);

                    return [x * 100, y * 100, z * 100];
                };

                convert.rgb.lab = function (rgb) {
                    var xyz = convert.rgb.xyz(rgb);
                    var x = xyz[0];
                    var y = xyz[1];
                    var z = xyz[2];
                    var l;
                    var a;
                    var b;

                    x /= 95.047;
                    y /= 100;
                    z /= 108.883;

                    x = x > 0.008856 ? Math.pow(x, 1 / 3) : (7.787 * x) + (16 / 116);
                    y = y > 0.008856 ? Math.pow(y, 1 / 3) : (7.787 * y) + (16 / 116);
                    z = z > 0.008856 ? Math.pow(z, 1 / 3) : (7.787 * z) + (16 / 116);

                    l = (116 * y) - 16;
                    a = 500 * (x - y);
                    b = 200 * (y - z);

                    return [l, a, b];
                };

                convert.hsl.rgb = function (hsl) {
                    var h = hsl[0] / 360;
                    var s = hsl[1] / 100;
                    var l = hsl[2] / 100;
                    var t1;
                    var t2;
                    var t3;
                    var rgb;
                    var val;

                    if (s === 0) {
                        val = l * 255;
                        return [val, val, val];
                    }

                    if (l < 0.5) {
                        t2 = l * (1 + s);
                    } else {
                        t2 = l + s - l * s;
                    }

                    t1 = 2 * l - t2;

                    rgb = [0, 0, 0];
                    for (var i = 0; i < 3; i++) {
                        t3 = h + 1 / 3 * -(i - 1);
                        if (t3 < 0) {
                            t3++;
                        }
                        if (t3 > 1) {
                            t3--;
                        }

                        if (6 * t3 < 1) {
                            val = t1 + (t2 - t1) * 6 * t3;
                        } else if (2 * t3 < 1) {
                            val = t2;
                        } else if (3 * t3 < 2) {
                            val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
                        } else {
                            val = t1;
                        }

                        rgb[i] = val * 255;
                    }

                    return rgb;
                };

                convert.hsl.hsv = function (hsl) {
                    var h = hsl[0];
                    var s = hsl[1] / 100;
                    var l = hsl[2] / 100;
                    var smin = s;
                    var lmin = Math.max(l, 0.01);
                    var sv;
                    var v;

                    l *= 2;
                    s *= (l <= 1) ? l : 2 - l;
                    smin *= lmin <= 1 ? lmin : 2 - lmin;
                    v = (l + s) / 2;
                    sv = l === 0 ? (2 * smin) / (lmin + smin) : (2 * s) / (l + s);

                    return [h, sv * 100, v * 100];
                };

                convert.hsv.rgb = function (hsv) {
                    var h = hsv[0] / 60;
                    var s = hsv[1] / 100;
                    var v = hsv[2] / 100;
                    var hi = Math.floor(h) % 6;

                    var f = h - Math.floor(h);
                    var p = 255 * v * (1 - s);
                    var q = 255 * v * (1 - (s * f));
                    var t = 255 * v * (1 - (s * (1 - f)));
                    v *= 255;

                    switch (hi) {
                        case 0:
                            return [v, t, p];
                        case 1:
                            return [q, v, p];
                        case 2:
                            return [p, v, t];
                        case 3:
                            return [p, q, v];
                        case 4:
                            return [t, p, v];
                        case 5:
                            return [v, p, q];
                    }
                };

                convert.hsv.hsl = function (hsv) {
                    var h = hsv[0];
                    var s = hsv[1] / 100;
                    var v = hsv[2] / 100;
                    var vmin = Math.max(v, 0.01);
                    var lmin;
                    var sl;
                    var l;

                    l = (2 - s) * v;
                    lmin = (2 - s) * vmin;
                    sl = s * vmin;
                    sl /= (lmin <= 1) ? lmin : 2 - lmin;
                    sl = sl || 0;
                    l /= 2;

                    return [h, sl * 100, l * 100];
                };

// http://dev.w3.org/csswg/css-color/#hwb-to-rgb
                convert.hwb.rgb = function (hwb) {
                    var h = hwb[0] / 360;
                    var wh = hwb[1] / 100;
                    var bl = hwb[2] / 100;
                    var ratio = wh + bl;
                    var i;
                    var v;
                    var f;
                    var n;

                    // wh + bl cant be > 1
                    if (ratio > 1) {
                        wh /= ratio;
                        bl /= ratio;
                    }

                    i = Math.floor(6 * h);
                    v = 1 - bl;
                    f = 6 * h - i;

                    if ((i & 0x01) !== 0) {
                        f = 1 - f;
                    }

                    n = wh + f * (v - wh); // linear interpolation

                    var r;
                    var g;
                    var b;
                    switch (i) {
                        default:
                        case 6:
                        case 0: r = v; g = n; b = wh; break;
                        case 1: r = n; g = v; b = wh; break;
                        case 2: r = wh; g = v; b = n; break;
                        case 3: r = wh; g = n; b = v; break;
                        case 4: r = n; g = wh; b = v; break;
                        case 5: r = v; g = wh; b = n; break;
                    }

                    return [r * 255, g * 255, b * 255];
                };

                convert.cmyk.rgb = function (cmyk) {
                    var c = cmyk[0] / 100;
                    var m = cmyk[1] / 100;
                    var y = cmyk[2] / 100;
                    var k = cmyk[3] / 100;
                    var r;
                    var g;
                    var b;

                    r = 1 - Math.min(1, c * (1 - k) + k);
                    g = 1 - Math.min(1, m * (1 - k) + k);
                    b = 1 - Math.min(1, y * (1 - k) + k);

                    return [r * 255, g * 255, b * 255];
                };

                convert.xyz.rgb = function (xyz) {
                    var x = xyz[0] / 100;
                    var y = xyz[1] / 100;
                    var z = xyz[2] / 100;
                    var r;
                    var g;
                    var b;

                    r = (x * 3.2406) + (y * -1.5372) + (z * -0.4986);
                    g = (x * -0.9689) + (y * 1.8758) + (z * 0.0415);
                    b = (x * 0.0557) + (y * -0.2040) + (z * 1.0570);

                    // assume sRGB
                    r = r > 0.0031308
                        ? ((1.055 * Math.pow(r, 1.0 / 2.4)) - 0.055)
                        : r * 12.92;

                    g = g > 0.0031308
                        ? ((1.055 * Math.pow(g, 1.0 / 2.4)) - 0.055)
                        : g * 12.92;

                    b = b > 0.0031308
                        ? ((1.055 * Math.pow(b, 1.0 / 2.4)) - 0.055)
                        : b * 12.92;

                    r = Math.min(Math.max(0, r), 1);
                    g = Math.min(Math.max(0, g), 1);
                    b = Math.min(Math.max(0, b), 1);

                    return [r * 255, g * 255, b * 255];
                };

                convert.xyz.lab = function (xyz) {
                    var x = xyz[0];
                    var y = xyz[1];
                    var z = xyz[2];
                    var l;
                    var a;
                    var b;

                    x /= 95.047;
                    y /= 100;
                    z /= 108.883;

                    x = x > 0.008856 ? Math.pow(x, 1 / 3) : (7.787 * x) + (16 / 116);
                    y = y > 0.008856 ? Math.pow(y, 1 / 3) : (7.787 * y) + (16 / 116);
                    z = z > 0.008856 ? Math.pow(z, 1 / 3) : (7.787 * z) + (16 / 116);

                    l = (116 * y) - 16;
                    a = 500 * (x - y);
                    b = 200 * (y - z);

                    return [l, a, b];
                };

                convert.lab.xyz = function (lab) {
                    var l = lab[0];
                    var a = lab[1];
                    var b = lab[2];
                    var x;
                    var y;
                    var z;

                    y = (l + 16) / 116;
                    x = a / 500 + y;
                    z = y - b / 200;

                    var y2 = Math.pow(y, 3);
                    var x2 = Math.pow(x, 3);
                    var z2 = Math.pow(z, 3);
                    y = y2 > 0.008856 ? y2 : (y - 16 / 116) / 7.787;
                    x = x2 > 0.008856 ? x2 : (x - 16 / 116) / 7.787;
                    z = z2 > 0.008856 ? z2 : (z - 16 / 116) / 7.787;

                    x *= 95.047;
                    y *= 100;
                    z *= 108.883;

                    return [x, y, z];
                };

                convert.lab.lch = function (lab) {
                    var l = lab[0];
                    var a = lab[1];
                    var b = lab[2];
                    var hr;
                    var h;
                    var c;

                    hr = Math.atan2(b, a);
                    h = hr * 360 / 2 / Math.PI;

                    if (h < 0) {
                        h += 360;
                    }

                    c = Math.sqrt(a * a + b * b);

                    return [l, c, h];
                };

                convert.lch.lab = function (lch) {
                    var l = lch[0];
                    var c = lch[1];
                    var h = lch[2];
                    var a;
                    var b;
                    var hr;

                    hr = h / 360 * 2 * Math.PI;
                    a = c * Math.cos(hr);
                    b = c * Math.sin(hr);

                    return [l, a, b];
                };

                convert.rgb.ansi16 = function (args) {
                    var r = args[0];
                    var g = args[1];
                    var b = args[2];
                    var value = 1 in arguments ? arguments[1] : convert.rgb.hsv(args)[2]; // hsv -> ansi16 optimization

                    value = Math.round(value / 50);

                    if (value === 0) {
                        return 30;
                    }

                    var ansi = 30
                        + ((Math.round(b / 255) << 2)
                            | (Math.round(g / 255) << 1)
                            | Math.round(r / 255));

                    if (value === 2) {
                        ansi += 60;
                    }

                    return ansi;
                };

                convert.hsv.ansi16 = function (args) {
                    // optimization here; we already know the value and don't need to get
                    // it converted for us.
                    return convert.rgb.ansi16(convert.hsv.rgb(args), args[2]);
                };

                convert.rgb.ansi256 = function (args) {
                    var r = args[0];
                    var g = args[1];
                    var b = args[2];

                    // we use the extended greyscale palette here, with the exception of
                    // black and white. normal palette only has 4 greyscale shades.
                    if (r === g && g === b) {
                        if (r < 8) {
                            return 16;
                        }

                        if (r > 248) {
                            return 231;
                        }

                        return Math.round(((r - 8) / 247) * 24) + 232;
                    }

                    var ansi = 16
                        + (36 * Math.round(r / 255 * 5))
                        + (6 * Math.round(g / 255 * 5))
                        + Math.round(b / 255 * 5);

                    return ansi;
                };

                convert.ansi16.rgb = function (args) {
                    var color = args % 10;

                    // handle greyscale
                    if (color === 0 || color === 7) {
                        if (args > 50) {
                            color += 3.5;
                        }

                        color = color / 10.5 * 255;

                        return [color, color, color];
                    }

                    var mult = (~~(args > 50) + 1) * 0.5;
                    var r = ((color & 1) * mult) * 255;
                    var g = (((color >> 1) & 1) * mult) * 255;
                    var b = (((color >> 2) & 1) * mult) * 255;

                    return [r, g, b];
                };

                convert.ansi256.rgb = function (args) {
                    // handle greyscale
                    if (args >= 232) {
                        var c = (args - 232) * 10 + 8;
                        return [c, c, c];
                    }

                    args -= 16;

                    var rem;
                    var r = Math.floor(args / 36) / 5 * 255;
                    var g = Math.floor((rem = args % 36) / 6) / 5 * 255;
                    var b = (rem % 6) / 5 * 255;

                    return [r, g, b];
                };

                convert.rgb.hex = function (args) {
                    var integer = ((Math.round(args[0]) & 0xFF) << 16)
                        + ((Math.round(args[1]) & 0xFF) << 8)
                        + (Math.round(args[2]) & 0xFF);

                    var string = integer.toString(16).toUpperCase();
                    return '000000'.substring(string.length) + string;
                };

                convert.hex.rgb = function (args) {
                    var match = args.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
                    if (!match) {
                        return [0, 0, 0];
                    }

                    var colorString = match[0];

                    if (match[0].length === 3) {
                        colorString = colorString.split('').map(function (char) {
                            return char + char;
                        }).join('');
                    }

                    var integer = parseInt(colorString, 16);
                    var r = (integer >> 16) & 0xFF;
                    var g = (integer >> 8) & 0xFF;
                    var b = integer & 0xFF;

                    return [r, g, b];
                };

                convert.rgb.hcg = function (rgb) {
                    var r = rgb[0] / 255;
                    var g = rgb[1] / 255;
                    var b = rgb[2] / 255;
                    var max = Math.max(Math.max(r, g), b);
                    var min = Math.min(Math.min(r, g), b);
                    var chroma = (max - min);
                    var grayscale;
                    var hue;

                    if (chroma < 1) {
                        grayscale = min / (1 - chroma);
                    } else {
                        grayscale = 0;
                    }

                    if (chroma <= 0) {
                        hue = 0;
                    } else
                    if (max === r) {
                        hue = ((g - b) / chroma) % 6;
                    } else
                    if (max === g) {
                        hue = 2 + (b - r) / chroma;
                    } else {
                        hue = 4 + (r - g) / chroma + 4;
                    }

                    hue /= 6;
                    hue %= 1;

                    return [hue * 360, chroma * 100, grayscale * 100];
                };

                convert.hsl.hcg = function (hsl) {
                    var s = hsl[1] / 100;
                    var l = hsl[2] / 100;
                    var c = 1;
                    var f = 0;

                    if (l < 0.5) {
                        c = 2.0 * s * l;
                    } else {
                        c = 2.0 * s * (1.0 - l);
                    }

                    if (c < 1.0) {
                        f = (l - 0.5 * c) / (1.0 - c);
                    }

                    return [hsl[0], c * 100, f * 100];
                };

                convert.hsv.hcg = function (hsv) {
                    var s = hsv[1] / 100;
                    var v = hsv[2] / 100;

                    var c = s * v;
                    var f = 0;

                    if (c < 1.0) {
                        f = (v - c) / (1 - c);
                    }

                    return [hsv[0], c * 100, f * 100];
                };

                convert.hcg.rgb = function (hcg) {
                    var h = hcg[0] / 360;
                    var c = hcg[1] / 100;
                    var g = hcg[2] / 100;

                    if (c === 0.0) {
                        return [g * 255, g * 255, g * 255];
                    }

                    var pure = [0, 0, 0];
                    var hi = (h % 1) * 6;
                    var v = hi % 1;
                    var w = 1 - v;
                    var mg = 0;

                    switch (Math.floor(hi)) {
                        case 0:
                            pure[0] = 1; pure[1] = v; pure[2] = 0; break;
                        case 1:
                            pure[0] = w; pure[1] = 1; pure[2] = 0; break;
                        case 2:
                            pure[0] = 0; pure[1] = 1; pure[2] = v; break;
                        case 3:
                            pure[0] = 0; pure[1] = w; pure[2] = 1; break;
                        case 4:
                            pure[0] = v; pure[1] = 0; pure[2] = 1; break;
                        default:
                            pure[0] = 1; pure[1] = 0; pure[2] = w;
                    }

                    mg = (1.0 - c) * g;

                    return [
                        (c * pure[0] + mg) * 255,
                        (c * pure[1] + mg) * 255,
                        (c * pure[2] + mg) * 255
                    ];
                };

                convert.hcg.hsv = function (hcg) {
                    var c = hcg[1] / 100;
                    var g = hcg[2] / 100;

                    var v = c + g * (1.0 - c);
                    var f = 0;

                    if (v > 0.0) {
                        f = c / v;
                    }

                    return [hcg[0], f * 100, v * 100];
                };

                convert.hcg.hsl = function (hcg) {
                    var c = hcg[1] / 100;
                    var g = hcg[2] / 100;

                    var l = g * (1.0 - c) + 0.5 * c;
                    var s = 0;

                    if (l > 0.0 && l < 0.5) {
                        s = c / (2 * l);
                    } else
                    if (l >= 0.5 && l < 1.0) {
                        s = c / (2 * (1 - l));
                    }

                    return [hcg[0], s * 100, l * 100];
                };

                convert.hcg.hwb = function (hcg) {
                    var c = hcg[1] / 100;
                    var g = hcg[2] / 100;
                    var v = c + g * (1.0 - c);
                    return [hcg[0], (v - c) * 100, (1 - v) * 100];
                };

                convert.hwb.hcg = function (hwb) {
                    var w = hwb[1] / 100;
                    var b = hwb[2] / 100;
                    var v = 1 - b;
                    var c = v - w;
                    var g = 0;

                    if (c < 1) {
                        g = (v - c) / (1 - c);
                    }

                    return [hwb[0], c * 100, g * 100];
                };

                convert.apple.rgb = function (apple) {
                    return [(apple[0] / 65535) * 255, (apple[1] / 65535) * 255, (apple[2] / 65535) * 255];
                };

                convert.rgb.apple = function (rgb) {
                    return [(rgb[0] / 255) * 65535, (rgb[1] / 255) * 65535, (rgb[2] / 255) * 65535];
                };

                convert.gray.rgb = function (args) {
                    return [args[0] / 100 * 255, args[0] / 100 * 255, args[0] / 100 * 255];
                };

                convert.gray.hsl = convert.gray.hsv = function (args) {
                    return [0, 0, args[0]];
                };

                convert.gray.hwb = function (gray) {
                    return [0, 100, gray[0]];
                };

                convert.gray.cmyk = function (gray) {
                    return [0, 0, 0, gray[0]];
                };

                convert.gray.lab = function (gray) {
                    return [gray[0], 0, 0];
                };

                convert.gray.hex = function (gray) {
                    var val = Math.round(gray[0] / 100 * 255) & 0xFF;
                    var integer = (val << 16) + (val << 8) + val;

                    var string = integer.toString(16).toUpperCase();
                    return '000000'.substring(string.length) + string;
                };

                convert.rgb.gray = function (rgb) {
                    var val = (rgb[0] + rgb[1] + rgb[2]) / 3;
                    return [val / 255 * 100];
                };


                /***/ }),

            /***/ 605:
            /***/ (function(module) {

                module.exports = require("http");

                /***/ }),

            /***/ 608:
            /***/ (function(module) {

                "use strict";


                module.exports = clone

                var getPrototypeOf = Object.getPrototypeOf || function (obj) {
                    return obj.__proto__
                }

                function clone (obj) {
                    if (obj === null || typeof obj !== 'object')
                        return obj

                    if (obj instanceof Object)
                        var copy = { __proto__: getPrototypeOf(obj) }
                    else
                        var copy = Object.create(null)

                    Object.getOwnPropertyNames(obj).forEach(function (key) {
                        Object.defineProperty(copy, key, Object.getOwnPropertyDescriptor(obj, key))
                    })

                    return copy
                }


                /***/ }),

            /***/ 612:
            /***/ (function(module, __unusedexports, __webpack_require__) {

                "use strict";


                var util = __webpack_require__(669);
                var isArrayish = __webpack_require__(156);

                var errorEx = function errorEx(name, properties) {
                    if (!name || name.constructor !== String) {
                        properties = name || {};
                        name = Error.name;
                    }

                    var errorExError = function ErrorEXError(message) {
                        if (!this) {
                            return new ErrorEXError(message);
                        }

                        message = message instanceof Error
                            ? message.message
                            : (message || this.message);

                        Error.call(this, message);
                        Error.captureStackTrace(this, errorExError);

                        this.name = name;

                        Object.defineProperty(this, 'message', {
                            configurable: true,
                            enumerable: false,
                            get: function () {
                                var newMessage = message.split(/\r?\n/g);

                                for (var key in properties) {
                                    if (!properties.hasOwnProperty(key)) {
                                        continue;
                                    }

                                    var modifier = properties[key];

                                    if ('message' in modifier) {
                                        newMessage = modifier.message(this[key], newMessage) || newMessage;
                                        if (!isArrayish(newMessage)) {
                                            newMessage = [newMessage];
                                        }
                                    }
                                }

                                return newMessage.join('\n');
                            },
                            set: function (v) {
                                message = v;
                            }
                        });

                        var overwrittenStack = null;

                        var stackDescriptor = Object.getOwnPropertyDescriptor(this, 'stack');
                        var stackGetter = stackDescriptor.get;
                        var stackValue = stackDescriptor.value;
                        delete stackDescriptor.value;
                        delete stackDescriptor.writable;

                        stackDescriptor.set = function (newstack) {
                            overwrittenStack = newstack;
                        };

                        stackDescriptor.get = function () {
                            var stack = (overwrittenStack || ((stackGetter)
                                ? stackGetter.call(this)
                                : stackValue)).split(/\r?\n+/g);

                            // starting in Node 7, the stack builder caches the message.
                            // just replace it.
                            if (!overwrittenStack) {
                                stack[0] = this.name + ': ' + this.message;
                            }

                            var lineCount = 1;
                            for (var key in properties) {
                                if (!properties.hasOwnProperty(key)) {
                                    continue;
                                }

                                var modifier = properties[key];

                                if ('line' in modifier) {
                                    var line = modifier.line(this[key]);
                                    if (line) {
                                        stack.splice(lineCount++, 0, '    ' + line);
                                    }
                                }

                                if ('stack' in modifier) {
                                    modifier.stack(this[key], stack);
                                }
                            }

                            return stack.join('\n');
                        };

                        Object.defineProperty(this, 'stack', stackDescriptor);
                    };

                    if (Object.setPrototypeOf) {
                        Object.setPrototypeOf(errorExError.prototype, Error.prototype);
                        Object.setPrototypeOf(errorExError, Error);
                    } else {
                        util.inherits(errorExError, Error);
                    }

                    return errorExError;
                };

                errorEx.append = function (str, def) {
                    return {
                        message: function (v, message) {
                            v = v || def;

                            if (v) {
                                message[0] += ' ' + str.replace('%s', v.toString());
                            }

                            return message;
                        }
                    };
                };

                errorEx.line = function (str, def) {
                    return {
                        line: function (v) {
                            v = v || def;

                            if (v) {
                                return str.replace('%s', v.toString());
                            }

                            return null;
                        }
                    };
                };

                module.exports = errorEx;


                /***/ }),

            /***/ 614:
            /***/ (function(module) {

                module.exports = require("events");

                /***/ }),

            /***/ 619:
            /***/ (function(module) {

                module.exports = require("constants");

                /***/ }),

            /***/ 621:
            /***/ (function(module, __unusedexports, __webpack_require__) {

                "use strict";

                const figures = __webpack_require__(848);

                module.exports = {
                    error: {
                        badge: figures.cross,
                        color: 'red',
                        label: 'error',
                        logLevel: 'error'
                    },
                    fatal: {
                        badge: figures.cross,
                        color: 'red',
                        label: 'fatal',
                        logLevel: 'error'
                    },
                    fav: {
                        badge: figures('❤'),
                        color: 'magenta',
                        label: 'favorite',
                        logLevel: 'info'
                    },
                    info: {
                        badge: figures.info,
                        color: 'blue',
                        label: 'info',
                        logLevel: 'info'
                    },
                    star: {
                        badge: figures.star,
                        color: 'yellow',
                        label: 'star',
                        logLevel: 'info'
                    },
                    success: {
                        badge: figures.tick,
                        color: 'green',
                        label: 'success',
                        logLevel: 'info'
                    },
                    wait: {
                        badge: figures.ellipsis,
                        color: 'blue',
                        label: 'waiting',
                        logLevel: 'info'
                    },
                    warn: {
                        badge: figures.warning,
                        color: 'yellow',
                        label: 'warning',
                        logLevel: 'warn'
                    },
                    complete: {
                        badge: figures.checkboxOn,
                        color: 'cyan',
                        label: 'complete',
                        logLevel: 'info'
                    },
                    pending: {
                        badge: figures.checkboxOff,
                        color: 'magenta',
                        label: 'pending',
                        logLevel: 'info'
                    },
                    note: {
                        badge: figures.bullet,
                        color: 'blue',
                        label: 'note',
                        logLevel: 'info'
                    },
                    start: {
                        badge: figures.play,
                        color: 'green',
                        label: 'start',
                        logLevel: 'info'
                    },
                    pause: {
                        badge: figures.squareSmallFilled,
                        color: 'yellow',
                        label: 'pause',
                        logLevel: 'info'
                    },
                    debug: {
                        badge: figures('⬤'),
                        color: 'red',
                        label: 'debug',
                        logLevel: 'debug'
                    },
                    await: {
                        badge: figures.ellipsis,
                        color: 'blue',
                        label: 'awaiting',
                        logLevel: 'info'
                    },
                    watch: {
                        badge: figures.ellipsis,
                        color: 'yellow',
                        label: 'watching',
                        logLevel: 'info'
                    },
                    log: {
                        badge: '',
                        color: '',
                        label: '',
                        logLevel: 'info'
                    }
                };


                /***/ }),

            /***/ 622:
            /***/ (function(module) {

                module.exports = require("path");

                /***/ }),

            /***/ 631:
            /***/ (function(module) {

                module.exports = require("net");

                /***/ }),

            /***/ 654:
            /***/ (function(module) {

// This is not the set of all possible signals.
//
// It IS, however, the set of all signals that trigger
// an exit on either Linux or BSD systems.  Linux is a
// superset of the signal names supported on BSD, and
// the unknown signals just fail to register, so we can
// catch that easily enough.
//
// Don't bother with SIGKILL.  It's uncatchable, which
// means that we can't fire any callbacks anyway.
//
// If a user does happen to register a handler on a non-
// fatal signal like SIGWINCH or something, and then
// exit, it'll end up firing `process.emit('exit')`, so
// the handler will be fired anyway.
//
// SIGBUS, SIGFPE, SIGSEGV and SIGILL, when not raised
// artificially, inherently leave the process in a
// state from which it is not safe to try and enter JS
// listeners.
                module.exports = [
                    'SIGABRT',
                    'SIGALRM',
                    'SIGHUP',
                    'SIGINT',
                    'SIGTERM'
                ]

                if (process.platform !== 'win32') {
                    module.exports.push(
                        'SIGVTALRM',
                        'SIGXCPU',
                        'SIGXFSZ',
                        'SIGUSR2',
                        'SIGTRAP',
                        'SIGSYS',
                        'SIGQUIT',
                        'SIGIOT'
                        // should detect profiler and enable/disable accordingly.
                        // see #21
                        // 'SIGPROF'
                    )
                }

                if (process.platform === 'linux') {
                    module.exports.push(
                        'SIGIO',
                        'SIGPOLL',
                        'SIGPWR',
                        'SIGSTKFLT',
                        'SIGUNUSED'
                    )
                }


                /***/ }),

            /***/ 663:
            /***/ (function(module, __unusedexports, __webpack_require__) {

                "use strict";
                /* module decorator */ module = __webpack_require__.nmd(module);

                const colorConvert = __webpack_require__(592);

                const wrapAnsi16 = (fn, offset) => function () {
                    const code = fn.apply(colorConvert, arguments);
                    return `\u001B[${code + offset}m`;
                };

                const wrapAnsi256 = (fn, offset) => function () {
                    const code = fn.apply(colorConvert, arguments);
                    return `\u001B[${38 + offset};5;${code}m`;
                };

                const wrapAnsi16m = (fn, offset) => function () {
                    const rgb = fn.apply(colorConvert, arguments);
                    return `\u001B[${38 + offset};2;${rgb[0]};${rgb[1]};${rgb[2]}m`;
                };

                function assembleStyles() {
                    const codes = new Map();
                    const styles = {
                        modifier: {
                            reset: [0, 0],
                            // 21 isn't widely supported and 22 does the same thing
                            bold: [1, 22],
                            dim: [2, 22],
                            italic: [3, 23],
                            underline: [4, 24],
                            inverse: [7, 27],
                            hidden: [8, 28],
                            strikethrough: [9, 29]
                        },
                        color: {
                            black: [30, 39],
                            red: [31, 39],
                            green: [32, 39],
                            yellow: [33, 39],
                            blue: [34, 39],
                            magenta: [35, 39],
                            cyan: [36, 39],
                            white: [37, 39],
                            gray: [90, 39],

                            // Bright color
                            redBright: [91, 39],
                            greenBright: [92, 39],
                            yellowBright: [93, 39],
                            blueBright: [94, 39],
                            magentaBright: [95, 39],
                            cyanBright: [96, 39],
                            whiteBright: [97, 39]
                        },
                        bgColor: {
                            bgBlack: [40, 49],
                            bgRed: [41, 49],
                            bgGreen: [42, 49],
                            bgYellow: [43, 49],
                            bgBlue: [44, 49],
                            bgMagenta: [45, 49],
                            bgCyan: [46, 49],
                            bgWhite: [47, 49],

                            // Bright color
                            bgBlackBright: [100, 49],
                            bgRedBright: [101, 49],
                            bgGreenBright: [102, 49],
                            bgYellowBright: [103, 49],
                            bgBlueBright: [104, 49],
                            bgMagentaBright: [105, 49],
                            bgCyanBright: [106, 49],
                            bgWhiteBright: [107, 49]
                        }
                    };

                    // Fix humans
                    styles.color.grey = styles.color.gray;

                    for (const groupName of Object.keys(styles)) {
                        const group = styles[groupName];

                        for (const styleName of Object.keys(group)) {
                            const style = group[styleName];

                            styles[styleName] = {
                                open: `\u001B[${style[0]}m`,
                                close: `\u001B[${style[1]}m`
                            };

                            group[styleName] = styles[styleName];

                            codes.set(style[0], style[1]);
                        }

                        Object.defineProperty(styles, groupName, {
                            value: group,
                            enumerable: false
                        });

                        Object.defineProperty(styles, 'codes', {
                            value: codes,
                            enumerable: false
                        });
                    }

                    const ansi2ansi = n => n;
                    const rgb2rgb = (r, g, b) => [r, g, b];

                    styles.color.close = '\u001B[39m';
                    styles.bgColor.close = '\u001B[49m';

                    styles.color.ansi = {
                        ansi: wrapAnsi16(ansi2ansi, 0)
                    };
                    styles.color.ansi256 = {
                        ansi256: wrapAnsi256(ansi2ansi, 0)
                    };
                    styles.color.ansi16m = {
                        rgb: wrapAnsi16m(rgb2rgb, 0)
                    };

                    styles.bgColor.ansi = {
                        ansi: wrapAnsi16(ansi2ansi, 10)
                    };
                    styles.bgColor.ansi256 = {
                        ansi256: wrapAnsi256(ansi2ansi, 10)
                    };
                    styles.bgColor.ansi16m = {
                        rgb: wrapAnsi16m(rgb2rgb, 10)
                    };

                    for (let key of Object.keys(colorConvert)) {
                        if (typeof colorConvert[key] !== 'object') {
                            continue;
                        }

                        const suite = colorConvert[key];

                        if (key === 'ansi16') {
                            key = 'ansi';
                        }

                        if ('ansi16' in suite) {
                            styles.color.ansi[key] = wrapAnsi16(suite.ansi16, 0);
                            styles.bgColor.ansi[key] = wrapAnsi16(suite.ansi16, 10);
                        }

                        if ('ansi256' in suite) {
                            styles.color.ansi256[key] = wrapAnsi256(suite.ansi256, 0);
                            styles.bgColor.ansi256[key] = wrapAnsi256(suite.ansi256, 10);
                        }

                        if ('rgb' in suite) {
                            styles.color.ansi16m[key] = wrapAnsi16m(suite.rgb, 0);
                            styles.bgColor.ansi16m[key] = wrapAnsi16m(suite.rgb, 10);
                        }
                    }

                    return styles;
                }

// Make the export immutable
                Object.defineProperty(module, 'exports', {
                    enumerable: true,
                    get: assembleStyles
                });


                /***/ }),

            /***/ 665:
            /***/ (function(__unusedmodule, exports, __webpack_require__) {

                "use strict";

                var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
                    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
                    return new (P || (P = Promise))(function (resolve, reject) {
                        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
                        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
                        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
                        step((generator = generator.apply(thisArg, _arguments || [])).next());
                    });
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                exports.summary = exports.markdownSummary = exports.SUMMARY_DOCS_URL = exports.SUMMARY_ENV_VAR = void 0;
                const os_1 = __webpack_require__(87);
                const fs_1 = __webpack_require__(747);
                const { access, appendFile, writeFile } = fs_1.promises;
                exports.SUMMARY_ENV_VAR = 'GITHUB_STEP_SUMMARY';
                exports.SUMMARY_DOCS_URL = 'https://docs.github.com/actions/using-workflows/workflow-commands-for-github-actions#adding-a-job-summary';
                class Summary {
                    constructor() {
                        this._buffer = '';
                    }
                    /**
                     * Finds the summary file path from the environment, rejects if env var is not found or file does not exist
                     * Also checks r/w permissions.
                     *
                     * @returns step summary file path
                     */
                    filePath() {
                        return __awaiter(this, void 0, void 0, function* () {
                            if (this._filePath) {
                                return this._filePath;
                            }
                            const pathFromEnv = process.env[exports.SUMMARY_ENV_VAR];
                            if (!pathFromEnv) {
                                throw new Error(`Unable to find environment variable for $${exports.SUMMARY_ENV_VAR}. Check if your runtime environment supports job summaries.`);
                            }
                            try {
                                yield access(pathFromEnv, fs_1.constants.R_OK | fs_1.constants.W_OK);
                            }
                            catch (_a) {
                                throw new Error(`Unable to access summary file: '${pathFromEnv}'. Check if the file has correct read/write permissions.`);
                            }
                            this._filePath = pathFromEnv;
                            return this._filePath;
                        });
                    }
                    /**
                     * Wraps content in an HTML tag, adding any HTML attributes
                     *
                     * @param {string} tag HTML tag to wrap
                     * @param {string | null} content content within the tag
                     * @param {[attribute: string]: string} attrs key-value list of HTML attributes to add
                     *
                     * @returns {string} content wrapped in HTML element
                     */
                    wrap(tag, content, attrs = {}) {
                        const htmlAttrs = Object.entries(attrs)
                            .map(([key, value]) => ` ${key}="${value}"`)
                            .join('');
                        if (!content) {
                            return `<${tag}${htmlAttrs}>`;
                        }
                        return `<${tag}${htmlAttrs}>${content}</${tag}>`;
                    }
                    /**
                     * Writes text in the buffer to the summary buffer file and empties buffer. Will append by default.
                     *
                     * @param {SummaryWriteOptions} [options] (optional) options for write operation
                     *
                     * @returns {Promise<Summary>} summary instance
                     */
                    write(options) {
                        return __awaiter(this, void 0, void 0, function* () {
                            const overwrite = !!(options === null || options === void 0 ? void 0 : options.overwrite);
                            const filePath = yield this.filePath();
                            const writeFunc = overwrite ? writeFile : appendFile;
                            yield writeFunc(filePath, this._buffer, { encoding: 'utf8' });
                            return this.emptyBuffer();
                        });
                    }
                    /**
                     * Clears the summary buffer and wipes the summary file
                     *
                     * @returns {Summary} summary instance
                     */
                    clear() {
                        return __awaiter(this, void 0, void 0, function* () {
                            return this.emptyBuffer().write({ overwrite: true });
                        });
                    }
                    /**
                     * Returns the current summary buffer as a string
                     *
                     * @returns {string} string of summary buffer
                     */
                    stringify() {
                        return this._buffer;
                    }
                    /**
                     * If the summary buffer is empty
                     *
                     * @returns {boolen} true if the buffer is empty
                     */
                    isEmptyBuffer() {
                        return this._buffer.length === 0;
                    }
                    /**
                     * Resets the summary buffer without writing to summary file
                     *
                     * @returns {Summary} summary instance
                     */
                    emptyBuffer() {
                        this._buffer = '';
                        return this;
                    }
                    /**
                     * Adds raw text to the summary buffer
                     *
                     * @param {string} text content to add
                     * @param {boolean} [addEOL=false] (optional) append an EOL to the raw text (default: false)
                     *
                     * @returns {Summary} summary instance
                     */
                    addRaw(text, addEOL = false) {
                        this._buffer += text;
                        return addEOL ? this.addEOL() : this;
                    }
                    /**
                     * Adds the operating system-specific end-of-line marker to the buffer
                     *
                     * @returns {Summary} summary instance
                     */
                    addEOL() {
                        return this.addRaw(os_1.EOL);
                    }
                    /**
                     * Adds an HTML codeblock to the summary buffer
                     *
                     * @param {string} code content to render within fenced code block
                     * @param {string} lang (optional) language to syntax highlight code
                     *
                     * @returns {Summary} summary instance
                     */
                    addCodeBlock(code, lang) {
                        const attrs = Object.assign({}, (lang && { lang }));
                        const element = this.wrap('pre', this.wrap('code', code), attrs);
                        return this.addRaw(element).addEOL();
                    }
                    /**
                     * Adds an HTML list to the summary buffer
                     *
                     * @param {string[]} items list of items to render
                     * @param {boolean} [ordered=false] (optional) if the rendered list should be ordered or not (default: false)
                     *
                     * @returns {Summary} summary instance
                     */
                    addList(items, ordered = false) {
                        const tag = ordered ? 'ol' : 'ul';
                        const listItems = items.map(item => this.wrap('li', item)).join('');
                        const element = this.wrap(tag, listItems);
                        return this.addRaw(element).addEOL();
                    }
                    /**
                     * Adds an HTML table to the summary buffer
                     *
                     * @param {SummaryTableCell[]} rows table rows
                     *
                     * @returns {Summary} summary instance
                     */
                    addTable(rows) {
                        const tableBody = rows
                            .map(row => {
                                const cells = row
                                    .map(cell => {
                                        if (typeof cell === 'string') {
                                            return this.wrap('td', cell);
                                        }
                                        const { header, data, colspan, rowspan } = cell;
                                        const tag = header ? 'th' : 'td';
                                        const attrs = Object.assign(Object.assign({}, (colspan && { colspan })), (rowspan && { rowspan }));
                                        return this.wrap(tag, data, attrs);
                                    })
                                    .join('');
                                return this.wrap('tr', cells);
                            })
                            .join('');
                        const element = this.wrap('table', tableBody);
                        return this.addRaw(element).addEOL();
                    }
                    /**
                     * Adds a collapsable HTML details element to the summary buffer
                     *
                     * @param {string} label text for the closed state
                     * @param {string} content collapsable content
                     *
                     * @returns {Summary} summary instance
                     */
                    addDetails(label, content) {
                        const element = this.wrap('details', this.wrap('summary', label) + content);
                        return this.addRaw(element).addEOL();
                    }
                    /**
                     * Adds an HTML image tag to the summary buffer
                     *
                     * @param {string} src path to the image you to embed
                     * @param {string} alt text description of the image
                     * @param {SummaryImageOptions} options (optional) addition image attributes
                     *
                     * @returns {Summary} summary instance
                     */
                    addImage(src, alt, options) {
                        const { width, height } = options || {};
                        const attrs = Object.assign(Object.assign({}, (width && { width })), (height && { height }));
                        const element = this.wrap('img', null, Object.assign({ src, alt }, attrs));
                        return this.addRaw(element).addEOL();
                    }
                    /**
                     * Adds an HTML section heading element
                     *
                     * @param {string} text heading text
                     * @param {number | string} [level=1] (optional) the heading level, default: 1
                     *
                     * @returns {Summary} summary instance
                     */
                    addHeading(text, level) {
                        const tag = `h${level}`;
                        const allowedTag = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)
                            ? tag
                            : 'h1';
                        const element = this.wrap(allowedTag, text);
                        return this.addRaw(element).addEOL();
                    }
                    /**
                     * Adds an HTML thematic break (<hr>) to the summary buffer
                     *
                     * @returns {Summary} summary instance
                     */
                    addSeparator() {
                        const element = this.wrap('hr', null);
                        return this.addRaw(element).addEOL();
                    }
                    /**
                     * Adds an HTML line break (<br>) to the summary buffer
                     *
                     * @returns {Summary} summary instance
                     */
                    addBreak() {
                        const element = this.wrap('br', null);
                        return this.addRaw(element).addEOL();
                    }
                    /**
                     * Adds an HTML blockquote to the summary buffer
                     *
                     * @param {string} text quote text
                     * @param {string} cite (optional) citation url
                     *
                     * @returns {Summary} summary instance
                     */
                    addQuote(text, cite) {
                        const attrs = Object.assign({}, (cite && { cite }));
                        const element = this.wrap('blockquote', text, attrs);
                        return this.addRaw(element).addEOL();
                    }
                    /**
                     * Adds an HTML anchor tag to the summary buffer
                     *
                     * @param {string} text link text/content
                     * @param {string} href hyperlink
                     *
                     * @returns {Summary} summary instance
                     */
                    addLink(text, href) {
                        const element = this.wrap('a', text, { href });
                        return this.addRaw(element).addEOL();
                    }
                }
                const _summary = new Summary();
                /**
                 * @deprecated use `core.summary`
                 */
                exports.markdownSummary = _summary;
                exports.summary = _summary;
//# sourceMappingURL=summary.js.map

                /***/ }),

            /***/ 669:
            /***/ (function(module) {

                module.exports = require("util");

                /***/ }),

            /***/ 672:
            /***/ (function(__unusedmodule, exports, __webpack_require__) {

                "use strict";

                var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
                    if (k2 === undefined) k2 = k;
                    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
                }) : (function(o, m, k, k2) {
                    if (k2 === undefined) k2 = k;
                    o[k2] = m[k];
                }));
                var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
                    Object.defineProperty(o, "default", { enumerable: true, value: v });
                }) : function(o, v) {
                    o["default"] = v;
                });
                var __importStar = (this && this.__importStar) || function (mod) {
                    if (mod && mod.__esModule) return mod;
                    var result = {};
                    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
                    __setModuleDefault(result, mod);
                    return result;
                };
                var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
                    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
                    return new (P || (P = Promise))(function (resolve, reject) {
                        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
                        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
                        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
                        step((generator = generator.apply(thisArg, _arguments || [])).next());
                    });
                };
                var _a;
                Object.defineProperty(exports, "__esModule", { value: true });
                exports.getCmdPath = exports.tryGetExecutablePath = exports.isRooted = exports.isDirectory = exports.exists = exports.READONLY = exports.UV_FS_O_EXLOCK = exports.IS_WINDOWS = exports.unlink = exports.symlink = exports.stat = exports.rmdir = exports.rm = exports.rename = exports.readlink = exports.readdir = exports.open = exports.mkdir = exports.lstat = exports.copyFile = exports.chmod = void 0;
                const fs = __importStar(__webpack_require__(747));
                const path = __importStar(__webpack_require__(622));
                _a = fs.promises
// export const {open} = 'fs'
                    , exports.chmod = _a.chmod, exports.copyFile = _a.copyFile, exports.lstat = _a.lstat, exports.mkdir = _a.mkdir, exports.open = _a.open, exports.readdir = _a.readdir, exports.readlink = _a.readlink, exports.rename = _a.rename, exports.rm = _a.rm, exports.rmdir = _a.rmdir, exports.stat = _a.stat, exports.symlink = _a.symlink, exports.unlink = _a.unlink;
// export const {open} = 'fs'
                exports.IS_WINDOWS = process.platform === 'win32';
// See https://github.com/nodejs/node/blob/d0153aee367422d0858105abec186da4dff0a0c5/deps/uv/include/uv/win.h#L691
                exports.UV_FS_O_EXLOCK = 0x10000000;
                exports.READONLY = fs.constants.O_RDONLY;
                function exists(fsPath) {
                    return __awaiter(this, void 0, void 0, function* () {
                        try {
                            yield exports.stat(fsPath);
                        }
                        catch (err) {
                            if (err.code === 'ENOENT') {
                                return false;
                            }
                            throw err;
                        }
                        return true;
                    });
                }
                exports.exists = exists;
                function isDirectory(fsPath, useStat = false) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const stats = useStat ? yield exports.stat(fsPath) : yield exports.lstat(fsPath);
                        return stats.isDirectory();
                    });
                }
                exports.isDirectory = isDirectory;
                /**
                 * On OSX/Linux, true if path starts with '/'. On Windows, true for paths like:
                 * \, \hello, \\hello\share, C:, and C:\hello (and corresponding alternate separator cases).
                 */
                function isRooted(p) {
                    p = normalizeSeparators(p);
                    if (!p) {
                        throw new Error('isRooted() parameter "p" cannot be empty');
                    }
                    if (exports.IS_WINDOWS) {
                        return (p.startsWith('\\') || /^[A-Z]:/i.test(p) // e.g. \ or \hello or \\hello
                        ); // e.g. C: or C:\hello
                    }
                    return p.startsWith('/');
                }
                exports.isRooted = isRooted;
                /**
                 * Best effort attempt to determine whether a file exists and is executable.
                 * @param filePath    file path to check
                 * @param extensions  additional file extensions to try
                 * @return if file exists and is executable, returns the file path. otherwise empty string.
                 */
                function tryGetExecutablePath(filePath, extensions) {
                    return __awaiter(this, void 0, void 0, function* () {
                        let stats = undefined;
                        try {
                            // test file exists
                            stats = yield exports.stat(filePath);
                        }
                        catch (err) {
                            if (err.code !== 'ENOENT') {
                                // eslint-disable-next-line no-console
                                console.log(`Unexpected error attempting to determine if executable file exists '${filePath}': ${err}`);
                            }
                        }
                        if (stats && stats.isFile()) {
                            if (exports.IS_WINDOWS) {
                                // on Windows, test for valid extension
                                const upperExt = path.extname(filePath).toUpperCase();
                                if (extensions.some(validExt => validExt.toUpperCase() === upperExt)) {
                                    return filePath;
                                }
                            }
                            else {
                                if (isUnixExecutable(stats)) {
                                    return filePath;
                                }
                            }
                        }
                        // try each extension
                        const originalFilePath = filePath;
                        for (const extension of extensions) {
                            filePath = originalFilePath + extension;
                            stats = undefined;
                            try {
                                stats = yield exports.stat(filePath);
                            }
                            catch (err) {
                                if (err.code !== 'ENOENT') {
                                    // eslint-disable-next-line no-console
                                    console.log(`Unexpected error attempting to determine if executable file exists '${filePath}': ${err}`);
                                }
                            }
                            if (stats && stats.isFile()) {
                                if (exports.IS_WINDOWS) {
                                    // preserve the case of the actual file (since an extension was appended)
                                    try {
                                        const directory = path.dirname(filePath);
                                        const upperName = path.basename(filePath).toUpperCase();
                                        for (const actualName of yield exports.readdir(directory)) {
                                            if (upperName === actualName.toUpperCase()) {
                                                filePath = path.join(directory, actualName);
                                                break;
                                            }
                                        }
                                    }
                                    catch (err) {
                                        // eslint-disable-next-line no-console
                                        console.log(`Unexpected error attempting to determine the actual case of the file '${filePath}': ${err}`);
                                    }
                                    return filePath;
                                }
                                else {
                                    if (isUnixExecutable(stats)) {
                                        return filePath;
                                    }
                                }
                            }
                        }
                        return '';
                    });
                }
                exports.tryGetExecutablePath = tryGetExecutablePath;
                function normalizeSeparators(p) {
                    p = p || '';
                    if (exports.IS_WINDOWS) {
                        // convert slashes on Windows
                        p = p.replace(/\//g, '\\');
                        // remove redundant slashes
                        return p.replace(/\\\\+/g, '\\');
                    }
                    // remove redundant slashes
                    return p.replace(/\/\/+/g, '/');
                }
// on Mac/Linux, test the execute bit
//     R   W  X  R  W X R W X
//   256 128 64 32 16 8 4 2 1
                function isUnixExecutable(stats) {
                    return ((stats.mode & 1) > 0 ||
                        ((stats.mode & 8) > 0 && stats.gid === process.getgid()) ||
                        ((stats.mode & 64) > 0 && stats.uid === process.getuid()));
                }
// Get the path of cmd.exe in windows
                function getCmdPath() {
                    var _a;
                    return (_a = process.env['COMSPEC']) !== null && _a !== void 0 ? _a : `cmd.exe`;
                }
                exports.getCmdPath = getCmdPath;
//# sourceMappingURL=io-util.js.map

                /***/ }),

            /***/ 692:
            /***/ (function(__unusedmodule, exports) {

                "use strict";


                Object.defineProperty(exports, '__esModule', { value: true });

                class Deprecation extends Error {
                    constructor(message) {
                        super(message); // Maintains proper stack trace (only available on V8)

                        /* istanbul ignore next */

                        if (Error.captureStackTrace) {
                            Error.captureStackTrace(this, this.constructor);
                        }

                        this.name = 'Deprecation';
                    }

                }

                exports.Deprecation = Deprecation;


                /***/ }),

            /***/ 695:
            /***/ (function(__unusedmodule, exports, __webpack_require__) {

                "use strict";


                Object.defineProperty(exports, "__esModule", {
                    value: true
                });
                exports.default = void 0;

                var _validate = _interopRequireDefault(__webpack_require__(78));

                function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

                function version(uuid) {
                    if (!(0, _validate.default)(uuid)) {
                        throw TypeError('Invalid UUID');
                    }

                    return parseInt(uuid.substr(14, 1), 16);
                }

                var _default = version;
                exports.default = _default;

                /***/ }),

            /***/ 697:
            /***/ (function(module) {

                "use strict";

                module.exports = (promise, onFinally) => {
                    onFinally = onFinally || (() => {});

                    return promise.then(
                        val => new Promise(resolve => {
                            resolve(onFinally());
                        }).then(() => val),
                        err => new Promise(resolve => {
                            resolve(onFinally());
                        }).then(() => {
                            throw err;
                        })
                    );
                };


                /***/ }),

            /***/ 699:
            /***/ (function(__unusedmodule, exports) {

                "use strict";


                Object.defineProperty(exports, '__esModule', { value: true });

                const REGEX_IS_INSTALLATION_LEGACY = /^v1\./;
                const REGEX_IS_INSTALLATION = /^ghs_/;
                const REGEX_IS_USER_TO_SERVER = /^ghu_/;
                async function auth(token) {
                    const isApp = token.split(/\./).length === 3;
                    const isInstallation = REGEX_IS_INSTALLATION_LEGACY.test(token) || REGEX_IS_INSTALLATION.test(token);
                    const isUserToServer = REGEX_IS_USER_TO_SERVER.test(token);
                    const tokenType = isApp ? "app" : isInstallation ? "installation" : isUserToServer ? "user-to-server" : "oauth";
                    return {
                        type: "token",
                        token: token,
                        tokenType
                    };
                }

                /**
                 * Prefix token for usage in the Authorization header
                 *
                 * @param token OAuth token or JSON Web Token
                 */
                function withAuthorizationPrefix(token) {
                    if (token.split(/\./).length === 3) {
                        return `bearer ${token}`;
                    }

                    return `token ${token}`;
                }

                async function hook(token, request, route, parameters) {
                    const endpoint = request.endpoint.merge(route, parameters);
                    endpoint.headers.authorization = withAuthorizationPrefix(token);
                    return request(endpoint);
                }

                const createTokenAuth = function createTokenAuth(token) {
                    if (!token) {
                        throw new Error("[@octokit/auth-token] No token passed to createTokenAuth");
                    }

                    if (typeof token !== "string") {
                        throw new Error("[@octokit/auth-token] Token passed to createTokenAuth is not a string");
                    }

                    token = token.replace(/^(token|bearer) +/i, "");
                    return Object.assign(auth.bind(null, token), {
                        hook: hook.bind(null, token)
                    });
                };

                exports.createTokenAuth = createTokenAuth;
//# sourceMappingURL=index.js.map


                /***/ }),

            /***/ 719:
            /***/ (function(__unusedmodule, exports, __webpack_require__) {

                "use strict";


                Object.defineProperty(exports, '__esModule', { value: true });

                var request = __webpack_require__(298);
                var universalUserAgent = __webpack_require__(796);

                const VERSION = "4.8.0";

                function _buildMessageForResponseErrors(data) {
                    return `Request failed due to following response errors:\n` + data.errors.map(e => ` - ${e.message}`).join("\n");
                }

                class GraphqlResponseError extends Error {
                    constructor(request, headers, response) {
                        super(_buildMessageForResponseErrors(response));
                        this.request = request;
                        this.headers = headers;
                        this.response = response;
                        this.name = "GraphqlResponseError"; // Expose the errors and response data in their shorthand properties.

                        this.errors = response.errors;
                        this.data = response.data; // Maintains proper stack trace (only available on V8)

                        /* istanbul ignore next */

                        if (Error.captureStackTrace) {
                            Error.captureStackTrace(this, this.constructor);
                        }
                    }

                }

                const NON_VARIABLE_OPTIONS = ["method", "baseUrl", "url", "headers", "request", "query", "mediaType"];
                const FORBIDDEN_VARIABLE_OPTIONS = ["query", "method", "url"];
                const GHES_V3_SUFFIX_REGEX = /\/api\/v3\/?$/;
                function graphql(request, query, options) {
                    if (options) {
                        if (typeof query === "string" && "query" in options) {
                            return Promise.reject(new Error(`[@octokit/graphql] "query" cannot be used as variable name`));
                        }

                        for (const key in options) {
                            if (!FORBIDDEN_VARIABLE_OPTIONS.includes(key)) continue;
                            return Promise.reject(new Error(`[@octokit/graphql] "${key}" cannot be used as variable name`));
                        }
                    }

                    const parsedOptions = typeof query === "string" ? Object.assign({
                        query
                    }, options) : query;
                    const requestOptions = Object.keys(parsedOptions).reduce((result, key) => {
                        if (NON_VARIABLE_OPTIONS.includes(key)) {
                            result[key] = parsedOptions[key];
                            return result;
                        }

                        if (!result.variables) {
                            result.variables = {};
                        }

                        result.variables[key] = parsedOptions[key];
                        return result;
                    }, {}); // workaround for GitHub Enterprise baseUrl set with /api/v3 suffix
                    // https://github.com/octokit/auth-app.js/issues/111#issuecomment-657610451

                    const baseUrl = parsedOptions.baseUrl || request.endpoint.DEFAULTS.baseUrl;

                    if (GHES_V3_SUFFIX_REGEX.test(baseUrl)) {
                        requestOptions.url = baseUrl.replace(GHES_V3_SUFFIX_REGEX, "/api/graphql");
                    }

                    return request(requestOptions).then(response => {
                        if (response.data.errors) {
                            const headers = {};

                            for (const key of Object.keys(response.headers)) {
                                headers[key] = response.headers[key];
                            }

                            throw new GraphqlResponseError(requestOptions, headers, response.data);
                        }

                        return response.data.data;
                    });
                }

                function withDefaults(request$1, newDefaults) {
                    const newRequest = request$1.defaults(newDefaults);

                    const newApi = (query, options) => {
                        return graphql(newRequest, query, options);
                    };

                    return Object.assign(newApi, {
                        defaults: withDefaults.bind(null, newRequest),
                        endpoint: request.request.endpoint
                    });
                }

                const graphql$1 = withDefaults(request.request, {
                    headers: {
                        "user-agent": `octokit-graphql.js/${VERSION} ${universalUserAgent.getUserAgent()}`
                    },
                    method: "POST",
                    url: "/graphql"
                });
                function withCustomRequest(customRequest) {
                    return withDefaults(customRequest, {
                        method: "POST",
                        url: "/graphql"
                    });
                }

                exports.GraphqlResponseError = GraphqlResponseError;
                exports.graphql = graphql$1;
                exports.withCustomRequest = withCustomRequest;
//# sourceMappingURL=index.js.map


                /***/ }),

            /***/ 723:
            /***/ (function(__unusedmodule, exports, __webpack_require__) {

                "use strict";


                Object.defineProperty(exports, '__esModule', { value: true });

                var isPlainObject = __webpack_require__(356);
                var universalUserAgent = __webpack_require__(796);

                function lowercaseKeys(object) {
                    if (!object) {
                        return {};
                    }

                    return Object.keys(object).reduce((newObj, key) => {
                        newObj[key.toLowerCase()] = object[key];
                        return newObj;
                    }, {});
                }

                function mergeDeep(defaults, options) {
                    const result = Object.assign({}, defaults);
                    Object.keys(options).forEach(key => {
                        if (isPlainObject.isPlainObject(options[key])) {
                            if (!(key in defaults)) Object.assign(result, {
                                [key]: options[key]
                            });else result[key] = mergeDeep(defaults[key], options[key]);
                        } else {
                            Object.assign(result, {
                                [key]: options[key]
                            });
                        }
                    });
                    return result;
                }

                function removeUndefinedProperties(obj) {
                    for (const key in obj) {
                        if (obj[key] === undefined) {
                            delete obj[key];
                        }
                    }

                    return obj;
                }

                function merge(defaults, route, options) {
                    if (typeof route === "string") {
                        let [method, url] = route.split(" ");
                        options = Object.assign(url ? {
                            method,
                            url
                        } : {
                            url: method
                        }, options);
                    } else {
                        options = Object.assign({}, route);
                    } // lowercase header names before merging with defaults to avoid duplicates


                    options.headers = lowercaseKeys(options.headers); // remove properties with undefined values before merging

                    removeUndefinedProperties(options);
                    removeUndefinedProperties(options.headers);
                    const mergedOptions = mergeDeep(defaults || {}, options); // mediaType.previews arrays are merged, instead of overwritten

                    if (defaults && defaults.mediaType.previews.length) {
                        mergedOptions.mediaType.previews = defaults.mediaType.previews.filter(preview => !mergedOptions.mediaType.previews.includes(preview)).concat(mergedOptions.mediaType.previews);
                    }

                    mergedOptions.mediaType.previews = mergedOptions.mediaType.previews.map(preview => preview.replace(/-preview/, ""));
                    return mergedOptions;
                }

                function addQueryParameters(url, parameters) {
                    const separator = /\?/.test(url) ? "&" : "?";
                    const names = Object.keys(parameters);

                    if (names.length === 0) {
                        return url;
                    }

                    return url + separator + names.map(name => {
                        if (name === "q") {
                            return "q=" + parameters.q.split("+").map(encodeURIComponent).join("+");
                        }

                        return `${name}=${encodeURIComponent(parameters[name])}`;
                    }).join("&");
                }

                const urlVariableRegex = /\{[^}]+\}/g;

                function removeNonChars(variableName) {
                    return variableName.replace(/^\W+|\W+$/g, "").split(/,/);
                }

                function extractUrlVariableNames(url) {
                    const matches = url.match(urlVariableRegex);

                    if (!matches) {
                        return [];
                    }

                    return matches.map(removeNonChars).reduce((a, b) => a.concat(b), []);
                }

                function omit(object, keysToOmit) {
                    return Object.keys(object).filter(option => !keysToOmit.includes(option)).reduce((obj, key) => {
                        obj[key] = object[key];
                        return obj;
                    }, {});
                }

// Based on https://github.com/bramstein/url-template, licensed under BSD
// TODO: create separate package.
//
// Copyright (c) 2012-2014, Bram Stein
// All rights reserved.
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions
// are met:
//  1. Redistributions of source code must retain the above copyright
//     notice, this list of conditions and the following disclaimer.
//  2. Redistributions in binary form must reproduce the above copyright
//     notice, this list of conditions and the following disclaimer in the
//     documentation and/or other materials provided with the distribution.
//  3. The name of the author may not be used to endorse or promote products
//     derived from this software without specific prior written permission.
// THIS SOFTWARE IS PROVIDED BY THE AUTHOR "AS IS" AND ANY EXPRESS OR IMPLIED
// WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO
// EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
// INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
// BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
// OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
// NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
// EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

                /* istanbul ignore file */
                function encodeReserved(str) {
                    return str.split(/(%[0-9A-Fa-f]{2})/g).map(function (part) {
                        if (!/%[0-9A-Fa-f]/.test(part)) {
                            part = encodeURI(part).replace(/%5B/g, "[").replace(/%5D/g, "]");
                        }

                        return part;
                    }).join("");
                }

                function encodeUnreserved(str) {
                    return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
                        return "%" + c.charCodeAt(0).toString(16).toUpperCase();
                    });
                }

                function encodeValue(operator, value, key) {
                    value = operator === "+" || operator === "#" ? encodeReserved(value) : encodeUnreserved(value);

                    if (key) {
                        return encodeUnreserved(key) + "=" + value;
                    } else {
                        return value;
                    }
                }

                function isDefined(value) {
                    return value !== undefined && value !== null;
                }

                function isKeyOperator(operator) {
                    return operator === ";" || operator === "&" || operator === "?";
                }

                function getValues(context, operator, key, modifier) {
                    var value = context[key],
                        result = [];

                    if (isDefined(value) && value !== "") {
                        if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
                            value = value.toString();

                            if (modifier && modifier !== "*") {
                                value = value.substring(0, parseInt(modifier, 10));
                            }

                            result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : ""));
                        } else {
                            if (modifier === "*") {
                                if (Array.isArray(value)) {
                                    value.filter(isDefined).forEach(function (value) {
                                        result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : ""));
                                    });
                                } else {
                                    Object.keys(value).forEach(function (k) {
                                        if (isDefined(value[k])) {
                                            result.push(encodeValue(operator, value[k], k));
                                        }
                                    });
                                }
                            } else {
                                const tmp = [];

                                if (Array.isArray(value)) {
                                    value.filter(isDefined).forEach(function (value) {
                                        tmp.push(encodeValue(operator, value));
                                    });
                                } else {
                                    Object.keys(value).forEach(function (k) {
                                        if (isDefined(value[k])) {
                                            tmp.push(encodeUnreserved(k));
                                            tmp.push(encodeValue(operator, value[k].toString()));
                                        }
                                    });
                                }

                                if (isKeyOperator(operator)) {
                                    result.push(encodeUnreserved(key) + "=" + tmp.join(","));
                                } else if (tmp.length !== 0) {
                                    result.push(tmp.join(","));
                                }
                            }
                        }
                    } else {
                        if (operator === ";") {
                            if (isDefined(value)) {
                                result.push(encodeUnreserved(key));
                            }
                        } else if (value === "" && (operator === "&" || operator === "?")) {
                            result.push(encodeUnreserved(key) + "=");
                        } else if (value === "") {
                            result.push("");
                        }
                    }

                    return result;
                }

                function parseUrl(template) {
                    return {
                        expand: expand.bind(null, template)
                    };
                }

                function expand(template, context) {
                    var operators = ["+", "#", ".", "/", ";", "?", "&"];
                    return template.replace(/\{([^\{\}]+)\}|([^\{\}]+)/g, function (_, expression, literal) {
                        if (expression) {
                            let operator = "";
                            const values = [];

                            if (operators.indexOf(expression.charAt(0)) !== -1) {
                                operator = expression.charAt(0);
                                expression = expression.substr(1);
                            }

                            expression.split(/,/g).forEach(function (variable) {
                                var tmp = /([^:\*]*)(?::(\d+)|(\*))?/.exec(variable);
                                values.push(getValues(context, operator, tmp[1], tmp[2] || tmp[3]));
                            });

                            if (operator && operator !== "+") {
                                var separator = ",";

                                if (operator === "?") {
                                    separator = "&";
                                } else if (operator !== "#") {
                                    separator = operator;
                                }

                                return (values.length !== 0 ? operator : "") + values.join(separator);
                            } else {
                                return values.join(",");
                            }
                        } else {
                            return encodeReserved(literal);
                        }
                    });
                }

                function parse(options) {
                    // https://fetch.spec.whatwg.org/#methods
                    let method = options.method.toUpperCase(); // replace :varname with {varname} to make it RFC 6570 compatible

                    let url = (options.url || "/").replace(/:([a-z]\w+)/g, "{$1}");
                    let headers = Object.assign({}, options.headers);
                    let body;
                    let parameters = omit(options, ["method", "baseUrl", "url", "headers", "request", "mediaType"]); // extract variable names from URL to calculate remaining variables later

                    const urlVariableNames = extractUrlVariableNames(url);
                    url = parseUrl(url).expand(parameters);

                    if (!/^http/.test(url)) {
                        url = options.baseUrl + url;
                    }

                    const omittedParameters = Object.keys(options).filter(option => urlVariableNames.includes(option)).concat("baseUrl");
                    const remainingParameters = omit(parameters, omittedParameters);
                    const isBinaryRequest = /application\/octet-stream/i.test(headers.accept);

                    if (!isBinaryRequest) {
                        if (options.mediaType.format) {
                            // e.g. application/vnd.github.v3+json => application/vnd.github.v3.raw
                            headers.accept = headers.accept.split(/,/).map(preview => preview.replace(/application\/vnd(\.\w+)(\.v3)?(\.\w+)?(\+json)?$/, `application/vnd$1$2.${options.mediaType.format}`)).join(",");
                        }

                        if (options.mediaType.previews.length) {
                            const previewsFromAcceptHeader = headers.accept.match(/[\w-]+(?=-preview)/g) || [];
                            headers.accept = previewsFromAcceptHeader.concat(options.mediaType.previews).map(preview => {
                                const format = options.mediaType.format ? `.${options.mediaType.format}` : "+json";
                                return `application/vnd.github.${preview}-preview${format}`;
                            }).join(",");
                        }
                    } // for GET/HEAD requests, set URL query parameters from remaining parameters
                    // for PATCH/POST/PUT/DELETE requests, set request body from remaining parameters


                    if (["GET", "HEAD"].includes(method)) {
                        url = addQueryParameters(url, remainingParameters);
                    } else {
                        if ("data" in remainingParameters) {
                            body = remainingParameters.data;
                        } else {
                            if (Object.keys(remainingParameters).length) {
                                body = remainingParameters;
                            } else {
                                headers["content-length"] = 0;
                            }
                        }
                    } // default content-type for JSON if body is set


                    if (!headers["content-type"] && typeof body !== "undefined") {
                        headers["content-type"] = "application/json; charset=utf-8";
                    } // GitHub expects 'content-length: 0' header for PUT/PATCH requests without body.
                    // fetch does not allow to set `content-length` header, but we can set body to an empty string


                    if (["PATCH", "PUT"].includes(method) && typeof body === "undefined") {
                        body = "";
                    } // Only return body/request keys if present


                    return Object.assign({
                        method,
                        url,
                        headers
                    }, typeof body !== "undefined" ? {
                        body
                    } : null, options.request ? {
                        request: options.request
                    } : null);
                }

                function endpointWithDefaults(defaults, route, options) {
                    return parse(merge(defaults, route, options));
                }

                function withDefaults(oldDefaults, newDefaults) {
                    const DEFAULTS = merge(oldDefaults, newDefaults);
                    const endpoint = endpointWithDefaults.bind(null, DEFAULTS);
                    return Object.assign(endpoint, {
                        DEFAULTS,
                        defaults: withDefaults.bind(null, DEFAULTS),
                        merge: merge.bind(null, DEFAULTS),
                        parse
                    });
                }

                const VERSION = "6.0.12";

                const userAgent = `octokit-endpoint.js/${VERSION} ${universalUserAgent.getUserAgent()}`; // DEFAULTS has all properties set that EndpointOptions has, except url.
// So we use RequestParameters and add method as additional required property.

                const DEFAULTS = {
                    method: "GET",
                    baseUrl: "https://api.github.com",
                    headers: {
                        accept: "application/vnd.github.v3+json",
                        "user-agent": userAgent
                    },
                    mediaType: {
                        format: "",
                        previews: []
                    }
                };

                const endpoint = withDefaults(null, DEFAULTS);

                exports.endpoint = endpoint;
//# sourceMappingURL=index.js.map


                /***/ }),

            /***/ 733:
            /***/ (function(__unusedmodule, exports, __webpack_require__) {

                "use strict";


                Object.defineProperty(exports, "__esModule", {
                    value: true
                });
                exports.default = void 0;

                var _rng = _interopRequireDefault(__webpack_require__(844));

                var _stringify = _interopRequireDefault(__webpack_require__(411));

                function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

                function v4(options, buf, offset) {
                    options = options || {};

                    const rnds = options.random || (options.rng || _rng.default)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`


                    rnds[6] = rnds[6] & 0x0f | 0x40;
                    rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

                    if (buf) {
                        offset = offset || 0;

                        for (let i = 0; i < 16; ++i) {
                            buf[offset + i] = rnds[i];
                        }

                        return buf;
                    }

                    return (0, _stringify.default)(rnds);
                }

                var _default = v4;
                exports.default = _default;

                /***/ }),

            /***/ 742:
            /***/ (function(__unusedmodule, exports, __webpack_require__) {

                "use strict";

                var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
                    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
                    return new (P || (P = Promise))(function (resolve, reject) {
                        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
                        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
                        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
                        step((generator = generator.apply(thisArg, _arguments || [])).next());
                    });
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                exports.OidcClient = void 0;
                const http_client_1 = __webpack_require__(425);
                const auth_1 = __webpack_require__(554);
                const core_1 = __webpack_require__(470);
                class OidcClient {
                    static createHttpClient(allowRetry = true, maxRetry = 10) {
                        const requestOptions = {
                            allowRetries: allowRetry,
                            maxRetries: maxRetry
                        };
                        return new http_client_1.HttpClient('actions/oidc-client', [new auth_1.BearerCredentialHandler(OidcClient.getRequestToken())], requestOptions);
                    }
                    static getRequestToken() {
                        const token = process.env['ACTIONS_ID_TOKEN_REQUEST_TOKEN'];
                        if (!token) {
                            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_TOKEN env variable');
                        }
                        return token;
                    }
                    static getIDTokenUrl() {
                        const runtimeUrl = process.env['ACTIONS_ID_TOKEN_REQUEST_URL'];
                        if (!runtimeUrl) {
                            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_URL env variable');
                        }
                        return runtimeUrl;
                    }
                    static getCall(id_token_url) {
                        var _a;
                        return __awaiter(this, void 0, void 0, function* () {
                            const httpclient = OidcClient.createHttpClient();
                            const res = yield httpclient
                                .getJson(id_token_url)
                                .catch(error => {
                                    throw new Error(`Failed to get ID Token. \n 
        Error Code : ${error.statusCode}\n 
        Error Message: ${error.result.message}`);
                                });
                            const id_token = (_a = res.result) === null || _a === void 0 ? void 0 : _a.value;
                            if (!id_token) {
                                throw new Error('Response json body do not have ID Token field');
                            }
                            return id_token;
                        });
                    }
                    static getIDToken(audience) {
                        return __awaiter(this, void 0, void 0, function* () {
                            try {
                                // New ID Token is requested from action service
                                let id_token_url = OidcClient.getIDTokenUrl();
                                if (audience) {
                                    const encodedAudience = encodeURIComponent(audience);
                                    id_token_url = `${id_token_url}&audience=${encodedAudience}`;
                                }
                                core_1.debug(`ID token url is ${id_token_url}`);
                                const id_token = yield OidcClient.getCall(id_token_url);
                                core_1.setSecret(id_token);
                                return id_token;
                            }
                            catch (error) {
                                throw new Error(`Error message: ${error.message}`);
                            }
                        });
                    }
                }
                exports.OidcClient = OidcClient;
//# sourceMappingURL=oidc-utils.js.map

                /***/ }),

            /***/ 747:
            /***/ (function(module) {

                module.exports = require("fs");

                /***/ }),

            /***/ 751:
            /***/ (function(module) {

                "use strict";


                var conversions = {};
                module.exports = conversions;

                function sign(x) {
                    return x < 0 ? -1 : 1;
                }

                function evenRound(x) {
                    // Round x to the nearest integer, choosing the even integer if it lies halfway between two.
                    if ((x % 1) === 0.5 && (x & 1) === 0) { // [even number].5; round down (i.e. floor)
                        return Math.floor(x);
                    } else {
                        return Math.round(x);
                    }
                }

                function createNumberConversion(bitLength, typeOpts) {
                    if (!typeOpts.unsigned) {
                        --bitLength;
                    }
                    const lowerBound = typeOpts.unsigned ? 0 : -Math.pow(2, bitLength);
                    const upperBound = Math.pow(2, bitLength) - 1;

                    const moduloVal = typeOpts.moduloBitLength ? Math.pow(2, typeOpts.moduloBitLength) : Math.pow(2, bitLength);
                    const moduloBound = typeOpts.moduloBitLength ? Math.pow(2, typeOpts.moduloBitLength - 1) : Math.pow(2, bitLength - 1);

                    return function(V, opts) {
                        if (!opts) opts = {};

                        let x = +V;

                        if (opts.enforceRange) {
                            if (!Number.isFinite(x)) {
                                throw new TypeError("Argument is not a finite number");
                            }

                            x = sign(x) * Math.floor(Math.abs(x));
                            if (x < lowerBound || x > upperBound) {
                                throw new TypeError("Argument is not in byte range");
                            }

                            return x;
                        }

                        if (!isNaN(x) && opts.clamp) {
                            x = evenRound(x);

                            if (x < lowerBound) x = lowerBound;
                            if (x > upperBound) x = upperBound;
                            return x;
                        }

                        if (!Number.isFinite(x) || x === 0) {
                            return 0;
                        }

                        x = sign(x) * Math.floor(Math.abs(x));
                        x = x % moduloVal;

                        if (!typeOpts.unsigned && x >= moduloBound) {
                            return x - moduloVal;
                        } else if (typeOpts.unsigned) {
                            if (x < 0) {
                                x += moduloVal;
                            } else if (x === -0) { // don't return negative zero
                                return 0;
                            }
                        }

                        return x;
                    }
                }

                conversions["void"] = function () {
                    return undefined;
                };

                conversions["boolean"] = function (val) {
                    return !!val;
                };

                conversions["byte"] = createNumberConversion(8, { unsigned: false });
                conversions["octet"] = createNumberConversion(8, { unsigned: true });

                conversions["short"] = createNumberConversion(16, { unsigned: false });
                conversions["unsigned short"] = createNumberConversion(16, { unsigned: true });

                conversions["long"] = createNumberConversion(32, { unsigned: false });
                conversions["unsigned long"] = createNumberConversion(32, { unsigned: true });

                conversions["long long"] = createNumberConversion(32, { unsigned: false, moduloBitLength: 64 });
                conversions["unsigned long long"] = createNumberConversion(32, { unsigned: true, moduloBitLength: 64 });

                conversions["double"] = function (V) {
                    const x = +V;

                    if (!Number.isFinite(x)) {
                        throw new TypeError("Argument is not a finite floating-point value");
                    }

                    return x;
                };

                conversions["unrestricted double"] = function (V) {
                    const x = +V;

                    if (isNaN(x)) {
                        throw new TypeError("Argument is NaN");
                    }

                    return x;
                };

// not quite valid, but good enough for JS
                conversions["float"] = conversions["double"];
                conversions["unrestricted float"] = conversions["unrestricted double"];

                conversions["DOMString"] = function (V, opts) {
                    if (!opts) opts = {};

                    if (opts.treatNullAsEmptyString && V === null) {
                        return "";
                    }

                    return String(V);
                };

                conversions["ByteString"] = function (V, opts) {
                    const x = String(V);
                    let c = undefined;
                    for (let i = 0; (c = x.codePointAt(i)) !== undefined; ++i) {
                        if (c > 255) {
                            throw new TypeError("Argument is not a valid bytestring");
                        }
                    }

                    return x;
                };

                conversions["USVString"] = function (V) {
                    const S = String(V);
                    const n = S.length;
                    const U = [];
                    for (let i = 0; i < n; ++i) {
                        const c = S.charCodeAt(i);
                        if (c < 0xD800 || c > 0xDFFF) {
                            U.push(String.fromCodePoint(c));
                        } else if (0xDC00 <= c && c <= 0xDFFF) {
                            U.push(String.fromCodePoint(0xFFFD));
                        } else {
                            if (i === n - 1) {
                                U.push(String.fromCodePoint(0xFFFD));
                            } else {
                                const d = S.charCodeAt(i + 1);
                                if (0xDC00 <= d && d <= 0xDFFF) {
                                    const a = c & 0x3FF;
                                    const b = d & 0x3FF;
                                    U.push(String.fromCodePoint((2 << 15) + (2 << 9) * a + b));
                                    ++i;
                                } else {
                                    U.push(String.fromCodePoint(0xFFFD));
                                }
                            }
                        }
                    }

                    return U.join('');
                };

                conversions["Date"] = function (V, opts) {
                    if (!(V instanceof Date)) {
                        throw new TypeError("Argument is not a Date object");
                    }
                    if (isNaN(V)) {
                        return undefined;
                    }

                    return V;
                };

                conversions["RegExp"] = function (V, opts) {
                    if (!(V instanceof RegExp)) {
                        V = new RegExp(V);
                    }

                    return V;
                };


                /***/ }),

            /***/ 759:
            /***/ (function(module, __unusedexports, __webpack_require__) {

                "use strict";

                const Signale = __webpack_require__(276);

                module.exports = Object.assign(new Signale(), {Signale});


                /***/ }),

            /***/ 761:
            /***/ (function(module) {

                module.exports = require("zlib");

                /***/ }),

            /***/ 763:
            /***/ (function(module) {

                module.exports = removeHook;

                function removeHook(state, name, method) {
                    if (!state.registry[name]) {
                        return;
                    }

                    var index = state.registry[name]
                        .map(function (registered) {
                            return registered.orig;
                        })
                        .indexOf(method);

                    if (index === -1) {
                        return;
                    }

                    state.registry[name].splice(index, 1);
                }


                /***/ }),

            /***/ 767:
            /***/ (function(module, __unusedexports, __webpack_require__) {

                "use strict";

                const pLimit = __webpack_require__(523);

                class EndError extends Error {
                    constructor(value) {
                        super();
                        this.value = value;
                    }
                }

// the input can also be a promise, so we `Promise.all()` them both
                const finder = el => Promise.all(el).then(val => val[1] === true && Promise.reject(new EndError(val[0])));

                module.exports = (iterable, tester, opts) => {
                    opts = Object.assign({
                        concurrency: Infinity,
                        preserveOrder: true
                    }, opts);

                    const limit = pLimit(opts.concurrency);

                    // start all the promises concurrently with optional limit
                    const items = Array.from(iterable).map(el => [el, limit(() => Promise.resolve(el).then(tester))]);

                    // check the promises either serially or concurrently
                    const checkLimit = pLimit(opts.preserveOrder ? 1 : Infinity);

                    return Promise.all(items.map(el => checkLimit(() => finder(el))))
                        .then(() => {})
                        .catch(err => err instanceof EndError ? err.value : Promise.reject(err));
                };


                /***/ }),

            /***/ 768:
            /***/ (function(module) {

                "use strict";

                module.exports = function (x) {
                    var lf = typeof x === 'string' ? '\n' : '\n'.charCodeAt();
                    var cr = typeof x === 'string' ? '\r' : '\r'.charCodeAt();

                    if (x[x.length - 1] === lf) {
                        x = x.slice(0, x.length - 1);
                    }

                    if (x[x.length - 1] === cr) {
                        x = x.slice(0, x.length - 1);
                    }

                    return x;
                };


                /***/ }),

            /***/ 794:
            /***/ (function(module) {

                module.exports = require("stream");

                /***/ }),

            /***/ 796:
            /***/ (function(__unusedmodule, exports) {

                "use strict";


                Object.defineProperty(exports, '__esModule', { value: true });

                function getUserAgent() {
                    if (typeof navigator === "object" && "userAgent" in navigator) {
                        return navigator.userAgent;
                    }

                    if (typeof process === "object" && "version" in process) {
                        return `Node.js/${process.version.substr(1)} (${process.platform}; ${process.arch})`;
                    }

                    return "<environment undetectable>";
                }

                exports.getUserAgent = getUserAgent;
//# sourceMappingURL=index.js.map


                /***/ }),

            /***/ 802:
            /***/ (function(module) {

                "use strict";


                const processFn = (fn, opts) => function () {
                    const P = opts.promiseModule;
                    const args = new Array(arguments.length);

                    for (let i = 0; i < arguments.length; i++) {
                        args[i] = arguments[i];
                    }

                    return new P((resolve, reject) => {
                        if (opts.errorFirst) {
                            args.push(function (err, result) {
                                if (opts.multiArgs) {
                                    const results = new Array(arguments.length - 1);

                                    for (let i = 1; i < arguments.length; i++) {
                                        results[i - 1] = arguments[i];
                                    }

                                    if (err) {
                                        results.unshift(err);
                                        reject(results);
                                    } else {
                                        resolve(results);
                                    }
                                } else if (err) {
                                    reject(err);
                                } else {
                                    resolve(result);
                                }
                            });
                        } else {
                            args.push(function (result) {
                                if (opts.multiArgs) {
                                    const results = new Array(arguments.length - 1);

                                    for (let i = 0; i < arguments.length; i++) {
                                        results[i] = arguments[i];
                                    }

                                    resolve(results);
                                } else {
                                    resolve(result);
                                }
                            });
                        }

                        fn.apply(this, args);
                    });
                };

                module.exports = (obj, opts) => {
                    opts = Object.assign({
                        exclude: [/.+(Sync|Stream)$/],
                        errorFirst: true,
                        promiseModule: Promise
                    }, opts);

                    const filter = key => {
                        const match = pattern => typeof pattern === 'string' ? key === pattern : pattern.test(key);
                        return opts.include ? opts.include.some(match) : !opts.exclude.some(match);
                    };

                    let ret;
                    if (typeof obj === 'function') {
                        ret = function () {
                            if (opts.excludeMain) {
                                return obj.apply(this, arguments);
                            }

                            return processFn(obj, opts).apply(this, arguments);
                        };
                    } else {
                        ret = Object.create(Object.getPrototypeOf(obj));
                    }

                    for (const key in obj) { // eslint-disable-line guard-for-in
                        const x = obj[key];
                        ret[key] = typeof x === 'function' && filter(key) ? processFn(x, opts) : x;
                    }

                    return ret;
                };


                /***/ }),

            /***/ 803:
            /***/ (function(__unusedmodule, exports, __webpack_require__) {

                "use strict";


                Object.defineProperty(exports, "__esModule", {
                    value: true
                });
                exports.default = void 0;

                var _crypto = _interopRequireDefault(__webpack_require__(417));

                function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

                function md5(bytes) {
                    if (Array.isArray(bytes)) {
                        bytes = Buffer.from(bytes);
                    } else if (typeof bytes === 'string') {
                        bytes = Buffer.from(bytes, 'utf8');
                    }

                    return _crypto.default.createHash('md5').update(bytes).digest();
                }

                var _default = md5;
                exports.default = _default;

                /***/ }),

            /***/ 813:
            /***/ (function(module, __unusedexports, __webpack_require__) {

                var fs = __webpack_require__(747)
                var core
                if (process.platform === 'win32' || global.TESTING_WINDOWS) {
                    core = __webpack_require__(818)
                } else {
                    core = __webpack_require__(197)
                }

                module.exports = isexe
                isexe.sync = sync

                function isexe (path, options, cb) {
                    if (typeof options === 'function') {
                        cb = options
                        options = {}
                    }

                    if (!cb) {
                        if (typeof Promise !== 'function') {
                            throw new TypeError('callback not provided')
                        }

                        return new Promise(function (resolve, reject) {
                            isexe(path, options || {}, function (er, is) {
                                if (er) {
                                    reject(er)
                                } else {
                                    resolve(is)
                                }
                            })
                        })
                    }

                    core(path, options || {}, function (er, is) {
                        // ignore EACCES because that just means we aren't allowed to run it
                        if (er) {
                            if (er.code === 'EACCES' || options && options.ignoreErrors) {
                                er = null
                                is = false
                            }
                        }
                        cb(er, is)
                    })
                }

                function sync (path, options) {
                    // my kingdom for a filtered catch
                    try {
                        return core.sync(path, options || {})
                    } catch (er) {
                        if (options && options.ignoreErrors || er.code === 'EACCES') {
                            return false
                        } else {
                            throw er
                        }
                    }
                }


                /***/ }),

            /***/ 814:
            /***/ (function(module, __unusedexports, __webpack_require__) {

                module.exports = which
                which.sync = whichSync

                var isWindows = process.platform === 'win32' ||
                    process.env.OSTYPE === 'cygwin' ||
                    process.env.OSTYPE === 'msys'

                var path = __webpack_require__(622)
                var COLON = isWindows ? ';' : ':'
                var isexe = __webpack_require__(813)

                function getNotFoundError (cmd) {
                    var er = new Error('not found: ' + cmd)
                    er.code = 'ENOENT'

                    return er
                }

                function getPathInfo (cmd, opt) {
                    var colon = opt.colon || COLON
                    var pathEnv = opt.path || process.env.PATH || ''
                    var pathExt = ['']

                    pathEnv = pathEnv.split(colon)

                    var pathExtExe = ''
                    if (isWindows) {
                        pathEnv.unshift(process.cwd())
                        pathExtExe = (opt.pathExt || process.env.PATHEXT || '.EXE;.CMD;.BAT;.COM')
                        pathExt = pathExtExe.split(colon)


                        // Always test the cmd itself first.  isexe will check to make sure
                        // it's found in the pathExt set.
                        if (cmd.indexOf('.') !== -1 && pathExt[0] !== '')
                            pathExt.unshift('')
                    }

                    // If it has a slash, then we don't bother searching the pathenv.
                    // just check the file itself, and that's it.
                    if (cmd.match(/\//) || isWindows && cmd.match(/\\/))
                        pathEnv = ['']

                    return {
                        env: pathEnv,
                        ext: pathExt,
                        extExe: pathExtExe
                    }
                }

                function which (cmd, opt, cb) {
                    if (typeof opt === 'function') {
                        cb = opt
                        opt = {}
                    }

                    var info = getPathInfo(cmd, opt)
                    var pathEnv = info.env
                    var pathExt = info.ext
                    var pathExtExe = info.extExe
                    var found = []

                    ;(function F (i, l) {
                        if (i === l) {
                            if (opt.all && found.length)
                                return cb(null, found)
                            else
                                return cb(getNotFoundError(cmd))
                        }

                        var pathPart = pathEnv[i]
                        if (pathPart.charAt(0) === '"' && pathPart.slice(-1) === '"')
                            pathPart = pathPart.slice(1, -1)

                        var p = path.join(pathPart, cmd)
                        if (!pathPart && (/^\.[\\\/]/).test(cmd)) {
                            p = cmd.slice(0, 2) + p
                        }
                        ;(function E (ii, ll) {
                            if (ii === ll) return F(i + 1, l)
                            var ext = pathExt[ii]
                            isexe(p + ext, { pathExt: pathExtExe }, function (er, is) {
                                if (!er && is) {
                                    if (opt.all)
                                        found.push(p + ext)
                                    else
                                        return cb(null, p + ext)
                                }
                                return E(ii + 1, ll)
                            })
                        })(0, pathExt.length)
                    })(0, pathEnv.length)
                }

                function whichSync (cmd, opt) {
                    opt = opt || {}

                    var info = getPathInfo(cmd, opt)
                    var pathEnv = info.env
                    var pathExt = info.ext
                    var pathExtExe = info.extExe
                    var found = []

                    for (var i = 0, l = pathEnv.length; i < l; i ++) {
                        var pathPart = pathEnv[i]
                        if (pathPart.charAt(0) === '"' && pathPart.slice(-1) === '"')
                            pathPart = pathPart.slice(1, -1)

                        var p = path.join(pathPart, cmd)
                        if (!pathPart && /^\.[\\\/]/.test(cmd)) {
                            p = cmd.slice(0, 2) + p
                        }
                        for (var j = 0, ll = pathExt.length; j < ll; j ++) {
                            var cur = p + pathExt[j]
                            var is
                            try {
                                is = isexe.sync(cur, { pathExt: pathExtExe })
                                if (is) {
                                    if (opt.all)
                                        found.push(cur)
                                    else
                                        return cur
                                }
                            } catch (ex) {}
                        }
                    }

                    if (opt.all && found.length)
                        return found

                    if (opt.nothrow)
                        return null

                    throw getNotFoundError(cmd)
                }


                /***/ }),

            /***/ 815:
            /***/ (function(module) {

                module.exports = require("punycode");

                /***/ }),

            /***/ 816:
            /***/ (function(module) {

                "use strict";

                module.exports = /^#!.*/;


                /***/ }),

            /***/ 818:
            /***/ (function(module, __unusedexports, __webpack_require__) {

                module.exports = isexe
                isexe.sync = sync

                var fs = __webpack_require__(747)

                function checkPathExt (path, options) {
                    var pathext = options.pathExt !== undefined ?
                        options.pathExt : process.env.PATHEXT

                    if (!pathext) {
                        return true
                    }

                    pathext = pathext.split(';')
                    if (pathext.indexOf('') !== -1) {
                        return true
                    }
                    for (var i = 0; i < pathext.length; i++) {
                        var p = pathext[i].toLowerCase()
                        if (p && path.substr(-p.length).toLowerCase() === p) {
                            return true
                        }
                    }
                    return false
                }

                function checkStat (stat, path, options) {
                    if (!stat.isSymbolicLink() && !stat.isFile()) {
                        return false
                    }
                    return checkPathExt(path, options)
                }

                function isexe (path, options, cb) {
                    fs.stat(path, function (er, stat) {
                        cb(er, er ? false : checkStat(stat, path, options))
                    })
                }

                function sync (path, options) {
                    return checkStat(fs.statSync(path), path, options)
                }


                /***/ }),

            /***/ 835:
            /***/ (function(module) {

                module.exports = require("url");

                /***/ }),

            /***/ 841:
            /***/ (function(module) {

                "use strict";

                const TEMPLATE_REGEX = /(?:\\(u[a-f\d]{4}|x[a-f\d]{2}|.))|(?:\{(~)?(\w+(?:\([^)]*\))?(?:\.\w+(?:\([^)]*\))?)*)(?:[ \t]|(?=\r?\n)))|(\})|((?:.|[\r\n\f])+?)/gi;
                const STYLE_REGEX = /(?:^|\.)(\w+)(?:\(([^)]*)\))?/g;
                const STRING_REGEX = /^(['"])((?:\\.|(?!\1)[^\\])*)\1$/;
                const ESCAPE_REGEX = /\\(u[a-f\d]{4}|x[a-f\d]{2}|.)|([^\\])/gi;

                const ESCAPES = new Map([
                    ['n', '\n'],
                    ['r', '\r'],
                    ['t', '\t'],
                    ['b', '\b'],
                    ['f', '\f'],
                    ['v', '\v'],
                    ['0', '\0'],
                    ['\\', '\\'],
                    ['e', '\u001B'],
                    ['a', '\u0007']
                ]);

                function unescape(c) {
                    if ((c[0] === 'u' && c.length === 5) || (c[0] === 'x' && c.length === 3)) {
                        return String.fromCharCode(parseInt(c.slice(1), 16));
                    }

                    return ESCAPES.get(c) || c;
                }

                function parseArguments(name, args) {
                    const results = [];
                    const chunks = args.trim().split(/\s*,\s*/g);
                    let matches;

                    for (const chunk of chunks) {
                        if (!isNaN(chunk)) {
                            results.push(Number(chunk));
                        } else if ((matches = chunk.match(STRING_REGEX))) {
                            results.push(matches[2].replace(ESCAPE_REGEX, (m, escape, chr) => escape ? unescape(escape) : chr));
                        } else {
                            throw new Error(`Invalid Chalk template style argument: ${chunk} (in style '${name}')`);
                        }
                    }

                    return results;
                }

                function parseStyle(style) {
                    STYLE_REGEX.lastIndex = 0;

                    const results = [];
                    let matches;

                    while ((matches = STYLE_REGEX.exec(style)) !== null) {
                        const name = matches[1];

                        if (matches[2]) {
                            const args = parseArguments(name, matches[2]);
                            results.push([name].concat(args));
                        } else {
                            results.push([name]);
                        }
                    }

                    return results;
                }

                function buildStyle(chalk, styles) {
                    const enabled = {};

                    for (const layer of styles) {
                        for (const style of layer.styles) {
                            enabled[style[0]] = layer.inverse ? null : style.slice(1);
                        }
                    }

                    let current = chalk;
                    for (const styleName of Object.keys(enabled)) {
                        if (Array.isArray(enabled[styleName])) {
                            if (!(styleName in current)) {
                                throw new Error(`Unknown Chalk style: ${styleName}`);
                            }

                            if (enabled[styleName].length > 0) {
                                current = current[styleName].apply(current, enabled[styleName]);
                            } else {
                                current = current[styleName];
                            }
                        }
                    }

                    return current;
                }

                module.exports = (chalk, tmp) => {
                    const styles = [];
                    const chunks = [];
                    let chunk = [];

                    // eslint-disable-next-line max-params
                    tmp.replace(TEMPLATE_REGEX, (m, escapeChar, inverse, style, close, chr) => {
                        if (escapeChar) {
                            chunk.push(unescape(escapeChar));
                        } else if (style) {
                            const str = chunk.join('');
                            chunk = [];
                            chunks.push(styles.length === 0 ? str : buildStyle(chalk, styles)(str));
                            styles.push({inverse, styles: parseStyle(style)});
                        } else if (close) {
                            if (styles.length === 0) {
                                throw new Error('Found extraneous } in Chalk template literal');
                            }

                            chunks.push(buildStyle(chalk, styles)(chunk.join('')));
                            chunk = [];
                            styles.pop();
                        } else {
                            chunk.push(chr);
                        }
                    });

                    chunks.push(chunk.join(''));

                    if (styles.length > 0) {
                        const errMsg = `Chalk template literal is missing ${styles.length} closing bracket${styles.length === 1 ? '' : 's'} (\`}\`)`;
                        throw new Error(errMsg);
                    }

                    return chunks.join('');
                };


                /***/ }),

            /***/ 842:
            /***/ (function(__unusedmodule, exports) {

                "use strict";


                Object.defineProperty(exports, '__esModule', { value: true });

                const Endpoints = {
                    actions: {
                        addSelectedRepoToOrgSecret: ["PUT /orgs/{org}/actions/secrets/{secret_name}/repositories/{repository_id}"],
                        cancelWorkflowRun: ["POST /repos/{owner}/{repo}/actions/runs/{run_id}/cancel"],
                        createOrUpdateOrgSecret: ["PUT /orgs/{org}/actions/secrets/{secret_name}"],
                        createOrUpdateRepoSecret: ["PUT /repos/{owner}/{repo}/actions/secrets/{secret_name}", {}, {
                            renamedParameters: {
                                name: "secret_name"
                            }
                        }],
                        createOrUpdateSecretForRepo: ["PUT /repos/{owner}/{repo}/actions/secrets/{secret_name}", {}, {
                            renamed: ["actions", "createOrUpdateRepoSecret"],
                            renamedParameters: {
                                name: "secret_name"
                            }
                        }],
                        createRegistrationToken: ["POST /repos/{owner}/{repo}/actions/runners/registration-token", {}, {
                            renamed: ["actions", "createRegistrationTokenForRepo"]
                        }],
                        createRegistrationTokenForOrg: ["POST /orgs/{org}/actions/runners/registration-token"],
                        createRegistrationTokenForRepo: ["POST /repos/{owner}/{repo}/actions/runners/registration-token"],
                        createRemoveToken: ["POST /repos/{owner}/{repo}/actions/runners/remove-token", {}, {
                            renamed: ["actions", "createRemoveTokenForRepo"]
                        }],
                        createRemoveTokenForOrg: ["POST /orgs/{org}/actions/runners/remove-token"],
                        createRemoveTokenForRepo: ["POST /repos/{owner}/{repo}/actions/runners/remove-token"],
                        deleteArtifact: ["DELETE /repos/{owner}/{repo}/actions/artifacts/{artifact_id}"],
                        deleteOrgSecret: ["DELETE /orgs/{org}/actions/secrets/{secret_name}"],
                        deleteRepoSecret: ["DELETE /repos/{owner}/{repo}/actions/secrets/{secret_name}", {}, {
                            renamedParameters: {
                                name: "secret_name"
                            }
                        }],
                        deleteSecretFromRepo: ["DELETE /repos/{owner}/{repo}/actions/secrets/{secret_name}", {}, {
                            renamed: ["actions", "deleteRepoSecret"],
                            renamedParameters: {
                                name: "secret_name"
                            }
                        }],
                        deleteSelfHostedRunnerFromOrg: ["DELETE /orgs/{org}/actions/runners/{runner_id}"],
                        deleteSelfHostedRunnerFromRepo: ["DELETE /repos/{owner}/{repo}/actions/runners/{runner_id}"],
                        deleteWorkflowRunLogs: ["DELETE /repos/{owner}/{repo}/actions/runs/{run_id}/logs"],
                        downloadArtifact: ["GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}/{archive_format}"],
                        downloadJobLogsForWorkflowRun: ["GET /repos/{owner}/{repo}/actions/jobs/{job_id}/logs"],
                        downloadWorkflowJobLogs: ["GET /repos/{owner}/{repo}/actions/jobs/{job_id}/logs", {}, {
                            renamed: ["actions", "downloadJobLogsForWorkflowRun"]
                        }],
                        downloadWorkflowRunLogs: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}/logs"],
                        getArtifact: ["GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}"],
                        getJobForWorkflowRun: ["GET /repos/{owner}/{repo}/actions/jobs/{job_id}"],
                        getOrgPublicKey: ["GET /orgs/{org}/actions/secrets/public-key"],
                        getOrgSecret: ["GET /orgs/{org}/actions/secrets/{secret_name}"],
                        getPublicKey: ["GET /repos/{owner}/{repo}/actions/secrets/public-key", {}, {
                            renamed: ["actions", "getRepoPublicKey"]
                        }],
                        getRepoPublicKey: ["GET /repos/{owner}/{repo}/actions/secrets/public-key"],
                        getRepoSecret: ["GET /repos/{owner}/{repo}/actions/secrets/{secret_name}", {}, {
                            renamedParameters: {
                                name: "secret_name"
                            }
                        }],
                        getSecret: ["GET /repos/{owner}/{repo}/actions/secrets/{secret_name}", {}, {
                            renamed: ["actions", "getRepoSecret"],
                            renamedParameters: {
                                name: "secret_name"
                            }
                        }],
                        getSelfHostedRunner: ["GET /repos/{owner}/{repo}/actions/runners/{runner_id}", {}, {
                            renamed: ["actions", "getSelfHostedRunnerForRepo"]
                        }],
                        getSelfHostedRunnerForOrg: ["GET /orgs/{org}/actions/runners/{runner_id}"],
                        getSelfHostedRunnerForRepo: ["GET /repos/{owner}/{repo}/actions/runners/{runner_id}"],
                        getWorkflow: ["GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}"],
                        getWorkflowJob: ["GET /repos/{owner}/{repo}/actions/jobs/{job_id}", {}, {
                            renamed: ["actions", "getJobForWorkflowRun"]
                        }],
                        getWorkflowRun: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}"],
                        getWorkflowRunUsage: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}/timing"],
                        getWorkflowUsage: ["GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/timing"],
                        listArtifactsForRepo: ["GET /repos/{owner}/{repo}/actions/artifacts"],
                        listDownloadsForSelfHostedRunnerApplication: ["GET /repos/{owner}/{repo}/actions/runners/downloads", {}, {
                            renamed: ["actions", "listRunnerApplicationsForRepo"]
                        }],
                        listJobsForWorkflowRun: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs"],
                        listOrgSecrets: ["GET /orgs/{org}/actions/secrets"],
                        listRepoSecrets: ["GET /repos/{owner}/{repo}/actions/secrets"],
                        listRepoWorkflowRuns: ["GET /repos/{owner}/{repo}/actions/runs", {}, {
                            renamed: ["actions", "listWorkflowRunsForRepo"]
                        }],
                        listRepoWorkflows: ["GET /repos/{owner}/{repo}/actions/workflows"],
                        listRunnerApplicationsForOrg: ["GET /orgs/{org}/actions/runners/downloads"],
                        listRunnerApplicationsForRepo: ["GET /repos/{owner}/{repo}/actions/runners/downloads"],
                        listSecretsForRepo: ["GET /repos/{owner}/{repo}/actions/secrets", {}, {
                            renamed: ["actions", "listRepoSecrets"]
                        }],
                        listSelectedReposForOrgSecret: ["GET /orgs/{org}/actions/secrets/{secret_name}/repositories"],
                        listSelfHostedRunnersForOrg: ["GET /orgs/{org}/actions/runners"],
                        listSelfHostedRunnersForRepo: ["GET /repos/{owner}/{repo}/actions/runners"],
                        listWorkflowJobLogs: ["GET /repos/{owner}/{repo}/actions/jobs/{job_id}/logs", {}, {
                            renamed: ["actions", "downloadWorkflowJobLogs"]
                        }],
                        listWorkflowRunArtifacts: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}/artifacts"],
                        listWorkflowRunLogs: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}/logs", {}, {
                            renamed: ["actions", "downloadWorkflowRunLogs"]
                        }],
                        listWorkflowRuns: ["GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs"],
                        listWorkflowRunsForRepo: ["GET /repos/{owner}/{repo}/actions/runs"],
                        reRunWorkflow: ["POST /repos/{owner}/{repo}/actions/runs/{run_id}/rerun"],
                        removeSelectedRepoFromOrgSecret: ["DELETE /orgs/{org}/actions/secrets/{secret_name}/repositories/{repository_id}"],
                        removeSelfHostedRunner: ["DELETE /repos/{owner}/{repo}/actions/runners/{runner_id}", {}, {
                            renamed: ["actions", "deleteSelfHostedRunnerFromRepo"]
                        }],
                        setSelectedReposForOrgSecret: ["PUT /orgs/{org}/actions/secrets/{secret_name}/repositories"]
                    },
                    activity: {
                        checkRepoIsStarredByAuthenticatedUser: ["GET /user/starred/{owner}/{repo}"],
                        checkStarringRepo: ["GET /user/starred/{owner}/{repo}", {}, {
                            renamed: ["activity", "checkRepoIsStarredByAuthenticatedUser"]
                        }],
                        deleteRepoSubscription: ["DELETE /repos/{owner}/{repo}/subscription"],
                        deleteThreadSubscription: ["DELETE /notifications/threads/{thread_id}/subscription"],
                        getFeeds: ["GET /feeds"],
                        getRepoSubscription: ["GET /repos/{owner}/{repo}/subscription"],
                        getThread: ["GET /notifications/threads/{thread_id}"],
                        getThreadSubscription: ["PUT /notifications", {}, {
                            renamed: ["activity", "getThreadSubscriptionForAuthenticatedUser"]
                        }],
                        getThreadSubscriptionForAuthenticatedUser: ["GET /notifications/threads/{thread_id}/subscription"],
                        listEventsForAuthenticatedUser: ["GET /users/{username}/events"],
                        listEventsForOrg: ["GET /users/{username}/events/orgs/{org}", {}, {
                            renamed: ["activity", "listOrgEventsForAuthenticatedUser"]
                        }],
                        listEventsForUser: ["GET /users/{username}/events", {}, {
                            renamed: ["activity", "listEventsForAuthenticatedUser"]
                        }],
                        listFeeds: ["GET /feeds", {}, {
                            renamed: ["activity", "getFeeds"]
                        }],
                        listNotifications: ["GET /notifications", {}, {
                            renamed: ["activity", "listNotificationsForAuthenticatedUser"]
                        }],
                        listNotificationsForAuthenticatedUser: ["GET /notifications"],
                        listNotificationsForRepo: ["GET /repos/{owner}/{repo}/notifications", {}, {
                            renamed: ["activity", "listRepoNotificationsForAuthenticatedUser"]
                        }],
                        listOrgEventsForAuthenticatedUser: ["GET /users/{username}/events/orgs/{org}"],
                        listPublicEvents: ["GET /events"],
                        listPublicEventsForOrg: ["GET /orgs/{org}/events", {}, {
                            renamed: ["activity", "listPublicOrgEvents"]
                        }],
                        listPublicEventsForRepoNetwork: ["GET /networks/{owner}/{repo}/events"],
                        listPublicEventsForUser: ["GET /users/{username}/events/public"],
                        listPublicOrgEvents: ["GET /orgs/{org}/events"],
                        listReceivedEventsForUser: ["GET /users/{username}/received_events"],
                        listReceivedPublicEventsForUser: ["GET /users/{username}/received_events/public"],
                        listRepoEvents: ["GET /repos/{owner}/{repo}/events"],
                        listRepoNotificationsForAuthenticatedUser: ["GET /repos/{owner}/{repo}/notifications"],
                        listReposStarredByAuthenticatedUser: ["GET /user/starred"],
                        listReposStarredByUser: ["GET /users/{username}/starred"],
                        listReposWatchedByUser: ["GET /users/{username}/subscriptions"],
                        listStargazersForRepo: ["GET /repos/{owner}/{repo}/stargazers"],
                        listWatchedReposForAuthenticatedUser: ["GET /user/subscriptions"],
                        listWatchersForRepo: ["GET /repos/{owner}/{repo}/subscribers"],
                        markAsRead: ["PUT /notifications", {}, {
                            renamed: ["activity", "markNotificationsAsRead"]
                        }],
                        markNotificationsAsRead: ["PUT /notifications"],
                        markNotificationsAsReadForRepo: ["PUT /repos/{owner}/{repo}/notifications", {}, {
                            renamed: ["activity", "markRepoNotificationsAsRead"]
                        }],
                        markRepoNotificationsAsRead: ["PUT /repos/{owner}/{repo}/notifications"],
                        markThreadAsRead: ["PATCH /notifications/threads/{thread_id}"],
                        setRepoSubscription: ["PUT /repos/{owner}/{repo}/subscription"],
                        setThreadSubscription: ["PUT /notifications/threads/{thread_id}/subscription"],
                        starRepo: ["PUT /user/starred/{owner}/{repo}", {}, {
                            renamed: ["activity", "starRepoForAuthenticatedUser"]
                        }],
                        starRepoForAuthenticatedUser: ["PUT /user/starred/{owner}/{repo}"],
                        unstarRepo: ["DELETE /user/starred/{owner}/{repo}", {}, {
                            renamed: ["activity", "unstarRepoForAuthenticatedUser"]
                        }],
                        unstarRepoForAuthenticatedUser: ["DELETE /user/starred/{owner}/{repo}"]
                    },
                    apps: {
                        addRepoToInstallation: ["PUT /user/installations/{installation_id}/repositories/{repository_id}", {
                            mediaType: {
                                previews: ["machine-man"]
                            }
                        }],
                        checkAccountIsAssociatedWithAny: ["GET /marketplace_listing/accounts/{account_id}", {}, {
                            renamed: ["apps", "getSubscriptionPlanForAccount"]
                        }],
                        checkAccountIsAssociatedWithAnyStubbed: ["GET /marketplace_listing/stubbed/accounts/{account_id}", {}, {
                            renamed: ["apps", "getSubscriptionPlanForAccountStubbed"]
                        }],
                        checkToken: ["POST /applications/{client_id}/token"],
                        createContentAttachment: ["POST /content_references/{content_reference_id}/attachments", {
                            mediaType: {
                                previews: ["corsair"]
                            }
                        }],
                        createFromManifest: ["POST /app-manifests/{code}/conversions"],
                        createInstallationAccessToken: ["POST /app/installations/{installation_id}/access_tokens", {
                            mediaType: {
                                previews: ["machine-man"]
                            }
                        }],
                        createInstallationToken: ["POST /app/installations/{installation_id}/access_tokens", {
                            mediaType: {
                                previews: ["machine-man"]
                            }
                        }, {
                            renamed: ["apps", "createInstallationAccessToken"]
                        }],
                        deleteAuthorization: ["DELETE /applications/{client_id}/grant"],
                        deleteInstallation: ["DELETE /app/installations/{installation_id}", {
                            mediaType: {
                                previews: ["machine-man"]
                            }
                        }],
                        deleteToken: ["DELETE /applications/{client_id}/token"],
                        getAuthenticated: ["GET /app", {
                            mediaType: {
                                previews: ["machine-man"]
                            }
                        }],
                        getBySlug: ["GET /apps/{app_slug}", {
                            mediaType: {
                                previews: ["machine-man"]
                            }
                        }],
                        getInstallation: ["GET /app/installations/{installation_id}", {
                            mediaType: {
                                previews: ["machine-man"]
                            }
                        }],
                        getOrgInstallation: ["GET /orgs/{org}/installation", {
                            mediaType: {
                                previews: ["machine-man"]
                            }
                        }],
                        getRepoInstallation: ["GET /repos/{owner}/{repo}/installation", {
                            mediaType: {
                                previews: ["machine-man"]
                            }
                        }],
                        getSubscriptionPlanForAccount: ["GET /marketplace_listing/accounts/{account_id}"],
                        getSubscriptionPlanForAccountStubbed: ["GET /marketplace_listing/stubbed/accounts/{account_id}"],
                        getUserInstallation: ["GET /users/{username}/installation", {
                            mediaType: {
                                previews: ["machine-man"]
                            }
                        }],
                        listAccountsForPlan: ["GET /marketplace_listing/plans/{plan_id}/accounts"],
                        listAccountsForPlanStubbed: ["GET /marketplace_listing/stubbed/plans/{plan_id}/accounts"],
                        listAccountsUserOrOrgOnPlan: ["GET /marketplace_listing/plans/{plan_id}/accounts", {}, {
                            renamed: ["apps", "listAccountsForPlan"]
                        }],
                        listAccountsUserOrOrgOnPlanStubbed: ["GET /marketplace_listing/stubbed/plans/{plan_id}/accounts", {}, {
                            renamed: ["apps", "listAccountsForPlanStubbed"]
                        }],
                        listInstallationReposForAuthenticatedUser: ["GET /user/installations/{installation_id}/repositories", {
                            mediaType: {
                                previews: ["machine-man"]
                            }
                        }],
                        listInstallations: ["GET /app/installations", {
                            mediaType: {
                                previews: ["machine-man"]
                            }
                        }],
                        listInstallationsForAuthenticatedUser: ["GET /user/installations", {
                            mediaType: {
                                previews: ["machine-man"]
                            }
                        }],
                        listMarketplacePurchasesForAuthenticatedUser: ["GET /user/marketplace_purchases", {}, {
                            renamed: ["apps", "listSubscriptionsForAuthenticatedUser"]
                        }],
                        listMarketplacePurchasesForAuthenticatedUserStubbed: ["GET /user/marketplace_purchases/stubbed", {}, {
                            renamed: ["apps", "listSubscriptionsForAuthenticatedUserStubbed"]
                        }],
                        listPlans: ["GET /marketplace_listing/plans"],
                        listPlansStubbed: ["GET /marketplace_listing/stubbed/plans"],
                        listRepos: ["GET /installation/repositories", {
                            mediaType: {
                                previews: ["machine-man"]
                            }
                        }, {
                            renamed: ["apps", "listReposAccessibleToInstallation"]
                        }],
                        listReposAccessibleToInstallation: ["GET /installation/repositories", {
                            mediaType: {
                                previews: ["machine-man"]
                            }
                        }],
                        listSubscriptionsForAuthenticatedUser: ["GET /user/marketplace_purchases"],
                        listSubscriptionsForAuthenticatedUserStubbed: ["GET /user/marketplace_purchases/stubbed"],
                        removeRepoFromInstallation: ["DELETE /user/installations/{installation_id}/repositories/{repository_id}", {
                            mediaType: {
                                previews: ["machine-man"]
                            }
                        }],
                        resetToken: ["PATCH /applications/{client_id}/token"],
                        revokeInstallationAccessToken: ["DELETE /installation/token"],
                        revokeInstallationToken: ["DELETE /installation/token", {}, {
                            renamed: ["apps", "revokeInstallationAccessToken"]
                        }],
                        suspendInstallation: ["PUT /app/installations/{installation_id}/suspended"],
                        unsuspendInstallation: ["DELETE /app/installations/{installation_id}/suspended"]
                    },
                    checks: {
                        create: ["POST /repos/{owner}/{repo}/check-runs", {
                            mediaType: {
                                previews: ["antiope"]
                            }
                        }],
                        createSuite: ["POST /repos/{owner}/{repo}/check-suites", {
                            mediaType: {
                                previews: ["antiope"]
                            }
                        }],
                        get: ["GET /repos/{owner}/{repo}/check-runs/{check_run_id}", {
                            mediaType: {
                                previews: ["antiope"]
                            }
                        }],
                        getSuite: ["GET /repos/{owner}/{repo}/check-suites/{check_suite_id}", {
                            mediaType: {
                                previews: ["antiope"]
                            }
                        }],
                        listAnnotations: ["GET /repos/{owner}/{repo}/check-runs/{check_run_id}/annotations", {
                            mediaType: {
                                previews: ["antiope"]
                            }
                        }],
                        listForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/check-runs", {
                            mediaType: {
                                previews: ["antiope"]
                            }
                        }],
                        listForSuite: ["GET /repos/{owner}/{repo}/check-suites/{check_suite_id}/check-runs", {
                            mediaType: {
                                previews: ["antiope"]
                            }
                        }],
                        listSuitesForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/check-suites", {
                            mediaType: {
                                previews: ["antiope"]
                            }
                        }],
                        rerequestSuite: ["POST /repos/{owner}/{repo}/check-suites/{check_suite_id}/rerequest", {
                            mediaType: {
                                previews: ["antiope"]
                            }
                        }],
                        setSuitesPreferences: ["PATCH /repos/{owner}/{repo}/check-suites/preferences", {
                            mediaType: {
                                previews: ["antiope"]
                            }
                        }],
                        update: ["PATCH /repos/{owner}/{repo}/check-runs/{check_run_id}", {
                            mediaType: {
                                previews: ["antiope"]
                            }
                        }]
                    },
                    codeScanning: {
                        getAlert: ["GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_id}"],
                        listAlertsForRepo: ["GET /repos/{owner}/{repo}/code-scanning/alerts"]
                    },
                    codesOfConduct: {
                        getAllCodesOfConduct: ["GET /codes_of_conduct", {
                            mediaType: {
                                previews: ["scarlet-witch"]
                            }
                        }],
                        getConductCode: ["GET /codes_of_conduct/{key}", {
                            mediaType: {
                                previews: ["scarlet-witch"]
                            }
                        }],
                        getForRepo: ["GET /repos/{owner}/{repo}/community/code_of_conduct", {
                            mediaType: {
                                previews: ["scarlet-witch"]
                            }
                        }],
                        listConductCodes: ["GET /codes_of_conduct", {
                            mediaType: {
                                previews: ["scarlet-witch"]
                            }
                        }, {
                            renamed: ["codesOfConduct", "getAllCodesOfConduct"]
                        }]
                    },
                    emojis: {
                        get: ["GET /emojis"]
                    },
                    gists: {
                        checkIsStarred: ["GET /gists/{gist_id}/star"],
                        create: ["POST /gists"],
                        createComment: ["POST /gists/{gist_id}/comments"],
                        delete: ["DELETE /gists/{gist_id}"],
                        deleteComment: ["DELETE /gists/{gist_id}/comments/{comment_id}"],
                        fork: ["POST /gists/{gist_id}/forks"],
                        get: ["GET /gists/{gist_id}"],
                        getComment: ["GET /gists/{gist_id}/comments/{comment_id}"],
                        getRevision: ["GET /gists/{gist_id}/{sha}"],
                        list: ["GET /gists"],
                        listComments: ["GET /gists/{gist_id}/comments"],
                        listCommits: ["GET /gists/{gist_id}/commits"],
                        listForUser: ["GET /users/{username}/gists"],
                        listForks: ["GET /gists/{gist_id}/forks"],
                        listPublic: ["GET /gists/public"],
                        listPublicForUser: ["GET /users/{username}/gists", {}, {
                            renamed: ["gists", "listForUser"]
                        }],
                        listStarred: ["GET /gists/starred"],
                        star: ["PUT /gists/{gist_id}/star"],
                        unstar: ["DELETE /gists/{gist_id}/star"],
                        update: ["PATCH /gists/{gist_id}"],
                        updateComment: ["PATCH /gists/{gist_id}/comments/{comment_id}"]
                    },
                    git: {
                        createBlob: ["POST /repos/{owner}/{repo}/git/blobs"],
                        createCommit: ["POST /repos/{owner}/{repo}/git/commits"],
                        createRef: ["POST /repos/{owner}/{repo}/git/refs"],
                        createTag: ["POST /repos/{owner}/{repo}/git/tags"],
                        createTree: ["POST /repos/{owner}/{repo}/git/trees"],
                        deleteRef: ["DELETE /repos/{owner}/{repo}/git/refs/{ref}"],
                        getBlob: ["GET /repos/{owner}/{repo}/git/blobs/{file_sha}"],
                        getCommit: ["GET /repos/{owner}/{repo}/git/commits/{commit_sha}"],
                        getRef: ["GET /repos/{owner}/{repo}/git/ref/{ref}"],
                        getTag: ["GET /repos/{owner}/{repo}/git/tags/{tag_sha}"],
                        getTree: ["GET /repos/{owner}/{repo}/git/trees/{tree_sha}"],
                        listMatchingRefs: ["GET /repos/{owner}/{repo}/git/matching-refs/{ref}"],
                        updateRef: ["PATCH /repos/{owner}/{repo}/git/refs/{ref}"]
                    },
                    gitignore: {
                        getAllTemplates: ["GET /gitignore/templates"],
                        getTemplate: ["GET /gitignore/templates/{name}"],
                        listTemplates: ["GET /gitignore/templates", {}, {
                            renamed: ["gitignore", "getAllTemplates"]
                        }]
                    },
                    interactions: {
                        addOrUpdateRestrictionsForOrg: ["PUT /orgs/{org}/interaction-limits", {
                            mediaType: {
                                previews: ["sombra"]
                            }
                        }, {
                            renamed: ["interactions", "setRestrictionsForOrg"]
                        }],
                        addOrUpdateRestrictionsForRepo: ["PUT /repos/{owner}/{repo}/interaction-limits", {
                            mediaType: {
                                previews: ["sombra"]
                            }
                        }, {
                            renamed: ["interactions", "setRestrictionsForRepo"]
                        }],
                        getRestrictionsForOrg: ["GET /orgs/{org}/interaction-limits", {
                            mediaType: {
                                previews: ["sombra"]
                            }
                        }],
                        getRestrictionsForRepo: ["GET /repos/{owner}/{repo}/interaction-limits", {
                            mediaType: {
                                previews: ["sombra"]
                            }
                        }],
                        removeRestrictionsForOrg: ["DELETE /orgs/{org}/interaction-limits", {
                            mediaType: {
                                previews: ["sombra"]
                            }
                        }],
                        removeRestrictionsForRepo: ["DELETE /repos/{owner}/{repo}/interaction-limits", {
                            mediaType: {
                                previews: ["sombra"]
                            }
                        }],
                        setRestrictionsForOrg: ["PUT /orgs/{org}/interaction-limits", {
                            mediaType: {
                                previews: ["sombra"]
                            }
                        }],
                        setRestrictionsForRepo: ["PUT /repos/{owner}/{repo}/interaction-limits", {
                            mediaType: {
                                previews: ["sombra"]
                            }
                        }]
                    },
                    issues: {
                        addAssignees: ["POST /repos/{owner}/{repo}/issues/{issue_number}/assignees"],
                        addLabels: ["POST /repos/{owner}/{repo}/issues/{issue_number}/labels"],
                        checkAssignee: ["GET /repos/{owner}/{repo}/assignees/{assignee}", {}, {
                            renamed: ["issues", "checkUserCanBeAssigned"]
                        }],
                        checkUserCanBeAssigned: ["GET /repos/{owner}/{repo}/assignees/{assignee}"],
                        create: ["POST /repos/{owner}/{repo}/issues"],
                        createComment: ["POST /repos/{owner}/{repo}/issues/{issue_number}/comments"],
                        createLabel: ["POST /repos/{owner}/{repo}/labels"],
                        createMilestone: ["POST /repos/{owner}/{repo}/milestones"],
                        deleteComment: ["DELETE /repos/{owner}/{repo}/issues/comments/{comment_id}"],
                        deleteLabel: ["DELETE /repos/{owner}/{repo}/labels/{name}"],
                        deleteMilestone: ["DELETE /repos/{owner}/{repo}/milestones/{milestone_number}"],
                        get: ["GET /repos/{owner}/{repo}/issues/{issue_number}"],
                        getComment: ["GET /repos/{owner}/{repo}/issues/comments/{comment_id}"],
                        getEvent: ["GET /repos/{owner}/{repo}/issues/events/{event_id}"],
                        getLabel: ["GET /repos/{owner}/{repo}/labels/{name}"],
                        getMilestone: ["GET /repos/{owner}/{repo}/milestones/{milestone_number}"],
                        list: ["GET /issues"],
                        listAssignees: ["GET /repos/{owner}/{repo}/assignees"],
                        listComments: ["GET /repos/{owner}/{repo}/issues/{issue_number}/comments"],
                        listCommentsForRepo: ["GET /repos/{owner}/{repo}/issues/comments"],
                        listEvents: ["GET /repos/{owner}/{repo}/issues/{issue_number}/events"],
                        listEventsForRepo: ["GET /repos/{owner}/{repo}/issues/events"],
                        listEventsForTimeline: ["GET /repos/{owner}/{repo}/issues/{issue_number}/timeline", {
                            mediaType: {
                                previews: ["mockingbird"]
                            }
                        }],
                        listForAuthenticatedUser: ["GET /user/issues"],
                        listForOrg: ["GET /orgs/{org}/issues"],
                        listForRepo: ["GET /repos/{owner}/{repo}/issues"],
                        listLabelsForMilestone: ["GET /repos/{owner}/{repo}/milestones/{milestone_number}/labels"],
                        listLabelsForRepo: ["GET /repos/{owner}/{repo}/labels"],
                        listLabelsOnIssue: ["GET /repos/{owner}/{repo}/issues/{issue_number}/labels"],
                        listMilestones: ["GET /repos/{owner}/{repo}/milestones"],
                        listMilestonesForRepo: ["GET /repos/{owner}/{repo}/milestones", {}, {
                            renamed: ["issues", "listMilestones"]
                        }],
                        lock: ["PUT /repos/{owner}/{repo}/issues/{issue_number}/lock"],
                        removeAllLabels: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels"],
                        removeAssignees: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/assignees"],
                        removeLabel: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels/{name}"],
                        removeLabels: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels", {}, {
                            renamed: ["issues", "removeAllLabels"]
                        }],
                        replaceAllLabels: ["PUT /repos/{owner}/{repo}/issues/{issue_number}/labels", {}, {
                            renamed: ["issues", "setLabels"]
                        }],
                        replaceLabels: ["PUT /repos/{owner}/{repo}/issues/{issue_number}/labels", {}, {
                            renamed: ["issues", "replaceAllLabels"]
                        }],
                        setLabels: ["PUT /repos/{owner}/{repo}/issues/{issue_number}/labels"],
                        unlock: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/lock"],
                        update: ["PATCH /repos/{owner}/{repo}/issues/{issue_number}"],
                        updateComment: ["PATCH /repos/{owner}/{repo}/issues/comments/{comment_id}"],
                        updateLabel: ["PATCH /repos/{owner}/{repo}/labels/{name}"],
                        updateMilestone: ["PATCH /repos/{owner}/{repo}/milestones/{milestone_number}"]
                    },
                    licenses: {
                        get: ["GET /licenses/{license}"],
                        getAllCommonlyUsed: ["GET /licenses"],
                        getForRepo: ["GET /repos/{owner}/{repo}/license"],
                        listCommonlyUsed: ["GET /licenses", {}, {
                            renamed: ["licenses", "getAllCommonlyUsed"]
                        }]
                    },
                    markdown: {
                        render: ["POST /markdown"],
                        renderRaw: ["POST /markdown/raw", {
                            headers: {
                                "content-type": "text/plain; charset=utf-8"
                            }
                        }]
                    },
                    meta: {
                        get: ["GET /meta"]
                    },
                    migrations: {
                        cancelImport: ["DELETE /repos/{owner}/{repo}/import"],
                        deleteArchiveForAuthenticatedUser: ["DELETE /user/migrations/{migration_id}/archive", {
                            mediaType: {
                                previews: ["wyandotte"]
                            }
                        }],
                        deleteArchiveForOrg: ["DELETE /orgs/{org}/migrations/{migration_id}/archive", {
                            mediaType: {
                                previews: ["wyandotte"]
                            }
                        }],
                        downloadArchiveForOrg: ["GET /orgs/{org}/migrations/{migration_id}/archive", {
                            mediaType: {
                                previews: ["wyandotte"]
                            }
                        }],
                        getArchiveForAuthenticatedUser: ["GET /user/migrations/{migration_id}/archive", {
                            mediaType: {
                                previews: ["wyandotte"]
                            }
                        }],
                        getCommitAuthors: ["GET /repos/{owner}/{repo}/import/authors"],
                        getImportProgress: ["GET /repos/{owner}/{repo}/import", {}, {
                            renamed: ["migrations", "getImportStatus"]
                        }],
                        getImportStatus: ["GET /repos/{owner}/{repo}/import"],
                        getLargeFiles: ["GET /repos/{owner}/{repo}/import/large_files"],
                        getStatusForAuthenticatedUser: ["GET /user/migrations/{migration_id}", {
                            mediaType: {
                                previews: ["wyandotte"]
                            }
                        }],
                        getStatusForOrg: ["GET /orgs/{org}/migrations/{migration_id}", {
                            mediaType: {
                                previews: ["wyandotte"]
                            }
                        }],
                        listForAuthenticatedUser: ["GET /user/migrations", {
                            mediaType: {
                                previews: ["wyandotte"]
                            }
                        }],
                        listForOrg: ["GET /orgs/{org}/migrations", {
                            mediaType: {
                                previews: ["wyandotte"]
                            }
                        }],
                        listReposForOrg: ["GET /orgs/{org}/migrations/{migration_id}/repositories", {
                            mediaType: {
                                previews: ["wyandotte"]
                            }
                        }],
                        listReposForUser: ["GET /user/{migration_id}/repositories", {
                            mediaType: {
                                previews: ["wyandotte"]
                            }
                        }],
                        mapCommitAuthor: ["PATCH /repos/{owner}/{repo}/import/authors/{author_id}"],
                        setLfsPreference: ["PATCH /repos/{owner}/{repo}/import/lfs"],
                        startForAuthenticatedUser: ["POST /user/migrations"],
                        startForOrg: ["POST /orgs/{org}/migrations"],
                        startImport: ["PUT /repos/{owner}/{repo}/import"],
                        unlockRepoForAuthenticatedUser: ["DELETE /user/migrations/{migration_id}/repos/{repo_name}/lock", {
                            mediaType: {
                                previews: ["wyandotte"]
                            }
                        }],
                        unlockRepoForOrg: ["DELETE /orgs/{org}/migrations/{migration_id}/repos/{repo_name}/lock", {
                            mediaType: {
                                previews: ["wyandotte"]
                            }
                        }],
                        updateImport: ["PATCH /repos/{owner}/{repo}/import"]
                    },
                    orgs: {
                        addOrUpdateMembership: ["PUT /orgs/{org}/memberships/{username}", {}, {
                            renamed: ["orgs", "setMembershipForUser"]
                        }],
                        blockUser: ["PUT /orgs/{org}/blocks/{username}"],
                        checkBlockedUser: ["GET /orgs/{org}/blocks/{username}"],
                        checkMembership: ["GET /orgs/{org}/members/{username}", {}, {
                            renamed: ["orgs", "checkMembershipForUser"]
                        }],
                        checkMembershipForUser: ["GET /orgs/{org}/members/{username}"],
                        checkPublicMembership: ["GET /orgs/{org}/public_members/{username}", {}, {
                            renamed: ["orgs", "checkPublicMembershipForUser"]
                        }],
                        checkPublicMembershipForUser: ["GET /orgs/{org}/public_members/{username}"],
                        concealMembership: ["DELETE /orgs/{org}/public_members/{username}", {}, {
                            renamed: ["orgs", "removePublicMembershipForAuthenticatedUser"]
                        }],
                        convertMemberToOutsideCollaborator: ["PUT /orgs/{org}/outside_collaborators/{username}"],
                        createHook: ["POST /orgs/{org}/hooks", {}, {
                            renamed: ["orgs", "createWebhook"]
                        }],
                        createInvitation: ["POST /orgs/{org}/invitations"],
                        createWebhook: ["POST /orgs/{org}/hooks"],
                        deleteHook: ["DELETE /orgs/{org}/hooks/{hook_id}", {}, {
                            renamed: ["orgs", "deleteWebhook"]
                        }],
                        deleteWebhook: ["DELETE /orgs/{org}/hooks/{hook_id}"],
                        get: ["GET /orgs/{org}"],
                        getHook: ["GET /orgs/{org}/hooks/{hook_id}", {}, {
                            renamed: ["orgs", "getWebhook"]
                        }],
                        getMembership: ["GET /orgs/{org}/memberships/{username}", {}, {
                            renamed: ["orgs", "getMembershipForUser"]
                        }],
                        getMembershipForAuthenticatedUser: ["GET /user/memberships/orgs/{org}"],
                        getMembershipForUser: ["GET /orgs/{org}/memberships/{username}"],
                        getWebhook: ["GET /orgs/{org}/hooks/{hook_id}"],
                        list: ["GET /organizations"],
                        listAppInstallations: ["GET /orgs/{org}/installations", {
                            mediaType: {
                                previews: ["machine-man"]
                            }
                        }],
                        listBlockedUsers: ["GET /orgs/{org}/blocks"],
                        listForAuthenticatedUser: ["GET /user/orgs"],
                        listForUser: ["GET /users/{username}/orgs"],
                        listHooks: ["GET /orgs/{org}/hooks", {}, {
                            renamed: ["orgs", "listWebhooks"]
                        }],
                        listInstallations: ["GET /orgs/{org}/installations", {
                            mediaType: {
                                previews: ["machine-man"]
                            }
                        }, {
                            renamed: ["orgs", "listAppInstallations"]
                        }],
                        listInvitationTeams: ["GET /orgs/{org}/invitations/{invitation_id}/teams"],
                        listMembers: ["GET /orgs/{org}/members"],
                        listMemberships: ["GET /user/memberships/orgs", {}, {
                            renamed: ["orgs", "listMembershipsForAuthenticatedUser"]
                        }],
                        listMembershipsForAuthenticatedUser: ["GET /user/memberships/orgs"],
                        listOutsideCollaborators: ["GET /orgs/{org}/outside_collaborators"],
                        listPendingInvitations: ["GET /orgs/{org}/invitations"],
                        listPublicMembers: ["GET /orgs/{org}/public_members"],
                        listWebhooks: ["GET /orgs/{org}/hooks"],
                        pingHook: ["POST /orgs/{org}/hooks/{hook_id}/pings", {}, {
                            renamed: ["orgs", "pingWebhook"]
                        }],
                        pingWebhook: ["POST /orgs/{org}/hooks/{hook_id}/pings"],
                        publicizeMembership: ["PUT /orgs/{org}/public_members/{username}", {}, {
                            renamed: ["orgs", "setPublicMembershipForAuthenticatedUser"]
                        }],
                        removeMember: ["DELETE /orgs/{org}/members/{username}"],
                        removeMembership: ["DELETE /orgs/{org}/memberships/{username}", {}, {
                            renamed: ["orgs", "removeMembershipForUser"]
                        }],
                        removeMembershipForUser: ["DELETE /orgs/{org}/memberships/{username}"],
                        removeOutsideCollaborator: ["DELETE /orgs/{org}/outside_collaborators/{username}"],
                        removePublicMembershipForAuthenticatedUser: ["DELETE /orgs/{org}/public_members/{username}"],
                        setMembershipForUser: ["PUT /orgs/{org}/memberships/{username}"],
                        setPublicMembershipForAuthenticatedUser: ["PUT /orgs/{org}/public_members/{username}"],
                        unblockUser: ["DELETE /orgs/{org}/blocks/{username}"],
                        update: ["PATCH /orgs/{org}"],
                        updateHook: ["PATCH /orgs/{org}/hooks/{hook_id}", {}, {
                            renamed: ["orgs", "updateWebhook"]
                        }],
                        updateMembership: ["PATCH /user/memberships/orgs/{org}", {}, {
                            renamed: ["orgs", "updateMembershipForAuthenticatedUser"]
                        }],
                        updateMembershipForAuthenticatedUser: ["PATCH /user/memberships/orgs/{org}"],
                        updateWebhook: ["PATCH /orgs/{org}/hooks/{hook_id}"]
                    },
                    projects: {
                        addCollaborator: ["PUT /projects/{project_id}/collaborators/{username}", {
                            mediaType: {
                                previews: ["inertia"]
                            }
                        }],
                        createCard: ["POST /projects/columns/{column_id}/cards", {
                            mediaType: {
                                previews: ["inertia"]
                            }
                        }],
                        createColumn: ["POST /projects/{project_id}/columns", {
                            mediaType: {
                                previews: ["inertia"]
                            }
                        }],
                        createForAuthenticatedUser: ["POST /user/projects", {
                            mediaType: {
                                previews: ["inertia"]
                            }
                        }],
                        createForOrg: ["POST /orgs/{org}/projects", {
                            mediaType: {
                                previews: ["inertia"]
                            }
                        }],
                        createForRepo: ["POST /repos/{owner}/{repo}/projects", {
                            mediaType: {
                                previews: ["inertia"]
                            }
                        }],
                        delete: ["DELETE /projects/{project_id}", {
                            mediaType: {
                                previews: ["inertia"]
                            }
                        }],
                        deleteCard: ["DELETE /projects/columns/cards/{card_id}", {
                            mediaType: {
                                previews: ["inertia"]
                            }
                        }],
                        deleteColumn: ["DELETE /projects/columns/{column_id}", {
                            mediaType: {
                                previews: ["inertia"]
                            }
                        }],
                        get: ["GET /projects/{project_id}", {
                            mediaType: {
                                previews: ["inertia"]
                            }
                        }],
                        getCard: ["GET /projects/columns/cards/{card_id}", {
                            mediaType: {
                                previews: ["inertia"]
                            }
                        }],
                        getColumn: ["GET /projects/columns/{column_id}", {
                            mediaType: {
                                previews: ["inertia"]
                            }
                        }],
                        getPermissionForUser: ["GET /projects/{project_id}/collaborators/{username}/permission", {
                            mediaType: {
                                previews: ["inertia"]
                            }
                        }],
                        listCards: ["GET /projects/columns/{column_id}/cards", {
                            mediaType: {
                                previews: ["inertia"]
                            }
                        }],
                        listCollaborators: ["GET /projects/{project_id}/collaborators", {
                            mediaType: {
                                previews: ["inertia"]
                            }
                        }],
                        listColumns: ["GET /projects/{project_id}/columns", {
                            mediaType: {
                                previews: ["inertia"]
                            }
                        }],
                        listForOrg: ["GET /orgs/{org}/projects", {
                            mediaType: {
                                previews: ["inertia"]
                            }
                        }],
                        listForRepo: ["GET /repos/{owner}/{repo}/projects", {
                            mediaType: {
                                previews: ["inertia"]
                            }
                        }],
                        listForUser: ["GET /users/{username}/projects", {
                            mediaType: {
                                previews: ["inertia"]
                            }
                        }],
                        moveCard: ["POST /projects/columns/cards/{card_id}/moves", {
                            mediaType: {
                                previews: ["inertia"]
                            }
                        }],
                        moveColumn: ["POST /projects/columns/{column_id}/moves", {
                            mediaType: {
                                previews: ["inertia"]
                            }
                        }],
                        removeCollaborator: ["DELETE /projects/{project_id}/collaborators/{username}", {
                            mediaType: {
                                previews: ["inertia"]
                            }
                        }],
                        reviewUserPermissionLevel: ["GET /projects/{project_id}/collaborators/{username}/permission", {
                            mediaType: {
                                previews: ["inertia"]
                            }
                        }, {
                            renamed: ["projects", "getPermissionForUser"]
                        }],
                        update: ["PATCH /projects/{project_id}", {
                            mediaType: {
                                previews: ["inertia"]
                            }
                        }],
                        updateCard: ["PATCH /projects/columns/cards/{card_id}", {
                            mediaType: {
                                previews: ["inertia"]
                            }
                        }],
                        updateColumn: ["PATCH /projects/columns/{column_id}", {
                            mediaType: {
                                previews: ["inertia"]
                            }
                        }]
                    },
                    pulls: {
                        checkIfMerged: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/merge"],
                        create: ["POST /repos/{owner}/{repo}/pulls"],
                        createComment: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/comments", {}, {
                            renamed: ["pulls", "createReviewComment"]
                        }],
                        createReplyForReviewComment: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/comments/{comment_id}/replies"],
                        createReview: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews"],
                        createReviewComment: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/comments"],
                        createReviewCommentReply: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/comments/{comment_id}/replies", {}, {
                            renamed: ["pulls", "createReplyForReviewComment"]
                        }],
                        createReviewRequest: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers", {}, {
                            renamed: ["pulls", "requestReviewers"]
                        }],
                        deleteComment: ["DELETE /repos/{owner}/{repo}/pulls/comments/{comment_id}", {}, {
                            renamed: ["pulls", "deleteReviewComment"]
                        }],
                        deletePendingReview: ["DELETE /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"],
                        deleteReviewComment: ["DELETE /repos/{owner}/{repo}/pulls/comments/{comment_id}"],
                        deleteReviewRequest: ["DELETE /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers", {}, {
                            renamed: ["pulls", "removeRequestedReviewers"]
                        }],
                        dismissReview: ["PUT /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/dismissals"],
                        get: ["GET /repos/{owner}/{repo}/pulls/{pull_number}"],
                        getComment: ["GET /repos/{owner}/{repo}/pulls/comments/{comment_id}", {}, {
                            renamed: ["pulls", "getReviewComment"]
                        }],
                        getCommentsForReview: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/comments", {}, {
                            renamed: ["pulls", "listCommentsForReview"]
                        }],
                        getReview: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"],
                        getReviewComment: ["GET /repos/{owner}/{repo}/pulls/comments/{comment_id}"],
                        list: ["GET /repos/{owner}/{repo}/pulls"],
                        listComments: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/comments", {}, {
                            renamed: ["pulls", "listReviewComments"]
                        }],
                        listCommentsForRepo: ["GET /repos/{owner}/{repo}/pulls/comments", {}, {
                            renamed: ["pulls", "listReviewCommentsForRepo"]
                        }],
                        listCommentsForReview: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/comments"],
                        listCommits: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/commits"],
                        listFiles: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/files"],
                        listRequestedReviewers: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"],
                        listReviewComments: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/comments"],
                        listReviewCommentsForRepo: ["GET /repos/{owner}/{repo}/pulls/comments"],
                        listReviewRequests: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers", {}, {
                            renamed: ["pulls", "listRequestedReviewers"]
                        }],
                        listReviews: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews"],
                        merge: ["PUT /repos/{owner}/{repo}/pulls/{pull_number}/merge"],
                        removeRequestedReviewers: ["DELETE /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"],
                        requestReviewers: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"],
                        submitReview: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/events"],
                        update: ["PATCH /repos/{owner}/{repo}/pulls/{pull_number}"],
                        updateBranch: ["PUT /repos/{owner}/{repo}/pulls/{pull_number}/update-branch", {
                            mediaType: {
                                previews: ["lydian"]
                            }
                        }],
                        updateComment: ["PATCH /repos/{owner}/{repo}/pulls/comments/{comment_id}", {}, {
                            renamed: ["pulls", "updateReviewComment"]
                        }],
                        updateReview: ["PUT /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"],
                        updateReviewComment: ["PATCH /repos/{owner}/{repo}/pulls/comments/{comment_id}"]
                    },
                    rateLimit: {
                        get: ["GET /rate_limit"]
                    },
                    reactions: {
                        createForCommitComment: ["POST /repos/{owner}/{repo}/comments/{comment_id}/reactions", {
                            mediaType: {
                                previews: ["squirrel-girl"]
                            }
                        }],
                        createForIssue: ["POST /repos/{owner}/{repo}/issues/{issue_number}/reactions", {
                            mediaType: {
                                previews: ["squirrel-girl"]
                            }
                        }],
                        createForIssueComment: ["POST /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions", {
                            mediaType: {
                                previews: ["squirrel-girl"]
                            }
                        }],
                        createForPullRequestReviewComment: ["POST /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions", {
                            mediaType: {
                                previews: ["squirrel-girl"]
                            }
                        }],
                        createForTeamDiscussionCommentInOrg: ["POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions", {
                            mediaType: {
                                previews: ["squirrel-girl"]
                            }
                        }],
                        createForTeamDiscussionInOrg: ["POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions", {
                            mediaType: {
                                previews: ["squirrel-girl"]
                            }
                        }],
                        delete: ["DELETE /reactions/{reaction_id}", {
                            mediaType: {
                                previews: ["squirrel-girl"]
                            }
                        }, {
                            renamed: ["reactions", "deleteLegacy"]
                        }],
                        deleteForCommitComment: ["DELETE /repos/{owner}/{repo}/comments/{comment_id}/reactions/{reaction_id}", {
                            mediaType: {
                                previews: ["squirrel-girl"]
                            }
                        }],
                        deleteForIssue: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/reactions/{reaction_id}", {
                            mediaType: {
                                previews: ["squirrel-girl"]
                            }
                        }],
                        deleteForIssueComment: ["DELETE /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions/{reaction_id}", {
                            mediaType: {
                                previews: ["squirrel-girl"]
                            }
                        }],
                        deleteForPullRequestComment: ["DELETE /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions/{reaction_id}", {
                            mediaType: {
                                previews: ["squirrel-girl"]
                            }
                        }],
                        deleteForTeamDiscussion: ["DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions/{reaction_id}", {
                            mediaType: {
                                previews: ["squirrel-girl"]
                            }
                        }],
                        deleteForTeamDiscussionComment: ["DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions/{reaction_id}", {
                            mediaType: {
                                previews: ["squirrel-girl"]
                            }
                        }],
                        deleteLegacy: ["DELETE /reactions/{reaction_id}", {
                            mediaType: {
                                previews: ["squirrel-girl"]
                            }
                        }, {
                            deprecated: "octokit.reactions.deleteLegacy() is deprecated, see https://developer.github.com/v3/reactions/#delete-a-reaction-legacy"
                        }],
                        listForCommitComment: ["GET /repos/{owner}/{repo}/comments/{comment_id}/reactions", {
                            mediaType: {
                                previews: ["squirrel-girl"]
                            }
                        }],
                        listForIssue: ["GET /repos/{owner}/{repo}/issues/{issue_number}/reactions", {
                            mediaType: {
                                previews: ["squirrel-girl"]
                            }
                        }],
                        listForIssueComment: ["GET /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions", {
                            mediaType: {
                                previews: ["squirrel-girl"]
                            }
                        }],
                        listForPullRequestReviewComment: ["GET /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions", {
                            mediaType: {
                                previews: ["squirrel-girl"]
                            }
                        }],
                        listForTeamDiscussionCommentInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions", {
                            mediaType: {
                                previews: ["squirrel-girl"]
                            }
                        }],
                        listForTeamDiscussionInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions", {
                            mediaType: {
                                previews: ["squirrel-girl"]
                            }
                        }]
                    },
                    repos: {
                        acceptInvitation: ["PATCH /user/repository_invitations/{invitation_id}"],
                        addAppAccessRestrictions: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps", {}, {
                            mapToData: "apps"
                        }],
                        addCollaborator: ["PUT /repos/{owner}/{repo}/collaborators/{username}"],
                        addDeployKey: ["POST /repos/{owner}/{repo}/keys", {}, {
                            renamed: ["repos", "createDeployKey"]
                        }],
                        addProtectedBranchAdminEnforcement: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins", {}, {
                            renamed: ["repos", "setAdminBranchProtection"]
                        }],
                        addProtectedBranchAppRestrictions: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps", {}, {
                            mapToData: "apps",
                            renamed: ["repos", "addAppAccessRestrictions"]
                        }],
                        addProtectedBranchRequiredSignatures: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures", {
                            mediaType: {
                                previews: ["zzzax"]
                            }
                        }, {
                            renamed: ["repos", "createCommitSignatureProtection"]
                        }],
                        addProtectedBranchRequiredStatusChecksContexts: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts", {}, {
                            mapToData: "contexts",
                            renamed: ["repos", "addStatusCheckContexts"]
                        }],
                        addProtectedBranchTeamRestrictions: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams", {}, {
                            mapToData: "teams",
                            renamed: ["repos", "addTeamAccessRestrictions"]
                        }],
                        addProtectedBranchUserRestrictions: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users", {}, {
                            mapToData: "users",
                            renamed: ["repos", "addUserAccessRestrictions"]
                        }],
                        addStatusCheckContexts: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts", {}, {
                            mapToData: "contexts"
                        }],
                        addTeamAccessRestrictions: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams", {}, {
                            mapToData: "teams"
                        }],
                        addUserAccessRestrictions: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users", {}, {
                            mapToData: "users"
                        }],
                        checkCollaborator: ["GET /repos/{owner}/{repo}/collaborators/{username}"],
                        checkVulnerabilityAlerts: ["GET /repos/{owner}/{repo}/vulnerability-alerts", {
                            mediaType: {
                                previews: ["dorian"]
                            }
                        }],
                        compareCommits: ["GET /repos/{owner}/{repo}/compare/{base}...{head}"],
                        createCommitComment: ["POST /repos/{owner}/{repo}/commits/{commit_sha}/comments"],
                        createCommitSignatureProtection: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures", {
                            mediaType: {
                                previews: ["zzzax"]
                            }
                        }],
                        createCommitStatus: ["POST /repos/{owner}/{repo}/statuses/{sha}"],
                        createDeployKey: ["POST /repos/{owner}/{repo}/keys"],
                        createDeployment: ["POST /repos/{owner}/{repo}/deployments"],
                        createDeploymentStatus: ["POST /repos/{owner}/{repo}/deployments/{deployment_id}/statuses"],
                        createDispatchEvent: ["POST /repos/{owner}/{repo}/dispatches"],
                        createForAuthenticatedUser: ["POST /user/repos"],
                        createFork: ["POST /repos/{owner}/{repo}/forks"],
                        createHook: ["POST /repos/{owner}/{repo}/hooks", {}, {
                            renamed: ["repos", "createWebhook"]
                        }],
                        createInOrg: ["POST /orgs/{org}/repos"],
                        createOrUpdateFile: ["PUT /repos/{owner}/{repo}/contents/{path}", {}, {
                            renamed: ["repos", "createOrUpdateFileContents"]
                        }],
                        createOrUpdateFileContents: ["PUT /repos/{owner}/{repo}/contents/{path}"],
                        createPagesSite: ["POST /repos/{owner}/{repo}/pages", {
                            mediaType: {
                                previews: ["switcheroo"]
                            }
                        }],
                        createRelease: ["POST /repos/{owner}/{repo}/releases"],
                        createStatus: ["POST /repos/{owner}/{repo}/statuses/{sha}", {}, {
                            renamed: ["repos", "createCommitStatus"]
                        }],
                        createUsingTemplate: ["POST /repos/{template_owner}/{template_repo}/generate", {
                            mediaType: {
                                previews: ["baptiste"]
                            }
                        }],
                        createWebhook: ["POST /repos/{owner}/{repo}/hooks"],
                        declineInvitation: ["DELETE /user/repository_invitations/{invitation_id}"],
                        delete: ["DELETE /repos/{owner}/{repo}"],
                        deleteAccessRestrictions: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions"],
                        deleteAdminBranchProtection: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"],
                        deleteBranchProtection: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection"],
                        deleteCommitComment: ["DELETE /repos/{owner}/{repo}/comments/{comment_id}"],
                        deleteCommitSignatureProtection: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures", {
                            mediaType: {
                                previews: ["zzzax"]
                            }
                        }],
                        deleteDeployKey: ["DELETE /repos/{owner}/{repo}/keys/{key_id}"],
                        deleteDeployment: ["DELETE /repos/{owner}/{repo}/deployments/{deployment_id}"],
                        deleteDownload: ["DELETE /repos/{owner}/{repo}/downloads/{download_id}"],
                        deleteFile: ["DELETE /repos/{owner}/{repo}/contents/{path}"],
                        deleteHook: ["DELETE /repos/{owner}/{repo}/hooks/{hook_id}", {}, {
                            renamed: ["repos", "deleteWebhook"]
                        }],
                        deleteInvitation: ["DELETE /repos/{owner}/{repo}/invitations/{invitation_id}"],
                        deletePagesSite: ["DELETE /repos/{owner}/{repo}/pages", {
                            mediaType: {
                                previews: ["switcheroo"]
                            }
                        }],
                        deletePullRequestReviewProtection: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"],
                        deleteRelease: ["DELETE /repos/{owner}/{repo}/releases/{release_id}"],
                        deleteReleaseAsset: ["DELETE /repos/{owner}/{repo}/releases/assets/{asset_id}"],
                        deleteWebhook: ["DELETE /repos/{owner}/{repo}/hooks/{hook_id}"],
                        disableAutomatedSecurityFixes: ["DELETE /repos/{owner}/{repo}/automated-security-fixes", {
                            mediaType: {
                                previews: ["london"]
                            }
                        }],
                        disablePagesSite: ["DELETE /repos/{owner}/{repo}/pages", {
                            mediaType: {
                                previews: ["switcheroo"]
                            }
                        }, {
                            renamed: ["repos", "deletePagesSite"]
                        }],
                        disableVulnerabilityAlerts: ["DELETE /repos/{owner}/{repo}/vulnerability-alerts", {
                            mediaType: {
                                previews: ["dorian"]
                            }
                        }],
                        downloadArchive: ["GET /repos/{owner}/{repo}/{archive_format}/{ref}"],
                        enableAutomatedSecurityFixes: ["PUT /repos/{owner}/{repo}/automated-security-fixes", {
                            mediaType: {
                                previews: ["london"]
                            }
                        }],
                        enablePagesSite: ["POST /repos/{owner}/{repo}/pages", {
                            mediaType: {
                                previews: ["switcheroo"]
                            }
                        }, {
                            renamed: ["repos", "createPagesSite"]
                        }],
                        enableVulnerabilityAlerts: ["PUT /repos/{owner}/{repo}/vulnerability-alerts", {
                            mediaType: {
                                previews: ["dorian"]
                            }
                        }],
                        get: ["GET /repos/{owner}/{repo}"],
                        getAccessRestrictions: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions"],
                        getAdminBranchProtection: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"],
                        getAllStatusCheckContexts: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts"],
                        getAllTopics: ["GET /repos/{owner}/{repo}/topics", {
                            mediaType: {
                                previews: ["mercy"]
                            }
                        }],
                        getAppsWithAccessToProtectedBranch: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps"],
                        getArchiveLink: ["GET /repos/{owner}/{repo}/{archive_format}/{ref}", {}, {
                            renamed: ["repos", "downloadArchive"]
                        }],
                        getBranch: ["GET /repos/{owner}/{repo}/branches/{branch}"],
                        getBranchProtection: ["GET /repos/{owner}/{repo}/branches/{branch}/protection"],
                        getClones: ["GET /repos/{owner}/{repo}/traffic/clones"],
                        getCodeFrequencyStats: ["GET /repos/{owner}/{repo}/stats/code_frequency"],
                        getCollaboratorPermissionLevel: ["GET /repos/{owner}/{repo}/collaborators/{username}/permission"],
                        getCombinedStatusForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/status"],
                        getCommit: ["GET /repos/{owner}/{repo}/commits/{ref}"],
                        getCommitActivityStats: ["GET /repos/{owner}/{repo}/stats/commit_activity"],
                        getCommitComment: ["GET /repos/{owner}/{repo}/comments/{comment_id}"],
                        getCommitSignatureProtection: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures", {
                            mediaType: {
                                previews: ["zzzax"]
                            }
                        }],
                        getCommunityProfileMetrics: ["GET /repos/{owner}/{repo}/community/profile"],
                        getContent: ["GET /repos/{owner}/{repo}/contents/{path}"],
                        getContents: ["GET /repos/{owner}/{repo}/contents/{path}", {}, {
                            renamed: ["repos", "getContent"]
                        }],
                        getContributorsStats: ["GET /repos/{owner}/{repo}/stats/contributors"],
                        getDeployKey: ["GET /repos/{owner}/{repo}/keys/{key_id}"],
                        getDeployment: ["GET /repos/{owner}/{repo}/deployments/{deployment_id}"],
                        getDeploymentStatus: ["GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses/{status_id}"],
                        getDownload: ["GET /repos/{owner}/{repo}/downloads/{download_id}"],
                        getHook: ["GET /repos/{owner}/{repo}/hooks/{hook_id}", {}, {
                            renamed: ["repos", "getWebhook"]
                        }],
                        getLatestPagesBuild: ["GET /repos/{owner}/{repo}/pages/builds/latest"],
                        getLatestRelease: ["GET /repos/{owner}/{repo}/releases/latest"],
                        getPages: ["GET /repos/{owner}/{repo}/pages"],
                        getPagesBuild: ["GET /repos/{owner}/{repo}/pages/builds/{build_id}"],
                        getParticipationStats: ["GET /repos/{owner}/{repo}/stats/participation"],
                        getProtectedBranchAdminEnforcement: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins", {}, {
                            renamed: ["repos", "getAdminBranchProtection"]
                        }],
                        getProtectedBranchPullRequestReviewEnforcement: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews", {}, {
                            renamed: ["repos", "getPullRequestReviewProtection"]
                        }],
                        getProtectedBranchRequiredSignatures: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures", {
                            mediaType: {
                                previews: ["zzzax"]
                            }
                        }, {
                            renamed: ["repos", "getCommitSignatureProtection"]
                        }],
                        getProtectedBranchRequiredStatusChecks: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks", {}, {
                            renamed: ["repos", "getStatusChecksProtection"]
                        }],
                        getProtectedBranchRestrictions: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions", {}, {
                            renamed: ["repos", "getAccessRestrictions"]
                        }],
                        getPullRequestReviewProtection: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"],
                        getPunchCardStats: ["GET /repos/{owner}/{repo}/stats/punch_card"],
                        getReadme: ["GET /repos/{owner}/{repo}/readme"],
                        getRelease: ["GET /repos/{owner}/{repo}/releases/{release_id}"],
                        getReleaseAsset: ["GET /repos/{owner}/{repo}/releases/assets/{asset_id}"],
                        getReleaseByTag: ["GET /repos/{owner}/{repo}/releases/tags/{tag}"],
                        getStatusChecksProtection: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"],
                        getTeamsWithAccessToProtectedBranch: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams"],
                        getTopPaths: ["GET /repos/{owner}/{repo}/traffic/popular/paths"],
                        getTopReferrers: ["GET /repos/{owner}/{repo}/traffic/popular/referrers"],
                        getUsersWithAccessToProtectedBranch: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users"],
                        getViews: ["GET /repos/{owner}/{repo}/traffic/views"],
                        getWebhook: ["GET /repos/{owner}/{repo}/hooks/{hook_id}"],
                        list: ["GET /user/repos", {}, {
                            renamed: ["repos", "listForAuthenticatedUser"]
                        }],
                        listAssetsForRelease: ["GET /repos/{owner}/{repo}/releases/{release_id}/assets", {}, {
                            renamed: ["repos", "listReleaseAssets"]
                        }],
                        listBranches: ["GET /repos/{owner}/{repo}/branches"],
                        listBranchesForHeadCommit: ["GET /repos/{owner}/{repo}/commits/{commit_sha}/branches-where-head", {
                            mediaType: {
                                previews: ["groot"]
                            }
                        }],
                        listCollaborators: ["GET /repos/{owner}/{repo}/collaborators"],
                        listCommentsForCommit: ["GET /repos/{owner}/{repo}/commits/{commit_sha}/comments"],
                        listCommitComments: ["GET /repos/{owner}/{repo}/comments", {}, {
                            renamed: ["repos", "listCommitCommentsForRepo"]
                        }],
                        listCommitCommentsForRepo: ["GET /repos/{owner}/{repo}/comments"],
                        listCommitStatusesForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/statuses"],
                        listCommits: ["GET /repos/{owner}/{repo}/commits"],
                        listContributors: ["GET /repos/{owner}/{repo}/contributors"],
                        listDeployKeys: ["GET /repos/{owner}/{repo}/keys"],
                        listDeploymentStatuses: ["GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses"],
                        listDeployments: ["GET /repos/{owner}/{repo}/deployments"],
                        listDownloads: ["GET /repos/{owner}/{repo}/downloads"],
                        listForAuthenticatedUser: ["GET /user/repos"],
                        listForOrg: ["GET /orgs/{org}/repos"],
                        listForUser: ["GET /users/{username}/repos"],
                        listForks: ["GET /repos/{owner}/{repo}/forks"],
                        listHooks: ["GET /repos/{owner}/{repo}/hooks", {}, {
                            renamed: ["repos", "listWebhooks"]
                        }],
                        listInvitations: ["GET /repos/{owner}/{repo}/invitations"],
                        listInvitationsForAuthenticatedUser: ["GET /user/repository_invitations"],
                        listLanguages: ["GET /repos/{owner}/{repo}/languages"],
                        listPagesBuilds: ["GET /repos/{owner}/{repo}/pages/builds"],
                        listProtectedBranchRequiredStatusChecksContexts: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts", {}, {
                            renamed: ["repos", "getAllStatusCheckContexts"]
                        }],
                        listPublic: ["GET /repositories"],
                        listPullRequestsAssociatedWithCommit: ["GET /repos/{owner}/{repo}/commits/{commit_sha}/pulls", {
                            mediaType: {
                                previews: ["groot"]
                            }
                        }],
                        listReleaseAssets: ["GET /repos/{owner}/{repo}/releases/{release_id}/assets"],
                        listReleases: ["GET /repos/{owner}/{repo}/releases"],
                        listStatusesForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/statuses", {}, {
                            renamed: ["repos", "listCommitStatusesForRef"]
                        }],
                        listTags: ["GET /repos/{owner}/{repo}/tags"],
                        listTeams: ["GET /repos/{owner}/{repo}/teams"],
                        listTopics: ["GET /repos/{owner}/{repo}/topics", {
                            mediaType: {
                                previews: ["mercy"]
                            }
                        }, {
                            renamed: ["repos", "getAllTopics"]
                        }],
                        listWebhooks: ["GET /repos/{owner}/{repo}/hooks"],
                        merge: ["POST /repos/{owner}/{repo}/merges"],
                        pingHook: ["POST /repos/{owner}/{repo}/hooks/{hook_id}/pings", {}, {
                            renamed: ["repos", "pingWebhook"]
                        }],
                        pingWebhook: ["POST /repos/{owner}/{repo}/hooks/{hook_id}/pings"],
                        removeAppAccessRestrictions: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps", {}, {
                            mapToData: "apps"
                        }],
                        removeBranchProtection: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection", {}, {
                            renamed: ["repos", "deleteBranchProtection"]
                        }],
                        removeCollaborator: ["DELETE /repos/{owner}/{repo}/collaborators/{username}"],
                        removeDeployKey: ["DELETE /repos/{owner}/{repo}/keys/{key_id}", {}, {
                            renamed: ["repos", "deleteDeployKey"]
                        }],
                        removeProtectedBranchAdminEnforcement: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins", {}, {
                            renamed: ["repos", "deleteAdminBranchProtection"]
                        }],
                        removeProtectedBranchAppRestrictions: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps", {}, {
                            mapToData: "apps",
                            renamed: ["repos", "removeAppAccessRestrictions"]
                        }],
                        removeProtectedBranchPullRequestReviewEnforcement: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews", {}, {
                            renamed: ["repos", "deletePullRequestReviewProtection"]
                        }],
                        removeProtectedBranchRequiredSignatures: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures", {
                            mediaType: {
                                previews: ["zzzax"]
                            }
                        }, {
                            renamed: ["repos", "deleteCommitSignatureProtection"]
                        }],
                        removeProtectedBranchRequiredStatusChecks: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks", {}, {
                            renamed: ["repos", "removeStatusChecksProtection"]
                        }],
                        removeProtectedBranchRequiredStatusChecksContexts: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts", {}, {
                            mapToData: "contexts",
                            renamed: ["repos", "removeStatusCheckContexts"]
                        }],
                        removeProtectedBranchRestrictions: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions", {}, {
                            renamed: ["repos", "deleteAccessRestrictions"]
                        }],
                        removeProtectedBranchTeamRestrictions: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams", {}, {
                            mapToData: "teams",
                            renamed: ["repos", "removeTeamAccessRestrictions"]
                        }],
                        removeProtectedBranchUserRestrictions: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users", {}, {
                            mapToData: "users",
                            renamed: ["repos", "removeUserAccessRestrictions"]
                        }],
                        removeStatusCheckContexts: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts", {}, {
                            mapToData: "contexts"
                        }],
                        removeStatusCheckProtection: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"],
                        removeTeamAccessRestrictions: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams", {}, {
                            mapToData: "teams"
                        }],
                        removeUserAccessRestrictions: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users", {}, {
                            mapToData: "users"
                        }],
                        replaceAllTopics: ["PUT /repos/{owner}/{repo}/topics", {
                            mediaType: {
                                previews: ["mercy"]
                            }
                        }],
                        replaceProtectedBranchAppRestrictions: ["PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps", {}, {
                            mapToData: "apps",
                            renamed: ["repos", "setAppAccessRestrictions"]
                        }],
                        replaceProtectedBranchRequiredStatusChecksContexts: ["PUT /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts", {}, {
                            mapToData: "contexts",
                            renamed: ["repos", "setStatusCheckContexts"]
                        }],
                        replaceProtectedBranchTeamRestrictions: ["PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams", {}, {
                            mapToData: "teams",
                            renamed: ["repos", "setTeamAccessRestrictions"]
                        }],
                        replaceProtectedBranchUserRestrictions: ["PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users", {}, {
                            mapToData: "users",
                            renamed: ["repos", "setUserAccessRestrictions"]
                        }],
                        replaceTopics: ["PUT /repos/{owner}/{repo}/topics", {
                            mediaType: {
                                previews: ["mercy"]
                            }
                        }, {
                            renamed: ["repos", "replaceAllTopics"]
                        }],
                        requestPageBuild: ["POST /repos/{owner}/{repo}/pages/builds", {}, {
                            renamed: ["repos", "requestPagesBuild"]
                        }],
                        requestPagesBuild: ["POST /repos/{owner}/{repo}/pages/builds"],
                        retrieveCommunityProfileMetrics: ["GET /repos/{owner}/{repo}/community/profile", {}, {
                            renamed: ["repos", "getCommunityProfileMetrics"]
                        }],
                        setAdminBranchProtection: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"],
                        setAppAccessRestrictions: ["PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps", {}, {
                            mapToData: "apps"
                        }],
                        setStatusCheckContexts: ["PUT /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts", {}, {
                            mapToData: "contexts"
                        }],
                        setTeamAccessRestrictions: ["PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams", {}, {
                            mapToData: "teams"
                        }],
                        setUserAccessRestrictions: ["PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users", {}, {
                            mapToData: "users"
                        }],
                        testPushHook: ["POST /repos/{owner}/{repo}/hooks/{hook_id}/tests", {}, {
                            renamed: ["repos", "testPushWebhook"]
                        }],
                        testPushWebhook: ["POST /repos/{owner}/{repo}/hooks/{hook_id}/tests"],
                        transfer: ["POST /repos/{owner}/{repo}/transfer"],
                        update: ["PATCH /repos/{owner}/{repo}"],
                        updateBranchProtection: ["PUT /repos/{owner}/{repo}/branches/{branch}/protection"],
                        updateCommitComment: ["PATCH /repos/{owner}/{repo}/comments/{comment_id}"],
                        updateHook: ["PATCH /repos/{owner}/{repo}/hooks/{hook_id}", {}, {
                            renamed: ["repos", "updateWebhook"]
                        }],
                        updateInformationAboutPagesSite: ["PUT /repos/{owner}/{repo}/pages"],
                        updateInvitation: ["PATCH /repos/{owner}/{repo}/invitations/{invitation_id}"],
                        updateProtectedBranchPullRequestReviewEnforcement: ["PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews", {}, {
                            renamed: ["repos", "updatePullRequestReviewProtection"]
                        }],
                        updateProtectedBranchRequiredStatusChecks: ["PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks", {}, {
                            renamed: ["repos", "updateStatusChecksProtection"]
                        }],
                        updatePullRequestReviewProtection: ["PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"],
                        updateRelease: ["PATCH /repos/{owner}/{repo}/releases/{release_id}"],
                        updateReleaseAsset: ["PATCH /repos/{owner}/{repo}/releases/assets/{asset_id}"],
                        updateStatusCheckPotection: ["PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"],
                        updateWebhook: ["PATCH /repos/{owner}/{repo}/hooks/{hook_id}"],
                        uploadReleaseAsset: ["POST /repos/{owner}/{repo}/releases/{release_id}/assets{?name,label}", {
                            baseUrl: "https://uploads.github.com"
                        }]
                    },
                    search: {
                        code: ["GET /search/code"],
                        commits: ["GET /search/commits", {
                            mediaType: {
                                previews: ["cloak"]
                            }
                        }],
                        issuesAndPullRequests: ["GET /search/issues"],
                        labels: ["GET /search/labels"],
                        repos: ["GET /search/repositories"],
                        topics: ["GET /search/topics"],
                        users: ["GET /search/users"]
                    },
                    teams: {
                        addOrUpdateMembershipForUserInOrg: ["PUT /orgs/{org}/teams/{team_slug}/memberships/{username}"],
                        addOrUpdateMembershipInOrg: ["PUT /orgs/{org}/teams/{team_slug}/memberships/{username}", {}, {
                            renamed: ["teams", "addOrUpdateMembershipForUserInOrg"]
                        }],
                        addOrUpdateProjectInOrg: ["PUT /orgs/{org}/teams/{team_slug}/projects/{project_id}", {
                            mediaType: {
                                previews: ["inertia"]
                            }
                        }, {
                            renamed: ["teams", "addOrUpdateProjectPermissionsInOrg"]
                        }],
                        addOrUpdateProjectPermissionsInOrg: ["PUT /orgs/{org}/teams/{team_slug}/projects/{project_id}", {
                            mediaType: {
                                previews: ["inertia"]
                            }
                        }],
                        addOrUpdateRepoInOrg: ["PUT /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}", {}, {
                            renamed: ["teams", "addOrUpdateRepoPermissionsInOrg"]
                        }],
                        addOrUpdateRepoPermissionsInOrg: ["PUT /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"],
                        checkManagesRepoInOrg: ["GET /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}", {}, {
                            renamed: ["teams", "checkPermissionsForRepoInOrg"]
                        }],
                        checkPermissionsForProjectInOrg: ["GET /orgs/{org}/teams/{team_slug}/projects/{project_id}", {
                            mediaType: {
                                previews: ["inertia"]
                            }
                        }],
                        checkPermissionsForRepoInOrg: ["GET /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"],
                        create: ["POST /orgs/{org}/teams"],
                        createDiscussionCommentInOrg: ["POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments"],
                        createDiscussionInOrg: ["POST /orgs/{org}/teams/{team_slug}/discussions"],
                        deleteDiscussionCommentInOrg: ["DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"],
                        deleteDiscussionInOrg: ["DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"],
                        deleteInOrg: ["DELETE /orgs/{org}/teams/{team_slug}"],
                        getByName: ["GET /orgs/{org}/teams/{team_slug}"],
                        getDiscussionCommentInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"],
                        getDiscussionInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"],
                        getMembershipForUserInOrg: ["GET /orgs/{org}/teams/{team_slug}/memberships/{username}"],
                        getMembershipInOrg: ["GET /orgs/{org}/teams/{team_slug}/memberships/{username}", {}, {
                            renamed: ["teams", "getMembershipForUserInOrg"]
                        }],
                        list: ["GET /orgs/{org}/teams"],
                        listChildInOrg: ["GET /orgs/{org}/teams/{team_slug}/teams"],
                        listDiscussionCommentsInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments"],
                        listDiscussionsInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions"],
                        listForAuthenticatedUser: ["GET /user/teams"],
                        listMembersInOrg: ["GET /orgs/{org}/teams/{team_slug}/members"],
                        listPendingInvitationsInOrg: ["GET /orgs/{org}/teams/{team_slug}/invitations"],
                        listProjectsInOrg: ["GET /orgs/{org}/teams/{team_slug}/projects", {
                            mediaType: {
                                previews: ["inertia"]
                            }
                        }],
                        listReposInOrg: ["GET /orgs/{org}/teams/{team_slug}/repos"],
                        removeMembershipForUserInOrg: ["DELETE /orgs/{org}/teams/{team_slug}/memberships/{username}"],
                        removeMembershipInOrg: ["DELETE /orgs/{org}/teams/{team_slug}/memberships/{username}", {}, {
                            renamed: ["teams", "removeMembershipForUserInOrg"]
                        }],
                        removeProjectInOrg: ["DELETE /orgs/{org}/teams/{team_slug}/projects/{project_id}"],
                        removeRepoInOrg: ["DELETE /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"],
                        reviewProjectInOrg: ["GET /orgs/{org}/teams/{team_slug}/projects/{project_id}", {
                            mediaType: {
                                previews: ["inertia"]
                            }
                        }, {
                            renamed: ["teams", "checkPermissionsForProjectInOrg"]
                        }],
                        updateDiscussionCommentInOrg: ["PATCH /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"],
                        updateDiscussionInOrg: ["PATCH /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"],
                        updateInOrg: ["PATCH /orgs/{org}/teams/{team_slug}"]
                    },
                    users: {
                        addEmailForAuthenticated: ["POST /user/emails"],
                        addEmails: ["POST /user/emails", {}, {
                            renamed: ["users", "addEmailsForAuthenticated"]
                        }],
                        block: ["PUT /user/blocks/{username}"],
                        checkBlocked: ["GET /user/blocks/{username}"],
                        checkFollowing: ["GET /user/following/{username}", {}, {
                            renamed: ["users", "checkPersonIsFollowedByAuthenticated"]
                        }],
                        checkFollowingForUser: ["GET /users/{username}/following/{target_user}"],
                        checkPersonIsFollowedByAuthenticated: ["GET /user/following/{username}"],
                        createGpgKey: ["POST /user/gpg_keys", {}, {
                            renamed: ["users", "createGpgKeyForAuthenticated"]
                        }],
                        createGpgKeyForAuthenticated: ["POST /user/gpg_keys"],
                        createPublicKey: ["POST /user/keys", {}, {
                            renamed: ["users", "createPublicSshKeyForAuthenticated"]
                        }],
                        createPublicSshKeyForAuthenticated: ["POST /user/keys"],
                        deleteEmailForAuthenticated: ["DELETE /user/emails"],
                        deleteEmails: ["DELETE /user/emails", {}, {
                            renamed: ["users", "deleteEmailsForAuthenticated"]
                        }],
                        deleteGpgKey: ["DELETE /user/gpg_keys/{gpg_key_id}", {}, {
                            renamed: ["users", "deleteGpgKeyForAuthenticated"]
                        }],
                        deleteGpgKeyForAuthenticated: ["DELETE /user/gpg_keys/{gpg_key_id}"],
                        deletePublicKey: ["DELETE /user/keys/{key_id}", {}, {
                            renamed: ["users", "deletePublicSshKeyForAuthenticated"]
                        }],
                        deletePublicSshKeyForAuthenticated: ["DELETE /user/keys/{key_id}"],
                        follow: ["PUT /user/following/{username}"],
                        getAuthenticated: ["GET /user"],
                        getByUsername: ["GET /users/{username}"],
                        getContextForUser: ["GET /users/{username}/hovercard"],
                        getGpgKey: ["GET /user/gpg_keys/{gpg_key_id}", {}, {
                            renamed: ["users", "getGpgKeyForAuthenticated"]
                        }],
                        getGpgKeyForAuthenticated: ["GET /user/gpg_keys/{gpg_key_id}"],
                        getPublicKey: ["GET /user/keys/{key_id}", {}, {
                            renamed: ["users", "getPublicSshKeyForAuthenticated"]
                        }],
                        getPublicSshKeyForAuthenticated: ["GET /user/keys/{key_id}"],
                        list: ["GET /users"],
                        listBlocked: ["GET /user/blocks", {}, {
                            renamed: ["users", "listBlockedByAuthenticated"]
                        }],
                        listBlockedByAuthenticated: ["GET /user/blocks"],
                        listEmails: ["GET /user/emails", {}, {
                            renamed: ["users", "listEmailsForAuthenticated"]
                        }],
                        listEmailsForAuthenticated: ["GET /user/emails"],
                        listFollowedByAuthenticated: ["GET /user/following"],
                        listFollowersForAuthenticatedUser: ["GET /user/followers"],
                        listFollowersForUser: ["GET /users/{username}/followers"],
                        listFollowingForAuthenticatedUser: ["GET /user/following", {}, {
                            renamed: ["users", "listFollowedByAuthenticated"]
                        }],
                        listFollowingForUser: ["GET /users/{username}/following"],
                        listGpgKeys: ["GET /user/gpg_keys", {}, {
                            renamed: ["users", "listGpgKeysForAuthenticated"]
                        }],
                        listGpgKeysForAuthenticated: ["GET /user/gpg_keys"],
                        listGpgKeysForUser: ["GET /users/{username}/gpg_keys"],
                        listPublicEmails: ["GET /user/public_emails", {}, {
                            renamed: ["users", "listPublicEmailsForAuthenticatedUser"]
                        }],
                        listPublicEmailsForAuthenticated: ["GET /user/public_emails"],
                        listPublicKeys: ["GET /user/keys", {}, {
                            renamed: ["users", "listPublicSshKeysForAuthenticated"]
                        }],
                        listPublicKeysForUser: ["GET /users/{username}/keys"],
                        listPublicSshKeysForAuthenticated: ["GET /user/keys"],
                        setPrimaryEmailVisibilityForAuthenticated: ["PATCH /user/email/visibility"],
                        togglePrimaryEmailVisibility: ["PATCH /user/email/visibility", {}, {
                            renamed: ["users", "setPrimaryEmailVisibilityForAuthenticated"]
                        }],
                        unblock: ["DELETE /user/blocks/{username}"],
                        unfollow: ["DELETE /user/following/{username}"],
                        updateAuthenticated: ["PATCH /user"]
                    }
                };

                const VERSION = "3.17.0";

                function endpointsToMethods(octokit, endpointsMap) {
                    const newMethods = {};

                    for (const [scope, endpoints] of Object.entries(endpointsMap)) {
                        for (const [methodName, endpoint] of Object.entries(endpoints)) {
                            const [route, defaults, decorations] = endpoint;
                            const [method, url] = route.split(/ /);
                            const endpointDefaults = Object.assign({
                                method,
                                url
                            }, defaults);

                            if (!newMethods[scope]) {
                                newMethods[scope] = {};
                            }

                            const scopeMethods = newMethods[scope];

                            if (decorations) {
                                scopeMethods[methodName] = decorate(octokit, scope, methodName, endpointDefaults, decorations);
                                continue;
                            }

                            scopeMethods[methodName] = octokit.request.defaults(endpointDefaults);
                        }
                    }

                    return newMethods;
                }

                function decorate(octokit, scope, methodName, defaults, decorations) {
                    const requestWithDefaults = octokit.request.defaults(defaults);

                    function withDecorations(...args) {
                        // @ts-ignore https://github.com/microsoft/TypeScript/issues/25488
                        let options = requestWithDefaults.endpoint.merge(...args); // There are currently no other decorations than `.mapToData`

                        if (decorations.mapToData) {
                            options = Object.assign({}, options, {
                                data: options[decorations.mapToData],
                                [decorations.mapToData]: undefined
                            });
                            return requestWithDefaults(options);
                        } // NOTE: there are currently no deprecations. But we keep the code
                        //       below for future reference


                        if (decorations.renamed) {
                            const [newScope, newMethodName] = decorations.renamed;
                            octokit.log.warn(`octokit.${scope}.${methodName}() has been renamed to octokit.${newScope}.${newMethodName}()`);
                        }

                        if (decorations.deprecated) {
                            octokit.log.warn(decorations.deprecated);
                        }

                        if (decorations.renamedParameters) {
                            // @ts-ignore https://github.com/microsoft/TypeScript/issues/25488
                            const options = requestWithDefaults.endpoint.merge(...args);

                            for (const [name, alias] of Object.entries(decorations.renamedParameters)) {
                                // There is currently no deprecated parameter that is optional,
                                // so we never hit the else branch below at this point.

                                /* istanbul ignore else */
                                if (name in options) {
                                    octokit.log.warn(`"${name}" parameter is deprecated for "octokit.${scope}.${methodName}()". Use "${alias}" instead`);

                                    if (!(alias in options)) {
                                        options[alias] = options[name];
                                    }

                                    delete options[name];
                                }
                            }

                            return requestWithDefaults(options);
                        } // @ts-ignore https://github.com/microsoft/TypeScript/issues/25488


                        return requestWithDefaults(...args);
                    }

                    return Object.assign(withDecorations, requestWithDefaults);
                }

                /**
                 * This plugin is a 1:1 copy of internal @octokit/rest plugins. The primary
                 * goal is to rebuild @octokit/rest on top of @octokit/core. Once that is
                 * done, we will remove the registerEndpoints methods and return the methods
                 * directly as with the other plugins. At that point we will also remove the
                 * legacy workarounds and deprecations.
                 *
                 * See the plan at
                 * https://github.com/octokit/plugin-rest-endpoint-methods.js/pull/1
                 */

                function restEndpointMethods(octokit) {
                    return endpointsToMethods(octokit, Endpoints);
                }
                restEndpointMethods.VERSION = VERSION;

                exports.restEndpointMethods = restEndpointMethods;
//# sourceMappingURL=index.js.map


                /***/ }),

            /***/ 844:
            /***/ (function(__unusedmodule, exports, __webpack_require__) {

                "use strict";


                Object.defineProperty(exports, "__esModule", {
                    value: true
                });
                exports.default = rng;

                var _crypto = _interopRequireDefault(__webpack_require__(417));

                function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

                const rnds8Pool = new Uint8Array(256); // # of random values to pre-allocate

                let poolPtr = rnds8Pool.length;

                function rng() {
                    if (poolPtr > rnds8Pool.length - 16) {
                        _crypto.default.randomFillSync(rnds8Pool);

                        poolPtr = 0;
                    }

                    return rnds8Pool.slice(poolPtr, poolPtr += 16);
                }

                /***/ }),

            /***/ 848:
            /***/ (function(module, __unusedexports, __webpack_require__) {

                "use strict";

                const escapeStringRegexp = __webpack_require__(138);

                const platform = process.platform;

                const main = {
                    tick: '✔',
                    cross: '✖',
                    star: '★',
                    square: '▇',
                    squareSmall: '◻',
                    squareSmallFilled: '◼',
                    play: '▶',
                    circle: '◯',
                    circleFilled: '◉',
                    circleDotted: '◌',
                    circleDouble: '◎',
                    circleCircle: 'ⓞ',
                    circleCross: 'ⓧ',
                    circlePipe: 'Ⓘ',
                    circleQuestionMark: '?⃝',
                    bullet: '●',
                    dot: '․',
                    line: '─',
                    ellipsis: '…',
                    pointer: '❯',
                    pointerSmall: '›',
                    info: 'ℹ',
                    warning: '⚠',
                    hamburger: '☰',
                    smiley: '㋡',
                    mustache: '෴',
                    heart: '♥',
                    arrowUp: '↑',
                    arrowDown: '↓',
                    arrowLeft: '←',
                    arrowRight: '→',
                    radioOn: '◉',
                    radioOff: '◯',
                    checkboxOn: '☒',
                    checkboxOff: '☐',
                    checkboxCircleOn: 'ⓧ',
                    checkboxCircleOff: 'Ⓘ',
                    questionMarkPrefix: '?⃝',
                    oneHalf: '½',
                    oneThird: '⅓',
                    oneQuarter: '¼',
                    oneFifth: '⅕',
                    oneSixth: '⅙',
                    oneSeventh: '⅐',
                    oneEighth: '⅛',
                    oneNinth: '⅑',
                    oneTenth: '⅒',
                    twoThirds: '⅔',
                    twoFifths: '⅖',
                    threeQuarters: '¾',
                    threeFifths: '⅗',
                    threeEighths: '⅜',
                    fourFifths: '⅘',
                    fiveSixths: '⅚',
                    fiveEighths: '⅝',
                    sevenEighths: '⅞'
                };

                const win = {
                    tick: '√',
                    cross: '×',
                    star: '*',
                    square: '█',
                    squareSmall: '[ ]',
                    squareSmallFilled: '[█]',
                    play: '►',
                    circle: '( )',
                    circleFilled: '(*)',
                    circleDotted: '( )',
                    circleDouble: '( )',
                    circleCircle: '(○)',
                    circleCross: '(×)',
                    circlePipe: '(│)',
                    circleQuestionMark: '(?)',
                    bullet: '*',
                    dot: '.',
                    line: '─',
                    ellipsis: '...',
                    pointer: '>',
                    pointerSmall: '»',
                    info: 'i',
                    warning: '‼',
                    hamburger: '≡',
                    smiley: '☺',
                    mustache: '┌─┐',
                    heart: main.heart,
                    arrowUp: main.arrowUp,
                    arrowDown: main.arrowDown,
                    arrowLeft: main.arrowLeft,
                    arrowRight: main.arrowRight,
                    radioOn: '(*)',
                    radioOff: '( )',
                    checkboxOn: '[×]',
                    checkboxOff: '[ ]',
                    checkboxCircleOn: '(×)',
                    checkboxCircleOff: '( )',
                    questionMarkPrefix: '？',
                    oneHalf: '1/2',
                    oneThird: '1/3',
                    oneQuarter: '1/4',
                    oneFifth: '1/5',
                    oneSixth: '1/6',
                    oneSeventh: '1/7',
                    oneEighth: '1/8',
                    oneNinth: '1/9',
                    oneTenth: '1/10',
                    twoThirds: '2/3',
                    twoFifths: '2/5',
                    threeQuarters: '3/4',
                    threeFifths: '3/5',
                    threeEighths: '3/8',
                    fourFifths: '4/5',
                    fiveSixths: '5/6',
                    fiveEighths: '5/8',
                    sevenEighths: '7/8'
                };

                if (platform === 'linux') {
                    // the main one doesn't look that good on Ubuntu
                    main.questionMarkPrefix = '?';
                }

                const figures = platform === 'win32' ? win : main;

                const fn = str => {
                    if (figures === main) {
                        return str;
                    }

                    Object.keys(main).forEach(key => {
                        if (main[key] === figures[key]) {
                            return;
                        }

                        str = str.replace(new RegExp(escapeStringRegexp(main[key]), 'g'), figures[key]);
                    });

                    return str;
                };

                module.exports = Object.assign(fn, figures);


                /***/ }),

            /***/ 856:
            /***/ (function(module, __unusedexports, __webpack_require__) {

                "use strict";

                const punycode = __webpack_require__(815);
                const tr46 = __webpack_require__(530);

                const specialSchemes = {
                    ftp: 21,
                    file: null,
                    gopher: 70,
                    http: 80,
                    https: 443,
                    ws: 80,
                    wss: 443
                };

                const failure = Symbol("failure");

                function countSymbols(str) {
                    return punycode.ucs2.decode(str).length;
                }

                function at(input, idx) {
                    const c = input[idx];
                    return isNaN(c) ? undefined : String.fromCodePoint(c);
                }

                function isASCIIDigit(c) {
                    return c >= 0x30 && c <= 0x39;
                }

                function isASCIIAlpha(c) {
                    return (c >= 0x41 && c <= 0x5A) || (c >= 0x61 && c <= 0x7A);
                }

                function isASCIIAlphanumeric(c) {
                    return isASCIIAlpha(c) || isASCIIDigit(c);
                }

                function isASCIIHex(c) {
                    return isASCIIDigit(c) || (c >= 0x41 && c <= 0x46) || (c >= 0x61 && c <= 0x66);
                }

                function isSingleDot(buffer) {
                    return buffer === "." || buffer.toLowerCase() === "%2e";
                }

                function isDoubleDot(buffer) {
                    buffer = buffer.toLowerCase();
                    return buffer === ".." || buffer === "%2e." || buffer === ".%2e" || buffer === "%2e%2e";
                }

                function isWindowsDriveLetterCodePoints(cp1, cp2) {
                    return isASCIIAlpha(cp1) && (cp2 === 58 || cp2 === 124);
                }

                function isWindowsDriveLetterString(string) {
                    return string.length === 2 && isASCIIAlpha(string.codePointAt(0)) && (string[1] === ":" || string[1] === "|");
                }

                function isNormalizedWindowsDriveLetterString(string) {
                    return string.length === 2 && isASCIIAlpha(string.codePointAt(0)) && string[1] === ":";
                }

                function containsForbiddenHostCodePoint(string) {
                    return string.search(/\u0000|\u0009|\u000A|\u000D|\u0020|#|%|\/|:|\?|@|\[|\\|\]/) !== -1;
                }

                function containsForbiddenHostCodePointExcludingPercent(string) {
                    return string.search(/\u0000|\u0009|\u000A|\u000D|\u0020|#|\/|:|\?|@|\[|\\|\]/) !== -1;
                }

                function isSpecialScheme(scheme) {
                    return specialSchemes[scheme] !== undefined;
                }

                function isSpecial(url) {
                    return isSpecialScheme(url.scheme);
                }

                function defaultPort(scheme) {
                    return specialSchemes[scheme];
                }

                function percentEncode(c) {
                    let hex = c.toString(16).toUpperCase();
                    if (hex.length === 1) {
                        hex = "0" + hex;
                    }

                    return "%" + hex;
                }

                function utf8PercentEncode(c) {
                    const buf = new Buffer(c);

                    let str = "";

                    for (let i = 0; i < buf.length; ++i) {
                        str += percentEncode(buf[i]);
                    }

                    return str;
                }

                function utf8PercentDecode(str) {
                    const input = new Buffer(str);
                    const output = [];
                    for (let i = 0; i < input.length; ++i) {
                        if (input[i] !== 37) {
                            output.push(input[i]);
                        } else if (input[i] === 37 && isASCIIHex(input[i + 1]) && isASCIIHex(input[i + 2])) {
                            output.push(parseInt(input.slice(i + 1, i + 3).toString(), 16));
                            i += 2;
                        } else {
                            output.push(input[i]);
                        }
                    }
                    return new Buffer(output).toString();
                }

                function isC0ControlPercentEncode(c) {
                    return c <= 0x1F || c > 0x7E;
                }

                const extraPathPercentEncodeSet = new Set([32, 34, 35, 60, 62, 63, 96, 123, 125]);
                function isPathPercentEncode(c) {
                    return isC0ControlPercentEncode(c) || extraPathPercentEncodeSet.has(c);
                }

                const extraUserinfoPercentEncodeSet =
                    new Set([47, 58, 59, 61, 64, 91, 92, 93, 94, 124]);
                function isUserinfoPercentEncode(c) {
                    return isPathPercentEncode(c) || extraUserinfoPercentEncodeSet.has(c);
                }

                function percentEncodeChar(c, encodeSetPredicate) {
                    const cStr = String.fromCodePoint(c);

                    if (encodeSetPredicate(c)) {
                        return utf8PercentEncode(cStr);
                    }

                    return cStr;
                }

                function parseIPv4Number(input) {
                    let R = 10;

                    if (input.length >= 2 && input.charAt(0) === "0" && input.charAt(1).toLowerCase() === "x") {
                        input = input.substring(2);
                        R = 16;
                    } else if (input.length >= 2 && input.charAt(0) === "0") {
                        input = input.substring(1);
                        R = 8;
                    }

                    if (input === "") {
                        return 0;
                    }

                    const regex = R === 10 ? /[^0-9]/ : (R === 16 ? /[^0-9A-Fa-f]/ : /[^0-7]/);
                    if (regex.test(input)) {
                        return failure;
                    }

                    return parseInt(input, R);
                }

                function parseIPv4(input) {
                    const parts = input.split(".");
                    if (parts[parts.length - 1] === "") {
                        if (parts.length > 1) {
                            parts.pop();
                        }
                    }

                    if (parts.length > 4) {
                        return input;
                    }

                    const numbers = [];
                    for (const part of parts) {
                        if (part === "") {
                            return input;
                        }
                        const n = parseIPv4Number(part);
                        if (n === failure) {
                            return input;
                        }

                        numbers.push(n);
                    }

                    for (let i = 0; i < numbers.length - 1; ++i) {
                        if (numbers[i] > 255) {
                            return failure;
                        }
                    }
                    if (numbers[numbers.length - 1] >= Math.pow(256, 5 - numbers.length)) {
                        return failure;
                    }

                    let ipv4 = numbers.pop();
                    let counter = 0;

                    for (const n of numbers) {
                        ipv4 += n * Math.pow(256, 3 - counter);
                        ++counter;
                    }

                    return ipv4;
                }

                function serializeIPv4(address) {
                    let output = "";
                    let n = address;

                    for (let i = 1; i <= 4; ++i) {
                        output = String(n % 256) + output;
                        if (i !== 4) {
                            output = "." + output;
                        }
                        n = Math.floor(n / 256);
                    }

                    return output;
                }

                function parseIPv6(input) {
                    const address = [0, 0, 0, 0, 0, 0, 0, 0];
                    let pieceIndex = 0;
                    let compress = null;
                    let pointer = 0;

                    input = punycode.ucs2.decode(input);

                    if (input[pointer] === 58) {
                        if (input[pointer + 1] !== 58) {
                            return failure;
                        }

                        pointer += 2;
                        ++pieceIndex;
                        compress = pieceIndex;
                    }

                    while (pointer < input.length) {
                        if (pieceIndex === 8) {
                            return failure;
                        }

                        if (input[pointer] === 58) {
                            if (compress !== null) {
                                return failure;
                            }
                            ++pointer;
                            ++pieceIndex;
                            compress = pieceIndex;
                            continue;
                        }

                        let value = 0;
                        let length = 0;

                        while (length < 4 && isASCIIHex(input[pointer])) {
                            value = value * 0x10 + parseInt(at(input, pointer), 16);
                            ++pointer;
                            ++length;
                        }

                        if (input[pointer] === 46) {
                            if (length === 0) {
                                return failure;
                            }

                            pointer -= length;

                            if (pieceIndex > 6) {
                                return failure;
                            }

                            let numbersSeen = 0;

                            while (input[pointer] !== undefined) {
                                let ipv4Piece = null;

                                if (numbersSeen > 0) {
                                    if (input[pointer] === 46 && numbersSeen < 4) {
                                        ++pointer;
                                    } else {
                                        return failure;
                                    }
                                }

                                if (!isASCIIDigit(input[pointer])) {
                                    return failure;
                                }

                                while (isASCIIDigit(input[pointer])) {
                                    const number = parseInt(at(input, pointer));
                                    if (ipv4Piece === null) {
                                        ipv4Piece = number;
                                    } else if (ipv4Piece === 0) {
                                        return failure;
                                    } else {
                                        ipv4Piece = ipv4Piece * 10 + number;
                                    }
                                    if (ipv4Piece > 255) {
                                        return failure;
                                    }
                                    ++pointer;
                                }

                                address[pieceIndex] = address[pieceIndex] * 0x100 + ipv4Piece;

                                ++numbersSeen;

                                if (numbersSeen === 2 || numbersSeen === 4) {
                                    ++pieceIndex;
                                }
                            }

                            if (numbersSeen !== 4) {
                                return failure;
                            }

                            break;
                        } else if (input[pointer] === 58) {
                            ++pointer;
                            if (input[pointer] === undefined) {
                                return failure;
                            }
                        } else if (input[pointer] !== undefined) {
                            return failure;
                        }

                        address[pieceIndex] = value;
                        ++pieceIndex;
                    }

                    if (compress !== null) {
                        let swaps = pieceIndex - compress;
                        pieceIndex = 7;
                        while (pieceIndex !== 0 && swaps > 0) {
                            const temp = address[compress + swaps - 1];
                            address[compress + swaps - 1] = address[pieceIndex];
                            address[pieceIndex] = temp;
                            --pieceIndex;
                            --swaps;
                        }
                    } else if (compress === null && pieceIndex !== 8) {
                        return failure;
                    }

                    return address;
                }

                function serializeIPv6(address) {
                    let output = "";
                    const seqResult = findLongestZeroSequence(address);
                    const compress = seqResult.idx;
                    let ignore0 = false;

                    for (let pieceIndex = 0; pieceIndex <= 7; ++pieceIndex) {
                        if (ignore0 && address[pieceIndex] === 0) {
                            continue;
                        } else if (ignore0) {
                            ignore0 = false;
                        }

                        if (compress === pieceIndex) {
                            const separator = pieceIndex === 0 ? "::" : ":";
                            output += separator;
                            ignore0 = true;
                            continue;
                        }

                        output += address[pieceIndex].toString(16);

                        if (pieceIndex !== 7) {
                            output += ":";
                        }
                    }

                    return output;
                }

                function parseHost(input, isSpecialArg) {
                    if (input[0] === "[") {
                        if (input[input.length - 1] !== "]") {
                            return failure;
                        }

                        return parseIPv6(input.substring(1, input.length - 1));
                    }

                    if (!isSpecialArg) {
                        return parseOpaqueHost(input);
                    }

                    const domain = utf8PercentDecode(input);
                    const asciiDomain = tr46.toASCII(domain, false, tr46.PROCESSING_OPTIONS.NONTRANSITIONAL, false);
                    if (asciiDomain === null) {
                        return failure;
                    }

                    if (containsForbiddenHostCodePoint(asciiDomain)) {
                        return failure;
                    }

                    const ipv4Host = parseIPv4(asciiDomain);
                    if (typeof ipv4Host === "number" || ipv4Host === failure) {
                        return ipv4Host;
                    }

                    return asciiDomain;
                }

                function parseOpaqueHost(input) {
                    if (containsForbiddenHostCodePointExcludingPercent(input)) {
                        return failure;
                    }

                    let output = "";
                    const decoded = punycode.ucs2.decode(input);
                    for (let i = 0; i < decoded.length; ++i) {
                        output += percentEncodeChar(decoded[i], isC0ControlPercentEncode);
                    }
                    return output;
                }

                function findLongestZeroSequence(arr) {
                    let maxIdx = null;
                    let maxLen = 1; // only find elements > 1
                    let currStart = null;
                    let currLen = 0;

                    for (let i = 0; i < arr.length; ++i) {
                        if (arr[i] !== 0) {
                            if (currLen > maxLen) {
                                maxIdx = currStart;
                                maxLen = currLen;
                            }

                            currStart = null;
                            currLen = 0;
                        } else {
                            if (currStart === null) {
                                currStart = i;
                            }
                            ++currLen;
                        }
                    }

                    // if trailing zeros
                    if (currLen > maxLen) {
                        maxIdx = currStart;
                        maxLen = currLen;
                    }

                    return {
                        idx: maxIdx,
                        len: maxLen
                    };
                }

                function serializeHost(host) {
                    if (typeof host === "number") {
                        return serializeIPv4(host);
                    }

                    // IPv6 serializer
                    if (host instanceof Array) {
                        return "[" + serializeIPv6(host) + "]";
                    }

                    return host;
                }

                function trimControlChars(url) {
                    return url.replace(/^[\u0000-\u001F\u0020]+|[\u0000-\u001F\u0020]+$/g, "");
                }

                function trimTabAndNewline(url) {
                    return url.replace(/\u0009|\u000A|\u000D/g, "");
                }

                function shortenPath(url) {
                    const path = url.path;
                    if (path.length === 0) {
                        return;
                    }
                    if (url.scheme === "file" && path.length === 1 && isNormalizedWindowsDriveLetter(path[0])) {
                        return;
                    }

                    path.pop();
                }

                function includesCredentials(url) {
                    return url.username !== "" || url.password !== "";
                }

                function cannotHaveAUsernamePasswordPort(url) {
                    return url.host === null || url.host === "" || url.cannotBeABaseURL || url.scheme === "file";
                }

                function isNormalizedWindowsDriveLetter(string) {
                    return /^[A-Za-z]:$/.test(string);
                }

                function URLStateMachine(input, base, encodingOverride, url, stateOverride) {
                    this.pointer = 0;
                    this.input = input;
                    this.base = base || null;
                    this.encodingOverride = encodingOverride || "utf-8";
                    this.stateOverride = stateOverride;
                    this.url = url;
                    this.failure = false;
                    this.parseError = false;

                    if (!this.url) {
                        this.url = {
                            scheme: "",
                            username: "",
                            password: "",
                            host: null,
                            port: null,
                            path: [],
                            query: null,
                            fragment: null,

                            cannotBeABaseURL: false
                        };

                        const res = trimControlChars(this.input);
                        if (res !== this.input) {
                            this.parseError = true;
                        }
                        this.input = res;
                    }

                    const res = trimTabAndNewline(this.input);
                    if (res !== this.input) {
                        this.parseError = true;
                    }
                    this.input = res;

                    this.state = stateOverride || "scheme start";

                    this.buffer = "";
                    this.atFlag = false;
                    this.arrFlag = false;
                    this.passwordTokenSeenFlag = false;

                    this.input = punycode.ucs2.decode(this.input);

                    for (; this.pointer <= this.input.length; ++this.pointer) {
                        const c = this.input[this.pointer];
                        const cStr = isNaN(c) ? undefined : String.fromCodePoint(c);

                        // exec state machine
                        const ret = this["parse " + this.state](c, cStr);
                        if (!ret) {
                            break; // terminate algorithm
                        } else if (ret === failure) {
                            this.failure = true;
                            break;
                        }
                    }
                }

                URLStateMachine.prototype["parse scheme start"] = function parseSchemeStart(c, cStr) {
                    if (isASCIIAlpha(c)) {
                        this.buffer += cStr.toLowerCase();
                        this.state = "scheme";
                    } else if (!this.stateOverride) {
                        this.state = "no scheme";
                        --this.pointer;
                    } else {
                        this.parseError = true;
                        return failure;
                    }

                    return true;
                };

                URLStateMachine.prototype["parse scheme"] = function parseScheme(c, cStr) {
                    if (isASCIIAlphanumeric(c) || c === 43 || c === 45 || c === 46) {
                        this.buffer += cStr.toLowerCase();
                    } else if (c === 58) {
                        if (this.stateOverride) {
                            if (isSpecial(this.url) && !isSpecialScheme(this.buffer)) {
                                return false;
                            }

                            if (!isSpecial(this.url) && isSpecialScheme(this.buffer)) {
                                return false;
                            }

                            if ((includesCredentials(this.url) || this.url.port !== null) && this.buffer === "file") {
                                return false;
                            }

                            if (this.url.scheme === "file" && (this.url.host === "" || this.url.host === null)) {
                                return false;
                            }
                        }
                        this.url.scheme = this.buffer;
                        this.buffer = "";
                        if (this.stateOverride) {
                            return false;
                        }
                        if (this.url.scheme === "file") {
                            if (this.input[this.pointer + 1] !== 47 || this.input[this.pointer + 2] !== 47) {
                                this.parseError = true;
                            }
                            this.state = "file";
                        } else if (isSpecial(this.url) && this.base !== null && this.base.scheme === this.url.scheme) {
                            this.state = "special relative or authority";
                        } else if (isSpecial(this.url)) {
                            this.state = "special authority slashes";
                        } else if (this.input[this.pointer + 1] === 47) {
                            this.state = "path or authority";
                            ++this.pointer;
                        } else {
                            this.url.cannotBeABaseURL = true;
                            this.url.path.push("");
                            this.state = "cannot-be-a-base-URL path";
                        }
                    } else if (!this.stateOverride) {
                        this.buffer = "";
                        this.state = "no scheme";
                        this.pointer = -1;
                    } else {
                        this.parseError = true;
                        return failure;
                    }

                    return true;
                };

                URLStateMachine.prototype["parse no scheme"] = function parseNoScheme(c) {
                    if (this.base === null || (this.base.cannotBeABaseURL && c !== 35)) {
                        return failure;
                    } else if (this.base.cannotBeABaseURL && c === 35) {
                        this.url.scheme = this.base.scheme;
                        this.url.path = this.base.path.slice();
                        this.url.query = this.base.query;
                        this.url.fragment = "";
                        this.url.cannotBeABaseURL = true;
                        this.state = "fragment";
                    } else if (this.base.scheme === "file") {
                        this.state = "file";
                        --this.pointer;
                    } else {
                        this.state = "relative";
                        --this.pointer;
                    }

                    return true;
                };

                URLStateMachine.prototype["parse special relative or authority"] = function parseSpecialRelativeOrAuthority(c) {
                    if (c === 47 && this.input[this.pointer + 1] === 47) {
                        this.state = "special authority ignore slashes";
                        ++this.pointer;
                    } else {
                        this.parseError = true;
                        this.state = "relative";
                        --this.pointer;
                    }

                    return true;
                };

                URLStateMachine.prototype["parse path or authority"] = function parsePathOrAuthority(c) {
                    if (c === 47) {
                        this.state = "authority";
                    } else {
                        this.state = "path";
                        --this.pointer;
                    }

                    return true;
                };

                URLStateMachine.prototype["parse relative"] = function parseRelative(c) {
                    this.url.scheme = this.base.scheme;
                    if (isNaN(c)) {
                        this.url.username = this.base.username;
                        this.url.password = this.base.password;
                        this.url.host = this.base.host;
                        this.url.port = this.base.port;
                        this.url.path = this.base.path.slice();
                        this.url.query = this.base.query;
                    } else if (c === 47) {
                        this.state = "relative slash";
                    } else if (c === 63) {
                        this.url.username = this.base.username;
                        this.url.password = this.base.password;
                        this.url.host = this.base.host;
                        this.url.port = this.base.port;
                        this.url.path = this.base.path.slice();
                        this.url.query = "";
                        this.state = "query";
                    } else if (c === 35) {
                        this.url.username = this.base.username;
                        this.url.password = this.base.password;
                        this.url.host = this.base.host;
                        this.url.port = this.base.port;
                        this.url.path = this.base.path.slice();
                        this.url.query = this.base.query;
                        this.url.fragment = "";
                        this.state = "fragment";
                    } else if (isSpecial(this.url) && c === 92) {
                        this.parseError = true;
                        this.state = "relative slash";
                    } else {
                        this.url.username = this.base.username;
                        this.url.password = this.base.password;
                        this.url.host = this.base.host;
                        this.url.port = this.base.port;
                        this.url.path = this.base.path.slice(0, this.base.path.length - 1);

                        this.state = "path";
                        --this.pointer;
                    }

                    return true;
                };

                URLStateMachine.prototype["parse relative slash"] = function parseRelativeSlash(c) {
                    if (isSpecial(this.url) && (c === 47 || c === 92)) {
                        if (c === 92) {
                            this.parseError = true;
                        }
                        this.state = "special authority ignore slashes";
                    } else if (c === 47) {
                        this.state = "authority";
                    } else {
                        this.url.username = this.base.username;
                        this.url.password = this.base.password;
                        this.url.host = this.base.host;
                        this.url.port = this.base.port;
                        this.state = "path";
                        --this.pointer;
                    }

                    return true;
                };

                URLStateMachine.prototype["parse special authority slashes"] = function parseSpecialAuthoritySlashes(c) {
                    if (c === 47 && this.input[this.pointer + 1] === 47) {
                        this.state = "special authority ignore slashes";
                        ++this.pointer;
                    } else {
                        this.parseError = true;
                        this.state = "special authority ignore slashes";
                        --this.pointer;
                    }

                    return true;
                };

                URLStateMachine.prototype["parse special authority ignore slashes"] = function parseSpecialAuthorityIgnoreSlashes(c) {
                    if (c !== 47 && c !== 92) {
                        this.state = "authority";
                        --this.pointer;
                    } else {
                        this.parseError = true;
                    }

                    return true;
                };

                URLStateMachine.prototype["parse authority"] = function parseAuthority(c, cStr) {
                    if (c === 64) {
                        this.parseError = true;
                        if (this.atFlag) {
                            this.buffer = "%40" + this.buffer;
                        }
                        this.atFlag = true;

                        // careful, this is based on buffer and has its own pointer (this.pointer != pointer) and inner chars
                        const len = countSymbols(this.buffer);
                        for (let pointer = 0; pointer < len; ++pointer) {
                            const codePoint = this.buffer.codePointAt(pointer);

                            if (codePoint === 58 && !this.passwordTokenSeenFlag) {
                                this.passwordTokenSeenFlag = true;
                                continue;
                            }
                            const encodedCodePoints = percentEncodeChar(codePoint, isUserinfoPercentEncode);
                            if (this.passwordTokenSeenFlag) {
                                this.url.password += encodedCodePoints;
                            } else {
                                this.url.username += encodedCodePoints;
                            }
                        }
                        this.buffer = "";
                    } else if (isNaN(c) || c === 47 || c === 63 || c === 35 ||
                        (isSpecial(this.url) && c === 92)) {
                        if (this.atFlag && this.buffer === "") {
                            this.parseError = true;
                            return failure;
                        }
                        this.pointer -= countSymbols(this.buffer) + 1;
                        this.buffer = "";
                        this.state = "host";
                    } else {
                        this.buffer += cStr;
                    }

                    return true;
                };

                URLStateMachine.prototype["parse hostname"] =
                    URLStateMachine.prototype["parse host"] = function parseHostName(c, cStr) {
                        if (this.stateOverride && this.url.scheme === "file") {
                            --this.pointer;
                            this.state = "file host";
                        } else if (c === 58 && !this.arrFlag) {
                            if (this.buffer === "") {
                                this.parseError = true;
                                return failure;
                            }

                            const host = parseHost(this.buffer, isSpecial(this.url));
                            if (host === failure) {
                                return failure;
                            }

                            this.url.host = host;
                            this.buffer = "";
                            this.state = "port";
                            if (this.stateOverride === "hostname") {
                                return false;
                            }
                        } else if (isNaN(c) || c === 47 || c === 63 || c === 35 ||
                            (isSpecial(this.url) && c === 92)) {
                            --this.pointer;
                            if (isSpecial(this.url) && this.buffer === "") {
                                this.parseError = true;
                                return failure;
                            } else if (this.stateOverride && this.buffer === "" &&
                                (includesCredentials(this.url) || this.url.port !== null)) {
                                this.parseError = true;
                                return false;
                            }

                            const host = parseHost(this.buffer, isSpecial(this.url));
                            if (host === failure) {
                                return failure;
                            }

                            this.url.host = host;
                            this.buffer = "";
                            this.state = "path start";
                            if (this.stateOverride) {
                                return false;
                            }
                        } else {
                            if (c === 91) {
                                this.arrFlag = true;
                            } else if (c === 93) {
                                this.arrFlag = false;
                            }
                            this.buffer += cStr;
                        }

                        return true;
                    };

                URLStateMachine.prototype["parse port"] = function parsePort(c, cStr) {
                    if (isASCIIDigit(c)) {
                        this.buffer += cStr;
                    } else if (isNaN(c) || c === 47 || c === 63 || c === 35 ||
                        (isSpecial(this.url) && c === 92) ||
                        this.stateOverride) {
                        if (this.buffer !== "") {
                            const port = parseInt(this.buffer);
                            if (port > Math.pow(2, 16) - 1) {
                                this.parseError = true;
                                return failure;
                            }
                            this.url.port = port === defaultPort(this.url.scheme) ? null : port;
                            this.buffer = "";
                        }
                        if (this.stateOverride) {
                            return false;
                        }
                        this.state = "path start";
                        --this.pointer;
                    } else {
                        this.parseError = true;
                        return failure;
                    }

                    return true;
                };

                const fileOtherwiseCodePoints = new Set([47, 92, 63, 35]);

                URLStateMachine.prototype["parse file"] = function parseFile(c) {
                    this.url.scheme = "file";

                    if (c === 47 || c === 92) {
                        if (c === 92) {
                            this.parseError = true;
                        }
                        this.state = "file slash";
                    } else if (this.base !== null && this.base.scheme === "file") {
                        if (isNaN(c)) {
                            this.url.host = this.base.host;
                            this.url.path = this.base.path.slice();
                            this.url.query = this.base.query;
                        } else if (c === 63) {
                            this.url.host = this.base.host;
                            this.url.path = this.base.path.slice();
                            this.url.query = "";
                            this.state = "query";
                        } else if (c === 35) {
                            this.url.host = this.base.host;
                            this.url.path = this.base.path.slice();
                            this.url.query = this.base.query;
                            this.url.fragment = "";
                            this.state = "fragment";
                        } else {
                            if (this.input.length - this.pointer - 1 === 0 || // remaining consists of 0 code points
                                !isWindowsDriveLetterCodePoints(c, this.input[this.pointer + 1]) ||
                                (this.input.length - this.pointer - 1 >= 2 && // remaining has at least 2 code points
                                    !fileOtherwiseCodePoints.has(this.input[this.pointer + 2]))) {
                                this.url.host = this.base.host;
                                this.url.path = this.base.path.slice();
                                shortenPath(this.url);
                            } else {
                                this.parseError = true;
                            }

                            this.state = "path";
                            --this.pointer;
                        }
                    } else {
                        this.state = "path";
                        --this.pointer;
                    }

                    return true;
                };

                URLStateMachine.prototype["parse file slash"] = function parseFileSlash(c) {
                    if (c === 47 || c === 92) {
                        if (c === 92) {
                            this.parseError = true;
                        }
                        this.state = "file host";
                    } else {
                        if (this.base !== null && this.base.scheme === "file") {
                            if (isNormalizedWindowsDriveLetterString(this.base.path[0])) {
                                this.url.path.push(this.base.path[0]);
                            } else {
                                this.url.host = this.base.host;
                            }
                        }
                        this.state = "path";
                        --this.pointer;
                    }

                    return true;
                };

                URLStateMachine.prototype["parse file host"] = function parseFileHost(c, cStr) {
                    if (isNaN(c) || c === 47 || c === 92 || c === 63 || c === 35) {
                        --this.pointer;
                        if (!this.stateOverride && isWindowsDriveLetterString(this.buffer)) {
                            this.parseError = true;
                            this.state = "path";
                        } else if (this.buffer === "") {
                            this.url.host = "";
                            if (this.stateOverride) {
                                return false;
                            }
                            this.state = "path start";
                        } else {
                            let host = parseHost(this.buffer, isSpecial(this.url));
                            if (host === failure) {
                                return failure;
                            }
                            if (host === "localhost") {
                                host = "";
                            }
                            this.url.host = host;

                            if (this.stateOverride) {
                                return false;
                            }

                            this.buffer = "";
                            this.state = "path start";
                        }
                    } else {
                        this.buffer += cStr;
                    }

                    return true;
                };

                URLStateMachine.prototype["parse path start"] = function parsePathStart(c) {
                    if (isSpecial(this.url)) {
                        if (c === 92) {
                            this.parseError = true;
                        }
                        this.state = "path";

                        if (c !== 47 && c !== 92) {
                            --this.pointer;
                        }
                    } else if (!this.stateOverride && c === 63) {
                        this.url.query = "";
                        this.state = "query";
                    } else if (!this.stateOverride && c === 35) {
                        this.url.fragment = "";
                        this.state = "fragment";
                    } else if (c !== undefined) {
                        this.state = "path";
                        if (c !== 47) {
                            --this.pointer;
                        }
                    }

                    return true;
                };

                URLStateMachine.prototype["parse path"] = function parsePath(c) {
                    if (isNaN(c) || c === 47 || (isSpecial(this.url) && c === 92) ||
                        (!this.stateOverride && (c === 63 || c === 35))) {
                        if (isSpecial(this.url) && c === 92) {
                            this.parseError = true;
                        }

                        if (isDoubleDot(this.buffer)) {
                            shortenPath(this.url);
                            if (c !== 47 && !(isSpecial(this.url) && c === 92)) {
                                this.url.path.push("");
                            }
                        } else if (isSingleDot(this.buffer) && c !== 47 &&
                            !(isSpecial(this.url) && c === 92)) {
                            this.url.path.push("");
                        } else if (!isSingleDot(this.buffer)) {
                            if (this.url.scheme === "file" && this.url.path.length === 0 && isWindowsDriveLetterString(this.buffer)) {
                                if (this.url.host !== "" && this.url.host !== null) {
                                    this.parseError = true;
                                    this.url.host = "";
                                }
                                this.buffer = this.buffer[0] + ":";
                            }
                            this.url.path.push(this.buffer);
                        }
                        this.buffer = "";
                        if (this.url.scheme === "file" && (c === undefined || c === 63 || c === 35)) {
                            while (this.url.path.length > 1 && this.url.path[0] === "") {
                                this.parseError = true;
                                this.url.path.shift();
                            }
                        }
                        if (c === 63) {
                            this.url.query = "";
                            this.state = "query";
                        }
                        if (c === 35) {
                            this.url.fragment = "";
                            this.state = "fragment";
                        }
                    } else {
                        // TODO: If c is not a URL code point and not "%", parse error.

                        if (c === 37 &&
                            (!isASCIIHex(this.input[this.pointer + 1]) ||
                                !isASCIIHex(this.input[this.pointer + 2]))) {
                            this.parseError = true;
                        }

                        this.buffer += percentEncodeChar(c, isPathPercentEncode);
                    }

                    return true;
                };

                URLStateMachine.prototype["parse cannot-be-a-base-URL path"] = function parseCannotBeABaseURLPath(c) {
                    if (c === 63) {
                        this.url.query = "";
                        this.state = "query";
                    } else if (c === 35) {
                        this.url.fragment = "";
                        this.state = "fragment";
                    } else {
                        // TODO: Add: not a URL code point
                        if (!isNaN(c) && c !== 37) {
                            this.parseError = true;
                        }

                        if (c === 37 &&
                            (!isASCIIHex(this.input[this.pointer + 1]) ||
                                !isASCIIHex(this.input[this.pointer + 2]))) {
                            this.parseError = true;
                        }

                        if (!isNaN(c)) {
                            this.url.path[0] = this.url.path[0] + percentEncodeChar(c, isC0ControlPercentEncode);
                        }
                    }

                    return true;
                };

                URLStateMachine.prototype["parse query"] = function parseQuery(c, cStr) {
                    if (isNaN(c) || (!this.stateOverride && c === 35)) {
                        if (!isSpecial(this.url) || this.url.scheme === "ws" || this.url.scheme === "wss") {
                            this.encodingOverride = "utf-8";
                        }

                        const buffer = new Buffer(this.buffer); // TODO: Use encoding override instead
                        for (let i = 0; i < buffer.length; ++i) {
                            if (buffer[i] < 0x21 || buffer[i] > 0x7E || buffer[i] === 0x22 || buffer[i] === 0x23 ||
                                buffer[i] === 0x3C || buffer[i] === 0x3E) {
                                this.url.query += percentEncode(buffer[i]);
                            } else {
                                this.url.query += String.fromCodePoint(buffer[i]);
                            }
                        }

                        this.buffer = "";
                        if (c === 35) {
                            this.url.fragment = "";
                            this.state = "fragment";
                        }
                    } else {
                        // TODO: If c is not a URL code point and not "%", parse error.
                        if (c === 37 &&
                            (!isASCIIHex(this.input[this.pointer + 1]) ||
                                !isASCIIHex(this.input[this.pointer + 2]))) {
                            this.parseError = true;
                        }

                        this.buffer += cStr;
                    }

                    return true;
                };

                URLStateMachine.prototype["parse fragment"] = function parseFragment(c) {
                    if (isNaN(c)) { // do nothing
                    } else if (c === 0x0) {
                        this.parseError = true;
                    } else {
                        // TODO: If c is not a URL code point and not "%", parse error.
                        if (c === 37 &&
                            (!isASCIIHex(this.input[this.pointer + 1]) ||
                                !isASCIIHex(this.input[this.pointer + 2]))) {
                            this.parseError = true;
                        }

                        this.url.fragment += percentEncodeChar(c, isC0ControlPercentEncode);
                    }

                    return true;
                };

                function serializeURL(url, excludeFragment) {
                    let output = url.scheme + ":";
                    if (url.host !== null) {
                        output += "//";

                        if (url.username !== "" || url.password !== "") {
                            output += url.username;
                            if (url.password !== "") {
                                output += ":" + url.password;
                            }
                            output += "@";
                        }

                        output += serializeHost(url.host);

                        if (url.port !== null) {
                            output += ":" + url.port;
                        }
                    } else if (url.host === null && url.scheme === "file") {
                        output += "//";
                    }

                    if (url.cannotBeABaseURL) {
                        output += url.path[0];
                    } else {
                        for (const string of url.path) {
                            output += "/" + string;
                        }
                    }

                    if (url.query !== null) {
                        output += "?" + url.query;
                    }

                    if (!excludeFragment && url.fragment !== null) {
                        output += "#" + url.fragment;
                    }

                    return output;
                }

                function serializeOrigin(tuple) {
                    let result = tuple.scheme + "://";
                    result += serializeHost(tuple.host);

                    if (tuple.port !== null) {
                        result += ":" + tuple.port;
                    }

                    return result;
                }

                module.exports.serializeURL = serializeURL;

                module.exports.serializeURLOrigin = function (url) {
                    // https://url.spec.whatwg.org/#concept-url-origin
                    switch (url.scheme) {
                        case "blob":
                            try {
                                return module.exports.serializeURLOrigin(module.exports.parseURL(url.path[0]));
                            } catch (e) {
                                // serializing an opaque origin returns "null"
                                return "null";
                            }
                        case "ftp":
                        case "gopher":
                        case "http":
                        case "https":
                        case "ws":
                        case "wss":
                            return serializeOrigin({
                                scheme: url.scheme,
                                host: url.host,
                                port: url.port
                            });
                        case "file":
                            // spec says "exercise to the reader", chrome says "file://"
                            return "file://";
                        default:
                            // serializing an opaque origin returns "null"
                            return "null";
                    }
                };

                module.exports.basicURLParse = function (input, options) {
                    if (options === undefined) {
                        options = {};
                    }

                    const usm = new URLStateMachine(input, options.baseURL, options.encodingOverride, options.url, options.stateOverride);
                    if (usm.failure) {
                        return "failure";
                    }

                    return usm.url;
                };

                module.exports.setTheUsername = function (url, username) {
                    url.username = "";
                    const decoded = punycode.ucs2.decode(username);
                    for (let i = 0; i < decoded.length; ++i) {
                        url.username += percentEncodeChar(decoded[i], isUserinfoPercentEncode);
                    }
                };

                module.exports.setThePassword = function (url, password) {
                    url.password = "";
                    const decoded = punycode.ucs2.decode(password);
                    for (let i = 0; i < decoded.length; ++i) {
                        url.password += percentEncodeChar(decoded[i], isUserinfoPercentEncode);
                    }
                };

                module.exports.serializeHost = serializeHost;

                module.exports.cannotHaveAUsernamePasswordPort = cannotHaveAUsernamePasswordPort;

                module.exports.serializeInteger = function (integer) {
                    return String(integer);
                };

                module.exports.parseURL = function (input, options) {
                    if (options === undefined) {
                        options = {};
                    }

                    // We don't handle blobs, so this just delegates:
                    return module.exports.basicURLParse(input, { baseURL: options.baseURL, encodingOverride: options.encodingOverride });
                };


                /***/ }),

            /***/ 861:
            /***/ (function(__unusedmodule, exports, __webpack_require__) {

                "use strict";

                var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
                    if (k2 === undefined) k2 = k;
                    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
                }) : (function(o, m, k, k2) {
                    if (k2 === undefined) k2 = k;
                    o[k2] = m[k];
                }));
                var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
                    Object.defineProperty(o, "default", { enumerable: true, value: v });
                }) : function(o, v) {
                    o["default"] = v;
                });
                var __importStar = (this && this.__importStar) || function (mod) {
                    if (mod && mod.__esModule) return mod;
                    var result = {};
                    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
                    __setModuleDefault(result, mod);
                    return result;
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                exports.createInputProxy = void 0;
                var core = __importStar(__webpack_require__(470));
                function createInputProxy() {
                    return new Proxy({}, {
                        get: function (_, name) {
                            // When we attempt to get `inputs.___`, instead
                            // we call `core.getInput`.
                            return core.getInput(name);
                        },
                        getOwnPropertyDescriptor: function () {
                            // We need to overwrite this to ensure that
                            // keys are enumerated
                            return {
                                enumerable: true,
                                configurable: true,
                                writable: false
                            };
                        },
                        ownKeys: function () {
                            var keys = Object.keys(process.env);
                            var filtered = keys.filter(function (key) { return key.startsWith('INPUT_'); });
                            return filtered;
                        }
                    });
                }
                exports.createInputProxy = createInputProxy;
//# sourceMappingURL=inputs.js.map

                /***/ }),

            /***/ 865:
            /***/ (function(__unusedmodule, exports, __webpack_require__) {

                "use strict";

                const usm = __webpack_require__(856);

                exports.implementation = class URLImpl {
                    constructor(constructorArgs) {
                        const url = constructorArgs[0];
                        const base = constructorArgs[1];

                        let parsedBase = null;
                        if (base !== undefined) {
                            parsedBase = usm.basicURLParse(base);
                            if (parsedBase === "failure") {
                                throw new TypeError("Invalid base URL");
                            }
                        }

                        const parsedURL = usm.basicURLParse(url, { baseURL: parsedBase });
                        if (parsedURL === "failure") {
                            throw new TypeError("Invalid URL");
                        }

                        this._url = parsedURL;

                        // TODO: query stuff
                    }

                    get href() {
                        return usm.serializeURL(this._url);
                    }

                    set href(v) {
                        const parsedURL = usm.basicURLParse(v);
                        if (parsedURL === "failure") {
                            throw new TypeError("Invalid URL");
                        }

                        this._url = parsedURL;
                    }

                    get origin() {
                        return usm.serializeURLOrigin(this._url);
                    }

                    get protocol() {
                        return this._url.scheme + ":";
                    }

                    set protocol(v) {
                        usm.basicURLParse(v + ":", { url: this._url, stateOverride: "scheme start" });
                    }

                    get username() {
                        return this._url.username;
                    }

                    set username(v) {
                        if (usm.cannotHaveAUsernamePasswordPort(this._url)) {
                            return;
                        }

                        usm.setTheUsername(this._url, v);
                    }

                    get password() {
                        return this._url.password;
                    }

                    set password(v) {
                        if (usm.cannotHaveAUsernamePasswordPort(this._url)) {
                            return;
                        }

                        usm.setThePassword(this._url, v);
                    }

                    get host() {
                        const url = this._url;

                        if (url.host === null) {
                            return "";
                        }

                        if (url.port === null) {
                            return usm.serializeHost(url.host);
                        }

                        return usm.serializeHost(url.host) + ":" + usm.serializeInteger(url.port);
                    }

                    set host(v) {
                        if (this._url.cannotBeABaseURL) {
                            return;
                        }

                        usm.basicURLParse(v, { url: this._url, stateOverride: "host" });
                    }

                    get hostname() {
                        if (this._url.host === null) {
                            return "";
                        }

                        return usm.serializeHost(this._url.host);
                    }

                    set hostname(v) {
                        if (this._url.cannotBeABaseURL) {
                            return;
                        }

                        usm.basicURLParse(v, { url: this._url, stateOverride: "hostname" });
                    }

                    get port() {
                        if (this._url.port === null) {
                            return "";
                        }

                        return usm.serializeInteger(this._url.port);
                    }

                    set port(v) {
                        if (usm.cannotHaveAUsernamePasswordPort(this._url)) {
                            return;
                        }

                        if (v === "") {
                            this._url.port = null;
                        } else {
                            usm.basicURLParse(v, { url: this._url, stateOverride: "port" });
                        }
                    }

                    get pathname() {
                        if (this._url.cannotBeABaseURL) {
                            return this._url.path[0];
                        }

                        if (this._url.path.length === 0) {
                            return "";
                        }

                        return "/" + this._url.path.join("/");
                    }

                    set pathname(v) {
                        if (this._url.cannotBeABaseURL) {
                            return;
                        }

                        this._url.path = [];
                        usm.basicURLParse(v, { url: this._url, stateOverride: "path start" });
                    }

                    get search() {
                        if (this._url.query === null || this._url.query === "") {
                            return "";
                        }

                        return "?" + this._url.query;
                    }

                    set search(v) {
                        // TODO: query stuff

                        const url = this._url;

                        if (v === "") {
                            url.query = null;
                            return;
                        }

                        const input = v[0] === "?" ? v.substring(1) : v;
                        url.query = "";
                        usm.basicURLParse(input, { url, stateOverride: "query" });
                    }

                    get hash() {
                        if (this._url.fragment === null || this._url.fragment === "") {
                            return "";
                        }

                        return "#" + this._url.fragment;
                    }

                    set hash(v) {
                        if (v === "") {
                            this._url.fragment = null;
                            return;
                        }

                        const input = v[0] === "#" ? v.substring(1) : v;
                        this._url.fragment = "";
                        usm.basicURLParse(input, { url: this._url, stateOverride: "fragment" });
                    }

                    toJSON() {
                        return this.href;
                    }
                };


                /***/ }),

            /***/ 866:
            /***/ (function(module, __unusedexports, __webpack_require__) {

                "use strict";

                var shebangRegex = __webpack_require__(816);

                module.exports = function (str) {
                    var match = str.match(shebangRegex);

                    if (!match) {
                        return null;
                    }

                    var arr = match[0].replace(/#! ?/, '').split(' ');
                    var bin = arr[0].split('/').pop();
                    var arg = arr[1];

                    return (bin === 'env' ?
                            arg :
                            bin + (arg ? ' ' + arg : '')
                    );
                };


                /***/ }),

            /***/ 880:
            /***/ (function(module, __unusedexports, __webpack_require__) {

                "use strict";


                const conversions = __webpack_require__(751);
                const utils = __webpack_require__(120);
                const Impl = __webpack_require__(865);

                const impl = utils.implSymbol;

                function URL(url) {
                    if (!this || this[impl] || !(this instanceof URL)) {
                        throw new TypeError("Failed to construct 'URL': Please use the 'new' operator, this DOM object constructor cannot be called as a function.");
                    }
                    if (arguments.length < 1) {
                        throw new TypeError("Failed to construct 'URL': 1 argument required, but only " + arguments.length + " present.");
                    }
                    const args = [];
                    for (let i = 0; i < arguments.length && i < 2; ++i) {
                        args[i] = arguments[i];
                    }
                    args[0] = conversions["USVString"](args[0]);
                    if (args[1] !== undefined) {
                        args[1] = conversions["USVString"](args[1]);
                    }

                    module.exports.setup(this, args);
                }

                URL.prototype.toJSON = function toJSON() {
                    if (!this || !module.exports.is(this)) {
                        throw new TypeError("Illegal invocation");
                    }
                    const args = [];
                    for (let i = 0; i < arguments.length && i < 0; ++i) {
                        args[i] = arguments[i];
                    }
                    return this[impl].toJSON.apply(this[impl], args);
                };
                Object.defineProperty(URL.prototype, "href", {
                    get() {
                        return this[impl].href;
                    },
                    set(V) {
                        V = conversions["USVString"](V);
                        this[impl].href = V;
                    },
                    enumerable: true,
                    configurable: true
                });

                URL.prototype.toString = function () {
                    if (!this || !module.exports.is(this)) {
                        throw new TypeError("Illegal invocation");
                    }
                    return this.href;
                };

                Object.defineProperty(URL.prototype, "origin", {
                    get() {
                        return this[impl].origin;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(URL.prototype, "protocol", {
                    get() {
                        return this[impl].protocol;
                    },
                    set(V) {
                        V = conversions["USVString"](V);
                        this[impl].protocol = V;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(URL.prototype, "username", {
                    get() {
                        return this[impl].username;
                    },
                    set(V) {
                        V = conversions["USVString"](V);
                        this[impl].username = V;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(URL.prototype, "password", {
                    get() {
                        return this[impl].password;
                    },
                    set(V) {
                        V = conversions["USVString"](V);
                        this[impl].password = V;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(URL.prototype, "host", {
                    get() {
                        return this[impl].host;
                    },
                    set(V) {
                        V = conversions["USVString"](V);
                        this[impl].host = V;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(URL.prototype, "hostname", {
                    get() {
                        return this[impl].hostname;
                    },
                    set(V) {
                        V = conversions["USVString"](V);
                        this[impl].hostname = V;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(URL.prototype, "port", {
                    get() {
                        return this[impl].port;
                    },
                    set(V) {
                        V = conversions["USVString"](V);
                        this[impl].port = V;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(URL.prototype, "pathname", {
                    get() {
                        return this[impl].pathname;
                    },
                    set(V) {
                        V = conversions["USVString"](V);
                        this[impl].pathname = V;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(URL.prototype, "search", {
                    get() {
                        return this[impl].search;
                    },
                    set(V) {
                        V = conversions["USVString"](V);
                        this[impl].search = V;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(URL.prototype, "hash", {
                    get() {
                        return this[impl].hash;
                    },
                    set(V) {
                        V = conversions["USVString"](V);
                        this[impl].hash = V;
                    },
                    enumerable: true,
                    configurable: true
                });


                module.exports = {
                    is(obj) {
                        return !!obj && obj[impl] instanceof Impl.implementation;
                    },
                    create(constructorArgs, privateData) {
                        let obj = Object.create(URL.prototype);
                        this.setup(obj, constructorArgs, privateData);
                        return obj;
                    },
                    setup(obj, constructorArgs, privateData) {
                        if (!privateData) privateData = {};
                        privateData.wrapper = obj;

                        obj[impl] = new Impl.implementation(constructorArgs, privateData);
                        obj[impl][utils.wrapperSymbol] = obj;
                    },
                    interface: URL,
                    expose: {
                        Window: { URL: URL },
                        Worker: { URL: URL }
                    }
                };



                /***/ }),

            /***/ 881:
            /***/ (function(module) {

                "use strict";


                const isWin = process.platform === 'win32';

                function notFoundError(original, syscall) {
                    return Object.assign(new Error(`${syscall} ${original.command} ENOENT`), {
                        code: 'ENOENT',
                        errno: 'ENOENT',
                        syscall: `${syscall} ${original.command}`,
                        path: original.command,
                        spawnargs: original.args,
                    });
                }

                function hookChildProcess(cp, parsed) {
                    if (!isWin) {
                        return;
                    }

                    const originalEmit = cp.emit;

                    cp.emit = function (name, arg1) {
                        // If emitting "exit" event and exit code is 1, we need to check if
                        // the command exists and emit an "error" instead
                        // See https://github.com/IndigoUnited/node-cross-spawn/issues/16
                        if (name === 'exit') {
                            const err = verifyENOENT(arg1, parsed, 'spawn');

                            if (err) {
                                return originalEmit.call(cp, 'error', err);
                            }
                        }

                        return originalEmit.apply(cp, arguments); // eslint-disable-line prefer-rest-params
                    };
                }

                function verifyENOENT(status, parsed) {
                    if (isWin && status === 1 && !parsed.file) {
                        return notFoundError(parsed.original, 'spawn');
                    }

                    return null;
                }

                function verifyENOENTSync(status, parsed) {
                    if (isWin && status === 1 && !parsed.file) {
                        return notFoundError(parsed.original, 'spawnSync');
                    }

                    return null;
                }

                module.exports = {
                    hookChildProcess,
                    verifyENOENT,
                    verifyENOENTSync,
                    notFoundError,
                };


                /***/ }),

            /***/ 885:
            /***/ (function(module) {

                "use strict";


                module.exports = {
                    "aliceblue": [240, 248, 255],
                    "antiquewhite": [250, 235, 215],
                    "aqua": [0, 255, 255],
                    "aquamarine": [127, 255, 212],
                    "azure": [240, 255, 255],
                    "beige": [245, 245, 220],
                    "bisque": [255, 228, 196],
                    "black": [0, 0, 0],
                    "blanchedalmond": [255, 235, 205],
                    "blue": [0, 0, 255],
                    "blueviolet": [138, 43, 226],
                    "brown": [165, 42, 42],
                    "burlywood": [222, 184, 135],
                    "cadetblue": [95, 158, 160],
                    "chartreuse": [127, 255, 0],
                    "chocolate": [210, 105, 30],
                    "coral": [255, 127, 80],
                    "cornflowerblue": [100, 149, 237],
                    "cornsilk": [255, 248, 220],
                    "crimson": [220, 20, 60],
                    "cyan": [0, 255, 255],
                    "darkblue": [0, 0, 139],
                    "darkcyan": [0, 139, 139],
                    "darkgoldenrod": [184, 134, 11],
                    "darkgray": [169, 169, 169],
                    "darkgreen": [0, 100, 0],
                    "darkgrey": [169, 169, 169],
                    "darkkhaki": [189, 183, 107],
                    "darkmagenta": [139, 0, 139],
                    "darkolivegreen": [85, 107, 47],
                    "darkorange": [255, 140, 0],
                    "darkorchid": [153, 50, 204],
                    "darkred": [139, 0, 0],
                    "darksalmon": [233, 150, 122],
                    "darkseagreen": [143, 188, 143],
                    "darkslateblue": [72, 61, 139],
                    "darkslategray": [47, 79, 79],
                    "darkslategrey": [47, 79, 79],
                    "darkturquoise": [0, 206, 209],
                    "darkviolet": [148, 0, 211],
                    "deeppink": [255, 20, 147],
                    "deepskyblue": [0, 191, 255],
                    "dimgray": [105, 105, 105],
                    "dimgrey": [105, 105, 105],
                    "dodgerblue": [30, 144, 255],
                    "firebrick": [178, 34, 34],
                    "floralwhite": [255, 250, 240],
                    "forestgreen": [34, 139, 34],
                    "fuchsia": [255, 0, 255],
                    "gainsboro": [220, 220, 220],
                    "ghostwhite": [248, 248, 255],
                    "gold": [255, 215, 0],
                    "goldenrod": [218, 165, 32],
                    "gray": [128, 128, 128],
                    "green": [0, 128, 0],
                    "greenyellow": [173, 255, 47],
                    "grey": [128, 128, 128],
                    "honeydew": [240, 255, 240],
                    "hotpink": [255, 105, 180],
                    "indianred": [205, 92, 92],
                    "indigo": [75, 0, 130],
                    "ivory": [255, 255, 240],
                    "khaki": [240, 230, 140],
                    "lavender": [230, 230, 250],
                    "lavenderblush": [255, 240, 245],
                    "lawngreen": [124, 252, 0],
                    "lemonchiffon": [255, 250, 205],
                    "lightblue": [173, 216, 230],
                    "lightcoral": [240, 128, 128],
                    "lightcyan": [224, 255, 255],
                    "lightgoldenrodyellow": [250, 250, 210],
                    "lightgray": [211, 211, 211],
                    "lightgreen": [144, 238, 144],
                    "lightgrey": [211, 211, 211],
                    "lightpink": [255, 182, 193],
                    "lightsalmon": [255, 160, 122],
                    "lightseagreen": [32, 178, 170],
                    "lightskyblue": [135, 206, 250],
                    "lightslategray": [119, 136, 153],
                    "lightslategrey": [119, 136, 153],
                    "lightsteelblue": [176, 196, 222],
                    "lightyellow": [255, 255, 224],
                    "lime": [0, 255, 0],
                    "limegreen": [50, 205, 50],
                    "linen": [250, 240, 230],
                    "magenta": [255, 0, 255],
                    "maroon": [128, 0, 0],
                    "mediumaquamarine": [102, 205, 170],
                    "mediumblue": [0, 0, 205],
                    "mediumorchid": [186, 85, 211],
                    "mediumpurple": [147, 112, 219],
                    "mediumseagreen": [60, 179, 113],
                    "mediumslateblue": [123, 104, 238],
                    "mediumspringgreen": [0, 250, 154],
                    "mediumturquoise": [72, 209, 204],
                    "mediumvioletred": [199, 21, 133],
                    "midnightblue": [25, 25, 112],
                    "mintcream": [245, 255, 250],
                    "mistyrose": [255, 228, 225],
                    "moccasin": [255, 228, 181],
                    "navajowhite": [255, 222, 173],
                    "navy": [0, 0, 128],
                    "oldlace": [253, 245, 230],
                    "olive": [128, 128, 0],
                    "olivedrab": [107, 142, 35],
                    "orange": [255, 165, 0],
                    "orangered": [255, 69, 0],
                    "orchid": [218, 112, 214],
                    "palegoldenrod": [238, 232, 170],
                    "palegreen": [152, 251, 152],
                    "paleturquoise": [175, 238, 238],
                    "palevioletred": [219, 112, 147],
                    "papayawhip": [255, 239, 213],
                    "peachpuff": [255, 218, 185],
                    "peru": [205, 133, 63],
                    "pink": [255, 192, 203],
                    "plum": [221, 160, 221],
                    "powderblue": [176, 224, 230],
                    "purple": [128, 0, 128],
                    "rebeccapurple": [102, 51, 153],
                    "red": [255, 0, 0],
                    "rosybrown": [188, 143, 143],
                    "royalblue": [65, 105, 225],
                    "saddlebrown": [139, 69, 19],
                    "salmon": [250, 128, 114],
                    "sandybrown": [244, 164, 96],
                    "seagreen": [46, 139, 87],
                    "seashell": [255, 245, 238],
                    "sienna": [160, 82, 45],
                    "silver": [192, 192, 192],
                    "skyblue": [135, 206, 235],
                    "slateblue": [106, 90, 205],
                    "slategray": [112, 128, 144],
                    "slategrey": [112, 128, 144],
                    "snow": [255, 250, 250],
                    "springgreen": [0, 255, 127],
                    "steelblue": [70, 130, 180],
                    "tan": [210, 180, 140],
                    "teal": [0, 128, 128],
                    "thistle": [216, 191, 216],
                    "tomato": [255, 99, 71],
                    "turquoise": [64, 224, 208],
                    "violet": [238, 130, 238],
                    "wheat": [245, 222, 179],
                    "white": [255, 255, 255],
                    "whitesmoke": [245, 245, 245],
                    "yellow": [255, 255, 0],
                    "yellowgreen": [154, 205, 50]
                };


                /***/ }),

            /***/ 889:
            /***/ (function(__unusedmodule, exports, __webpack_require__) {

                "use strict";


                Object.defineProperty(exports, '__esModule', { value: true });

                var core = __webpack_require__(152);
                var pluginRequestLog = __webpack_require__(916);
                var pluginPaginateRest = __webpack_require__(299);
                var pluginRestEndpointMethods = __webpack_require__(842);

                const VERSION = "17.11.2";

                const Octokit = core.Octokit.plugin(pluginRequestLog.requestLog, pluginRestEndpointMethods.restEndpointMethods, pluginPaginateRest.paginateRest).defaults({
                    userAgent: `octokit-rest.js/${VERSION}`
                });

                exports.Octokit = Octokit;
//# sourceMappingURL=index.js.map


                /***/ }),

            /***/ 893:
            /***/ (function(__unusedmodule, exports, __webpack_require__) {

                "use strict";


                Object.defineProperty(exports, "__esModule", {
                    value: true
                });
                exports.default = void 0;

                var _rng = _interopRequireDefault(__webpack_require__(844));

                var _stringify = _interopRequireDefault(__webpack_require__(411));

                function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html
                let _nodeId;

                let _clockseq; // Previous uuid creation time


                let _lastMSecs = 0;
                let _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details

                function v1(options, buf, offset) {
                    let i = buf && offset || 0;
                    const b = buf || new Array(16);
                    options = options || {};
                    let node = options.node || _nodeId;
                    let clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
                    // specified.  We do this lazily to minimize issues related to insufficient
                    // system entropy.  See #189

                    if (node == null || clockseq == null) {
                        const seedBytes = options.random || (options.rng || _rng.default)();

                        if (node == null) {
                            // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
                            node = _nodeId = [seedBytes[0] | 0x01, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
                        }

                        if (clockseq == null) {
                            // Per 4.2.2, randomize (14 bit) clockseq
                            clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
                        }
                    } // UUID timestamps are 100 nano-second units since the Gregorian epoch,
                    // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
                    // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
                    // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.


                    let msecs = options.msecs !== undefined ? options.msecs : Date.now(); // Per 4.2.1.2, use count of uuid's generated during the current clock
                    // cycle to simulate higher resolution clock

                    let nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)

                    const dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression

                    if (dt < 0 && options.clockseq === undefined) {
                        clockseq = clockseq + 1 & 0x3fff;
                    } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
                    // time interval


                    if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
                        nsecs = 0;
                    } // Per 4.2.1.2 Throw error if too many uuids are requested


                    if (nsecs >= 10000) {
                        throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
                    }

                    _lastMSecs = msecs;
                    _lastNSecs = nsecs;
                    _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch

                    msecs += 12219292800000; // `time_low`

                    const tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
                    b[i++] = tl >>> 24 & 0xff;
                    b[i++] = tl >>> 16 & 0xff;
                    b[i++] = tl >>> 8 & 0xff;
                    b[i++] = tl & 0xff; // `time_mid`

                    const tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
                    b[i++] = tmh >>> 8 & 0xff;
                    b[i++] = tmh & 0xff; // `time_high_and_version`

                    b[i++] = tmh >>> 24 & 0xf | 0x10; // include version

                    b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)

                    b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`

                    b[i++] = clockseq & 0xff; // `node`

                    for (let n = 0; n < 6; ++n) {
                        b[i + n] = node[n];
                    }

                    return buf || (0, _stringify.default)(b);
                }

                var _default = v1;
                exports.default = _default;

                /***/ }),

            /***/ 916:
            /***/ (function(__unusedmodule, exports) {

                "use strict";


                Object.defineProperty(exports, '__esModule', { value: true });

                const VERSION = "1.0.4";

                /**
                 * @param octokit Octokit instance
                 * @param options Options passed to Octokit constructor
                 */

                function requestLog(octokit) {
                    octokit.hook.wrap("request", (request, options) => {
                        octokit.log.debug("request", options);
                        const start = Date.now();
                        const requestOptions = octokit.request.endpoint.parse(options);
                        const path = requestOptions.url.replace(options.baseUrl, "");
                        return request(options).then(response => {
                            octokit.log.info(`${requestOptions.method} ${path} - ${response.status} in ${Date.now() - start}ms`);
                            return response;
                        }).catch(error => {
                            octokit.log.info(`${requestOptions.method} ${path} - ${error.status} in ${Date.now() - start}ms`);
                            throw error;
                        });
                    });
                }
                requestLog.VERSION = VERSION;

                exports.requestLog = requestLog;
//# sourceMappingURL=index.js.map


                /***/ }),

            /***/ 946:
            /***/ (function(module, __unusedexports, __webpack_require__) {

                "use strict";

                const escapeStringRegexp = __webpack_require__(138);
                const ansiStyles = __webpack_require__(663);
                const stdoutColor = __webpack_require__(247).stdout;

                const template = __webpack_require__(841);

                const isSimpleWindowsTerm = process.platform === 'win32' && !(process.env.TERM || '').toLowerCase().startsWith('xterm');

// `supportsColor.level` → `ansiStyles.color[name]` mapping
                const levelMapping = ['ansi', 'ansi', 'ansi256', 'ansi16m'];

// `color-convert` models to exclude from the Chalk API due to conflicts and such
                const skipModels = new Set(['gray']);

                const styles = Object.create(null);

                function applyOptions(obj, options) {
                    options = options || {};

                    // Detect level if not set manually
                    const scLevel = stdoutColor ? stdoutColor.level : 0;
                    obj.level = options.level === undefined ? scLevel : options.level;
                    obj.enabled = 'enabled' in options ? options.enabled : obj.level > 0;
                }

                function Chalk(options) {
                    // We check for this.template here since calling `chalk.constructor()`
                    // by itself will have a `this` of a previously constructed chalk object
                    if (!this || !(this instanceof Chalk) || this.template) {
                        const chalk = {};
                        applyOptions(chalk, options);

                        chalk.template = function () {
                            const args = [].slice.call(arguments);
                            return chalkTag.apply(null, [chalk.template].concat(args));
                        };

                        Object.setPrototypeOf(chalk, Chalk.prototype);
                        Object.setPrototypeOf(chalk.template, chalk);

                        chalk.template.constructor = Chalk;

                        return chalk.template;
                    }

                    applyOptions(this, options);
                }

// Use bright blue on Windows as the normal blue color is illegible
                if (isSimpleWindowsTerm) {
                    ansiStyles.blue.open = '\u001B[94m';
                }

                for (const key of Object.keys(ansiStyles)) {
                    ansiStyles[key].closeRe = new RegExp(escapeStringRegexp(ansiStyles[key].close), 'g');

                    styles[key] = {
                        get() {
                            const codes = ansiStyles[key];
                            return build.call(this, this._styles ? this._styles.concat(codes) : [codes], this._empty, key);
                        }
                    };
                }

                styles.visible = {
                    get() {
                        return build.call(this, this._styles || [], true, 'visible');
                    }
                };

                ansiStyles.color.closeRe = new RegExp(escapeStringRegexp(ansiStyles.color.close), 'g');
                for (const model of Object.keys(ansiStyles.color.ansi)) {
                    if (skipModels.has(model)) {
                        continue;
                    }

                    styles[model] = {
                        get() {
                            const level = this.level;
                            return function () {
                                const open = ansiStyles.color[levelMapping[level]][model].apply(null, arguments);
                                const codes = {
                                    open,
                                    close: ansiStyles.color.close,
                                    closeRe: ansiStyles.color.closeRe
                                };
                                return build.call(this, this._styles ? this._styles.concat(codes) : [codes], this._empty, model);
                            };
                        }
                    };
                }

                ansiStyles.bgColor.closeRe = new RegExp(escapeStringRegexp(ansiStyles.bgColor.close), 'g');
                for (const model of Object.keys(ansiStyles.bgColor.ansi)) {
                    if (skipModels.has(model)) {
                        continue;
                    }

                    const bgModel = 'bg' + model[0].toUpperCase() + model.slice(1);
                    styles[bgModel] = {
                        get() {
                            const level = this.level;
                            return function () {
                                const open = ansiStyles.bgColor[levelMapping[level]][model].apply(null, arguments);
                                const codes = {
                                    open,
                                    close: ansiStyles.bgColor.close,
                                    closeRe: ansiStyles.bgColor.closeRe
                                };
                                return build.call(this, this._styles ? this._styles.concat(codes) : [codes], this._empty, model);
                            };
                        }
                    };
                }

                const proto = Object.defineProperties(() => {}, styles);

                function build(_styles, _empty, key) {
                    const builder = function () {
                        return applyStyle.apply(builder, arguments);
                    };

                    builder._styles = _styles;
                    builder._empty = _empty;

                    const self = this;

                    Object.defineProperty(builder, 'level', {
                        enumerable: true,
                        get() {
                            return self.level;
                        },
                        set(level) {
                            self.level = level;
                        }
                    });

                    Object.defineProperty(builder, 'enabled', {
                        enumerable: true,
                        get() {
                            return self.enabled;
                        },
                        set(enabled) {
                            self.enabled = enabled;
                        }
                    });

                    // See below for fix regarding invisible grey/dim combination on Windows
                    builder.hasGrey = this.hasGrey || key === 'gray' || key === 'grey';

                    // `__proto__` is used because we must return a function, but there is
                    // no way to create a function with a different prototype
                    builder.__proto__ = proto; // eslint-disable-line no-proto

                    return builder;
                }

                function applyStyle() {
                    // Support varags, but simply cast to string in case there's only one arg
                    const args = arguments;
                    const argsLen = args.length;
                    let str = String(arguments[0]);

                    if (argsLen === 0) {
                        return '';
                    }

                    if (argsLen > 1) {
                        // Don't slice `arguments`, it prevents V8 optimizations
                        for (let a = 1; a < argsLen; a++) {
                            str += ' ' + args[a];
                        }
                    }

                    if (!this.enabled || this.level <= 0 || !str) {
                        return this._empty ? '' : str;
                    }

                    // Turns out that on Windows dimmed gray text becomes invisible in cmd.exe,
                    // see https://github.com/chalk/chalk/issues/58
                    // If we're on Windows and we're dealing with a gray color, temporarily make 'dim' a noop.
                    const originalDim = ansiStyles.dim.open;
                    if (isSimpleWindowsTerm && this.hasGrey) {
                        ansiStyles.dim.open = '';
                    }

                    for (const code of this._styles.slice().reverse()) {
                        // Replace any instances already present with a re-opening code
                        // otherwise only the part of the string until said closing code
                        // will be colored, and the rest will simply be 'plain'.
                        str = code.open + str.replace(code.closeRe, code.open) + code.close;

                        // Close the styling before a linebreak and reopen
                        // after next line to fix a bleed issue on macOS
                        // https://github.com/chalk/chalk/pull/92
                        str = str.replace(/\r?\n/g, `${code.close}$&${code.open}`);
                    }

                    // Reset the original `dim` if we changed it to work around the Windows dimmed gray issue
                    ansiStyles.dim.open = originalDim;

                    return str;
                }

                function chalkTag(chalk, strings) {
                    if (!Array.isArray(strings)) {
                        // If chalk() was called by itself or with a string,
                        // return the string itself as a string.
                        return [].slice.call(arguments, 1).join(' ');
                    }

                    const args = [].slice.call(arguments, 2);
                    const parts = [strings.raw[0]];

                    for (let i = 1; i < strings.length; i++) {
                        parts.push(String(args[i - 1]).replace(/[{}\\]/g, '\\$&'));
                        parts.push(String(strings.raw[i]));
                    }

                    return template(chalk, parts.join(''));
                }

                Object.defineProperties(Chalk.prototype, styles);

                module.exports = Chalk(); // eslint-disable-line new-cap
                module.exports.supportsColor = stdoutColor;
                module.exports.default = module.exports; // For TypeScript


                /***/ }),

            /***/ 948:
            /***/ (function(module) {

                "use strict";


                /**
                 * Tries to execute a function and discards any error that occurs.
                 * @param {Function} fn - Function that might or might not throw an error.
                 * @returns {?*} Return-value of the function when no error occurred.
                 */
                module.exports = function(fn) {

                    try { return fn() } catch (e) {}

                }

                /***/ }),

            /***/ 955:
            /***/ (function(module, __unusedexports, __webpack_require__) {

                "use strict";

                const path = __webpack_require__(622);
                const childProcess = __webpack_require__(129);
                const crossSpawn = __webpack_require__(20);
                const stripEof = __webpack_require__(768);
                const npmRunPath = __webpack_require__(512);
                const isStream = __webpack_require__(323);
                const _getStream = __webpack_require__(145);
                const pFinally = __webpack_require__(697);
                const onExit = __webpack_require__(497);
                const errname = __webpack_require__(427);
                const stdio = __webpack_require__(168);

                const TEN_MEGABYTES = 1000 * 1000 * 10;

                function handleArgs(cmd, args, opts) {
                    let parsed;

                    opts = Object.assign({
                        extendEnv: true,
                        env: {}
                    }, opts);

                    if (opts.extendEnv) {
                        opts.env = Object.assign({}, process.env, opts.env);
                    }

                    if (opts.__winShell === true) {
                        delete opts.__winShell;
                        parsed = {
                            command: cmd,
                            args,
                            options: opts,
                            file: cmd,
                            original: {
                                cmd,
                                args
                            }
                        };
                    } else {
                        parsed = crossSpawn._parse(cmd, args, opts);
                    }

                    opts = Object.assign({
                        maxBuffer: TEN_MEGABYTES,
                        buffer: true,
                        stripEof: true,
                        preferLocal: true,
                        localDir: parsed.options.cwd || process.cwd(),
                        encoding: 'utf8',
                        reject: true,
                        cleanup: true
                    }, parsed.options);

                    opts.stdio = stdio(opts);

                    if (opts.preferLocal) {
                        opts.env = npmRunPath.env(Object.assign({}, opts, {cwd: opts.localDir}));
                    }

                    if (opts.detached) {
                        // #115
                        opts.cleanup = false;
                    }

                    if (process.platform === 'win32' && path.basename(parsed.command) === 'cmd.exe') {
                        // #116
                        parsed.args.unshift('/q');
                    }

                    return {
                        cmd: parsed.command,
                        args: parsed.args,
                        opts,
                        parsed
                    };
                }

                function handleInput(spawned, input) {
                    if (input === null || input === undefined) {
                        return;
                    }

                    if (isStream(input)) {
                        input.pipe(spawned.stdin);
                    } else {
                        spawned.stdin.end(input);
                    }
                }

                function handleOutput(opts, val) {
                    if (val && opts.stripEof) {
                        val = stripEof(val);
                    }

                    return val;
                }

                function handleShell(fn, cmd, opts) {
                    let file = '/bin/sh';
                    let args = ['-c', cmd];

                    opts = Object.assign({}, opts);

                    if (process.platform === 'win32') {
                        opts.__winShell = true;
                        file = process.env.comspec || 'cmd.exe';
                        args = ['/s', '/c', `"${cmd}"`];
                        opts.windowsVerbatimArguments = true;
                    }

                    if (opts.shell) {
                        file = opts.shell;
                        delete opts.shell;
                    }

                    return fn(file, args, opts);
                }

                function getStream(process, stream, {encoding, buffer, maxBuffer}) {
                    if (!process[stream]) {
                        return null;
                    }

                    let ret;

                    if (!buffer) {
                        // TODO: Use `ret = util.promisify(stream.finished)(process[stream]);` when targeting Node.js 10
                        ret = new Promise((resolve, reject) => {
                            process[stream]
                                .once('end', resolve)
                                .once('error', reject);
                        });
                    } else if (encoding) {
                        ret = _getStream(process[stream], {
                            encoding,
                            maxBuffer
                        });
                    } else {
                        ret = _getStream.buffer(process[stream], {maxBuffer});
                    }

                    return ret.catch(err => {
                        err.stream = stream;
                        err.message = `${stream} ${err.message}`;
                        throw err;
                    });
                }

                function makeError(result, options) {
                    const {stdout, stderr} = result;

                    let err = result.error;
                    const {code, signal} = result;

                    const {parsed, joinedCmd} = options;
                    const timedOut = options.timedOut || false;

                    if (!err) {
                        let output = '';

                        if (Array.isArray(parsed.opts.stdio)) {
                            if (parsed.opts.stdio[2] !== 'inherit') {
                                output += output.length > 0 ? stderr : `\n${stderr}`;
                            }

                            if (parsed.opts.stdio[1] !== 'inherit') {
                                output += `\n${stdout}`;
                            }
                        } else if (parsed.opts.stdio !== 'inherit') {
                            output = `\n${stderr}${stdout}`;
                        }

                        err = new Error(`Command failed: ${joinedCmd}${output}`);
                        err.code = code < 0 ? errname(code) : code;
                    }

                    err.stdout = stdout;
                    err.stderr = stderr;
                    err.failed = true;
                    err.signal = signal || null;
                    err.cmd = joinedCmd;
                    err.timedOut = timedOut;

                    return err;
                }

                function joinCmd(cmd, args) {
                    let joinedCmd = cmd;

                    if (Array.isArray(args) && args.length > 0) {
                        joinedCmd += ' ' + args.join(' ');
                    }

                    return joinedCmd;
                }

                module.exports = (cmd, args, opts) => {
                    const parsed = handleArgs(cmd, args, opts);
                    const {encoding, buffer, maxBuffer} = parsed.opts;
                    const joinedCmd = joinCmd(cmd, args);

                    let spawned;
                    try {
                        spawned = childProcess.spawn(parsed.cmd, parsed.args, parsed.opts);
                    } catch (err) {
                        return Promise.reject(err);
                    }

                    let removeExitHandler;
                    if (parsed.opts.cleanup) {
                        removeExitHandler = onExit(() => {
                            spawned.kill();
                        });
                    }

                    let timeoutId = null;
                    let timedOut = false;

                    const cleanup = () => {
                        if (timeoutId) {
                            clearTimeout(timeoutId);
                            timeoutId = null;
                        }

                        if (removeExitHandler) {
                            removeExitHandler();
                        }
                    };

                    if (parsed.opts.timeout > 0) {
                        timeoutId = setTimeout(() => {
                            timeoutId = null;
                            timedOut = true;
                            spawned.kill(parsed.opts.killSignal);
                        }, parsed.opts.timeout);
                    }

                    const processDone = new Promise(resolve => {
                        spawned.on('exit', (code, signal) => {
                            cleanup();
                            resolve({code, signal});
                        });

                        spawned.on('error', err => {
                            cleanup();
                            resolve({error: err});
                        });

                        if (spawned.stdin) {
                            spawned.stdin.on('error', err => {
                                cleanup();
                                resolve({error: err});
                            });
                        }
                    });

                    function destroy() {
                        if (spawned.stdout) {
                            spawned.stdout.destroy();
                        }

                        if (spawned.stderr) {
                            spawned.stderr.destroy();
                        }
                    }

                    const handlePromise = () => pFinally(Promise.all([
                        processDone,
                        getStream(spawned, 'stdout', {encoding, buffer, maxBuffer}),
                        getStream(spawned, 'stderr', {encoding, buffer, maxBuffer})
                    ]).then(arr => {
                        const result = arr[0];
                        result.stdout = arr[1];
                        result.stderr = arr[2];

                        if (result.error || result.code !== 0 || result.signal !== null) {
                            const err = makeError(result, {
                                joinedCmd,
                                parsed,
                                timedOut
                            });

                            // TODO: missing some timeout logic for killed
                            // https://github.com/nodejs/node/blob/master/lib/child_process.js#L203
                            // err.killed = spawned.killed || killed;
                            err.killed = err.killed || spawned.killed;

                            if (!parsed.opts.reject) {
                                return err;
                            }

                            throw err;
                        }

                        return {
                            stdout: handleOutput(parsed.opts, result.stdout),
                            stderr: handleOutput(parsed.opts, result.stderr),
                            code: 0,
                            failed: false,
                            killed: false,
                            signal: null,
                            cmd: joinedCmd,
                            timedOut: false
                        };
                    }), destroy);

                    crossSpawn._enoent.hookChildProcess(spawned, parsed.parsed);

                    handleInput(spawned, parsed.opts.input);

                    spawned.then = (onfulfilled, onrejected) => handlePromise().then(onfulfilled, onrejected);
                    spawned.catch = onrejected => handlePromise().catch(onrejected);

                    return spawned;
                };

// TODO: set `stderr: 'ignore'` when that option is implemented
                module.exports.stdout = (...args) => module.exports(...args).then(x => x.stdout);

// TODO: set `stdout: 'ignore'` when that option is implemented
                module.exports.stderr = (...args) => module.exports(...args).then(x => x.stderr);

                module.exports.shell = (cmd, opts) => handleShell(module.exports, cmd, opts);

                module.exports.sync = (cmd, args, opts) => {
                    const parsed = handleArgs(cmd, args, opts);
                    const joinedCmd = joinCmd(cmd, args);

                    if (isStream(parsed.opts.input)) {
                        throw new TypeError('The `input` option cannot be a stream in sync mode');
                    }

                    const result = childProcess.spawnSync(parsed.cmd, parsed.args, parsed.opts);
                    result.code = result.status;

                    if (result.error || result.status !== 0 || result.signal !== null) {
                        const err = makeError(result, {
                            joinedCmd,
                            parsed
                        });

                        if (!parsed.opts.reject) {
                            return err;
                        }

                        throw err;
                    }

                    return {
                        stdout: handleOutput(parsed.opts, result.stdout),
                        stderr: handleOutput(parsed.opts, result.stderr),
                        code: 0,
                        failed: false,
                        signal: null,
                        cmd: joinedCmd,
                        timedOut: false
                    };
                };

                module.exports.shellSync = (cmd, opts) => handleShell(module.exports.sync, cmd, opts);


                /***/ }),

            /***/ 966:
            /***/ (function(module, __unusedexports, __webpack_require__) {

                "use strict";

                const {PassThrough} = __webpack_require__(794);

                module.exports = options => {
                    options = Object.assign({}, options);

                    const {array} = options;
                    let {encoding} = options;
                    const buffer = encoding === 'buffer';
                    let objectMode = false;

                    if (array) {
                        objectMode = !(encoding || buffer);
                    } else {
                        encoding = encoding || 'utf8';
                    }

                    if (buffer) {
                        encoding = null;
                    }

                    let len = 0;
                    const ret = [];
                    const stream = new PassThrough({objectMode});

                    if (encoding) {
                        stream.setEncoding(encoding);
                    }

                    stream.on('data', chunk => {
                        ret.push(chunk);

                        if (objectMode) {
                            len = ret.length;
                        } else {
                            len += chunk.length;
                        }
                    });

                    stream.getBufferedValue = () => {
                        if (array) {
                            return ret;
                        }

                        return buffer ? Buffer.concat(ret, len) : ret.join('');
                    };

                    stream.getBufferedLength = () => len;

                    return stream;
                };


                /***/ }),

            /***/ 967:
            /***/ (function(module) {


                /***/ }),

            /***/ 969:
            /***/ (function(module) {

                module.exports = {"name":"signale","version":"1.4.0","description":"👋 Hackable console logger","license":"MIT","repository":"klaussinani/signale","author":{"name":"Klaus Sinani","email":"klaussinani@gmail.com","url":"https://klaussinani.github.io"},"maintainers":[{"name":"Mario Sinani","email":"mariosinani@protonmail.ch","url":"https://mariocfhq.github.io"}],"engines":{"node":">=6"},"files":["index.js","signale.js","types.js"],"keywords":["hackable","colorful","console","logger"],"scripts":{"test":"xo"},"dependencies":{"chalk":"^2.3.2","figures":"^2.0.0","pkg-conf":"^2.1.0"},"devDependencies":{"xo":"*"},"options":{"default":{"displayScope":true,"displayBadge":true,"displayDate":false,"displayFilename":false,"displayLabel":true,"displayTimestamp":false,"underlineLabel":true,"underlineMessage":false,"underlinePrefix":false,"underlineSuffix":false,"uppercaseLabel":false}},"xo":{"space":2}};

                /***/ }),

            /***/ 976:
            /***/ (function(__unusedmodule, exports, __webpack_require__) {

                "use strict";


                Object.defineProperty(exports, '__esModule', { value: true });

                function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

                var osName = _interopDefault(__webpack_require__(2));

                function getUserAgent() {
                    try {
                        return `Node.js/${process.version.substr(1)} (${osName()}; ${process.arch})`;
                    } catch (error) {
                        if (/wmic os get Caption/.test(error.message)) {
                            return "Windows <version undetectable>";
                        }

                        return "<environment undetectable>";
                    }
                }

                exports.getUserAgent = getUserAgent;
//# sourceMappingURL=index.js.map


                /***/ }),

            /***/ 986:
            /***/ (function(__unusedmodule, exports, __webpack_require__) {

                "use strict";

                var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
                    if (k2 === undefined) k2 = k;
                    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
                }) : (function(o, m, k, k2) {
                    if (k2 === undefined) k2 = k;
                    o[k2] = m[k];
                }));
                var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
                    Object.defineProperty(o, "default", { enumerable: true, value: v });
                }) : function(o, v) {
                    o["default"] = v;
                });
                var __importStar = (this && this.__importStar) || function (mod) {
                    if (mod && mod.__esModule) return mod;
                    var result = {};
                    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
                    __setModuleDefault(result, mod);
                    return result;
                };
                var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
                    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
                    return new (P || (P = Promise))(function (resolve, reject) {
                        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
                        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
                        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
                        step((generator = generator.apply(thisArg, _arguments || [])).next());
                    });
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                exports.getExecOutput = exports.exec = void 0;
                const string_decoder_1 = __webpack_require__(304);
                const tr = __importStar(__webpack_require__(9));
                /**
                 * Exec a command.
                 * Output will be streamed to the live console.
                 * Returns promise with return code
                 *
                 * @param     commandLine        command to execute (can include additional args). Must be correctly escaped.
                 * @param     args               optional arguments for tool. Escaping is handled by the lib.
                 * @param     options            optional exec options.  See ExecOptions
                 * @returns   Promise<number>    exit code
                 */
                function exec(commandLine, args, options) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const commandArgs = tr.argStringToArray(commandLine);
                        if (commandArgs.length === 0) {
                            throw new Error(`Parameter 'commandLine' cannot be null or empty.`);
                        }
                        // Path to tool to execute should be first arg
                        const toolPath = commandArgs[0];
                        args = commandArgs.slice(1).concat(args || []);
                        const runner = new tr.ToolRunner(toolPath, args, options);
                        return runner.exec();
                    });
                }
                exports.exec = exec;
                /**
                 * Exec a command and get the output.
                 * Output will be streamed to the live console.
                 * Returns promise with the exit code and collected stdout and stderr
                 *
                 * @param     commandLine           command to execute (can include additional args). Must be correctly escaped.
                 * @param     args                  optional arguments for tool. Escaping is handled by the lib.
                 * @param     options               optional exec options.  See ExecOptions
                 * @returns   Promise<ExecOutput>   exit code, stdout, and stderr
                 */
                function getExecOutput(commandLine, args, options) {
                    var _a, _b;
                    return __awaiter(this, void 0, void 0, function* () {
                        let stdout = '';
                        let stderr = '';
                        //Using string decoder covers the case where a mult-byte character is split
                        const stdoutDecoder = new string_decoder_1.StringDecoder('utf8');
                        const stderrDecoder = new string_decoder_1.StringDecoder('utf8');
                        const originalStdoutListener = (_a = options === null || options === void 0 ? void 0 : options.listeners) === null || _a === void 0 ? void 0 : _a.stdout;
                        const originalStdErrListener = (_b = options === null || options === void 0 ? void 0 : options.listeners) === null || _b === void 0 ? void 0 : _b.stderr;
                        const stdErrListener = (data) => {
                            stderr += stderrDecoder.write(data);
                            if (originalStdErrListener) {
                                originalStdErrListener(data);
                            }
                        };
                        const stdOutListener = (data) => {
                            stdout += stdoutDecoder.write(data);
                            if (originalStdoutListener) {
                                originalStdoutListener(data);
                            }
                        };
                        const listeners = Object.assign(Object.assign({}, options === null || options === void 0 ? void 0 : options.listeners), { stdout: stdOutListener, stderr: stdErrListener });
                        const exitCode = yield exec(commandLine, args, Object.assign(Object.assign({}, options), { listeners }));
                        //flush any remaining characters
                        stdout += stdoutDecoder.end();
                        stderr += stderrDecoder.end();
                        return {
                            exitCode,
                            stdout,
                            stderr
                        };
                    });
                }
                exports.getExecOutput = getExecOutput;
//# sourceMappingURL=exec.js.map

                /***/ })

            /******/ },
        /******/ function(__webpack_require__) { // webpackRuntimeModules
            /******/ 	"use strict";
            /******/
            /******/ 	/* webpack/runtime/node module decorator */
            /******/ 	!function() {
                /******/ 		__webpack_require__.nmd = function(module) {
                    /******/ 			module.paths = [];
                    /******/ 			if (!module.children) module.children = [];
                    /******/ 			Object.defineProperty(module, 'loaded', {
                        /******/ 				enumerable: true,
                        /******/ 				get: function() { return module.l; }
                        /******/ 			});
                    /******/ 			Object.defineProperty(module, 'id', {
                        /******/ 				enumerable: true,
                        /******/ 				get: function() { return module.i; }
                        /******/ 			});
                    /******/ 			return module;
                    /******/ 		};
                /******/ 	}();
            /******/
            /******/ }
    );