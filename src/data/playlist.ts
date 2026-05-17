import type { Song } from 'vue3-music-player'

async function loadText(url: string) {
  const res = await fetch(url)
  if (!res.ok)
    throw new Error(`Failed to load ${url}`)

  return res.text()
}

export async function loadPlaylist(): Promise<Song[]> {
  const [daoxiangLrc, kaibuliaokouLrc] = await Promise.all([
    loadText('/audio/daoxiang.lrc'),
    loadText('/audio/kaibuliaokou.lrc'),
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
