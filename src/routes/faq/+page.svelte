<script>
    import Titulo from '$lib/Titulo.svelte'
    import InfoCard from '$lib/InfoCard.svelte';
    import Editable from '$lib/Editable.svelte'
    import { writable } from 'svelte/store'
    import { setContext } from 'svelte'
    import MdAdd from 'svelte-icons/md/MdAdd.svelte'
    import MdPlusOne from 'svelte-icons/md/MdPlusOne.svelte'
    export let data;

    const modalShow = writable(true)
    setContext('modalShow', modalShow)


    function addQA() {
        data.faq.push({
            id: '',
            question: "Pregunta",
            answer: "Respuesta"
        })

        data.faq = data.faq
    }

    function saveQA(id) {
        return async ({detail}) => {
            await fetch(`/faq?id=${id}`, {
                method: "POST",
                body: JSON.stringify({
                    question: detail.new.Pregunta,
                    answer: detail.new.Respuesta
                })
            })

            location.reload()
        }
    }

    function deleteQA(id) {
        return async ({detail}) => {
            await fetch(`faq?id=${id}`, {
                method: "DELETE",
            })

            location.reload()
        }
    }
</script>

<svelte:head>
    <title>Preguntas y Respuestas</title>
</svelte:head>

<Titulo>
    <span>
        <div>Preguntas y Respuestas</div>
        {#if data.loggedIn}
            <button on:click|once={addQA} class="icon">
                +
            </button>
        {/if}
    </span>
</Titulo>

{#each data.faq.slice().sort((a,b) => a.id - b.id) as {id, question, answer}}
    <InfoCard>
        <Editable
            slot="header"
            title="QA"
            disabled={!data.loggedIn}
            removable={true}
            icon="right"
            on:save={saveQA(id)}
            on:delete={deleteQA(id)}
            edit={{
                Pregunta: { text: question },
                Respuesta: { textarea: answer }
            }}>
            {question}
        </Editable>

        {@html answer}
    </InfoCard>
{/each}

<style lang="scss">
    @import './../../lib/styles.scss';

    span {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .icon {
        margin-top: 0.2rem;
        font-size: 1.7rem;
        padding: 0 0.5rem;
        background-color: $logo-crimson;
        border-radius: 8px;
        color: #ddd;
        border: none;
        outline: none;

        &:hover {
            color: $logo-pink;
            cursor: pointer;
        }
    }
</style>
