---
title: vscode-tailwind-magic
description: A plug-in that can provide magic for TailwindCss.
date: 2024-07-07T21:00:00.000+00:00
lang: en
duration: now
subtitle: 'Author: Simon'
---

[[toc]]

> [中文 Chinese Version](/posts/vscode-tailwind-magic-zh)

## What is vscode-tailwind-magic

- It is a `vscode` plug-in that solves the pain points of `TailwindCss` writing

## Why write vscode-tailwind-magic❓

- In order to align the ecology of `UnoCSS`, `UnoCSS` has `transformer-variant-group`, `transformer-attributify`, but `TailwindC Ss doesn't have this advantage.

## Advantages of vscode-tailwind-magic 💯

1. It allows you to write the syntax of `tailwind` on the attribute, which can retain the meaning of `sense`: because the shorthands brought by these vite-plugin of `UnoCSS` will lose some developers to intuitively interpret the meaning of the attribute, because the project In many cases, it is collaborative development. You customize a `variant`, I'll have a `shortcuts`, you ask for leave, I'll read your `shortcuts`, I will be very confused, what is this, I want to use `Unocs` Only when the vscode plug-in hover can know the converted css result. An extra thing has been done here. It is not intuitive, so I want to keep the original tailwind syntax in design, because this is the specification, even today. When a newcomer comes, it learns with reference to tailwind's official website, rather than your personal customization, which will bring greater learning costs.

2. It is more simplified than `Unocss`. It is a super in the writing of `UnoCSS`, because `vite-plugin` of `UnoCSS` does not introduce parser, so its ability is limited and it can't bring more With accurate control, its attribute mode support ability is also limited, and `vscode-tailwind-magic` can break the limitations of traditional `parser` and break through the constraints of `jsx`, even at the `jsx` syntax level. Popular, you can still support conversion under the ability of the plug-in, you can't do `<div bg-#fff/>` in `UnoCSS`, and vscode-tailwind-magic can `<div bg#fff/>`

3. Because `UnoCSS` and `TailwindCSS` consider the maximization of reusability for the sake of atomization, the attribute splitting is very small in size, and it is impossible to achieve particularly good development experience optimization. For example, I wrote `flex-col`, and it will be removed. Does `flex` exist? You must `flex flex-col` to take effect, and there is `border-#eee`. You can't see the style of border. Why? Because you need to configure the `width` of `border`, whether it is `solid` or `dash` and so on to see the border you think. Why not directly give a default `solid` and `1` pixel border? ? This is what I said about a pain point for maximizing reuse, and `vscode-tailwind-magic` can make up for this, because I design it from the perspective of the developer, so I hope that if I give a more detailed attribute, I can Automatically bring out the necessary attributes associated with it, that is, the examples mentioned above. Although these configurations are based on my subjective default settings, you may think that this is equivalent to your personal `shortcuts`? This is not the case, because it can also be your personal `shortcuts`. It supports everyone to configure their own rules. The only difference is that no matter how you configure it personally, but everyone eventually follows the specifications of the `Tailwind` official website and retains the symantization. , instead of personal customization, for example, you can configure `tc` your personal feeling `shortcuts`, but in the end, what all developers see is that you write `class="text-center"`

4. By the way, some people don't like the `attributify` mode very much. Although its writing is simple, it is not limited to the freedom that I must write it in `class` or `className`, but the attribute mode of `UnoCSS` is not It is not strong enough to support all writing methods, so for special cases, you still have to write `class`, so there are a large number of mixed `class` and `attributify`, which will be more intuitive maintenance, because the attributes will be in the front. Later, the transfer attributes of other components may be mixed in the middle, such as `<my-comp w-10 comp-prop="xxx" h-10 class="bg-#eee" text-center />`, but `vscode-tailwind-magic` It is written in the form of attributes in any position, but it will eventually be converted to the corresponding `class` or `className`, and it will become `<my-comp comp-prop="xxx " class="w-10 h-10 text-center bg-#eee" />`

## Demo Gif

<img rounded-2 src="../../public/tailwind-magic.gif"/>

You can see how it is written and what it can do through its [test file 📃](https://github.com/Simon-He95/vscode-tailwind-magic/blob/main/test/index.test.ts)~

#### After reading the above information, if you think it really touches you, why don't you try it quickly? You can help me order a [star 🌟](https://github.com/Simon-He95/vscode-tailwind- Magic) and [Sponsor me a cup ☕️](https://github.com/Simon-He95/sponsor), I hope this plug-in can help you bring `10` times development efficiency and super development experience :)
