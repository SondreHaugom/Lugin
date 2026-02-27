<script>
    import '$lib/global.css'; 
    import {env} from '$env/dynamic/public';
    import { browser } from '$app/environment';
    import { onMount } from 'svelte';

    let passord = ''; // Dette skal være brukerinput, ikke miljøvariabel!
    let brukernavn = ''; // Dette skal være brukerinput, ikke miljøvariabel!
    
    // Mottar callback-funksjon fra parent-komponenten
    let { onLogin } = $props();

    // Sjekk localStorage når komponenten lastes (bare i nettleseren)
    onMount(() => {
        const savedLoginStatus = localStorage.getItem('isLoggedIn');
        if (savedLoginStatus === 'true') {
            // Bruker er allerede innlogget - kall onLogin direkte
            if (onLogin) {
                onLogin();
            }
        }
    });

    function handleSubmit(event) {
        event.preventDefault();
        
        if (passord === env.PUBLIC_ADMIN_PASSORD && brukernavn === env.PUBLIC_ADMIN_BRUKERNAVN) {
            console.log("Innlogging vellykket");
            
            // Lagre innloggingsstatus i localStorage
            if (browser) {
                localStorage.setItem('isLoggedIn', 'true');
            }
            
            // Kaller callback-funksjonen for å informere parent om vellykket innlogging
            if (onLogin) {
                onLogin();
            }
        } else {
            console.log("Feil brukernavn eller passord");
            alert("Feil brukernavn eller passord!");
        }
    }


</script>
<div>
    <div class="innlogin_container">
        <h2>Innlogging</h2>
        <form onsubmit={handleSubmit}>
            <label for="username">Brukernavn:</label>
            <input type="text" id="username" name="username" bind:value={brukernavn} required>

            <label for="password">Passord:</label>
            <input type="password" id="password" name="password" bind:value={passord} required>

            <button type="submit">Logg inn</button>
        </form>
    </div>
</div>
<style>
    .innlogin_container {
        max-width: 400px;
        margin-top: 60px;
        margin-left: auto;
        margin-right: auto;
        display: block;
        padding: 20px;
        border: 1px solid #ccc;
        border-radius: 5px;
                /* Enkel glassstil */
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    
    border: 1px solid rgba(255, 255, 255, 0.15);
    
    color: white;
    font-size: 16px;
    
    /* Enkel skygge */
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        position: relative;
        z-index: 10001;
        color: white;
    }


    .innlogin_container h2 {
        text-align: center;
        margin-bottom: 20px;
    }

    .innlogin_container label {
        display: block;
        margin-bottom: 5px;
    }

    .innlogin_container input {
        width: 95%;
        padding: 8px;
        margin-bottom: 15px;
        border: 1px solid #ccc;
        border-radius: 4px;
        
    }

    .innlogin_container button {
        width: 100%;
        padding: 10px;
        /* Enkel glassstil */
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
    
        color: white;
        font-size: 16px;
    
        /* Enkel skygge */
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s, border-color 0.3s;
    }

    .innlogin_container button:hover {
        background: rgba(255, 255, 255, 0.15);
    }
    
 
</style>