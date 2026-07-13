import { tick } from 'svelte';

export class LocalStorage<T> {
	#key: string;
	#version = $state(0);
	#listeners = 0;
	#value: T | undefined;
	#proxies = new WeakMap();
	#raw: string | null = null;
	#parsed: any = null;

	#handler = (e: StorageEvent) => {
		if (!e) return;
		if (e.storageArea !== localStorage) return;
		if (e.key !== this.#key) return;
		this.#version += 1;
	};

	constructor(key: string, initial?: T) {
		this.#key = key;
		this.#value = initial;

		if (typeof localStorage !== 'undefined') {
			if (localStorage.getItem(key) === null) {
				localStorage.setItem(key, JSON.stringify(initial));
			}
		}
	}

	#read() {
		try {
			const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(this.#key) : null;
			if (raw === this.#raw && this.#parsed !== null) return this.#parsed;
			this.#raw = raw;
			this.#parsed = raw ? JSON.parse(raw) : this.#value;
		} catch {
			this.#parsed = this.#value;
			this.#raw = null;
		}
		return this.#parsed;
	}

	#proxy(value: unknown): unknown {
		if (typeof value !== 'object' || value === null) return value;

		let p = this.#proxies.get(value);
		if (!p) {
			p = new Proxy(value, {
				get: (target, property) => {
					this.#version;
					return this.#proxy(Reflect.get(target, property));
				},
				set: (target, property, value) => {
					this.#version += 1;
					Reflect.set(target, property, value);
					try {
						if (typeof localStorage !== 'undefined') {
							localStorage.setItem(this.#key, JSON.stringify(this.#parsed));
						}
					} catch (err) {
						console.error('Failed to persist ' + this.#key, err);
					}
					this.#raw = null;
					return true;
				}
			});
			this.#proxies.set(value, p);
		}
		return p;
	}

	get current() {
		this.#version;
		const root = this.#read();

		if ($effect.tracking()) {
			$effect(() => {
				if (this.#listeners === 0) {
					window.addEventListener('storage', this.#handler);
				}
				this.#listeners += 1;
				return () => {
					tick().then(() => {
						this.#listeners -= 1;
						if (this.#listeners === 0) {
							window.removeEventListener('storage', this.#handler);
						}
					});
				};
			});
		}

		return this.#proxy(root);
	}

	set current(value) {
		try {
			if (typeof localStorage !== 'undefined') {
				localStorage.setItem(this.#key, JSON.stringify(value));
			}
		} catch (err) {
			console.error('Failed to persist ' + this.#key, err);
		}
		this.#raw = null;
		this.#version += 1;
	}
}
