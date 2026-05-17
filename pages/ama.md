---
title: Ask Me Anything / 一对一咨询
display: ''
plum: true
---

<h1 id="ask-me-anything">{{ isZh ? '一对一咨询' : 'Ask Me Anything' }}</h1>

<template v-if="isZh">
  <p>提供一对一的咨询服务</p>

  <h2 id="interview">面试</h2>
  <p>面试取经，经验分享，简历分析</p>

  <h2 id="open-source">开源</h2>
  <p>开源项目维护，开源项目推广，开源项目贡献</p>

  <h2 id="consulting">咨询</h2>
  <p>咨询我的经历（Like 如何转型？你是否适合转型？以及转型到哪一个领域？）或者谈及你的经历和问题，给出一些未来的发展的方向和我个人的意见，当然，后续有任何工作上的问题或者技术上的问题，我也会提供一定的帮助。</p>

  <h2 id="qa">解答</h2>
  <p>你可能遇到了开发的难点，或者你有一些问题，我会尽力帮你解答，或者你希望我可以手把手带你开发一个项目来帮助你提效，顺便学到一些技术。</p>

  <h2 id="how-it-works">咨询方式</h2>
  <p>提前至少一个工作日预付款并发送需要咨询的问题列表，我需要一定的时间进行准备。当然在实际咨询中不受该列表的限制。</p>
  <p>如果咨询人数较多，为了保证咨询的质量可能会等待一定时间，还望谅解 <span i-ic:outline-favorite text-red-500></span></p>

  <h2 id="pricing">定价</h2>
  <ul>
    <li>¥200 - 30 min，适合简单问题咨询和讨论</li>
    <li>¥500 - 60 min，手把手带你开发一个项目，解决你的痛点</li>
  </ul>

  <p>点击下方按钮添加我微信进行预约和付款，<strong><em>请备注 咨询</em></strong>。</p>
  <p>一般咨询的开始时间为工作日（除周五）的晚上 (UTC +8) 20:00-23:00。</p>
</template>

<template v-else>
  <p>One-on-one consulting service.</p>

  <h2 id="interview">Interview</h2>
  <p>Interview preparation, experience sharing, and resume review.</p>

  <h2 id="open-source">Open Source</h2>
  <p>Open source maintenance, promotion, and contribution guidance.</p>

  <h2 id="consulting">Consulting</h2>
  <p>We can talk about my experience, such as how to switch careers, whether switching careers is right for you, and which direction may fit you. We can also discuss your own situation and questions, then work through possible next steps and my personal suggestions. I can continue to help with work or technical questions after the session.</p>

  <h2 id="qa">Q&amp;A</h2>
  <p>If you are blocked by a development problem, have questions, or want me to walk you through building a project that improves your workflow, I can help you solve the issue and learn the related techniques.</p>

  <h2 id="how-it-works">How It Works</h2>
  <p>Please pay in advance at least one business day before the session and send the questions you want to discuss, so I have time to prepare. The actual session is not limited to that list.</p>
  <p>If there are many bookings, there may be a short wait to keep the consulting quality high. Thanks for understanding <span i-ic:outline-favorite text-red-500></span></p>

  <h2 id="pricing">Pricing</h2>
  <ul>
    <li>¥200 - 30 min, suitable for simple questions and discussion</li>
    <li>¥500 - 60 min, for building a project together and solving your pain point</li>
  </ul>

  <p>Click the button below to add me on WeChat for booking and payment. <strong><em>Please include "consulting" in your message</em></strong>.</p>
  <p>Sessions usually start on weekday evenings except Friday, 20:00-23:00 (UTC +8).</p>
</template>

<router-link to="/weixin" target="_blank"><i i-uiw:weixin text-green /></router-link>

<script setup>
  import { isZh } from '../lang'
</script>
