<script>

  import { Howl, Howler } from 'howler';
  import { oven } from './stores.js';
  import Display from './display.svelte';

  let power_plugged = true;
  let display_idle_mode = true;
  let display_timer_id;
  let heater_timer_id;

  let generic_notification_timer_id;
  let display_generic_notification = false;
  let notification_msg = "";

  let longPressTimerIds = [];
  let longPressIntervalIds = [];
  let longPressThreshold = 300; // milliseconds
  let extraLongPressThreshold = 3000; // milliseconds
  let longPressInterval = 100; // milliseconds
  let extraLongPressInterval = 20; // milliseconds
  let heating_enabled = false;
  let hatch_open = false;

  let bing_sound = new Howl({
    src: ['bing.wav']
  });

  let hum_sound = new Howl({
    src: ['hum.wav'],
    loop: true
  });

  let beep_sound = new Howl({
    src: ['beep.wav']
  });

  function play_beep_sound() {
    if(power_plugged) {
      beep_sound.play();
    }
  }

  function powerOnSequence() {
    stopHeating();
    oven.reset();
    display_idle_mode = true;
  }

  function stopHeating() {
    hum_sound.stop();
    setDisplayIdleModeCounter();
    heating_enabled = false;
    clearInterval(heater_timer_id);
  }

  function hatchHandler() {
    if(hatch_open && heating_enabled) {
      stopHeating();
    }
  }

  function heatingTimerHandler() {
    if($oven.time !== 0) {
      oven.t_dec_1();
    } else {
      bing_sound.play();
      displayNotification("Bing!", 3000);
      stopHeating();
    }
  }

  function startStopHandler() {
    if(!power_plugged) { return }
    play_beep_sound();
    if(hatch_open) {
      displayNotification("Sulje luukku!", 3000);
      return;
    }

    if(heating_enabled === false) {
      heating_enabled = true;
      heater_timer_id = setInterval(heatingTimerHandler, 1000);
      hum_sound.play();
    } else {
      stopHeating();
    }
  }

  function setDisplayIdleModeCounter() {
    clearTimeout(display_timer_id);
    display_idle_mode = false;
    display_timer_id = setTimeout(function(){ display_idle_mode = true }, 10000);
  }

  function displayNotification(msg, duration) {
    clearTimeout(generic_notification_timer_id);
    display_generic_notification = true;
    notification_msg = msg;
    generic_notification_timer_id = setTimeout(function(){ display_generic_notification = false }, duration);
  }

  function mouseDownDecrementHandler() {
    play_beep_sound();
    clearTimeout(display_timer_id);
    display_idle_mode = false;
    display_generic_notification = false;
    longPressTimerIds.push(setTimeout(startLongPressDecrementAction, longPressThreshold));
    longPressTimerIds.push(setTimeout(startExtraLongPressDecrementAction, extraLongPressThreshold));
  }

  function touchDownDecrementHandler(event) {
    event.preventDefault();
    $oven.adjust_time ? oven.t_decrement() : oven.p_decrement();
    mouseDownDecrementHandler();
  }

  function mouseDownIncrementHandler() {
    play_beep_sound();
    clearTimeout(display_timer_id);
    display_idle_mode = false;
    display_generic_notification = false;
    longPressTimerIds.push(setTimeout(startLongPressIncrementAction, longPressThreshold));
    longPressTimerIds.push(setTimeout(startExtraLongPressIncrementAction, extraLongPressThreshold));
  }

  function touchDownIncrementHandler(event) {
    event.preventDefault();
    $oven.adjust_time ? oven.t_increment() : oven.p_increment();
    mouseDownIncrementHandler();
  }

  function mouseUpEventHandler () {
    longPressTimerIds.forEach(clearTimeout)
    longPressTimerIds = []
    longPressIntervalIds.forEach(clearInterval)
    longPressIntervalIds = []
    setDisplayIdleModeCounter();
  }

  function startLongPressDecrementAction () {
    longPressIntervalIds.push(setInterval($oven.adjust_time ? oven.t_decrement : oven.p_decrement, longPressInterval));
  }

  function startLongPressIncrementAction () {
    longPressIntervalIds.push(setInterval($oven.adjust_time ? oven.t_increment : oven.p_increment, longPressInterval));
  }

  function startExtraLongPressDecrementAction () {
    longPressIntervalIds.push(setInterval($oven.adjust_time ? oven.t_decrement : oven.p_decrement, extraLongPressInterval));
  }

  function startExtraLongPressIncrementAction () {
    longPressIntervalIds.push(setInterval($oven.adjust_time ? oven.t_increment : oven.p_increment, extraLongPressInterval));
  }

</script>

<main>
<div id="ui_container">
  <div id="label">
    Jussin proto
  </div>
  <div id="display_container">
    <Display
      power_plugged={power_plugged}
      idle_mode={display_idle_mode}
      heating_enabled={heating_enabled}
      display_generic_notification={display_generic_notification}
      notification_msg={notification_msg}
    />
  </div>
  <div id="buttons_container">
    <div
      class="button"
      id="time_power"
      on:click={oven.switch_adjustment}
      on:click={setDisplayIdleModeCounter}
      on:click={() => display_generic_notification = false}
      on:click={() => play_beep_sound()}
    >
        aika<br>teho
    </div>
    <div
      class="button"
      id="minus"
      on:click={$oven.adjust_time ? oven.t_decrement : oven.p_decrement}
      on:click={setDisplayIdleModeCounter}
      on:mousedown={mouseDownDecrementHandler}
      on:mouseup={mouseUpEventHandler}
      on:touchstart={e => touchDownDecrementHandler(e)}
      on:touchend={mouseUpEventHandler}
      on:touchcancel={mouseUpEventHandler}
    >
        -
    </div>
    <div
      class="button"
      id="plus"
      on:click={$oven.adjust_time ? oven.t_increment : oven.p_increment}
      on:click={setDisplayIdleModeCounter}
      on:mousedown={mouseDownIncrementHandler}
      on:mouseup={mouseUpEventHandler}
      on:touchstart={e => touchDownIncrementHandler(e)}
      on:touchend={mouseUpEventHandler}
      on:touchcancel={mouseUpEventHandler}
    >
        +
    </div>
    <div
      class="{heating_enabled ? 'heating_button' : 'button'}"
      id="start_stop"
      on:click={startStopHandler}
    >
      start<br>stop
    </div>
  </div>
</div>

<div id="switches_container">
  <div class="control_container">
    <label>
    <input
      type="checkbox"
      bind:checked={power_plugged}
      on:change={powerOnSequence}
    >
      Virta on kytketty
    </label>
  </div>
    Luukku on:
  <div class="control_container">
    <input
      type="radio"
      id="hatch_open"
      bind:group={hatch_open}
      value={true}
      on:change={hatchHandler}
    >
    <label for="hatch_open">Auki</label>
  </div>
  <div class="control_container">
    <input
      type="radio"
      id="hatch_closed"
      bind:group={hatch_open}
      value={false}
      on:change={hatchHandler}
    >
    <label for="hatch_closed">Kiinni</label>
  </div>
</div>
</main>
