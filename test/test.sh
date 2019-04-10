
# src='src/index.js src/root.js src/test/t1.js src/test/t2.js common/index.js common/vue/index.js'
src='abc/index.js'
echo ${src}
node ../bin/index.js --debug --default-file -p ./package.1.json -f "${src}"
echo $?