<script>
import { onMount } from 'svelte';

onMount(() => {
    function showSettings() {
        const btn = document.querySelector('.settings-btn');
        btn.addEventListener('click', () => {
            const settingsContainer = document.querySelector('.settings-container');
            settingsContainer.classList.toggle('show');
        });
    }

})
</script>


<main>
    <div class="settings-container">
        <button class="settings-btn" type="button">⚙️
        </button>
    </div>

</main>


<style>
.settings-container {
    position: absolute;
    top: 90%;
    right: 70%;
}
</style>