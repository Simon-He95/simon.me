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
    title: 'Hey <%><span class="rotated-hand" i-noto:waving-hand></span></%>, I am Simon He, currently a front-end programmer. My hobbies include watching cartoon, playing basketball, watching some mystery dramas, and werewolf, lived in <%><span class="i-mi:location"></span></%>Shanghai <%><span class="i-openmoji:flag-china"></span></%>',
    contents: [
      'After graduating from college in 2018, I accept my parents\' arrangement and entered an ordinary Japanese company. At that time, my daily work was mainly to communicate with customers and complete various tasks according to the requirements of the leaders. Including writing Word documents, studying Excel macros, doing PPT, etc. In such a boring working environment, I stay for two years. Until the help of a colleague, I saw the turnaround of my career. At that time, work was relatively leisure. He suggested that I could use this time to learn a technology, so he gave me a tutorial video of Vue.js.',
      'This is the first time I have come into contact with Vue.js. I was surprised to find that using vue.js can be so simple and convenient to develop amazing web applications. This makes me full of endless imagination and yearning for the front-end development industry. That year, when I was 24 years old, with expectations for the future, I resolutely quit the stable but uncertain job and began a three-month closed study.',
      'Before I changed my job, I met my true love, that is, my current wife (Judy). She is my Party A. Before I resigned, we confirmed our relationship. Two years later, we entered the palace of marriage.',
      'During this period, I devoted myself to it and studied crazily. Fortunately, God rewards diligence. Three months later, I successfully joined a company and started my first front-end development job.',
      'Although I majored in computer science, I only have three months of learning experience in the field of front-end development. I know that having the current job depends largely on luck, so I did not slack off after joining the company, but made full use of my free time to improve myself.',
      'In 2022, an accidental opportunity. I saw <a href="https://github.com/antfu" alt="Anthony Fu" ><span i-mdi:face-man-outline></span> Anthony Fu</a>\'s live broadcast, I was deeply attracted by his charm. Anthony Fu\'s open source spirit touched me, and I also became a big fan of Anthony Fu that day. Take the Internet as the medium, take the code as the bridge, take the example as the power, and moisten things silently. Since then, I have also embarked on my open source road.',
      'After starting to do open source, I found a wider world beyond work. At first, I didn\'t depend on others. I had my own opinions on technology and products. So far, I have written nearly 40 VSCode plug-ins and sent nearly 100 npm packages. While getting the attention of the community, I also became a team member of Vue Vine and UnoCss, and successfully followed the stars.',
      'All this made me firmly believe that it was the most correct decision I made to give up a stable job and bravely step out of the comfort zone.',
      '<span font-mono>......</span>',
      'My experience ends here, but the story continues. In the future, I hope to use my technology to help more developers, just like when I first saw Anthony Fu being led.',
      'If you are curious about what I am doing, or want to pay attention to my future development, you can come to me. If you encounter difficulties and need consultation, or are inefficient or confused, you can come to me. Welcome to be friends with me. , I am Simon He, a front-end programmer who loves coding~',
    ],
    findMe: [
      '<span i-ri:user-search-fill></span> Find me on <a href="https://github.com/Simon-He95" alt="GitHub" ><span i-carbon:logo-github></span> GitHub</a>, <a href="https://twitter.com/simon_he1995" alt="Twitter" ><span i-carbon:logo-twitter></span> Twitter</a>, <a href="https://www.zhihu.com/people/zka0cr" alt="Zhihu" ><span i-ri:zhihu-fill></span> Zhihu</a>,  <a href="https://juejin.cn/user/4319334608151533" alt="掘金" ><svg xmlns="http://www.w3.org/2000/svg" inline-block width="1.2em" height="1.2em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="m2 12l10 7.422L22 12"/><path d="m7 9l5 4l5-4m-6-3l1 .8l1-.8l-1-.8z"/></g></svg> 掘金</a>.',
      `<span i-simple-icons:minutemailer></span> <span>Mail me at</span> <a href="mailto:674949287@qq.com" alt="Mail" > hi@Simon</a>.
      Chat with the community at <a href="https://discord.gg/ZnjxzMKWNW" alt="Discord" ><span i-teenyicons:discord-outline></span> Discord</a>.`,
    ],
  },
  zh: {
    title: 'Hi，你好 <%><span class="rotated-hand" i-noto:waving-hand></span></%>，我是Simon He，目前是一位前端程序员，兴趣爱好有追动漫、打篮球、看一些推理剧、狼人杀，居住在 <%><span class="i-mi:location"></span></%>上海 <%><span class="i-openmoji:flag-china"></span></%>',
    contents: [
      '2018 年大学毕业后，我听从父母的安排，进入了一家普通的日企工作。那时候，我的日常工作主要就是和客户沟通，按照领导的要求完成各种任务。包括写 Word 文档，研究 Excel 宏，做 PPT 等等。在这样枯燥乏味的工作环境下，我一待就是两年。直到一位同事的帮助，让我看到了事业的转机。那时候工作相对闲暇，他建议我可以利用这段时间去学习一门技术，于是便给了我一份 Vue.js 的教程视频。',
      '这是我第一次接触到 Vue.js。我惊讶的发现，使用 vue.js 竟可以如此简单便捷的开发出令人惊艳的 Web 应用。这让我对前端开发行业充满了无尽的想象和向往。那年我 24 岁，怀揣着对未来的期待，我毅然决然地辞掉了那份稳定但看不到前途的工作，开始了长达三个月的封闭式学习。',
      '在我转行前，我遇到了我的真爱也就是我现在的老婆（Judy），她是我的甲方，在我辞职前，我们确认了情侣关系，两年后，我们步入了婚姻的殿堂。',
      '在这段时间里，我全身心地投入其中，疯狂地学习。幸运的是，天道酬勤，三个月后，我成功入职了一家公司，开始了我第一份前端开发的工作。',
      '虽然本科是计算机专业出身，但在前端开发领域，我只有三个月的学习经验。我深知，拥有目前这份工作很大程度上靠运气，所以入职后我也并没有懈怠，而是充分利用自己的空闲时间去提升自己。',
      '2022 年，一次偶然的机会。我在 B 站上刷到了 <a href="https://github.com/antfu" alt="Anthony Fu" ><span i-mdi:face-man-outline></span> Anthony Fu</a> 的直播，我深深被他的魅力所吸引。Anthony Fu 的开源精神触动了我，我也在那天成为了 Anthony Fu 的狂热粉丝。以网络为媒介，以代码为桥梁，以榜样为力量，润物无声。从那以后，我也踏上了我的开源之路。',
      '开始做开源之后，我发现了工作之外更广阔的天地。我开始不在依附于别人，对技术、对产品，都有了自己的见解。截止目前，我已经写了近 40 个 VSCode 插件，发了近 100 个 npm 包。得到社区关注的同时，我也成为 Vue Vine、UnoCss 的团队成员，成功追星。',
      '这一切让我坚信，当初放弃稳定的工作，勇敢地迈出舒适区是我做出的最正确的决定。',
      '<span font-mono>......</span>',
      '我的经历就先写到这里，但故事仍在继续。在未来，我希望能用自己的技术帮助到更多的开发者，就像当年我第一次看到 Anthony Fu 被引领一样。',
      '如果你好奇我正在做的事，或者想关注我未来的发展，可以来找我～如果你遇到困难需要咨询，或者效率不高，遇到困惑，可以来找我～欢迎来和我做朋友，我是 Simon He，一个热爱编码的前端程序员～',
    ],
    findMe: [
      '<span i-ri:user-search-fill></span>可以在 <a href="https://github.com/Simon-He95" alt="GitHub" ><span i-carbon:logo-github></span> GitHub</a>, <a href="https://twitter.com/simon_he1995" alt="Twitter" ><span i-carbon:logo-twitter></span> Twitter</a>, <a href="https://www.zhihu.com/people/zka0cr" alt="Zhihu" ><span i-ri:zhihu-fill></span> Zhihu</a>, <a href="https://juejin.cn/user/4319334608151533" alt="掘金" ><svg xmlns="http://www.w3.org/2000/svg" inline-block width="1.2em" height="1.2em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="m2 12l10 7.422L22 12"/><path d="m7 9l5 4l5-4m-6-3l1 .8l1-.8l-1-.8z"/></g></svg> 掘金</a> 找到我。',
      `<span i-simple-icons:minutemailer></span> <span>通过邮件联系我</span> <a href="mailto:674949287@qq.com" alt="Mail" > hi@Simon</a>。
      在 <a href="https://discord.gg/ZnjxzMKWNW" alt="Discord" ><span i-teenyicons:discord-outline></span> Discord</a>上联系我。`,
    ],
  },
}

export const $t = computed(() => json[lan.value])

export const setLan = () => {
  lan.value = lan.value === 'en' ? 'zh' : 'en'
}

export const isZh = computed(() => lan.value === 'zh')
