
import { createSignal, Show, mergeProps, createContext, createMemo, Index, createUniqueId } from 'solid-js';
import { produce, createStore } from "solid-js/store"
import { useNavigate } from '@solidjs/router';
import { normalizeProps, useMachine } from "@zag-js/solid"
import { Menu } from '@ark-ui/solid'
import toast from 'solid-toast';
import * as fileUpload from "@zag-js/file-upload"
import axios, { type CancelTokenSource } from 'axios'


const [drawerStatus, setDrawerStatus] = createSignal(false)
const [fileList, setFileList] = createStore<PlainObjectType[]>([]);
let drawerRef: HTMLDivElement | ((el: HTMLDivElement) => void) | undefined;

export default function Upload() {
    const navigate = useNavigate()
    const [cancelTokenArray, setCancelTokenArray] = createSignal<CancelTokenSource[]>([], { equals: false })
    const [state, send] = useMachine(
        fileUpload.machine({
            accept: "image/*",
            id: createUniqueId(),
            maxFiles: Infinity,
            directory: true,
        }),
    )

    const api = createMemo(() => fileUpload.connect(state, send, normalizeProps))
    const tableList = createMemo(() => [...api().acceptedFiles].reverse())


    const openDrawer = () => {
        requestAnimationFrame(() => {
            setDrawerStatus(true)
        })
    }
    const onUpload = async () => {
        const state = JSON.parse(localStorage.getItem("solid-data-store")!)
        if (!state?.cookie || !state?.rkm) {
            navigate('/');
            toast.error('请配置相关参数.')
            return
        }
        setFileList(tableList().map(file => ({
            file: file,
            statusText: '待上传',
            status: 0,
            progress: 0
        })))
        api().clearFiles()
        openDrawer()
        for (const [index, fileItem] of fileList.entries()) {
            if (fileItem.status !== 0) continue;
            const formData = new FormData();
            formData.append('image', fileItem.file);
            formData.append('with_image_url', 'yes');
            formData.append('rkm', state?.rkm);
            formData.append('ck', state?.cookie);
            const cancelToken = axios.CancelToken.source();
            cancelTokenArray()[index] = cancelToken;
            setCancelTokenArray(cancelTokenArray())
            setFileList(
                produce((s) => {
                    s[index].status = 1
                    s[index].statusText = '上传中'
                })
            )
            try {
                // const 
                const { data } = await axios.post('/api/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    onUploadProgress: (progressEvent) => {
                        if (progressEvent.total) {
                            const percentCompleted = Math.round(
                                (progressEvent.loaded * 100) / progressEvent.total
                            );
                            setFileList(
                                produce((s) => {
                                    s[index].progress = percentCompleted + '%'
                                })
                            )
                        }

                    },
                    cancelToken: cancelToken.token
                });
                if (data.image_url) {
                    setFileList(
                        produce((s) => {
                            s[index].status = 3
                            s[index].statusText = '上传成功'
                            s[index].image_url = data.image_url
                        })
                    )
                    return
                }
                throw new Error("未知错误");
            } catch (error) {
                if (axios.isCancel(error)) {
                    setFileList(
                        produce((s) => {
                            s[index].status = 2
                            s[index].statusText = '已停止'
                        })
                    )
                } else {
                    setFileList(
                        produce((s) => {
                            s[index].status = 4
                            s[index].statusText = '上传失败'
                        })
                    )
                }
            }
        }
    }

    const onClear = () => {
        api().clearFiles()
    }
    return (
        <div class='lg:ps-64 py-7 bg-white h-full'>
            <div class="px-7">
                <div class="max-w-[850px] h-72 mx-auto py-4 px-6 border border-[#e9e8e6] rounded-lg"  {...api().getRootProps()}>
                    <div class="flex gap-3 flex-col items-center justify-center h-full bg-gray-50 rounded-md border border-[#e9e8e6] text-gray-500 cursor-pointer hover:bg-gray-100 transition-colors" data-scope="file-upload-dropzone" {...api().getDropzoneProps()}>
                        <span class="text-center text-gray-600 font-medium text-sm">将文件拖放到此处</span>
                        <button class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none" {...api().getTriggerProps()}>打开对话框</button>
                    </div>
                    <input {...api().getHiddenInputProps()} multiple />
                    {/* <ul {...api().getItemGroupProps()}>
                        <Index each={api().acceptedFiles}>
                            {(file) => (
                                <li {...api().getItemProps({ file: file() })}>
                                    <div {...api().getItemNameProps({ file: file() })}>
                                        {file().name}
                                    </div>
                                    <button {...api().getItemDeleteTriggerProps({ file: file() })}>
                                        Delete
                                    </button>
                                </li>
                            )}
                        </Index>
                    </ul> */}
                </div>
            </div>

            <div class="px-7 max-w-[850px] m-auto box-content my-7">
                {/* <button type="button" class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-teal-100 text-teal-800 hover:bg-teal-200 focus:outline-none focus:bg-teal-200 disabled:opacity-50 disabled:pointer-events-none dark:text-teal-500 dark:bg-teal-800/30 dark:hover:bg-teal-800/20 dark:focus:bg-teal-800/20" onClick={() => api().openFilePicker()}>
                    扫描文件
                </button> */}
                <button type="button" class="ml-2 py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200 focus:outline-none focus:bg-blue-200 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-400 dark:bg-blue-800/30 dark:hover:bg-blue-800/20 dark:focus:bg-blue-800/20" onClick={() => api().openFilePicker()}>
                扫描文件
                </button>
                <button type="button" class="ml-2 py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-200 focus:outline-none focus:bg-yellow-200 disabled:opacity-50 disabled:pointer-events-none dark:text-yellow-500 dark:bg-yellow-800/30 dark:hover:bg-yellow-800/20 dark:focus:bg-yellow-800/20" onClick={openDrawer}>
                    控制台
                </button>
            </div>

            <div class="px-7 max-w-[850px] m-auto box-content">
                <div class="flex flex-col m-auto bg-white border shadow-sm rounded-xl dark:bg-neutral-800 dark:border-neutral-700 mt-7">
                    <div class="p-4 md:p-5 space-y-7">

                        <Index each={tableList()}>
                            {(file) => (
                                <div >
                                    <div class="mb-2 flex justify-between items-center">
                                        <div class="flex items-center gap-x-24 overflow-hidden pr-3">
                                            <div class="flex items-center gap-x-3 overflow-hidden">
                                                <span class="flex-shrink-0 size-8 flex justify-center items-center border border-gray-200 text-gray-500 rounded-lg dark:border-neutral-700 dark:text-neutral-500">
                                                    <svg class="shrink-0 size-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                                        <polyline points="17 8 12 3 7 8"></polyline>
                                                        <line x1="12" x2="12" y1="3" y2="15"></line>
                                                    </svg>
                                                </span>
                                                <div class="min-w-0  w-72">
                                                    <p title={file().name} class="text-sm font-medium text-gray-800 dark:text-white truncate whitespace-nowrap overflow-hidden text-ellipsis">{file().name}</p>
                                                    <p class="text-xs text-gray-500 dark:text-neutral-500">{formatFileSize(file().size)}</p>
                                                </div>
                                            </div>
                                            <div class="md:block hidden">
                                                <p class="text-xs text-gray-500 dark:text-neutral-500 whitespace-nowrap">{file().type}</p>
                                            </div>
                                            <div class="sm:block hidden">
                                                <p class="text-sm font-medium text-[#99f6e4] dark:text-white whitespace-nowrap">已扫描待上传</p>
                                            </div>
                                        </div>

                                        <div class="inline-flex items-center gap-x-2">
                                            {/* <span class="relative">
                                           <svg class="shrink-0 size-4 text-teal-500" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                               <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"></path>
                                           </svg>
                                           <span class="sr-only">Success</span>
                                       </span> */}
                                            <button  {...api().getItemDeleteTriggerProps({ file: file() })} type="button" class="relative text-gray-500 hover:text-gray-800 focus:outline-none focus:text-gray-800 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-500 dark:hover:text-neutral-200 dark:focus:text-neutral-200">
                                                <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                    <path d="M3 6h18"></path>
                                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                                    <line x1="10" x2="10" y1="11" y2="17"></line>
                                                    <line x1="14" x2="14" y1="11" y2="17"></line>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Index>
                    </div>

                    <div class="bg-gray-50 border-t border-gray-200 rounded-b-xl py-2 px-4 md:px-5 dark:bg-white/10 dark:border-neutral-700">
                        <div class="flex flex-wrap justify-between items-center gap-x-3">
                            <div>
                                <span class="text-sm font-semibold text-gray-800 dark:text-white">
                                    {/* 2 success, 1 failed */}
                                    {tableList().length} 剩余
                                </span>
                            </div>

                            <div class="-me-2.5 flex gap-2">
                                <button onClick={onUpload} type="button" class="py-2 px-3 inline-flex items-center gap-x-1.5 text-sm font-medium rounded-lg border border-transparent hover:bg-gray-200 focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800">
                                    <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                    </svg>
                                    开始
                                </button>
                                <button onClick={onClear} type="button" class="py-2 px-3 inline-flex items-center gap-x-1.5 text-sm font-medium rounded-lg border border-transparent  hover:bg-gray-200 hover:text-gray-800 focus:outline-none focus:bg-gray-200 focus:text-gray-800 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white dark:focus:bg-neutral-800 dark:focus:text-white">
                                    <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M3 6h18"></path>
                                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                        <line x1="10" x2="10" y1="11" y2="17"></line>
                                        <line x1="14" x2="14" y1="11" y2="17"></line>
                                    </svg>
                                    清除
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Drawer></Drawer>
        </div>
    )
}

function Drawer() {
    let closeDrawerRef: HTMLElement;
    // 0待上传1上传中2已停止3上传成功4上传失败
    const fileToAllList = createMemo(() => fileList, { equals: false });
    const fileToBeUploadedList = createMemo(() => fileList.filter(file => file.status === 0));
    const fileToPendingList = createMemo(() => fileList.filter(file => file.status === 1));
    const fileToStopList = createMemo(() => fileList.filter(file => file.status === 2));
    const fileSuccessList = createMemo(() => fileList.filter(file => file.status === 3));
    const fileToFailList = createMemo(() => fileList.filter(file => file.status === 4));
    const [selectId, setSelectId] = createSignal('0')
    const onClick = (e: Event) => {
        const target = e.target as HTMLInputElement
        const id = target.dataset?.id ?? target.value
        id && setSelectId(id)
    }
    const clearRecords = () => {
        setFileList([])
        closeDrawerRef.click()
    }

    return (
        <Show when={drawerStatus()}>
            <div onClick={() => setDrawerStatus(false)} class='hs-overlay-backdrop transition duration fixed inset-0 bg-gray-900 bg-opacity-50 dark:bg-opacity-80 dark:bg-neutral-900 z-[999]'>
                <div onClick={(e) => e.stopPropagation()} ref={drawerRef} class="hs-overlay hs-overlay-open:translate-x-0 translate-x-full fixed top-0 end-0 transition-all duration-300 transform h-full max-w-2xl w-full z-[80] bg-white border-s dark:bg-neutral-800 dark:border-neutral-700 [--body-scroll:true] open opened">
                    <div class="flex justify-between items-center py-3 px-4 border-b dark:border-neutral-700">
                        <button onClick={() => setDrawerStatus(false)} type="button" class="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-neutral-400 dark:focus:bg-neutral-600" aria-label="Close" data-hs-overlay="#hs-offcanvas-right" ref={el => closeDrawerRef = el}>
                            <span class="sr-only">Close</span>
                            <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M18 6 6 18"></path>
                                <path d="m6 6 12 12"></path>
                            </svg>
                        </button>
                        <h3 id="hs-offcanvas-right-label" class="font-bold text-gray-800 dark:text-white">
                            任务列表
                        </h3>
                    </div>
                    <div class="p-4">
                        <select id="tab-select" class="sm:hidden py-3 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400" aria-label="Tabs" onChange={(e) => onClick(e)}>
                            <option value="0" >全部({fileToAllList().length})</option>
                            <option value="1" >待上传({fileToBeUploadedList().length})</option>
                            <option value="2" >上传中({fileToPendingList().length})</option>
                            <option value="3" >已停止({fileToStopList().length})</option>
                            <option value="4" >上传成功({fileSuccessList().length})</option>
                            <option value="5" >上传失败({fileToFailList().length})</option>
                        </select>
                        <div class="hidden sm:block border-b border-gray-200 dark:border-neutral-700">
                            <nav class="flex gap-x-2" aria-label="Tabs" role="tablist" data-hs-tab-select="#tab-select" onClick={((e) => onClick(e))}>
                                <button type="button" class={`hs-tab-active:bg-white hs-tab-active:border-b-transparent  dark:hs-tab-active:bg-neutral-800 dark:hs-tab-active:border-b-gray-800 dark:hs-tab-active:text-white -mb-px py-3 px-4 inline-flex items-center gap-x-2 bg-gray-50 text-sm font-medium text-center border text-gray-500 rounded-t-lg hover:text-gray-700 focus:outline-none focus:text-gray-700 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:border-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 dark:focus:text-neutral-200 text-clip ${selectId() === '0' ? '!text-blue-600 active' : ''}`} id="hs-tab-to-select-item-1" aria-selected="true" data-hs-tab="#hs-tab-to-select-1" aria-controls="hs-tab-to-select-1" role="tab" data-id="0">
                                    全部({fileToAllList().length})
                                </button>
                                <button type="button" class={`hs-tab-active:bg-white hs-tab-active:border-b-transparent  dark:hs-tab-active:bg-neutral-800 dark:hs-tab-active:border-b-gray-800 dark:hs-tab-active:text-white -mb-px py-3 px-4 inline-flex items-center gap-x-2 bg-gray-50 text-sm font-medium text-center border text-gray-500 rounded-t-lg hover:text-gray-700 focus:outline-none focus:text-gray-700 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:border-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 dark:focus:text-neutral-200 ${selectId() === '1' ? '!text-blue-600 active' : ''}`} id="hs-tab-to-select-item-2" aria-selected="false" data-hs-tab="#hs-tab-to-select-2" aria-controls="hs-tab-to-select-2" role="tab" data-id="1">
                                    待上传({fileToBeUploadedList().length})
                                </button>
                                <button type="button" class={`hs-tab-active:bg-white hs-tab-active:border-b-transparent  dark:hs-tab-active:bg-neutral-800 dark:hs-tab-active:border-b-gray-800 dark:hs-tab-active:text-white -mb-px py-3 px-4 inline-flex items-center gap-x-2 bg-gray-50 text-sm font-medium text-center border text-gray-500 rounded-t-lg hover:text-gray-700 focus:outline-none focus:text-gray-700 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:border-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 dark:focus:text-neutral-200 ${selectId() === '2' ? '!text-blue-600 active' : ''}`} id="hs-tab-to-select-item-3" aria-selected="false" data-hs-tab="#hs-tab-to-select-3" aria-controls="hs-tab-to-select-3" role="tab" data-id="2">
                                    上传中({fileToPendingList().length})
                                </button>
                                <button type="button" class={`hs-tab-active:bg-white hs-tab-active:border-b-transparent  dark:hs-tab-active:bg-neutral-800 dark:hs-tab-active:border-b-gray-800 dark:hs-tab-active:text-white -mb-px py-3 px-4 inline-flex items-center gap-x-2 bg-gray-50 text-sm font-medium text-center border text-gray-500 rounded-t-lg hover:text-gray-700 focus:outline-none focus:text-gray-700 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:border-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 dark:focus:text-neutral-200 ${selectId() === '3' ? '!text-blue-600 active' : ''}`} id="hs-tab-to-select-item-4" aria-selected="false" data-hs-tab="#hs-tab-to-select-4" aria-controls="hs-tab-to-select-4" role="tab" data-id="3">
                                    已停止({fileToStopList().length})
                                </button>
                                <button type="button" class={`hs-tab-active:bg-white hs-tab-active:border-b-transparent  dark:hs-tab-active:bg-neutral-800 dark:hs-tab-active:border-b-gray-800 dark:hs-tab-active:text-white -mb-px py-3 px-4 inline-flex items-center gap-x-2 bg-gray-50 text-sm font-medium text-center border text-gray-500 rounded-t-lg hover:text-gray-700 focus:outline-none focus:text-gray-700 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:border-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 dark:focus:text-neutral-200 ${selectId() === '4' ? '!text-blue-600 active' : ''}`} id="hs-tab-to-select-item-5" aria-selected="false" data-hs-tab="#hs-tab-to-select-5" aria-controls="hs-tab-to-select-5" role="tab" data-id="4">
                                    上传成功({fileSuccessList().length})
                                </button>
                                <button type="button" class={`hs-tab-active:bg-white hs-tab-active:border-b-transparent  dark:hs-tab-active:bg-neutral-800 dark:hs-tab-active:border-b-gray-800 dark:hs-tab-active:text-white -mb-px py-3 px-4 inline-flex items-center gap-x-2 bg-gray-50 text-sm font-medium text-center border text-gray-500 rounded-t-lg hover:text-gray-700 focus:outline-none focus:text-gray-700 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:border-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 dark:focus:text-neutral-200 ${selectId() === '5' ? '!text-blue-600 active' : ''}`} id="hs-tab-to-select-item-6" aria-selected="false" data-hs-tab="#hs-tab-to-select-6" aria-controls="hs-tab-to-select-6" role="tab" data-id="5">
                                    上传失败({fileToFailList().length})
                                </button>
                            </nav>
                        </div>

                        <div class='my-3 flex gap-2'>
                            <Show when={['0', '3', '4', '5', '6'].includes(selectId())}>
                                <button type="button" class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-yellow-500 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700" onClick={clearRecords}>
                                    清除全部记录
                                </button>
                            </Show>
                            {/* 
                        <Show when={['0', '1', '2'].includes(selectId())}>
                            <button type="button" class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-red-500 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700">
                                停止全部上传
                            </button>
                        </Show> */}
                        </div>
                        <div>
                            <div id="hs-tab-to-select-1" role="tabpanel" aria-labelledby="hs-tab-to-select-item-1">
                                <div class="p-3 sm:p-0">
                                    <TableInDrawer tableList={fileToAllList()}></TableInDrawer>
                                </div>
                            </div>
                            <div id="hs-tab-to-select-2" class="hidden" role="tabpanel" aria-labelledby="hs-tab-to-select-item-2">
                                <div class="p-3 sm:p-0">
                                    <TableInDrawer tableList={fileToBeUploadedList()}></TableInDrawer>
                                </div>
                            </div>
                            <div id="hs-tab-to-select-3" class="hidden" role="tabpanel" aria-labelledby="hs-tab-to-select-item-3">
                                <div class="p-3 sm:p-0">
                                    <TableInDrawer tableList={fileToPendingList()}></TableInDrawer>
                                </div>
                            </div>
                            <div id="hs-tab-to-select-4" class="hidden" role="tabpanel" aria-labelledby="hs-tab-to-select-item-4">
                                <div class="p-3 sm:p-0">
                                    <TableInDrawer tableList={fileToStopList()}></TableInDrawer>
                                </div>
                            </div>
                            <div id="hs-tab-to-select-5" class="hidden" role="tabpanel" aria-labelledby="hs-tab-to-select-item-5">
                                <div class="p-3 sm:p-0">
                                    <TableInDrawer tableList={fileSuccessList()}></TableInDrawer>
                                </div>
                            </div>
                            <div id="hs-tab-to-select-6" class="hidden" role="tabpanel" aria-labelledby="hs-tab-to-select-item-6">
                                <div class="p-3 sm:p-0">
                                    <TableInDrawer tableList={fileToFailList()}></TableInDrawer>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Show >
    )
}


function TableInDrawer(props: PlainObjectType) {
    const merged = mergeProps({ tableList: [] }, props);
    return (
        <>
            <div class="flex flex-col">
                <div class="-m-1.5">
                    <div class="p-1.5 min-w-full inline-block align-middle">
                        <div class="border rounded-lg shadow overflow-hidden dark:border-neutral-700 dark:shadow-gray-900">
                            <table class="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                                <thead class="bg-gray-50 dark:bg-neutral-700">
                                    <tr>
                                        <th scope="col" class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400">文件</th>
                                        <th scope="col" class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400">状态</th>
                                        <th scope="col" class="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase dark:text-neutral-400">操作</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-gray-200 dark:divide-neutral-700">
                                    <Index each={merged.tableList}>
                                        {(fileItem) => (
                                            <tr class="hover:bg-gray-100 dark:hover:bg-neutral-700">
                                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200 truncate max-w-[120px] sm:max-w-[160px] md:max-w-xs">
                                                    {fileItem().file.name}
                                                </td>
                                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                                                    <Show when={fileItem().status === 1} fallback={fileItem().statusText}>
                                                        {fileItem().progress}
                                                    </Show>
                                                </td>
                                                <td class="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                                                    <Dropdown fileItem={fileItem()}></Dropdown>
                                                </td>
                                            </tr>
                                        )}
                                    </Index>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}



function Dropdown(props: PlainObjectType) {
    const merged = mergeProps({ fileItem: {} }, props);
    const onSelect = (value: string, details: PlainObjectType) => {
        const { file, image_url } = details;
        const enums: Record<string, string> = {
            'URL': image_url,
            'BBCode': `[img]${image_url}[/img]`,
            'Markdown': `![${file.name}](${image_url})`,
        }
        const copyInput = document.createElement("textarea");
        copyInput.style.opacity = '0';
        copyInput.style.position = "absolute";
        copyInput.style.zIndex = "-999999";
        copyInput.style.left = "-999999px";
        copyInput.style.top = "-999999px";
        copyInput.value = enums[value]
        document.body.appendChild(copyInput);
        copyInput.select();
        document.execCommand("copy");
        copyInput.remove();
        toast.success("复制成功")
    }
    return (
        <Menu.Root onSelect={({ value }) => onSelect(value, merged.fileItem)}>
            <Menu.Trigger>
                <Menu.Indicator>
                    <div class="flex justify-center items-center size-9 text-sm font-semibold rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800">
                        <svg class="flex-none size-4 text-gray-600 dark:text-neutral-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" /></svg>
                    </div>
                </Menu.Indicator>

            </Menu.Trigger>
            <Menu.Positioner class='hs-dropdown-menu z-60 transition-[opacity,margin] duration hs-dropdown-open:opacity-100 min-w-60 bg-white shadow-md rounded-lg p-1 space-y-0.5 mt-2 dark:bg-neutral-800 dark:border dark:border-neutral-700'>
                <Menu.Content>
                    <Menu.Item value="URL" class='flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700 cursor-pointer'>URL</Menu.Item>
                    <Menu.Item value="Markdown" class='flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700 cursor-pointer'>Markdown</Menu.Item>
                    <Menu.Item value="BBCode" class='flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700 cursor-pointer'>BBCode</Menu.Item>
                </Menu.Content>
            </Menu.Positioner>
        </Menu.Root>
    )
}


function formatFileSize(bytes: number) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const size = (bytes / Math.pow(k, i)).toFixed(2); // 保留两位小数
    return `${size} ${sizes[i]}`;
}
