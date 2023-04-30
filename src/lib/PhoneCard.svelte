<script>
  import { titleCase } from '$lib/foobar'
  import { tweened } from 'svelte/motion'
  import { cubicOut } from 'svelte/easing'

  import FaRegEye from 'svelte-icons/fa/FaRegEye.svelte'

  export let id
  export let name
  export let brand
  export let views
  export let condition
  export let images
  export let prices
  export let specs
  export let createdAt
  export let updatedAt
  export let description

  export let priceTween = false

  let price = {
    amount: tweened(priceTween ? 0 : prices[0].amount, {
      duration: randomDuration(),
      easing: cubicOut
    }),

    unit: prices[0].unit
  }

  if (priceTween) {
    price.amount.set(prices[0].amount)
  }

  const amount = price.amount

  function randomDuration() {
    return 500 + Math.floor(Math.random() * 1500)
  }
</script>

<a href="/producto/{id}">
  <div class="phone-card">
    <img alt={name} src="/photo/{id}/{images[0]}" />
    <div class="informacion">
      <div data-name={name} class="nombre">
        {name}
      </div>
      <div>{brand}</div>
      <div style:font-weight="bold" class="condition">{titleCase(condition)}</div>
      <div>{$amount.toFixed()} {price.unit}</div>
      <div style:display="flex"
           style:align-items="center"
           style:gap="1ch">
        <div style:width="25px" class="icon">
          <FaRegEye />
        </div>
        {views}
      </div>
    </div>
  </div>
</a>

<style lang="scss">
  @import 'styles.scss';

  a {
    color: $foreground;
  }

  .phone-card {
    @include flexy(row);
    justify-content: space-between;
    align-items: flex-start;
    gap: 0.5rem;
    background-color: $background-darker;
    border-radius: 10px;
    padding: 1rem;
    transition-duration: 300ms;
    height: 87%;

    &:hover {
      background-color: $logo-crimson;
      cursor: pointer;
    }

    img {
      border-radius: 10px;
      width: 50%;
    }

    .informacion {
      @include flexy(column);
      align-items: center;
      gap: 1ch;
      flex: 1;

      .nombre {
        background-color: $logo-crimson;
        font-size: 1.2rem;
        text-align: center;
        padding: 0.5rem;
        border-radius: 8px;
      }
    }
  }

  @media (max-width: 750px) {
    .informacion {
      width: 100%;
      padding: 0.25rem;
    }

    a {
      flex: 1;

      .phone-card {
        flex-direction: column-reverse;
        align-items: center;

        img {
          width: 100%;
        }
      }
    }
  }
</style>
