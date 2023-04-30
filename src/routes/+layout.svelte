<script>
  import logo from '$lib/assets/logo.png'
</script>

<div id="content">
  <aside>
    <a href="/"><img id="logo" alt="logo" src={logo} /></a>

    <nav id="paginas">
      <a href="/productos">Productos</a>
      <a href="/admin">Administrar</a>
      <a href="/faq">FAQ</a>
    </nav>

    <nav id="contact">
      <span class="contact-link">
        <img
          alt="Whatsapp Logo"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/240px-WhatsApp.svg.png"
        />
        <a href="https://chat.whatsapp.com/JADgz7k3GdnBVBdWstJvO6">Whatsapp</a>
      </span>

      <span class="contact-link">
        <img
          alt="Telegram Logo"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Telegram_logo.svg/240px-Telegram_logo.svg.png"
        />
        <a href="https://t.me/tecnoiSla">Telegram</a>
      </span>
    </nav>
  </aside>

  <main>
    <slot />
  </main>
</div>

<style lang="scss">
  @import '../lib/styles.scss';

  :root {
    font-family: 'Roboto', sans-serif;
    background-color: $background;
    color: $foreground;
  }

  :global(a) {
    color: $link;
    text-decoration: none;

    &:hover {
      color: $link-hover;
    }
  }

  #content {
    margin-top: 2em;
    display: flex;
    justify-content: flex-start;
    flex-direction: row;
  }

  a {
    color: $foreground;
    text-decoration: none;
  }

  main {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 95ch;
    width: 70vw;
    margin-left: 2rem;
    position: relative;
  }

  .contact-link {
    display: flex;
    align-items: center;
    gap: 0.5ch;
    width: 14ch;

    img {
      max-width: 30px;
    }
  }

  aside {
    padding: (1.5rem) {
      top: 0;
    }

    @include flexy(column);
    gap: 1.2rem;
    background-color: $background-darker;
    border-radius: 10px;
    max-height: 50vh;

    #logo {
      max-height: 150px;
    }

    nav {
      @include flexy(column);
      gap: 0.5ch;

      &#paginas a {
        color: $link;
        &:hover {
          color: $link-hover;
        }
      }

      a {
        font-size: 1.2em;
        color: white;
        &:hover {
          color: $link-hover;
        }
      }
    }
  }

  @media (max-width: 900px) {
    #content {
      margin-top: 0;
      flex-direction: column;
    }

    nav {
      flex-direction: row;
    }

    aside {
      flex-direction: row;
      justify-content: space-evenly;
      gap: 0.2rem;
      padding: {
        left: 0;
        right: 0;
      }
    }

    main {
      margin-top: 1rem;
      margin-left: 0;
      width: 95vw;
    }
  }

  @media (max-width: 600px) {
    #logo {
      width: 20vw;
    }
  }
</style>
