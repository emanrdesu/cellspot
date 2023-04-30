<script>
  export let options
  export let valueTransform = (x) => x
  export let name
  export let direction = 'column'
  export let prechosen = null

  let chosen = 0

  if (prechosen) {
    chosen = options.findIndex((e) => e == prechosen)
  }

  $: value = valueTransform(options[chosen])

  function chooseIndex(i) {
    chosen = i
  }
</script>

<div style:flex-direction={direction} class="radio">
  <input type="hidden" {name} bind:value />
  {#each options as option, i}
    <button
      tabindex="-1"
      class:checked={chosen == i}
      on:click|preventDefault={() => {
        chooseIndex(i)
      }}>{option}</button
    >
  {/each}
</div>

<style lang="scss">
  @import './styles.scss';

  .radio {
    display: flex;

    gap: 0.5rem;
    padding: 0.5rem;
  }

  button {
    padding: 0.5rem;
    font-size: 1rem;
    font-weight: bold;
    border: none;
    outline: none;
    transition: background-color 200ms ease-in;
    border-radius: 8px;
    cursor: pointer;

    &.checked {
      background-color: $logo-pink;
    }
  }
</style>
