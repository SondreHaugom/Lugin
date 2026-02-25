<script>
    import '$lib/global.css';
    
    
    export let systemInstruks = ""; // Eksporter som prop for å kunne bindes
    let showConfig = false;
    let selectedConfigAgent = "";
    let showPopup = false;

    
    const saveConfig = () => {
        let agentKey = selectedConfigAgent.toLowerCase().replace(/\s+/g, '_');
        
        console.log(`Lagrer instruksjoner for ${selectedConfigAgent}: ${systemInstruks}`);
        setTimeout(() => {
            showPopup = true;
            setTimeout(() => {
                showPopup = false;
            }, 2000);
        })
    };



</script>
    
    <div class="agent_config" class:open={showConfig}>
          <button title="Juster system innstruks" class="config-toggle" on:click={() => showConfig = !showConfig}><svg id="Layer_1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1"><path d="m19.5 0h-15c-2.481 0-4.5 2.019-4.5 4.5v15c0 2.481 2.019 4.5 4.5 4.5h15c2.481 0 4.5-2.019 4.5-4.5v-15c0-2.481-2.019-4.5-4.5-4.5zm3.5 19.5c0 1.93-1.57 3.5-3.5 3.5h-15c-1.93 0-3.5-1.57-3.5-3.5v-15c0-1.93 1.57-3.5 3.5-3.5h15c1.93 0 3.5 1.57 3.5 3.5zm-6.497-14.5c-.668 0-1.297.26-1.768.731l-8.418 8.415c-.851.851-1.319 1.98-1.319 3.183v.67c0 .551.449 1 1 1h.672c1.202 0 2.332-.468 3.182-1.317l8.411-8.409c.969-.881.97-2.663.008-3.542-.472-.472-1.1-.731-1.768-.731zm-7.358 11.975c-.661.661-1.54 1.024-2.475 1.024h-.672v-.67c0-.935.364-1.814 1.026-2.476l6.312-6.31 2.122 2.121zm8.418-8.416-1.398 1.398-2.122-2.121 1.399-1.398c.564-.583 1.563-.581 2.129.008.567.519.564 1.593-.008 2.113z"/></svg></button>
        
        {#if showConfig}
        <textarea class="config-input" bind:value={systemInstruks} placeholder="Du er en hjelpsom assistent..."> </textarea>
        <button title="Lagre endringer" class="config-save" on:click={saveConfig}>Lagre</button>
        {#if showPopup}
            <div class="popup">Instruksjoner lagret!</div>
        {/if}    
    {/if}
      
    </div>

    <style>
        .agent_config {
            position: absolute;
            top: 9px;
            left: 0.5%;
            width: 280px;
            z-index: 10000;
            transition: all 0.3s ease;
        }
        
        .agent_config.open {
            background-color: var(--color-himmel-10);
            border: 1px solid var(--color-stein-50);
            border-radius: 10px;
            padding: 15px;
            width: 350px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        

        .config-input {
            width: 100%;
            max-height: 80px;        /* juster maks-høyde som du vil */
            padding: 10px 12px;
            margin: 10px 0 8px 0;
            border: 1px solid var(--color-stein-50);
            border-radius: 5px;
            font-size: 14px;
            background-color: white;
            box-sizing: border-box;
            transition: border-color 0.2s, box-shadow 0.2s;

            resize: none;            /* lås størrelsen (valgfritt) */
            overflow-y: auto;        /* scroll når høyden nås */
            overflow-x: hidden;      /* ingen horisontal scroll */
        }

        
        .config-input:focus {
            outline: none;
            border-color: var(--color-himmel-10);
            box-shadow: 0 0 0 2px rgba(126, 214, 223, 0.2);
        }
        
        .config-save {
            padding: 8px 16px;
            background-color: var(--color-gran-30);
            color: black;
            border: 1px solid var(--color-stein-50);
            border-radius: 5px;
            font-size: 14px;
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            transition: background-color 0.2s, box-shadow 0.2s;
        }
        
        .config-save:hover {
            background-color: var(--color-gran-50);
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
        }
        .config-toggle {
            background: none;
            border: none;
            padding: 6px;
            cursor: pointer;
            margin-bottom: 8px;
        }
        .config-toggle svg {
            width: 24px;
            height: 24px;
            display: block;
        }

        .popup {
            position: absolute;
            top: 2px;
            left: 1680px;
            background-color: var(--color-gran-30);
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.2);
            animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @media (min-width: 300px) and (max-width: 600px) {
            .agent_config {
                left: 5%;
                width: 90%;
            }
            .agent_config.open {
                width: 82%;
                
            }
            .popup {
                left: 50%;
                top: 20px;
                transform: translateX(-50%);
            }
        }
        @media (min-width: 601px) and (max-width: 1200px) {
            .agent_config {
                left: 5%;
                width: 90%;
            }
            .agent_config.open {
                width: 82%;
                
            }
            .popup {
                left: 50%;
                top: 20px;
                transform: translateX(-50%);
            }
        }

    </style>