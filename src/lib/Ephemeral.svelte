<script>
  import { onMount } from 'svelte'

  export let duration
  let show = true

  onMount(() => {
    setTimeout(() => {
      show = false
    }, duration)
  })
</script>

{#if show}
  <slot />
{/if}
