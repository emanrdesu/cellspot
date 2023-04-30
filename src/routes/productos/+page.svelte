<script>
  import { error } from '@sveltejs/kit'
  import PhoneCard from '$lib/PhoneCard.svelte'
  import Titulo from '$lib/Titulo.svelte'

  import IoIosArrowDropright from 'svelte-icons/io/IoIosArrowDropright.svelte'
  import IoIosArrowDropleft from 'svelte-icons/io/IoIosArrowDropleft.svelte'

  export let data

  if (data.count > 0)
    if (data.phones.length == 0)
      throw error(404)
</script>

<svelte:head>
  <title>Productos ({data.pageNumber})</title>
</svelte:head>

<Titulo>
  <span class="flex-container">
    {#if data.pageNumber == 1}
      <div class="icon disabled">
        <IoIosArrowDropleft />
      </div>
    {:else}
      <a href="/productos?page={data.pageNumber - 1}">
        <div class="icon">
          <IoIosArrowDropleft />
        </div>
      </a>
    {/if}

    <span id="title">Productos</span>

    {#if data.lastPage}
      <div class="icon disabled">
        <IoIosArrowDropright />
      </div>
    {:else}
      <a href="/productos?page={data.pageNumber + 1}">
        <div class="icon">
          <IoIosArrowDropright />
        </div>
      </a>
    {/if}
  </span>
</Titulo>

<div id="phoneList">
  {#each data.phones as phone}
    <PhoneCard {...phone} />
  {/each}
</div>

<style lang="scss">
  @import '../../lib/styles.scss';

  .flex-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .icon {
    width: 30px;
    margin-top: 0.35rem;

    &.disabled {
      opacity: 40%;
    }
  }

  #phoneList {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 500px) {
    #phoneList {
      grid-template-columns: 1fr 1fr;
    }
  }
</style>
