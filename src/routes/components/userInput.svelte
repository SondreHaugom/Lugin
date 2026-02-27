<script>
     import '$lib/global.css';

</script>


<div class="input-container">
    <textarea class="user_input" name="" id="" placeholder="Skriv meldingen din her..."></textarea> 
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
        /* Enkel glassstil */
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    
    border: 1px solid rgba(255, 255, 255, 0.15);
    
    color: white;
    font-size: 16px;
    
    /* Enkel skygge */
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
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
        /* Enkel glassstil */
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    
    border: 1px solid rgba(255, 255, 255, 0.15);
    
    color: white;
    font-size: 16px;
    
    /* Enkel skygge */
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    transition: box-shadow 0.3s;
    height: 20px;


    resize: none;            /* lås størrelsen (valgfritt) */
    overflow-y: auto;        /* scroll når høyden nås */
    overflow-x: hidden;      /* ingen horisontal scroll */
}
.user_input::placeholder {
    color: white;
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
        /* Enkel glassstil */
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    
    border: 1px solid rgba(255, 255, 255, 0.15);
    
    color: white;
    font-size: 16px;
    
    /* Enkel skygge */
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    transition: background-color 0.3s;
}
    .sendBtn:hover {
        background-color: #6b6b6b;
}

@media (min-width: 300px) and (max-width: 600px) {
    .input-container {
        left: 5%;
        height: 40px;
        width: 90%;
        max-width: 90%;
        border-radius: 8px;
    }

    .user_input {
        width: 85%;
        height: 13px;
        font-size: 14px;
        border-radius: 8px;
    }
    .sendBtn {
        width: 35px;
        height: 35px;
    }
}



</style>