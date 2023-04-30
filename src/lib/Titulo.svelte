<script>
  export let padding = '1rem'
  export let fontSize = '2rem'
</script>

<div style:font-size={fontSize} style:padding>
  <slot />
</div>

<style lang="scss">
  @import './styles.scss';

  div {
    border-radius: 10px;
    background-color: $background-darker;
  }

  @media (max-width: 800px) {
    div {
      text-align: center;
    }
  }
</style>
