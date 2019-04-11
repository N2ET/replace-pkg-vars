# replace-pkg-vars

## 使用方法

### 命令
全局安装replace-pkg-vars。
```bash
# files指文件列表
replace-pkg-vars -f files

# pkg-file-path 为package.json的文件路径，使用默认的即可
replace-pkg-vars --debug --default-file -p pkg-file-path -f files
```

工具使用`hadlebars`模板对目标文件进行变量替换。命令行使用时，支持`{{files}}`变量，和`{{filter pattern}}`helper（函数）。

`{{files}}`对应命令中的`files`。`pattern`为模板文件中，filter的值，如果是字符串，需要使用单引号包裹。

当配置`--default-file`时，如果过滤的文件为空，会将`default-file`设置为`{{filter pattern}}`的值，默认为`__replace_pkg_vars_default_file__`。如果文件不存在，则会创建。

### 全局安装后的使用示例

#### 示例1
`package.1.josn`：
```json
{
    "{{files}}": "{{filter 'src/test/** common/**'}}"
}
```

bash命令：
```bash
src='src/index.js src/root.js src/test/t1.js src/test/t2.js common/index.js common/vue/index.js'
replace-pkg-vars --debug -p ./package.1.json -f "${src}"
echo $?
```

执行上述`bash`命令后，文件内容将被替换为:
```json
{
    "src/index.js src/root.js src/test/t1.js src/test/t2.js common/index.js common/vue/index.js": "src/test/t1.js,src/test/t2.js,common/index.js,common/vue/index.js"
}
```

#### 示例2
提交代码时，eslint增量扫描替换增量文件。增量文件列表由代码扫描环境提供。

```js
"scripts": {
    "lint-all": "eslint ./src", // 扫描src目录
    "lint-updated": "eslint {{files}}",  // 扫描所有修改的文件
    "lint-updated-in-src": "eslint {{filter 'src/**'}}"  // 扫描src目录下修改的文件
}
```

命令行调用：
```bash
src=$1 # 文件列表由扫描环境提供
replace-pkg-vars -f "${src}"
npm run lint-updated-in-src

# 如果 {{filter 'src/**'}} 的结果为空，则会导致eslint命令出错，
# 此时可配置 --default-file 生成一个空文件 __replace_pkg_vars_default_file__ 作为eslint命令的目标文件，避免eslint运行出错
replace-pkg-vars --default-file -f "${src}"
```

### 注意事项

* 文件路径不能包含./前缀，如./src/test/index.js，请直接写成src/test/index.js
* {{filter pattern}}中的pattern使用的是minimatch通配符，如src请写成src/**
