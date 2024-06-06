const env = import.meta?.env ?? {};
export default (env.version = __SVELTE_JSONSCHEMA_FORM_VERSION__ ) as string;
