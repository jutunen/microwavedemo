import { writable } from 'svelte/store';

function createOven() {
    const { subscribe, set, update } = writable({ time: 60, power: 50, adjust_time: true});
	
    return {
        subscribe,
        t_increment: () => update(n => {return {...n, time:n.time >= 3600 ? 3600 : (n.time >= 60 ? n.time + 10 : n.time + 5)}; }),
        t_decrement: () => update(n => {return {...n, time:n.time <= 5 ? 5 : (n.time <= 60 ? n.time - 5 : n.time - 10)}; }),
        t_dec_1: () => update(n => {return {...n, time:n.time <= 0 ? 0 : n.time-1}; }),
        p_increment: () => update(n => {return {...n, power: n.power >= 100 ? 100 : n.power+10}; }),
        p_decrement: () => update(n => {return {...n, power: n.power <= 10 ? 10 : n.power-10}; }),
        switch_adjustment: () => update(n => {return {...n, adjust_time: !n.adjust_time}; }),
        reset: () => set({ time: 60, power: 50, adjust_time: true})
    };
}

export const oven = createOven();
