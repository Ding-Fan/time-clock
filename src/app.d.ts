// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	// Fullscreen API vendor-prefixed properties for Safari/WebKit support
	interface Document {
		webkitFullscreenElement?: Element;
		webkitExitFullscreen?: () => Promise<void>;
	}

	interface HTMLElement {
		webkitRequestFullscreen?: () => Promise<void>;
	}
}

export {};
