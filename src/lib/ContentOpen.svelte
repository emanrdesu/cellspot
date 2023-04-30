<script>
  import { slide, fade } from 'svelte/transition'

  export let openText = 'Open Content'
  export let closeText = 'Close Content'

  export let fontSize = '1.5rem'
  export let backgroundColor = '#7b2929'

  export let delay = 0
  export let duration = 300

  let open = false

  function toggleContent() {
    open = !open
  }
</script>

<div
  on:click|preventDefault={toggleContent}
  style:background-color={backgroundColor}
  style:font-size={fontSize}
  class="toggle"
>
  {open ? closeText : openText}
</div>

{#if open}
  <div transition:slide|local={{ delay: delay, duration: duration }} class="content">
    <slot>No content</slot>
  </div>
{/if}

<style lang="scss">
  @import '../lib/styles.scss';

  .toggle {
    margin-left: auto;
    margin-right: auto;
    padding: 0.5rem;
    border-radius: 10px;
    font-weight: bold;
    cursor: pointer;
  }
</style>
