<script>
  import Radio from '$lib/Radio.svelte'
  import GoX from 'svelte-icons/go/GoX.svelte'
  import InfoCard from '$lib/InfoCard.svelte'
  import { slide } from 'svelte/transition'
  import ContentOpen from './ContentOpen.svelte'
  import { enhance } from '$app/forms'

  const infoCardOptions = {
    headerAlign: 'center',
    headerSize: '1rem',
    headerPadding: '0.5rem',
    padding: '0.5rem',
    gap: '0.5rem',
    background: 'darkslategray',
    headerBackground: '#ac3939',
    contentBackground: 'rgb(60, 100, 100)'
  }

  const miniCardOptions = {
    borderRadius: ['10px', '8px', '8px'],
    contentPadding: '0.5rem',
    padding: '0.5rem',
    gap: '0.2rem'
  }

  let specInputIDs = []
  let specInputNextID = 0

  let form
  let input

  let innerWidth

  $: radioDirection = (innerWidth || 1e6) > 500 ? "column" : "row"

  function addSpecInput() {
    specInputIDs = [...specInputIDs, specInputNextID++]
  }

  function removeSpecInput(id) {
    specInputIDs = specInputIDs.filter((x) => x != id)
  }
</script>

<svelte:window bind:innerWidth />

<div transition:slide|local class="phone-form">
  <form bind:this={form} method="POST" use:enhance action="?/add">
    <div>
      <InfoCard {...infoCardOptions} {...miniCardOptions} contentPadding="0" gap="0.5rem">
        <span slot="header">Marca + Nombre</span>
        <input style:text-align="center" type="text" name="brand+name" required />
      </InfoCard>
    </div>

    <InfoCard {...infoCardOptions} contentPadding="0.25rem">
      <span slot="header"> Condición | Precios </span>
      <div class="condition-prices">
        <Radio
          bind:direction={radioDirection}
          name="condition"
          options={['Nuevo', 'Usado', 'Traste']}
          valueTransform={(x) => x.toUpperCase()}
        />

        <div class="prices">
          {#each new Array(3) as _, id}
            <div class="price">
              {#if id == 0}
                <input style:text-align="right" required type="number" name="price-{id}" />
              {:else}
                <input style:text-align="right" type="number" name="price-{id}" />
              {/if}

              <select name="price-{id}-unit">
                <option value="MLC">MLC</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="MN">MN</option>
              </select>
            </div>
          {/each}
        </div>
      </div>
    </InfoCard>

    <InfoCard {...infoCardOptions}>
      <span slot="header" class="html-header">
        <span>Fícha Técnica</span>
        <button class="plus" on:click|preventDefault={addSpecInput}> + </button>
      </span>
      <div class="specs">
        {#each specInputIDs as id (id)}
          <div in:slide|local={{ duration: 300 }} class="spec">
            <input style:text-align="right" name="spec-{id}-key" type="text" />
            :
            <input name="spec-{id}-value" type="text" />

            <button
              tabindex="-1"
              style:margin-left="auto"
              style:width="30px"
              on:click|preventDefault={() => {
                removeSpecInput(id)
              }}><GoX /></button
            >
          </div>
        {/each}
      </div>
    </InfoCard>

    <input type="hidden" name="spec-count" value={specInputIDs.length} />

    <InfoCard {...infoCardOptions}>
      <span slot="header">Photos</span>
      <div class="file-picker">
        <input bind:this={input} name="photos" required type="file" accept="image/jpg" multiple />
      </div>
    </InfoCard>

    <ContentOpen
      backgroundColor="#ac3939"
      fontSize="1.2rem"
      openText="Añadir Descripción"
      closeText="Borrar Descripción"
    >
      <InfoCard {...infoCardOptions} noHeader="true" padding="0" contentPadding="0.5rem">
        <textarea value="" name="description" />
      </InfoCard>
    </ContentOpen>

    <button type="submit" class="add-cell">Añadir Mobil</button>
  </form>
</div>

<style lang="scss">
  @import './styles.scss';

  .add-cell {
    padding: 0.5rem;
    background-color: $logo-crimson;
    border-radius: 10px;
    color: $white;
    border: none;
    outline: none;
    font-size: 1.5rem;
    font-weight: bold;
    cursor: pointer;
    width: 100%;

    &:hover {
      background: #ac3939;
    }
  }

  .plus {
    width: 30px;
    font-size: 1.6rem;
    padding: 0;

    &:hover {
      background-color: pink;
    }
  }

  .condition-prices,
  .file-picker {
    @include flexy(row);
    justify-content: center;
    gap: 0.5rem;
  }

  .file-picker input {
    color: black;
    width: 100%;
  }

  .html-header {
    @include flexy(row, 0.5rem);
  }

  form {
    flex-direction: column;
    align-items: stretch;
    justify-self: flex-end;
  }

  .prices {
    @include flexy(column, 0.7rem);
  }

  .price {
    @include flexy(row, 0.25rem);

    input {
      width: 80%;
    }

    select {
      padding: 0.4rem;
      border-radius: 8px;
    }

    button {
      height: 30px;
      padding: 0.25rem;
    }
  }

  .specs {
    @include flexy(column, 1rem);

    .spec {
      @include flexy(row, 0.25rem);

      input {
        width: 50%;
      }

      button {
        padding: 0.25rem;
        margin-bottom: 0.05rem;
      }
    }

    button {
      height: 30px;
      padding: 0.25rem;

      &:hover {
        background-color: pink;
      }
    }
  }

  @media (max-width: 500px) {
    .condition-prices {
      flex-direction: column;
    }
  }
</style>
