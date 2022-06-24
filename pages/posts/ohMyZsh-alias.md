---
title: oh My Zsh alias
description: Wish this is the end.
date: 2022-05-11T22:00:00.000+00:00
lang: zh
duration: 8min
subtitle: 'Author: Simon'
---

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
  template # clone一个vitesse的项目模板,并自动打开这个项目,需要安装degit

  #4 updateVersion
  updateVersion # 更新版本号,自动提交commit:chore: update version并推送
  
  #5 ignore
  ignore # 生成一个.ignore文件模板

  #6 init
  init # 初始化package.json 可以提前预设一下npm config author的基本信息和license

  #7 use
  use npm # nrm 快速切换源

  #8 remove
  remove # 删除目录或文件

  #9 clone
  clone # 克隆一个项目,并自动打开这个项目

  #10 p
  p # 默认执行pnpm run play命令一般配置指向playground的play命令,可能当前不是workspace结构,则执行当前目录下的dev命令运行项目

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
alias updateVersion="git add . && git commit -m 'chore: update version' && git push"
alias clean="git add . && git commit -m 'chore: clean' && git push"
alias v="npm view"
alias init="npm init -y"
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
# alias template="npx degit Simon-He95/vitesse-lite"
alias unproxy="git config --global --unset http.proxy && git config --global --unset https.proxy"
alias pullmaster="git pull origin master"
alias pullmain="git pull origin main"
alias flog="git reflog"
alias see="ps -ef|grep"

#--------------------------#
# Pnpm
# -------------------------#

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
  echo "请输入tagname:"
  read tagname
  if [ "$tagname" = "" ]; then
    echo "输入的tagname为空"
    exit 1
  fi

  echo "请输入描述:"

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
    echo "gitignore已存在"
    return
  fi
  echo "...正在生成.gitignore"
  touch .gitignore                                                                                                                                # 创建文件
  echo "*.DS_Store  \nnode_modules \n*.log \nidea/ \n*.local \n.DS_Store \ndist \n.cache \n.idea \nlogs \n&-debug.log \n*-error.log" >>.gitignore # 添加内容
}

# clone
clone() {
  str=$1
  str1=${str##*/}
  result=${str1%.*}
  echo "正在clone $result"
  git clone $str && code $result
}

# template
template() {
  if [ ! $1 ]; then
    echo "请输入模板名称"
    return 0
  fi
  echo "正在创建$1目录,下载vitesse-lite模板,请稍等..."
  npx degit Simon-He95/vitesse-lite $1 && echo "正在打开$1" && code $1
}

# remove
remove() {
  if [ ! $1 ]; then
    echo "请输入要删除的目录名称"
    return 0
  fi
  echo "正在删除$1目录"
  rimraf $1 && echo "删除成功" || echo "删除失败,请重新尝试"
}
```
