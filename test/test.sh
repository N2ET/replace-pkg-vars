
src='src/index.js src/root.js src/test/t1.js src/test/t2.js common/index.js common/vue/index.js'
echo ${src}
node ../bin/index.js --debug -p ./package.1.json -f "${src}"
echo $?