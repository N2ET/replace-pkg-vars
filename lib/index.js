const fs = require('fs');
const minimatch = require('minimatch');
const handlebars = require('handlebars');

let debug = false;

function debugLog () {
    if (!debug) {
        return;
    }

    console.debug.apply(console, arguments);
}

function setDebug (value) {
    debug = !!value;
}

function registerFilter (files, defaultFiles) {
    handlebars.registerHelper('filter', function filterFn() {

        debugLog(`[registerFilter filterfn] ${JSON.stringify(arguments)}`);

        let filters = [].slice.call(arguments, 0, arguments.length - 1);
        let ret = filter({
            files: files,
            filters: filters
        });

        debugLog(`[registerFilter filterfn] ret: ${ret} defaultFiles: ${defaultFiles}`);

       if (!ret.length) {
           ret = defaultFiles;
       } 

        return ret;
    });
}

/**
 * 
 * @param {Object|String} data - 文件列表或数据对象
 * @param {String} pkgFile - package.json文件路径
 * @param {Boolean} writeToFile - 是否写文件
 * @param {Array} defaultFiles - 当无文件匹配时，使用的默认文件
 */
function run (data, pkgFile, writeToFile = true, defaultFiles = []) {

    pkgFile = pkgFile || './package.json';

    let content = readFile(pkgFile);

    let result = runWithTemplate(data, content, defaultFiles);

    if (writeToFile) {
        writeFile(pkgFile, result);
    } else {
        debugLog(`[run] result: ${result}`);
    }

}

/**
 * 
 * @param {Object|String} data 
 * @param {String} content 
 * @param {Array} defaultFiles
 */
function runWithTemplate (data, content, defaultFiles = []) {

    if (typeof(data) === 'string') {
        data = {
            files: data
        };
    }

    registerFilter(data.files, defaultFiles);    

    let result = handlebars.compile(content)(data);

    return result;    
}

function readFile (pkgFile) {
    if (!fs.existsSync(pkgFile)) {
        console.log(`[replace-pkg-vars::readFile] ${pkgFile} not exists, exit`);
        process.exit(0);
    }
    
    // 无需异常处理
    const content = fs.readFileSync(pkgFile, {
        encoding: 'utf-8'
    });

    return content;
}

function writeFile (pkgFile, content) {

    // 无需异常处理
    fs.writeFileSync(pkgFile, content);
}

/**
 * 
 * @param {String} data.files - 文件列表，空格或逗号分割
 * @param {String|Array} data.filters - 过滤文件列表的minimatch模式，空格或逗号分割，或数组
 * @returns {Array}
 */
function filter (data) {
    let files = data.files.split(/,?\s/);
    let filters = [];
    let dataFilters = data.filters;;
    if (typeof(dataFilters) === 'string') {
        dataFilters = [dataFilters];
    }

    dataFilters.forEach(item => {
        if (!item) {
            return;
        }

        filters = filters.concat(item.split(/,?\s/));
    });

    debugLog(`[filter] files: ${files} filters: ${filters}`);

    let filteredFiles = [];

    if (!filters.length) {

        filteredFiles = files;

    } else {

        let hash = {};

        /**
         * 取的是多个filter的并集，只要文件符合其中一个filter，就会被收集到结果中。
         * 注意使用!xx模式的情况，使用多个!xx模式可能会导致结果不如预期，
         * 如!src/** !common/** 则会导致src common中的文件被收集
         */
        files.forEach(file => {

            checkPattern(file);

            filters.forEach(item => {

                checkPattern(item);

                if (minimatch(file, item)) {

                    if (!hash[file]) {
                        hash[file] = 1;
                        filteredFiles.push(file);
                    }
                }
            })
        });  

    }

    debugLog(`[filter] filteredFiles: ${filteredFiles}`);

    return filteredFiles;
};

function checkPattern (pattern) {
    if (/^\.\//.test(pattern)) {
        throw(`invalid pattern ${pattern}, please remote ./`);
    }
}

module.exports = {
    run: run,
    runWithTemplate: runWithTemplate,
    filter: filter,
    setDebug: setDebug,
    readFile: readFile,
    writeFile: writeFile
};
