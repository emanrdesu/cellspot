<script>
  import { error } from '@sveltejs/kit'
  import Titulo from '$lib/Titulo.svelte'
  import InfoCard from '$lib/InfoCard.svelte'
  import Carousel from '$lib/Carousel.svelte'
  import Editable from '$lib/Editable.svelte'
  import TwoStep from '$lib/TwoStep.svelte'
  import MdDeleteForever from 'svelte-icons/md/MdDeleteForever.svelte'
  import MdPlusOne from 'svelte-icons/md/MdPlusOne.svelte'
  import MdArrowUpward from 'svelte-icons/md/MdArrowUpward.svelte'

  import { setContext } from 'svelte'
  import { writable } from 'svelte/store'
  import { goto } from '$app/navigation'
  import { urlEncode } from '$lib/foobar'


  export let data
  const phone = data.phone

  if (!phone) throw error(404)

  let carousel;

  function getImageURL(path) {
    return `/photo/${phone.id}/${path}`
  }

  const modalShow = writable()
  $modalShow = true
  setContext('modalShow', modalShow)


  async function deleteImage() {
    if(carousel.getImageCount() > 1) {
      await fetch(carousel.getCurrentImage(), { method: "DELETE" })
      location.reload();
    }
    else {
      alert("No se puede borrar la ultima foto.")
    }
  }


  function requester(method) {
    return (transform) => {
      return ({ detail }) => {
        const data = typeof transform == 'function' ? transform(detail) : transform

        return fetch(`/producto/${phone.id}` + urlEncode(data.url), {
          method: method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data.body || '')
        }).then((res) => {
          if (res.ok) location.reload()
        })
      }
    }
  }

  const poster = requester('POST')
  const deleter = requester('DELETE')

  function save(property) {
    const actions = {
      name: poster((data) => ({
          body: {
            brand: data.new.Marca,
            name: data.new.Nombre
          }
        })),

      condition: poster((data) => ({
          body: { condition: data.new.Condición }
        })),

      price: poster((data) => ({
          url: {
            target: 'price',
            amount: data.old.Cantidad,
            unit: data.old.Moneda
          },

          body: {
            amount: +data.new.Cantidad,
            unit: data.new.Moneda
          }
        })),

      spec: poster((data) => ({
          url: {
            target: 'spec',
            name: data.old.Propiedad,
            value: data.old.Valor
          },

          body: {
            name: data.new.Propiedad,
            value: data.new.Valor
          }
        })),

      description: poster((data) => ({ body: { description: data.new.Descripción }}))
    }

    return actions[property]
  }

  function borrar(property) {
    const actions = {
      description: poster({ body: { description: '' } }),

      price: deleter((data) => ({
          body: {
            target: 'price',
            amount: data.old.Cantidad,
            unit: data.old.Moneda
          }
      })),

      spec: deleter((data) => ({
          body: {
            target: 'spec',
            name: data.old.Propiedad,
            value: data.old.Valor
          }
        })),

      phone: deleter(() => ({ body: { target: 'phone' } }))
    }

    return actions[property]
  }


  async function saveImage({ detail }) {
    const input = detail.input.Seleccionar
    if (input.files.length == 0) return;

    const file = input.files[0]
    const ext = file.name.split('.').splice(-1)

    const photoURL = `/photo/${phone.id}/${data.randomUUID}.${ext}`

    await fetch(photoURL, {
      method: "POST",
      headers: { 'Content-Type': file.type },
      body: new Uint8Array(await file.arrayBuffer())
    })

    location.reload()
  }

  let message = ["BORRAR", "SEGURO", "ASERLO"]
  async function deletePhone() {
    if(message.length > 1) {
      message.shift(), message = message
    }
    else {
      await borrar('phone')({ detail: {} })
      goto('/productos')
    }
  }
</script>

<svelte:head>
  <title>{phone.brand} {phone.name}</title>
</svelte:head>

<Titulo>
  <div id="titulo">
    <div id="name">
      <Editable
        title="Nombre"
        disabled={!data.loggedIn}
        edit={{
          Marca: { text: phone.brand },
          Nombre: { text: phone.name }
        }}
        on:save={save('name')}
        icon="right"
      >
        {phone.brand}
        {phone.name}
      </Editable>
    </div>

    {#if data.loggedIn }
      <button
       class="deletePhone"
       on:click={deletePhone}>
       {message[0]}
      </button>
    {/if}

    <div id="prices">
      <span style:margin-right="0.5rem">
        <Editable
          disabled={!data.loggedIn}
          on:save={save('condition')}
          edit={{
            Condición: {
              radio: {
                value: phone.condition.toUpperCase(),
                options: ['NUEVO', 'USADO', 'TRASTE']
              }
            }
          }}
        >
          {phone.condition}
        </Editable>
      </span>
      {#each phone.prices as price}
        <Editable
          title="Precio"
          removable={true}
          disabled={!data.loggedIn}
          on:save={save('price')}
          on:delete={borrar('price')}
          edit={{
            Cantidad: { number: price.amount },
            Moneda: {
              radio: {
                value: price.unit,
                options: ['MLC', 'USD', 'EUR', 'MN']
              }
            }
          }}
        >
          <span class="price">
            {price.amount}
            {price.unit}
          </span>
        </Editable>
      {/each}
      {#if data.loggedIn}
        <button
          on:click|once={() => {
            if (phone.prices.length < 3) {
              phone.prices = [...phone.prices, { amount: 0, unit: 'MLC' }]
            }
          }}
          class="add-price">+</button
        >
      {/if}
    </div>
  </div>
</Titulo>

<div id="container">
  <div id="carousel">
    <Carousel bind:this={carousel} images={phone.images.map(getImageURL)} />
    {#if data.loggedIn }
      <br>
      <div>
        <TwoStep two={deleteImage}>
          <MdDeleteForever slot="one"/>
          <MdArrowUpward slot="two"/>
        </TwoStep>

        <Editable
          icon='none'
          on:save={saveImage}
          edit={{ Seleccionar: { image: true } }}
        >
        <div class="icon">
          <MdPlusOne />
        </div>

        </Editable>

      </div>
    {/if}
  </div>

  {#if phone.description || data.loggedIn}
    <InfoCard headerAlign="center">
      <span slot="header">
        <Editable
          disabled={!data.loggedIn}
          removable={true}
          on:save={save('description')}
          on:delete={borrar('description')}
          edit={{ Descripción: { textarea: phone.description || 'Sample' } }}>
          Descripción
        </Editable>
      </span>
      {phone.description}
    </InfoCard>
  {/if}

  {#if phone.specs.length > 0 || data.loggedIn}
    <InfoCard headerAlign="center">
      <span slot="header">Fícha Técnica</span>
      {#each phone.specs as spec}
        <div>
          <Editable
            title="Spec"
            disabled={!data.loggedIn}
            removable={true}
            on:save={save('spec')}
            on:delete={borrar('spec')}
            edit={{
              Propiedad: { text: spec.name },
              Valor: { text: spec.value || '' }
            }}
          >
            <span style:text-shadow="1px 1px 1px black">{spec.name}</span>
            {#if spec.value}: {spec.value} {/if}
          </Editable>
        </div>
      {/each}
      {#if data.loggedIn}
        <button
          class="add-property"
          on:click|once={() => {
            phone.specs = [...phone.specs, { name: 'Propiedad', value: 'Valor' }]
          }}>+</button
        >
      {/if}
    </InfoCard>
  {/if}
</div>

<style lang="scss">
  @import '../../../lib/styles.scss';

  #titulo {
    @include flexy(row);
    justify-content: space-between;
    flex-wrap: wrap;

    #name {
      white-space: nowrap;
    }

    button {
      font-size: 1.2rem;
    }

    #prices {
      @include flexy(row);
      gap: 0.5rem;
      font-size: 1rem;
      font-weight: bold;
    }
  }

  .add-property,
  .add-price {
    margin-top: 1rem;
    font-size: 1.3rem;
    border-radius: 8px;
    border: none;
    outline: none;
    cursor: pointer;
    &:focus {
      background-color: #ddd;
    }
  }

  .add-price {
    margin: 0;
    background-color: $foreground;
    padding: {
      left: 0.5rem;
      right: 0.5rem;
    }
  }

  button.deletePhone {
    font-size: 1.3rem;
    font-weight: bold;
    background-color: $logo-crimson;
    padding: 0.2rem 0.5rem;
    color: #ddd;
    border: none;
    outline: none;
    border-radius: 8px;
    cursor: pointer;

    &:focus {
      color: #fff;
    }
  }

  .price {
    white-space: nowrap;
    background-color: $logo-crimson;
    padding: 0.2rem;
    border-radius: 8px;
  }

  #container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;

    #carousel {
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 100%;
      width: 100%;
      min-height: 350px;
      border-radius: 8px;
      grid-row: span 2;

      div {
        display: flex;
        gap: 1rem;

        .icon {
          width: 30px;
          background-color: $background-darker;
          padding: 0.25rem;
          border-radius: 8px;

          &:hover {
            background-color: $background-lighter;
          }

        }
      }
    }
  }

  img {
    border-radius: 10px;
    width: 50%;
  }

  @media (max-width: 750px) {
    #container {
      grid-template-columns: 1fr;

      #carousel {
        height: 50vh;
      }
    }
  }
</style>
