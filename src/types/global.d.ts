// * Vite
declare type Recordable<T = any> = Record<string, T>;

declare interface ViteEnv {
	NODE_ENV: string;
	VITE_API_URL: string;
	VITE_ENABLE_VCONSOLE: boolean;
	VITE_GLOB_APP_TITLE: string;
	VITE_HOST: string | boolean;
	VITE_PORT: number;
	VITE_OPEN: boolean;
	VITE_DROP_CONSOLE: boolean;
}