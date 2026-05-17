import type { LyricLine, Song } from 'vue3-music-player'

export function createBasePlaylist(): Song[] {
  return [
    {
      id: 1,
      title: '稻香',
      artist: '周杰伦',
      cover: '/audio/covers/daoxiang.jpg',
      src: '/audio/daoxiang.mp3',
    },
    {
      id: 2,
      title: '开不了口',
      artist: '周杰伦',
      cover: '/audio/covers/kaibuliaokou.jpg',
      src: '/audio/kaibuliaokou.mp3',
    },
  ]
}

function loadLyrics(loader: () => Promise<{ default: LyricLine[] }>) {
  return loader()
    .then(mod => mod.default)
    .catch(() => [])
}

export async function hydrateLyrics(playlist: Song[]) {
  const [daoxiangLrc, kaibuliaokouLrc] = await Promise.all([
    loadLyrics(() => import('./daoxiang.lrc')),
    loadLyrics(() => import('./kaibuliaokou.lrc')),
  ])

  playlist[0].lyrics = daoxiangLrc
  playlist[1].lyrics = kaibuliaokouLrc

  return playlist
}
