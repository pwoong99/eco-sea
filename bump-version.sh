#!/usr/bin/env bash
# 사용법: ./bump-version.sh 1.3.2
# js/data.js의 VERSION과, 브라우저 캐시를 피하기 위한 파일 주소의 ?v= 값을 한 번에 바꿉니다.
set -e
V="$1"
if [ -z "$V" ]; then echo "사용법: ./bump-version.sh 1.3.2"; exit 1; fi
cd "$(dirname "$0")"
sed -i -E "s/export const VERSION = '[^']+';/export const VERSION = 'v$V';/" js/data.js
sed -i -E "s#(from '\./[a-z-]+\.js)(\?v=[0-9.]+)?'#\1?v=$V'#g" js/*.js
sed -i -E "s#(href=\"css/style\.css)(\?v=[0-9.]+)?\"#\1?v=$V\"#; s#(src=\"js/game\.js)(\?v=[0-9.]+)?\"#\1?v=$V\"#" index.html
sed -i -E "s#(src=\"js/admin\.js)(\?v=[0-9.]+)?\"#\1?v=$V\"#" admin.html
echo "v$V 로 바꿨어요."
