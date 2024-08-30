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
        preset: 'node-server'
    }
});
