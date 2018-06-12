#!/bin/bash

## 为nuxt创建node_modules链接
rm -rf app/web/node_modules
rm -rf app/web-mobile/node_modules

result=$(uname -a | grep "Msys")
if [ "$result" != "" ]
then
    cmd //C "mklink /J app\web-mobile\node_modules node_modules"
    cmd //C "mklink /J app\web\node_modules node_modules"
else
    ln -s $(pwd)/node_modules/ $(pwd)/app/web/node_modules
    ln -s $(pwd)/node_modules/ $(pwd)/app/web-mobile/node_modules
fi