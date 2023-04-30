<script>
  export let padding = '0.75rem'
  export let gap = '0.75rem'
  export let contentGap = '0.2rem'
  export let contentPadding = '1rem'

  export let borderRadius = ['10px', '8px', '8px']

  export let headerAlign = 'flex-start'
  export let headerSize = '1.3rem'
  export let headerPadding = '1rem'
  export let headerWeight = 'bold'
  export let noHeader = false

  export let flexDirection = 'column'

  export let background = 'rgb(34, 58, 58)'
  export let contentBackground = 'darkslategray'
  export let headerBackground = '#7b2929'

  borderRadius = {
    card: borderRadius[0],
    header: borderRadius[1],
    content: borderRadius[2]
  }
</script>

<div
  class="information-card"
  style:border-radius={borderRadius.card}
  style:gap
  style:padding
  style:background-color={background}
  style:flex-direction={flexDirection}
>
  {#if noHeader}{:else}
    <div
      class="header"
      style:justify-content={headerAlign}
      style:font-size={headerSize}
      style:padding={headerPadding}
      style:font-weight={headerWeight}
      style:background-color={headerBackground}
      style:border-radius={borderRadius.header}
    >
      <slot name="header">
        <span>Undefined Name</span>
      </slot>
    </div>
  {/if}
  <div
    class="content"
    style:border-radius={borderRadius.content}
    style:gap={contentGap}
    style:padding={contentPadding}
    style:background-color={contentBackground}
  >
    <slot />
  </div>
</div>

<style lang="scss">
  @import './styles.scss';

  .information-card {
    @include flexy(column);
    align-items: stretch;
    justify-content: stretch;
    // flex: 1;
    height: min-content;

    .header {
      display: flex;
      align-items: center;
    }

    .content {
      display: flex;
      flex-direction: column;
      color: $white;
    }
  }
</style>
