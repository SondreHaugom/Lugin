<script>
     import '$lib/global.css';

</script>


<div class="input-container">
    <input type="text" class="user_input" placeholder="Skriv meldingen din her...">
    <button class="sendBtn" title="Send melding" type="button">↑</button>
</div>

<style>
    .input-container {
    position: absolute;
    top:92%;
    left: 27%;
    border-style: solid;
    border-width: 1px;
    border-color: var(--color-stein-50);
    border-radius: 20px;
    background-color: var(--color-himmel-10);
    width: 50%;
    max-width: 50%;
    height: 50px;
    z-index: 9999;
    display: flex;
    align-items: center;
}

.user_input {
    width: 92%;
    margin-left: 5px;
    outline: none;
    border-style: solid;
    border-color: var(--color-stein-50);
    border-width: 1px;
    border-radius: 13px;
    padding: 10px;
    font-size: 16px;
    cursor: text;
    pointer-events: auto;
    z-index: 10000;
    position: relative;
    background-color: white;
    transition: box-shadow 0.3s;
}
.user_input:hover {
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);

}
.sendBtn {
    width: 40px;
    height: 40px;
    border-radius: 100%;
    border-style: solid;
    border-color: var(--color-stein-50);
    border-width: 1px;
    margin-left: 8px;
    margin-right: 8px;
    background-color: var(--color-gran-30);
    transition: background-color 0.3s;
}
    .sendBtn:hover {
        background-color: var(--color-gran-50);
}

</style>