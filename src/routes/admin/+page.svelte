<script>
  import PhoneForm from '$lib/PhoneForm.svelte'
  import Titulo from '$lib/Titulo.svelte'
  import Ephemeral from '$lib/Ephemeral.svelte'
  import { fly } from 'svelte/transition'
  import { enhance } from '$app/forms'

  export let data
  export let form
</script>

<svelte:head>
  <title>Administración</title>
</svelte:head>

<Titulo>
  <div id="titulo">
    <div>Administración</div>
    {#if data.loggedIn}
      <form style:padding="0" method="POST" action="?/salir" style:display="inline">
        <button>Salir</button>
      </form>
    {/if}
  </div>
</Titulo>

<!-- á, é, í, ó, ú, ñ, ü -->

{#if data.loggedIn}
  {#if form}
    <Ephemeral duration={5000}>
      {#if form.exito == true}
        <div transition:fly class="success">Mobil añadido!</div>
      {:else if form.exito == false}
        <div transition:fly class="error">Errór: Mobil necesíta marca y nombre.</div>
      {/if}
    </Ephemeral>
  {/if}
  <div id="phoneForm">
    <PhoneForm />
  </div>
{:else}
  <div id="loginForm">
    <form method="POST" use:enhance action="?/login">
      <label for="password">Contraseña:</label>
      <input type="password" id="password" name="password" required />
      <button type="submit">Entrar</button>
    </form>
  </div>
{/if}

<style lang="scss">
  @import '../../lib/styles.scss';

  .success,
  .error {
    padding: 1rem;
    font-size: 1.3rem;
    border-radius: 8px;
    font-weight: bold;
    text-align: center;
    color: white;
  }

  .success {
    background-color: rgb(24, 161, 81);
  }

  .error {
    background-color: darkred;
  }

  #phoneForm {
    max-width: 750px;
    margin: {
      left: auto;
      right: auto;
    }
  }

  #titulo {
    @include flexy(row);
    justify-content: center;
    gap: 0.5rem;

    button {
      padding: 0.3rem 0.5rem;
      background-color: $logo-crimson;
      border-radius: 10px;
      color: #ddd;
      border: none;
      outline: none;
      font-size: 1.5rem;
      font-weight: bold;
      cursor: pointer;

      &:hover {
        background: #ac3939;
      }
    }
  }

  #loginForm form {
    flex-direction: row;
  }

  @media (max-width: 900px) {
    #loginForm form {
      flex-direction: column;
    }
  }
</style>
