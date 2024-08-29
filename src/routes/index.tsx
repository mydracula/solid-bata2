import { onMount } from "solid-js";
import { createStore } from "solid-js/store";
export default function Home() {
    const [state, setState] = createStore({
        rkm: "",
        cookie: ""
    })
    onMount(() => {
        const savedData = localStorage.getItem("solid-data-store");
        if (savedData) {
            setState(JSON.parse(savedData));
        }
    })
    const handleSubmit = (e: Event) => {
        e.preventDefault()
        localStorage.setItem("solid-data-store", JSON.stringify(state));
    }
    return (
        <>
            <div class="lg:ps-64 flex flex-1 justify-center items-center h-full">
                <div class="p-4 sm:p-6 space-y-4 sm:space-y-6 w-full">
                    <form onSubmit={handleSubmit}>
                        <div class="space-y-5 justify-center items-center flex flex-col" data-hs-toggle-password-group="">
                            <input type="text" name="username" autocomplete="username" style="display:none;" aria-hidden="true" />
                            <div class="max-w-sm w-full">
                                <label for="hs-toggle-password-multi-toggle-np" class="block text-sm mb-2 dark:text-white">RKM参数</label>
                                <div class="relative">
                                    <input autocomplete="RKM" id="hs-toggle-password-multi-toggle-np" type="password" class="py-3 ps-4 pe-10 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" placeholder="RKM参数" value={state.rkm} onInput={e => setState('rkm', e.target.value)} />
                                    <button type="button" data-hs-toggle-password='{
              "target": ["#hs-toggle-password-multi-toggle-np"]
            }' class="absolute inset-y-0 end-0 flex items-center z-20 px-3 cursor-pointer text-gray-400 rounded-e-md focus:outline-none focus:text-blue-600 dark:text-neutral-600 dark:focus:text-blue-500">
                                        <svg class="shrink-0 size-3.5" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path class="hs-password-active:hidden" d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                                            <path class="hs-password-active:hidden" d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                                            <path class="hs-password-active:hidden" d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                                            <line class="hs-password-active:hidden" x1="2" x2="22" y1="2" y2="22"></line>
                                            <path class="hidden hs-password-active:block" d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                                            <circle class="hidden hs-password-active:block" cx="12" cy="12" r="3"></circle>
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div class="max-w-sm mb-5 w-full">
                                <label for="hs-toggle-password-multi-toggle" class="block text-sm mb-2 dark:text-white">Cookie参数</label>
                                <div class="relative">
                                    <input autocomplete="Cookie" id="hs-toggle-password-multi-toggle" type="password" class="py-3 ps-4 pe-10 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" placeholder="Cookie参数" value={state.cookie} onInput={e => setState('cookie', e.target.value)} />
                                    <button type="button" data-hs-toggle-password='{
              "target": ["#hs-toggle-password-multi-toggle"]
            }' class="absolute inset-y-0 end-0 flex items-center z-20 px-3 cursor-pointer text-gray-400 rounded-e-md focus:outline-none focus:text-blue-600 dark:text-neutral-600 dark:focus:text-blue-500">
                                        <svg class="shrink-0 size-3.5" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path class="hs-password-active:hidden" d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                                            <path class="hs-password-active:hidden" d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                                            <path class="hs-password-active:hidden" d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                                            <line class="hs-password-active:hidden" x1="2" x2="22" y1="2" y2="22"></line>
                                            <path class="hidden hs-password-active:block" d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                                            <circle class="hidden hs-password-active:block" cx="12" cy="12" r="3"></circle>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div>
                                <button type="submit" class="w-28 py-2 px-3 inline-flex  justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
                                    一键配置
                                </button>
                            </div>
                        </div >
                    </form>
                </div>
            </div>
        </>
    );
}
