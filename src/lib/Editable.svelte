<script>
  import Radio from '$lib/Radio.svelte'
  import FaPenFancy from 'svelte-icons/fa/FaPenFancy.svelte'
  import MdSave from 'svelte-icons/md/MdSave.svelte'
  import MdCancel from 'svelte-icons/md/MdCancel.svelte'
  import MdDeleteForever from 'svelte-icons/md/MdDeleteForever.svelte'

  import { createEventDispatcher } from 'svelte'
  import { getContext } from 'svelte'

  export let icon = 'left'
  export let title = ''
  export let edit
  export let disabled = false
  export let removable = false

  const copy = {}
  const input = {}

  let modal = false
  const modalShow = getContext('modalShow')
  const dispatch = createEventDispatcher()

  let eventDisabled = false

  function toggleModal() {
    if ($modalShow) {
      $modalShow = !(modal = true)
    } else if (modal) {
      $modalShow = !(modal = false)
    }
  }

  function keys(object) {
    let result = []

    for (const key in object) {
      result.push(key)
    }

    return result
  }

  function emit(event) {
    return () => {
      if (eventDisabled) return
      eventDisabled = true
      const old = {}
      const query = 'input, textarea'

      for (const key in copy) {
        input[key] = copy[key].querySelector(query)
        copy[key] = copy[key].querySelector(query).value
        old[key] = edit[key]?.text || edit[key]?.textarea || edit[key]?.number || edit[key]?.radio?.value
        old[key] = old[key] || ''
      }

      dispatch(event, {
        old: old,
        new: { ...copy },
        input: input,
      })

      eventDisabled = false
      toggleModal()
    }
  }
</script>

<span class="editable" on:click={toggleModal}>
  {#if icon == 'left' && !disabled}
    <div class:clicked={modal} class="icon" on:mousedown|preventDefault><FaPenFancy /></div>
  {/if}
  <slot />
  {#if icon == 'right' && !disabled}
    <div class:clicked={modal} class="icon" on:mousedown|preventDefault><FaPenFancy /></div>
  {/if}
</span>

{#if modal && !disabled}
  <div class="modal">
    <div class="header">
      <span style:margin-left="auto">Editar {title}</span>
      <div style:margin-left="auto" on:click={toggleModal} class="icon cancel"><MdCancel /></div>
    </div>
    <div class="content">
      {#each keys(edit) as key}
        <span>
          <span class="key">
            {key}
          </span>
          <span bind:this={copy[key]} class="value">
            {#if edit[key]?.text != null}
              <input value={edit[key].text} />
            {/if}
            {#if edit[key]?.number != null}
              <input type="number" value={edit[key].number} />
            {/if}
            {#if edit[key]?.textarea}
              <textarea value={edit[key].textarea} />
            {/if}
            {#if edit[key]?.image}
              <input class="file" type="file" accept="image/*" />
            {/if}
            {#if edit[key]?.radio}
              <Radio
                name="foo"
                direction="row"
                options={edit[key].radio.options}
                prechosen={edit[key].radio.value}
              />
            {/if}
          </span>
        </span>
      {/each}
    </div>
    <div class="footer">
      {#if removable}
        <span on:click={emit('delete')} class="action">
          <div class="delete icon">
            <MdDeleteForever />
          </div>
          Borrar
        </span>
      {/if}

      <span class:disabled={eventDisabled} on:click={emit('save')} class="action">
        <div class="save icon"><MdSave /></div>
        Guardar
      </span>
    </div>
  </div>
{/if}

<style lang="scss">
  @import './styles.scss';
  .editable {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .icon {
    width: 20px;
    cursor: pointer;

    &.clicked,
    &:hover {
      color: pink;
    }
  }

  .modal {
    font-size: 1rem;
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: stretch;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0px 0px 2em black;
    border-radius: 10px;
    width: 35ch;
  }

  .header {
    position: relative;
    text-align: center;
    font-size: 1.2rem;
    padding: 0.75rem;
    font-weight: bold;
    background-color: rgb(116, 38, 51);

    .icon {
      position: absolute;
      top: 15%;
      right: 1%;
    }
  }

  .content {
    @include flexy(column);
    padding: 1rem;
    font-size: 1.2rem;
    gap: 0.5rem;
    background-color: rgba(0, 0, 0, 0.6);
    align-items: stretch;

    > span {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    input,
    textarea {
      border: none;
      border-radius: 8px;
      outline: none;
      font-size: 1.1rem;
      padding: 0.25rem;
      background-color: $foreground;
      margin-right: auto;
    }

    input {
      text-align: center;
      width: min-content;
    }

    input.file {
      margin: 0 auto;
      color: black;
    }

    textarea {
      width: 25ch;
      height: 20ch;
    }
  }

  .footer {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    background-color: rgba(0, 0, 0, 0.6);
  }

  .header .icon {
    width: 30px;
  }

  .action .icon {
    width: 30px;
    border-radius: 8px;

    &.delete {
      color: $logo-pink;
    }

    &.save {
      color: $link;
    }
  }

  .action {
    display: flex;
    align-items: center;
    cursor: pointer;
    font-weight: bold;
    color: $foreground;

    &.disabled {
      cursor: not-allowed;
    }

    &:hover {
      color: white;
    }
  }

  @media (max-width: 750px) {
    .modal {
      position: fixed;
    }
  }
</style>
