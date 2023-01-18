// @unocss-include
import { computed, ref } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import type { Ref } from 'vue'

const language = ref<'en' | 'zh'>('en')
export const lan = useLocalStorage('simon.me.language', language) as Ref<'en' | 'zh'>
interface JSON {
  en: Record<string, any>
  zh: Record<string, any>
}
const json: JSON = {
  en: {
    title: 'Hey, I am Simon He, a fanatical programmers located  in <%><span class="i-mi:location"></span></%>Shanghai, <%><span class="i-openmoji:flag-china"></span></%>China.',
    contents: [
      'Through this page, I would like to share with you some projects I’ve done and what I’ve been through. ',
      'Recently, I have been following <a href="https://github.com/antfu" alt="Anthony Fu" ><span i-mdi:face-man-outline></span> Anthony Fu</a> for a couple months, his enthusiasm to coding and dedication really inspired me a lot. Now, I’m used to learning industry news from Twitter and digging myself in those forward-looking feature and innovative ecological technology.',
      'I’m also an active user on <a href="https://github.com/Simon-He95" alt="GitHub" ><span i-iconoir:github></span> GitHub</a> to communicate with people have same ambition and interests on the latest technical information and ideas. Happy to be one of the contributors for some open-source <a href="/projects" alt="Projects" ><span i-carbon:lightning></span> Projects</a>. ',
      'Moreover, highly recommend my terminal configuration through the link <a href="/posts/ohMyZsh-alias" alt="zsh config" ><span i-carbon:face-satisfied></span> here</a> and hope this could bring you some convenience during your encoding process. ',
      'I wanna say - I don’t regard it as my work, it’s an indispensable part of my life. How about you? Join me to fall in love with coding along this journey. ',
      'I’m eagerly to have in-depth communication with you and looking forward to hearing your voice via below listed channels. ',
    ],
    findMe: [
      '<span i-ri:user-search-fill></span>Find me on <a href="https://github.com/Simon-He95" alt="GitHub" ><span i-carbon:logo-github></span> GitHub</a>, <a href="https://twitter.com/simon_he1995" alt="Twitter" ><span i-carbon:logo-twitter></span> Twitter</a>, <a href="https://www.zhihu.com/people/zka0cr" alt="Zhihu" ><span i-ri:zhihu-fill></span> Zhihu</a>.',
      `<span i-simple-icons:minutemailer></span>Mail me at <a href="mailto:674949287@qq.com" alt="Mail" > hi@Simon</a>.
      Chat with the community at <a href="https://discord.gg/r4hjJ6WT" alt="Discord" ><span i-teenyicons:discord-outline></span> Discord</a>.`,
    ],
  },
  zh: {
    title: '大家好，我是Simon He，一个狂热的程序员，位于 <%><span class="i-mi:location"></span></%>上海, <%><span class="i-openmoji:flag-china"></span></%>中国。',
    contents: [
      '通过这个页面，我想和大家分享一些我做过的项目和经历的事情。 ',
      '最近，我一直在关注 <a href="https://github.com/antfu" alt="Anthony Fu" ><span i-mdi:face-man-outline></span> Anthony Fu</a> 几个月来，他对编码的热情和奉献精神真的激励了我很多。 现在，我习惯了从推特上了解行业新闻，在那些前瞻性的功能和创新的生态技术中挖掘自己。',
      '我也是 <a href="https://github.com/Simon-He95" alt="GitHub" ><span i-iconoir:github></span> GitHub</a> 的活跃用户, 喜欢与有相同志向和兴趣的人交流最新的技术信息和想法，也很高兴成为一些开源项目的贡献者之一 。<a href="/projects" alt="Projects" ><span i-carbon:lightning></span> 个人项目</a>. ',
      '此外，强烈推荐我的终端配置 <a href="/posts/ohMyZsh-alias" alt="zsh config" ><span i-carbon:face-satisfied></span> 这里</a>， 并希望这里面封装的低代码和强大的功能，能在您的编码过程中给您带来一些方便，另外还有<a href="https://github.com/Simon-He95/zsh-install">一键自动安装</a>配置，<a href="https://github.com/Simon-He95/directory-configuration">了解更多。</a> ',
      '我想说——我不把它当成我的工作，它是我生活中不可或缺的一部分。 你呢？ 和我一起爱上这段旅程中的编码。 ',
      '我渴望与您进行深入交流，并期待通过以下渠道听到您的声音。 ',
    ],
    findMe: [
      '<span i-ri:user-search-fill></span>可以在 <a href="https://github.com/Simon-He95" alt="GitHub" ><span i-carbon:logo-github></span> GitHub</a>, <a href="https://twitter.com/simon_he1995" alt="Twitter" ><span i-carbon:logo-twitter></span> Twitter</a>, <a href="https://www.zhihu.com/people/zka0cr" alt="Zhihu" ><span i-ri:zhihu-fill></span> Zhihu</a> 找到我。',
      `<span i-simple-icons:minutemailer></span>通过邮件联系我 <a href="mailto:674949287@qq.com" alt="Mail" > hi@Simon</a>。
      在 <a href="https://discord.gg/r4hjJ6WT" alt="Discord" ><span i-teenyicons:discord-outline></span> Discord</a>上联系我`,
    ],
  },
}

export const $t = computed(() => json[lan.value])

export const setLan = () => {
  lan.value = lan.value === 'en' ? 'zh' : 'en'
}
