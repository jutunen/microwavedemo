<script>

  import { oven } from './stores.js';
  import { onInterval } from './utils.js';
  export let power_plugged;
  export let idle_mode;
  export let heating_enabled;
  export let display_generic_notification;
  export let notification_msg;

  let date_string = formatTime();

  onInterval(() => { date_string = formatTime(); }, 5000);

  // seconds to minutes and seconds
  function secsToMinsAndSecs(secs) {
    return(secs-(secs%=60))/60+(9<secs?':':':0')+secs;
  }

  function pad(n) {
    n = n + '';
    return n.length >= 2 ? n : new Array(2 - n.length + 1).join('0') + n;
  }

  function formatTime() {
    let d = new Date();
    let date_s = d.getDate() + '.' + (d.getMonth() + 1) + '.' + d.getFullYear() + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
    return date_s;
  }

</script>

<div id="display">
{#if power_plugged}
  {#if display_generic_notification}
    <div class="adjusting">
      {notification_msg}
    </div>
  {:else if heating_enabled}
    <div class="heating">
      lämmitetään
    </div>
    {#if $oven.adjust_time}
      <div class="adjusting">
        &nbsp;&nbsp;&nbsp;Teho: {$oven.power}%<br>
        =>&nbsp;Aika: {secsToMinsAndSecs($oven.time)}
      </div>
    {:else}
      <div class="adjusting">
        =>&nbsp;Teho: {$oven.power}%<br>
        &nbsp;&nbsp;&nbsp;Aika: {secsToMinsAndSecs($oven.time)}
      </div>
    {/if}
  {:else}
    {#if idle_mode}
      <div class="adjusting">
        {date_string}
      </div>
    {:else if $oven.adjust_time}
      <div class="adjusting">
        &nbsp;&nbsp;&nbsp;Teho: {$oven.power}%<br>
        =>&nbsp;Aika: {secsToMinsAndSecs($oven.time)}
      </div>
    {:else}
      <div class="adjusting">
        =>&nbsp;Teho: {$oven.power}%<br>
        &nbsp;&nbsp;&nbsp;Aika: {secsToMinsAndSecs($oven.time)}
      </div>
    {/if}
  {/if}
{/if}
</div>

<style>
  #display {
    width: 250px;
    height: 100px;
    background-color: black;
    color: lightgreen;
    font-family: 'Courier New', monospace;
    position: relative;
  }
  .adjusting {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 22px;
  }
  .heating {
    position: absolute;
  }
</style>
