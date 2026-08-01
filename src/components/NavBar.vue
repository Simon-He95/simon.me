<script setup lang="ts">
import { computed } from 'vue'
import { lan, setLan } from '../../lang'
import { toggleDark } from '../logics'

const labels = computed(() => lan.value === 'zh'
  ? { projects: '项目', posts: '文章', talks: '分享', ama: '问我', language: '切换到英文', theme: '切换明暗模式' }
  : { projects: 'Projects', posts: 'Notes', talks: 'Talks', ama: 'AMA', language: 'Switch to Chinese', theme: 'Toggle color scheme' })
</script>

<template>
  <header class="site-header">
    <div class="site-nav">
      <router-link class="site-brand" to="/" aria-label="Simon He home">
        <span aria-hidden="true">S</span>
        <strong>Simon He</strong>
      </router-link>

      <nav class="site-links" aria-label="Primary navigation">
        <router-link to="/projects">
          {{ labels.projects }}
        </router-link>
        <router-link to="/posts">
          {{ labels.posts }}
        </router-link>
        <router-link to="/talks">
          {{ labels.talks }}
        </router-link>
        <router-link to="/ama">
          {{ labels.ama }}
        </router-link>
      </nav>

      <div class="site-actions">
        <a class="site-github" href="https://github.com/Simon-He95" target="_blank" rel="noopener">
          GitHub <span aria-hidden="true">↗</span>
        </a>
        <button type="button" :aria-label="labels.language" :title="labels.language" @click="setLan">
          {{ lan === 'zh' ? 'EN' : '中' }}
        </button>
        <button type="button" :aria-label="labels.theme" :title="labels.theme" @click="toggleDark($event)">
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" />
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  position: relative;
  z-index: 40;
  border-bottom: 1px solid color-mix(in srgb, var(--c-line) 82%, transparent);
  background: color-mix(in srgb, var(--c-bg) 82%, transparent);
  backdrop-filter: blur(18px);
}

.site-nav {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  width: min(100% - 2.5rem, 74rem);
  min-height: 4.5rem;
  margin: 0 auto;
}

.site-brand {
  display: inline-flex;
  align-items: center;
  justify-self: start;
  gap: 0.65rem;
  color: var(--c-text);
  font-size: 0.93rem;
  letter-spacing: -0.01em;
  text-decoration: none;
}

.site-brand > span {
  display: grid;
  width: 1.9rem;
  height: 1.9rem;
  place-items: center;
  border: 1px solid var(--c-line-strong);
  border-radius: 0.55rem;
  background: var(--c-raised);
  color: var(--c-accent);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  box-shadow: 0 5px 18px var(--c-shadow);
}

.site-links {
  display: flex;
  align-items: center;
  gap: 1.65rem;
}

.site-links a,
.site-github {
  color: var(--c-muted);
  font-size: 0.82rem;
  font-weight: 500;
  text-decoration: none;
  transition: color 180ms ease;
}

.site-links a:hover,
.site-links a:focus-visible,
.site-links a.router-link-active,
.site-github:hover,
.site-github:focus-visible {
  color: var(--c-text);
}

.site-actions {
  display: flex;
  align-items: center;
  justify-self: end;
  gap: 0.35rem;
}

.site-github {
  display: inline-flex;
  gap: 0.25rem;
  margin-right: 0.55rem;
}

.site-actions button {
  display: grid;
  width: 2.45rem;
  height: 2.45rem;
  place-items: center;
  border: 1px solid transparent;
  border-radius: 0.55rem;
  background: transparent;
  color: var(--c-muted);
  cursor: pointer;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  transition: border-color 180ms ease, background 180ms ease, color 180ms ease;
}

.site-actions button:hover {
  border-color: var(--c-line);
  background: var(--c-surface);
  color: var(--c-text);
}

.site-actions svg {
  width: 1.05rem;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-width: 1.5;
}

@media (max-width: 760px) {
  .site-nav {
    grid-template-columns: 1fr auto;
    width: min(100% - 1.5rem, 74rem);
    min-height: 4rem;
  }

  .site-links {
    display: none;
  }

  .site-github {
    margin-right: 0.15rem;
  }
}

@media (max-width: 420px) {
  .site-brand strong {
    display: none;
  }
}
</style>
