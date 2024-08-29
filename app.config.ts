import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
    vite: {
        resolve: {
            alias: {
                '@': '/src'
            }
        }
    },
    server: {
        preset: 'netlify_edge'
    }
});
