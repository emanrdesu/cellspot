
<script>
    export let one = () => {};
    export let two;

    let changed = false;
    let done = false;

    function onClick() {
        if(!done) {
            if(changed) {
                two();
                done = true;
            }
            else {
                changed = true;
                one()
            }
        }
    }
</script>

<div on:click={onClick} class="icon">
    {#if changed}
        <slot name="two"></slot>
    {:else}
        <slot name="one"></slot>
    {/if}
</div>

<style lang="scss">
    @import './styles.scss';
    div {
        width: 30px;
        background-color: $background-darker;
        padding: 0.25rem;
        border-radius: 8px;

        &:hover {
            background-color: $background-lighter;
        }
    }
</style>
