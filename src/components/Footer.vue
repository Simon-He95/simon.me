<template>
  <footer class="site-footer">
    <div class="footer-inner">
      <span>© {{ new Date().getFullYear() }} Simon He</span>
      <nav aria-label="Social links">
        <a href="https://twitter.com/simon_he1995" target="_blank" rel="noopener">X</a>
        <a href="https://github.com/Simon-He95" target="_blank" rel="noopener">GitHub</a>
        <router-link to="/friends">
          Friends
        </router-link>
        <router-link to="/ama">
          AMA
        </router-link>
      </nav>
      <a class="registration" href="https://beian.miit.gov.cn/" target="_blank" rel="noopener">沪ICP备20020389号-1</a>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  border-top: 1px solid var(--c-line);
  color: var(--c-quiet);
  font-family: var(--font-mono);
  font-size: 0.65rem;
}

.footer-inner {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 1rem;
  width: min(100% - 2.5rem, 74rem);
  min-height: 5.5rem;
  margin: 0 auto;
}

.site-footer nav {
  display: flex;
  gap: 1rem;
}

.site-footer a {
  color: inherit;
  text-decoration: none;
  transition: color 180ms ease;
}

.site-footer a:hover {
  color: var(--c-text);
}

.registration {
  justify-self: end;
}

@media (max-width: 640px) {
  .footer-inner {
    grid-template-columns: 1fr auto;
    width: min(100% - 1.5rem, 74rem);
    padding: 1.5rem 0;
  }

  .registration {
    grid-column: 1 / -1;
    justify-self: start;
  }
}
</style>
