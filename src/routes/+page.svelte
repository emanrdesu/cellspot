<script>
  import Titulo from '$lib/Titulo.svelte'
  import InfoCard from '$lib/InfoCard.svelte'
  import PhoneCard from '$lib/PhoneCard.svelte'

  export let data
</script>

<svelte:head>
  <title>Cellspot</title>
</svelte:head>

<Titulo>Cellspot: Mobile Store</Titulo>

<!-- á, é, í, ó, ú, ñ, ü -->

<InfoCard>
  <span slot="header">Bienvenído a nuestra tienda.</span>
  <div class="punto">Cansádo con el descaro de áltos precios?</div>
  <div class="punto">Estámos para mejorárte tu vida.</div>
  <div class="punto">Vendémos todo los mobil a precios buenos directo del yuma.</div>
  <div style:font-weight="bold" class="punto">No te piérdas esta oportunidad.</div>
  <div class="punto">Chequéate los <a href="/productos">productos</a>.</div>
  <div class="punto">
    Contáctanos por <a href="https://chat.whatsapp.com/JADgz7k3GdnBVBdWstJvO6">Whatsapp</a> o
    <a href="https://t.me/tecnoiSla">Telegram</a>.
  </div>
  <div class="punto">Píde un télefono que te sirva.</div>
</InfoCard>

<div id="latest">
  {#each data.phones as phone}
    <PhoneCard {...phone} priceTween={true} />
  {/each}
</div>

<style lang="scss">
  @import '../lib/styles.scss';

  #latest {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 0.5rem;
  }

  .punto {
    font-weight: semibold;
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
  }

  @media (max-width: 800px) {
    .header {
      text-align: center;
    }
  }
</style>
