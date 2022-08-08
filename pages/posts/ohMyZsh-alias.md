---
title: oh My Zsh alias
description: Wish this is the end.
date: 2022-05-11T22:00:00.000+00:00
lang: zh
duration: 8min
subtitle: 'Author: Simon'
---
  [[toc]]
  > alias部分实现基于[@antfu/ni](https://github.com/antfu/ni)

  ## 这篇blog是来分享一下我的terminal,另外推荐一些好用的[vscode插件和配置](https://github.com/Simon-He95/directory-configuration)

  #### 个人觉得比较好用的alias:  <div inline-block m-l-2 text-xl><span i-carbon:star-filled v-for="i in 5" bg-yellow></span></div>
  
  ``` bash
  #1. run 
  ## 前提需要workspace中的package的name:"shared" => run shared d
  ## 另一种方式是直接在script中使用npm -C workspace run d
  run package d # pnpm中会filter到package.json中的script(d是dev的缩写)
  # 示例:
  run package i vue pinia -D # 安装vue 和 pinia 到package下的devdepdencies
  run package un vue pinia -D # 卸载package下devdepdencies的 vue 和 pinia

  #2. tag
  tag # 打tag等待你输入tag名称和描述

  #3. template
  template vue-starpot d # 目前支持2种模板ts | vue，输入vue，clone一个vitesse的项目模板文件名vue-starpot,并自动打开这个项目,并安装依赖如果依赖安装失败会重新尝试超过3次结束，如果配置了第二个参数，在安装依赖完成后会执行nr d 如果找不到package.json中的d就会取全局zshrc中找d的alias来启动，注意：需要全局安装degit 和 @antfu/ni

  #4 ignore
  ignore # 生成一个.ignore文件模板

  #5 pkginit
  pkginit # 要求输入一个pkgname，然后会生成一个预设package.json文件

  #6 use
  use npm # nrm 快速切换源

  #7 remove
  remove # 删除目录或文件 注意：需要全局安装rimraf, 支持直接remove node_modules, 如果不传会自动匹配当前目录下所有文件或目录供选择删除

  #8 clone
  clone git@github.com:Simon-He95/vitesse-lite.git d # 克隆一个项目,并自动打开这个项目, 安装依赖，后自动执行nr d 如果找不到package.json中的d就会取全局zshrc中找d的alias来启动，注意：需要全局安装@antfu/ni

  #9 p
  p # 默认执行pnpm run play命令一般配置指向playground的play命令,可能当前不是workspace结构,则执行当前目录下的dev命令运行项目

  #10 nii
  nii # 如果网络不太好ni在线安装依赖比较慢，会自动使用nio缓存安装依赖，注意：需要全局安装@antfu/ni,在zshrc配置nio, alias nio="ni --prefer-offline"

  #11 template
  template project-name # 将会有对应的项目模板可供选择,并clone下来自动打开并安装依赖

  #12 commit
  commit # 配置常用的commit提交信息,比如chore: init ; chore: update denpendency; fix: typo 等等快速提交commit
 
  #13 grant
  grant # 分配文件权限 对于某些.sh文件没办法直接执行,可以通过grant a.sh 分配权限后执行 source a.sh
  ```
  
 #### 完整的alias:

```bash
# User configuration
# -------------------------#
#  Node Package Manager
# -------------------------#
# alias - ni

alias nio="ni --prefer-offline"
alias d="nr dev"
alias s="nr start"
alias b="nr build"
alias bw="nr build --watch"
alias t="nr test"
alias t="nr test -u"
alias w="nr watch"
alias lint="nr lint"
alias lintf="nr lint:fix"
alias s="nr start"
alias p="nr play || d"
alias pr="nr preview"
alias pb="nr play:build || b"
alias release="npm run release"
alias publish="npm publish"
alias clean="git add . && git commit -m 'chore: clean' && git push"
alias v="npm view"
alias lock="pnpm install --no-frozen-lockfile"

#--------------------------#
# project simple
# -------------------------#

alias cls="clear"
alias ..="cd .."
alias ...="cd ../.."
alias ....="cd ../../.."

#--------------------------#
# Git
# -------------------------#

alias gs="git status"
alias gcc="git checkout"
alias gccb="git checkout -b"
alias gl="git log"
alias glo="git log --online --graph"
alias gb="git branch"
alias gbd="git branch -d"
alias gba="git branch -a"
alias gc="git add . && git commit -m"
alias ga="git add ."
alias gs="git status"
alias gpl="git pull --rebase"
alias gpf="git push --force"
alias gpt="git push origin --tags"
alias gptf="git push origin --tags -f"
alias gp="git push"
alias gst="git stash"
alias rebase="git rebase"
alias reset="git reset HEAD"
alias reset1="git reset HEAD~1"
alias main="git checkout main"
alias use="nrm use"
alias unproxy="git config --global --unset http.proxy && git config --global --unset https.proxy"
alias proxy="git config --global http.proxy http://127.0.0.1:57932 && git config --global https.proxy https://127.0.0.1:57932"
alias pullmaster="git pull origin master"
alias pullmain="git pull origin main"
alias flog="git reflog"
alias see="ps -ef|grep"

#--------------------------#
# Pnpm
# -------------------------#

RED='\e[1;31m'     # 红
GREEN='\e[1;32m'   # 绿
YELLOW='\e[1;33m'  # 黄
BLUE='\e[1;34m'    # 蓝
PINK='\e[1;35m'    # 粉红
SKYBLUE='\e[1;96m' # 紫
RES='\e[0m'        # 清除颜色

console.red() {
  echo -e "${RED} $* ${RES}"
}

console.green() {
  echo -e "${GREEN} $* ${RES}"
}

console.yellow() {
  echo -e "${YELLOW} $* ${RES}"
}

console.blue() {
  echo -e "${BLUE} $* ${RES}"
}

console.skyblue() {
  echo -e "${SKYBLUE} $* ${RES}"
}
console.pink() {
  echo -e "${PINK} $* ${RES}"
}

run() {
  command="$2"
  if [ "$2" = "" ]; then
    pnpm run $1
    return
  elif [ "$2" = "i" -o "$2" = "install" ]; then
    data=$*
    len1=$1
    len2=$2
    result="pnpm --filter "$1" i ${data:$(expr ${#len1} + ${#len2} + 2)}"
    eval $result
    return
  elif [ "$2" = "un" -o "$2" = "uninstall" ]; then
    data=$*
    len1=$1
    len2=$2
    result="pnpm --filter "$1" uninstall ${data:$(expr ${#len1} + ${#len2} + 2)}"
    eval $result
    return
  elif [ "$2" = "d" ]; then
    command="dev"
  elif [ "$2" = "b" ]; then
    command="build"
  elif [ "$2" = "t" ]; then
    command="test"
  elif [ "$2" = "p" ]; then
    command="playground"
  elif [ "$2" = "pr" ]; then
    command="preview"
  fi
  pnpm --filter $1 run $command
}

# 创建git tag
tag() {
  console.skyblue "请输入tagname:"
  read tagname
  if [ "$tagname" = "" ]; then
    console.red "tagname不能为空"
    exit 1
  fi

  console.skyblue "请输入描述:"

  read detail
  if [ -n "detail" ]; then
    detail="say nothing"
  fi
  if [ "$?" = 0 ]; then
    git tag -a $tagname -m $detail
  fi
}

# 自动生成.gitignore
ignore() {
  if [ -f ".gitignore" ]; then
    console.red ".gitignore已存在"
    return
  fi
  console.green "...正在生成.gitignore"
  touch .gitignore                                                                                                                                # 创建文件
  echo "*.DS_Store  \nnode_modules \n*.log \nidea/ \n*.local \n.DS_Store \ndist \n.cache \n.idea \nlogs \n&-debug.log \n*-error.log" >>.gitignore # 添加内容
}

# clone
clone() {
  str=$1
  str1=${str##*/}
  result=${str1%.*}
  console.skyblue "正在clone $result"
  if [ ! $2 ]; then
    git clone $str && console.pink "下载完成,正在打开 $result" && code $result && cd $result && console.green '正在下载依赖' && ni
  else
    git clone $str && console.pink "下载完成,正在打开 $result" && code $result && cd $result && console.green '正在下载依赖' && ni || ni || ni || console.red '安装依赖失败，请重新尝试' && console.blue "正在执行 nr $2" && nr $2 || eval ${2}
  fi
}

# template
template() {
  console.skyblue "请选择一个模板: ts | vue | nuxt | vitesse | react | next"
  templateName=$(gum choose "ts" "vue" "nuxt" "react" "next")
  if [ ! $1 ]; then
    console.red "需要指定一个模板名称"
    return 0
  fi

  if [ ! $templateName ]; then
    templateName=1
  fi

  if [ $templateName = "ts" ]; then
    console.blue "正在创建$1目录,下载starter-ts模板,请稍等..."
    if [ ! $2 ]; then
      npx degit Simon-He95/starter-ts $1 && console.green "正在打开$1" && code $1 && cd $1 && find ./ -type f -path "./package.json" | xargs sed -i "s:pkg-name:$1:g" && console.pink '正在下载依赖' && ni
    else
      npx degit Simon-He95/starter-ts $1 && console.green "正在打开$1" && code $1 && cd $1 && find ./ -type f -path "./package.json" | xargs sed -i "s:pkg-name:$1:g" && console.pink '正在下载依赖' && ni || ni || ni || console.red '安装依赖失败，请重新尝试' && console.blue "正在执行 nr $2" && nr $2 || eval ${2}
    fi
  elif [ $templateName = "vue" ]; then
    console.blue "正在创建$1目录,下载vitesse-lite模板,请稍等..."
    if [ ! $2 ]; then
      npx degit Simon-He95/vitesse-lite $1 && console.green "正在打开$1" && code $1 && cd $1 && find ./ -type f -path "./package.json" | xargs sed -i "s:pkg-name:$1:g" && console.pink '正在下载依赖' && ni
    else
      npx degit Simon-He95/vitesse-lite $1 && console.green "正在打开$1" && code $1 && cd $1 && find ./ -type f -path "./package.json" | xargs sed -i "s:pkg-name:$1:g" && console.pink '正在下载依赖' && ni || ni || ni || console.red '安装依赖失败，请重新尝试' && console.blue "正在执行 nr $2" && nr $2 || eval ${2}
    fi
  elif [ $templateName = "nuxt" ]; then
    console.blue "正在创建$1目录,下载vitesse-nuxt3模板,请稍等..."
    if [ ! $2 ]; then
      npx degit Simon-He95/vitesse-nuxt3 $1 && console.green "正在打开$1" && code $1 && cd $1 && find ./ -type f -path "./package.json" | xargs sed -i "s:pkg-name:$1:g" && console.pink '正在下载依赖' && ni
    else
      npx degit Simon-He95/vitesse-nuxt3 $1 && console.green "正在打开$1" && code $1 && cd $1 && find ./ -type f -path "./package.json" | xargs sed -i "s:pkg-name:$1:g" && console.pink '正在下载依赖' && ni || ni || ni || console.red '安装依赖失败，请重新尝试' && console.blue "正在执行 nr $2" && nr $2 || eval ${2}
    fi
  elif [ $templateName = "vitesse" ]; then
    console.blue "正在创建$1目录,下载vitesse模板,请稍等..."
    if [ ! $2 ]; then
      npx degit Simon-He95/vitesse $1 && console.green "正在打开$1" && code $1 && cd $1 && find ./ -type f -path "./package.json" | xargs sed -i "s:pkg-name:$1:g" && console.pink '正在下载依赖' && ni
    else
      npx degit Simon-He95/vitesse $1 && console.green "正在打开$1" && code $1 && cd $1 && find ./ -type f -path "./package.json" | xargs sed -i "s:pkg-name:$1:g" && console.pink '正在下载依赖' && ni || ni || ni || console.red '安装依赖失败，请重新尝试' && console.blue "正在执行 nr $2" && nr $2 || eval ${2}
    fi
  elif [ $templateName = "react" ]; then
    console.blue "正在创建$1目录,下载vitesse-lite-react模板,请稍等..."
    if [ ! $2 ]; then
      npx degit Simon-He95/vitesse-lite-react $1 && console.green "正在打开$1" && code $1 && cd $1 && find ./ -type f -path "./package.json" | xargs sed -i "s:pkg-name:$1:g" && console.pink '正在下载依赖' && ni
    else
      npx degit Simon-He95/vitesse-lite-react $1 && console.green "正在打开$1" && code $1 && cd $1 && find ./ -type f -path "./package.json" | xargs sed -i "s:pkg-name:$1:g" && console.pink '正在下载依赖' && ni || ni || ni || console.red '安装依赖失败，请重新尝试' && console.blue "正在执行 nr $2" && nr $2 || eval ${2}
    fi
  elif [ $templateName = "next" ]; then
    console.blue "正在创建$1目录,下载vitesse-next模板,请稍等..."
    if [ ! $2 ]; then
      npx degit Simon-He95/vitesse-next $1 && console.green "正在打开$1" && code $1 && cd $1 && find ./ -type f -path "./package.json" | xargs sed -i "s:pkg-name:$1:g" && console.pink '正在下载依赖' && ni
    else
      npx degit Simon-He95/vitesse-next $1 && console.green "正在打开$1" && code $1 && cd $1 && find ./ -type f -path "./package.json" | xargs sed -i "s:pkg-name:$1:g" && console.pink '正在下载依赖' && ni || ni || ni || console.red '安装依赖失败，请重新尝试' && console.blue "正在执行 nr $2" && nr $2 || eval ${2}
    fi
  fi
}

# remove
remove() {
  if [ $1 ]; then
    if [ ! -f $1 ] && [ ! -d $1 ]; then
      console.red '文件或目录不存在'
      return 0
    else
      console.blue "正在删除$1"
      rimraf $1 && console.green "删除成功" || console.red "删除失败,请重新尝试"
      return 1
    fi
  fi
  for file in $(ls); do
    str="$str\"$file\" "
  done
  content=$(echo $(ls) | sed 's/ /\n/g' | gum choose)
  console.blue "正在删除$content"
  rimraf $content && console.green "删除成功" || console.red "删除失败,请重新尝试"
  return 1
}

# reni
reni() {
  remove node_modules
  if [ $? = 1 ]; then
    ni || ni || ni
  fi
}

# 包裹ni
nii() {
  ni $* || nio $*
}

# pkginit
pkginit() {
  console.blue "请输入包名:"
  read pkgname
  if [ ! $pkgname ]; then
    console.red "包名不能为空"
    return 0
  fi
  if [ -f package.json ]; then
    console.red 'package.json已存在'
    return 0
  fi

  touch package.json
  echo '{
  "name": "'$pkgname'",
  "version": "0.0.0",
  "packageManager": "pnpm@6.32.3",
  "description": "'$pkgname'",
  "author": "Simon He",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "git + git@github.com:Simon-He95/'$pkgname'.git"
  },
  "bugs": {
    "url": "https://github.com/Simon-He95/'$pkgname'/issues"
  },
  "keywords": [
    "'$pkgname'"
  ],
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "require": "./dist/index.js",
      "import": "./dist/index.mjs"
    }
  },
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "pkgroll --minify",
    "dev": "pkgroll --watch",
    "play": "pnpm run -C playground dev",
    "play:build": "pnpm run -C playground build",
    "serve": "pnpm run -C playground serve",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "typecheck": "vue-tsc --noEmit",
    "test": "vitest -u",
    "test:e2e": "cypress open",
    "prepublishOnly": "nr build",
    "release": "bumpp --commit --tag --push && pnpm publish"
  },
  "dependencies": {
    "@vueuse/core": "^8.1.1",
    "vue": "^3.2.36"
  },
  "devDependencies": {
    "@antfu/eslint-config": "^0.25.0",
    "@types/node": "^17.0.38",
    "bumpp": "^7.1.1",
    "eslint": "^8.16.0",
    "eslint-plugin-n": "^15.2.1",
    "pkgroll": "^1.3.1",
    "typescript": "^4.7.2",
    "vitest": "^0.7.0"
  },
  "eslintConfig": {
    "extends": "@antfu"
  }
}' >>package.json
  if [ $? = 0 ]; then
    console.green '创建成功'
  else
    console.red '创建失败'
  fi
}

# grant 授予文件权限
grant() {
  chmod +x $1
  console.green '已授权成功'
}

# update 安装最新版本
update() {
  all=$*
  str=${all// /@latest }
  console.green ni $str
  ni $str
}

commit() {
  commitMessage=$(gum choose "chore: update" "feature: add new funciton" "chore: update dependency" "fix: typo" "chore: init")
  git add . && git commit -m $commitMessage
}
```
