import { onMount } from "solid-js";
import { createStore } from "solid-js/store";
import toast from 'solid-toast';
export default function Home() {
    const [state, setState] = createStore({
        rkm: "",
        ck: ""
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
        toast.success("配置成功")
    }
    return (
        <>
            <div class="lg:ps-64 flex flex-1 justify-center items-center h-full">
                <div class="p-4 sm:p-6 space-y-4 sm:space-y-6 w-full">
                    <form onSubmit={handleSubmit}>
                        <div class="space-y-5 justify-center items-center flex flex-col" data-hs-toggle-password-group="">
                            <input type="text" name="username" autocomplete="username" style="display:none;" aria-hidden="true" />
                            <div class="max-w-sm w-full">
                                <label for="rkm" class="block text-sm mb-2 dark:text-white">RKM参数</label>
                                <div class="relative">
                                    <input id="rkm" autocomplete="rkm" aria-autocomplete="none" type="text" required class="focus:shadow-[inset_0_0_0_1px_#2563eb,_0_0_#000] leading-4 focus:outline-none  py-3 ps-4 pe-10 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600 border border-transparent" placeholder="RKM参数" value={state.rkm} onInput={e => setState('rkm', e.target.value)} />
                                </div>
                            </div>

                            <div class="max-w-sm mb-5 w-full">
                                <label for="ck" class="block text-sm mb-2 dark:text-white">CK参数</label>
                                <div class="relative">
                                    <input id="ck" autocomplete="ck" aria-autocomplete="none" type="text" required class="focus:shadow-[inset_0_0_0_1px_#2563eb,_0_0_#000] leading-4 focus:outline-none  py-3 ps-4 pe-10 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600 border border-transparent" placeholder="CK参数" value={state.ck} onInput={e => setState('ck', e.target.value)} />
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
