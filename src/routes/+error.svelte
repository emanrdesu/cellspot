<script>
  import Titulo from '$lib/Titulo.svelte'
</script>

<Titulo>
  <div id="error">Error <span id="code">404</span></div>
  <div>Esta página no existe.</div>
</Titulo>

<style lang="scss">
  @import '../lib/styles.scss';

  #error {
    font-size: 4rem;
    margin-bottom: 2rem;
  }

  #code {
    color: $logo-red;
  }
</style>
