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
    title: 'Hey, I am Simon He, currently a front-end programmer. My hobbies include watching animation, playing basketball, watching some mystery dramas, and werewolf, lived in <%><span class="i-mi:location"></span></%>Shanghai <%><span class="i-openmoji:flag-china"></span></%>',
    contents: [
      'I\'m a career-changing programmer. After graduating in 2018, I had no plans for the future and no idea what kind of job I could do. Following my parents\' arrangements, I entered an ordinary Japanese company. My daily work was mainly to communicate with customers and complete various tasks according to the leadership\'s arrangements, whether it was writing Word documents, studying Excel macros, or exploring automatic sending of emails. methods, even making PPT. I stayed in this environment for nearly two years. ',
      'During this period of work, one of my colleagues became my guide on the road to front-end development. Since my work was relatively free, he suggested that I use this time to learn technology. So, he gave me a Vue2 training video from 2019. It was precisely because of this chance that I came into contact with Vue, and then I realized that through Vue, I could create amazing works so easily. This made me have endless yearning for the front-end industry. With the passion of youth, I decisively quit my stable but boring job and went through three months of closed study. During this time, I was almost a study fanatic and devoted myself wholeheartedly to it. Fortunately, after three months of study, I successfully joined a company and started my first front-end job. ',
      'After joining the job, I didn\'t slack off. After all, I was a front-end monk halfway through, and I had never studied systematically. I was also lucky in my current job, and God rewarded me with food. So, I made full use of my free time to go to Research related technologies in the front-end field. ',
      'By chance, I saw <a href="https://github.com/antfu" alt="Anthony Fu" ><span i-mdi:face-man-outline></span> Anthony Fu </a>’s live broadcast, I was deeply attracted by him. From then on, I started my open source career. From here on, my life became different. I no longer just blindly listened to other people’s opinions. , will only follow the instructions of others. I gradually developed my own opinions and was able to express them. At the same time, for those libraries and dependencies that are only installed and used in the project according to the documentation, in the past I couldn’t even imagine that I could work at the same level as them. But now, as a contributor, I can help them and submit Pull Requests to them. No longer was I a newbie who just listened to others and asked questions while waiting for answers. I experienced transformation and growth. ',
      'Now I am a core member of UnoCss and Vue Vine. I have written nearly 40 vscode plug-ins. I have more than 400 repos. I have published nearly 100 npm packages. I have received a lot of attention from open source and even got Anthony Fu and other sponsorships from open source, all this convinced me that giving up my stable job and choosing to devote myself to passionate front-end development was the best decision I made. ',
      'Although I changed careers late, in the eyes of others, I may have insufficient experience and no good academic qualifications, but I always believe that hard work can make up for weakness. Two years before I started front-end, I went out for interviews, and others thought I was better than most programmers with 5 years of experience. There are many members. Maybe I didn’t make this decision back then, and I became one of the majority of these people. The good news is that before I changed careers, I met my true love<svg xmlns="http://www.w3. org/2000/svg" inline-block width="1.2em" height="1.2em" viewBox="0 0 24 24"><g fill="none"><circle cx="10" cy="6" r="4" stroke="currentColor" stroke-width="1.5"/><path stroke="currentColor" stroke-width="1.5" d="M18 17.5c0 2.485 0 4.5-8 4.5s-8-2.015 -8-4.5S5.582 13 10 13s8 2.015 8 4.5Z"/><path fill="currentColor" d="m18.089 12.539l.455-.597zM19 8.644l-.532.528a.75.75 0 0 0 1.064 0zm .912 3.895l-.456-.597zm-1.368-.597c-.487-.371-.925-.668-1.278-1.053c-.327-.357-.516-.725-.516-1.19h -1.5c0 .95.414 1.663.91 2.204c.471.513 1.077.93 1.474 1.232zM16.75 9.7c0-.412.24-.745.547-.881c.267-.118.69-.13 1.171.353l1. 064-1.057c-.87 -.875-1.945-1.065-2.842-.668A2.455 2.455 0 0 0 15.25 9.7zm.884 3.435c.148.113.342.26.545.376c.204.116.487.239.821.239v-1.5c. 034 0 .017.011-.082 -.044c-.1-.056-.212-.14-.374-.264zm2.732 0c.397-.303 1.003-.719 1.473-1.232c.497-.541.911-1.255.911-2.203h- 1.5c0 .464-.189.832-.516 1.19c-.353.384-.791.681-1.278 1.052zM22.75 9.7c0-1-.585-1.875-1.44-2.253c-.896-.397-1.973-.207- 2.842.668l1.064 1.057c.48-.483.904-.471 1.17-.353a.955.955 0 0 1 .548.88zm-3.294 2.242a3.584 3.584 0 0 1-.374.264c-.099.056 -.116.044-.082.044 v1.5c.334 0 .617-.123.82-.239c.204-.115.398-.263.546-.376z"/></g></svg> , is also my current wife (Judy), he is mine Party A, before I resigned, we confirmed our relationship, and after less than 2 years of getting along, we got married. ',
      'My story is not over yet, it is just the beginning. In my future, there may be more products and outputs. I hope to use my technology to help more programmers, just like when I Once I saw Anthony Fu being led, I also wanted to be such a person. ',
      'If you are curious about what I am doing, or if you expect my future development, you can come to me~. If you encounter difficulties or need consultation, you can come to me~. If you feel that your efficiency is not high, always I am doing some repetitive work that I can be lazy about. You can come to me. Welcome to be friends with me. I am Simon He, a front-end programmer who loves coding. ',
    ],
    findMe: [
      '<span i-ri:user-search-fill></span> Find me on <a href="https://github.com/Simon-He95" alt="GitHub" ><span i-carbon:logo-github></span> GitHub</a>, <a href="https://twitter.com/simon_he1995" alt="Twitter" ><span i-carbon:logo-twitter></span> Twitter</a>, <a href="https://www.zhihu.com/people/zka0cr" alt="Zhihu" ><span i-ri:zhihu-fill></span> Zhihu</a>,  <a href="https://juejin.cn/user/4319334608151533" alt="掘金" ><svg xmlns="http://www.w3.org/2000/svg" inline-block width="1.2em" height="1.2em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="m2 12l10 7.422L22 12"/><path d="m7 9l5 4l5-4m-6-3l1 .8l1-.8l-1-.8z"/></g></svg> 掘金</a>.',
      `<span i-simple-icons:minutemailer></span> <span>Mail me at</span> <a href="mailto:674949287@qq.com" alt="Mail" > hi@Simon</a>.
      Chat with the community at <a href="https://discord.gg/r4hjJ6WT" alt="Discord" ><span i-teenyicons:discord-outline></span> Discord</a>.`,
    ],
  },
  zh: {
    title: '大家好，我是Simon He，目前是一位前端程序员，兴趣爱好有追动漫、打篮球、看一些推理剧、狼人杀，居住在 <%><span class="i-mi:location"></span></%>上海 <%><span class="i-openmoji:flag-china"></span></%>',
    contents: [
      '我是一位转行的程序员。在2018年毕业后，我对未来毫无计划，不知道自己能从事什么工作。听从父母的安排，我进入了一家普通的日本企业，我的日常工作主要是与客户沟通，并按照领导的安排完成各种任务，无论是写Word文档，研究Excel宏，还是探索自动发送电子邮件的方法，甚至制作PPT。我在这样的环境中待了近两年。',
      '在这段工作期间，我的一个同事成为了我踏上前端开发之路的引路人。由于我的工作相对闲暇，他建议我利用这段时间学习技术。于是，他给了我一份2019年的Vue2培训视频。正是因为这个偶然的机会，我开始接触到Vue，才意识到通过Vue，原来可以如此简单地创建出令人惊艳的作品。这让我对前端行业产生了无限向往。怀揣着年轻的热血，我果断辞去了那份虽然稳定但乏味的工作，经历了长达三个月的封闭式学习。在这段时间里，我几乎是个学习狂人，全身心地投入其中。幸运的是，三个月的学习之后，我成功地加入了一家公司，开启了我的第一份前端工作。',
      '入职后，我也没有懈怠，毕竟我是一个半路出家的前端，并没有系统的学习过，目前的这份工作也是运气好，老天赏饭吃，于是，我充分利用自己的空闲时间，去研究一下前端领域相关的技术。',
      '在一次偶然的机会，我看到了 <a href="https://github.com/antfu" alt="Anthony Fu" ><span i-mdi:face-man-outline></span> Anthony Fu</a> 的直播，我深深的被他所吸引，从那以后我开始了我的开源生涯，也就是从这里开始，我的生活变得不一样了，我不再只是盲目听从别人的意见，只会按照别人的指示去做。我逐渐有了自己的见解，并且能够表达出来。同时，那些在项目中只会安装和按照文档使用的库和依赖，过去我甚至不敢想象自己能够和它们在同一高度工作。但现在，我作为贡献者能够给它们提供帮助，向它们提交Pull Request。我不再是一个只能听别人说、通过提问等待答案的新手，我经历了转变，也取得了成长。',
      '现在已经是 UnoCss、Vue Vine 的核心成员了，我写了将近 40 个 vscode 插件，我拥有 400 多个 repo，我发了近 100 个 npm 包，我有了好多来自开源的关注，甚至得到 Anthony Fu 和 其他来自开源的赞助，这一切让我坚信，当初放弃稳定的工作、选择投身于充满激情的前端开发，是我做出的最正确的决定。',
      '虽然转行晚了，在别人眼中，觉得我可能经验不足，又没有好的学历，但是我始终相信勤能补拙，我开始前端前两年，我出去面试，别人都觉得我比大多数 5 年的程序员会的多，可能当年我没有下这个决定，我也成为了这些大多数人，好消息是，在我转行前，我遇到了我的真爱 <svg xmlns="http://www.w3.org/2000/svg" inline-block width="1.2em" height="1.2em" viewBox="0 0 24 24"><g fill="none"><circle cx="10" cy="6" r="4" stroke="currentColor" stroke-width="1.5"/><path stroke="currentColor" stroke-width="1.5" d="M18 17.5c0 2.485 0 4.5-8 4.5s-8-2.015-8-4.5S5.582 13 10 13s8 2.015 8 4.5Z"/><path fill="currentColor" d="m18.089 12.539l.455-.597zM19 8.644l-.532.528a.75.75 0 0 0 1.064 0zm.912 3.895l-.456-.597zm-1.368-.597c-.487-.371-.925-.668-1.278-1.053c-.327-.357-.516-.725-.516-1.19h-1.5c0 .95.414 1.663.91 2.204c.471.513 1.077.93 1.474 1.232zM16.75 9.7c0-.412.24-.745.547-.881c.267-.118.69-.13 1.171.353l1.064-1.057c-.87-.875-1.945-1.065-2.842-.668A2.455 2.455 0 0 0 15.25 9.7zm.884 3.435c.148.113.342.26.545.376c.204.116.487.239.821.239v-1.5c.034 0 .017.011-.082-.044c-.1-.056-.212-.14-.374-.264zm2.732 0c.397-.303 1.003-.719 1.473-1.232c.497-.541.911-1.255.911-2.203h-1.5c0 .464-.189.832-.516 1.19c-.353.384-.791.681-1.278 1.052zM22.75 9.7c0-1-.585-1.875-1.44-2.253c-.896-.397-1.973-.207-2.842.668l1.064 1.057c.48-.483.904-.471 1.17-.353a.955.955 0 0 1 .548.88zm-3.294 2.242a3.584 3.584 0 0 1-.374.264c-.099.056-.116.044-.082.044v1.5c.334 0 .617-.123.82-.239c.204-.115.398-.263.546-.376z"/></g></svg> ，也是我现在的老婆（Judy），他是我的甲方，再我辞职前，我们确认了情侣关系，再经过2年不到的相处，我们结婚了。',
      '我的故事到这里，还没有结束，才只是一个开始，我的未来，可能会有更多的产品和产出，我希望用我的技术去帮助到更多程序员，就像当年我第一次看到 Anthony Fu 被引领一样，我也希望成为这样的一个人。',
      '如果你好奇，我在做的事，或者你期待我未来的发展，你可以找我～，如果你遇到困难或者需要咨询，你可以找我～，如果你觉得你的效率不高，总是在做一些可以偷懒的重复工作，你可以来找我，欢迎来和我做朋友，我是 Simon He，一个热爱编码的前端程序员。',
    ],
    findMe: [
      '<span i-ri:user-search-fill></span>可以在 <a href="https://github.com/Simon-He95" alt="GitHub" ><span i-carbon:logo-github></span> GitHub</a>, <a href="https://twitter.com/simon_he1995" alt="Twitter" ><span i-carbon:logo-twitter></span> Twitter</a>, <a href="https://www.zhihu.com/people/zka0cr" alt="Zhihu" ><span i-ri:zhihu-fill></span> Zhihu</a>, <a href="https://juejin.cn/user/4319334608151533" alt="掘金" ><svg xmlns="http://www.w3.org/2000/svg" inline-block width="1.2em" height="1.2em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="m2 12l10 7.422L22 12"/><path d="m7 9l5 4l5-4m-6-3l1 .8l1-.8l-1-.8z"/></g></svg> 掘金</a> 找到我。',
      `<span i-simple-icons:minutemailer></span> <span>通过邮件联系我</span> <a href="mailto:674949287@qq.com" alt="Mail" > hi@Simon</a>。
      在 <a href="https://discord.gg/r4hjJ6WT" alt="Discord" ><span i-teenyicons:discord-outline></span> Discord</a>上联系我。`,
    ],
  },
}

export const $t = computed(() => json[lan.value])

export const setLan = () => {
  lan.value = lan.value === 'en' ? 'zh' : 'en'
}

export const isZh = computed(() => lan.value === 'zh')
