<script>
  import IoIosArrowForward from 'svelte-icons/io/IoIosArrowForward.svelte'
  import IoIosArrowBack from 'svelte-icons/io/IoIosArrowBack.svelte'

  export let images = []

  let index = 0

  function increment() {
    index = (index + 1) % images.length
  }

  function decrement() {
    index--
    if (index < 0) {
      index = images.length - 1
    }
  }

  function openImage() {
    window.open(images[index], '_blank')
  }

  export function getCurrentImage() {
    return images[index];
  }

  export function getImageCount() {
    return images.length;
  }
</script>

<div class="carousel" on:click={openImage} style:background-image="url({images[index]})">
  <div class="navigation">
    {#if images.length > 1}
      <div on:mousedown|preventDefault on:click|stopPropagation={decrement} class="icon">
        <IoIosArrowBack />
      </div>

      <div on:mousedown|preventDefault on:click|stopPropagation={increment} class="icon">
        <IoIosArrowForward />
      </div>
    {/if}
  </div>
</div>

<style lang="scss">
  @import './styles.scss';

  .hidden {
    display: none;
  }

  .carousel {
    @include flexy(column);
    justify-content: center;
    border-radius: inherit;
    flex: 1;
    cursor: zoom-in;

    width: 100%;
    height: 100%;

    transition: background-image 300ms ease-in-out;

    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;

    .navigation {
      display: flex;
      justify-content: space-between;
      width: 100%;
    }
  }

  .icon {
    width: 30px;
    &:hover {
      cursor: pointer;
    }
  }
</style>
