import type { Song } from 'vue3-music-player'

async function loadOptionalText(url: string) {
  try {
    const res = await fetch(url)
    if (!res.ok)
      return ''

    return await res.text()
  }
  catch {
    return ''
  }
}

export async function loadPlaylist(): Promise<Song[]> {
  const [daoxiangLrc, kaibuliaokouLrc] = await Promise.all([
    loadOptionalText('/audio/daoxiang.lrc'),
    loadOptionalText('/audio/kaibuliaokou.lrc'),
  ])

  return [
    {
      id: 1,
      title: '稻香',
      artist: '周杰伦',
      cover: '/audio/covers/daoxiang.jpg',
      src: '/audio/daoxiang.mp3',
      lyrics: daoxiangLrc,
    },
    {
      id: 2,
      title: '开不了口',
      artist: '周杰伦',
      cover: '/audio/covers/kaibuliaokou.jpg',
      src: '/audio/kaibuliaokou.mp3',
      lyrics: kaibuliaokouLrc,
    },
  ] as Song[]
}
