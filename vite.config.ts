import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { version } from "./package.json";


export default defineConfig({
	plugins: [sveltekit()],
	define: {
		__SVELTE_JSONSCHEMA_FORM_VERSION__: JSON.stringify(version),
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
