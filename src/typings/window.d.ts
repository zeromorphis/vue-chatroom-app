// * global
declare global {
	interface Window {
		ethereum: any;
	}
	interface Navigator {
		browserLanguage: string;
	}
}

export {};
