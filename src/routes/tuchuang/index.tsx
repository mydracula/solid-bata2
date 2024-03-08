// @ts-nocheck
import { createSignal, createMemo, onMount } from 'solid-js';
import { Select, Tabs } from "@kobalte/core";
// import FilePondPluginImageEditor from '@pqina/filepond-plugin-image-editor';
// import FilePondPluginFilePoster from 'filepond-plugin-file-poster';
// import 'filepond-plugin-file-poster/dist/filepond-plugin-file-poster.css';


export default function Tuchuang() {
    const option = ["Telegraph", "Github"]
    const [value, setValue] = createSignal("Telegraph");
    const index = createMemo(() => option.findIndex((item) => item === value()));
    const [selectedTab, setSelectedTab] = createSignal("URL");
    const [result, setResult] = createSignal([]);
    let upload;
    const copy = (event) => {
        const val = event.target.innerText
        const copyInput = document.createElement("input");
        copyInput.style.display = 'none'
        copyInput.setAttribute("value", val);
        document.body.appendChild(copyInput);
        copyInput.select();
        document.execCommand("copy");
        copyInput.remove();
    }

    onMount(async () => {
        // const { openDefaultEditor, createDefaultI'mageReader, createDefaultImageWriter, processImage, getEditorDefaults } = window.pintura
        // window.FilePond.registerPlugin(
        //   FilePondPluginImageEditor,
        //   FilePondPluginFilePoster
        // )

        const pond = window.FilePond.create();

        pond.setOptions({
            server: {
                process: (fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
                    const formData = new FormData();
                    formData.append(fieldName, file);
                    formData.append('index', index());
                    if (index() == 1) {
                        formData.append('repo', 'mydracula/image');
                        formData.append('fileName', file.name);
                    }
                    const request = new XMLHttpRequest();
                    request.open('POST', '/api/upload');
                    request.upload.onprogress = (e) => {
                        progress(e.lengthComputable, e.loaded, e.total);
                    };
                    request.onload = function () {
                        if (request.status >= 200 && request.status < 300) {
                            load(request.responseText);
                        } else {
                            error('oh no');
                        }
                    };
                    request.send(formData);
                    return {
                        abort: () => {
                            request.abort();
                            abort();
                        },
                    };
                },
                revert: null
            },
            name: 'file',
            maxFiles: 10,
            allowDrop: true,
            allowPaste: true,
            allowMultiple: true,
            // allowReorder: true,
            // allowImageEdit: false,
            // filePosterMaxHeight: 46,
            // allowProcess: true,
            // imageEditor: {
            //   createEditor: openDefaultEditor,
            //   imageReader: [createDefaultImageReader],
            //   imageWriter: [
            //     createDefaultImageWriter,
            //     () =>
            //       createDefaultMediaWriter(
            //         // Generic Media Writer options, passed to image and video writer
            //         [
            //           // For handling images
            //           createDefaultImageWriter(),

            //           // For handling videos
            //           createDefaultVideoWriter({
            //             // Video writer instructions here
            //             // ...

            //             // Encoder to use
            //             encoder: createMediaStreamEncoder({
            //               imageStateToCanvas,
            //             }),
            //           }),
            //         ]
            //       ),
            //   ],

            //   imageProcessor: processImage,
            //   editorOptions: {
            //     ...getEditorDefaults(),
            //     // imageCropAspectRatio: null,
            //   },

            //   /* uncomment if you've used FilePond with version 6 of Pintura and are loading old file metadata
            //   // map legacy data objects to new imageState objects
            //   legacyDataToImageState: legacyDataToImageState,
            //   */
            // },

            // stylePanelAspectRatio: 0.1
            // labelIdle: 'Drag & Drop your files or <span class="font-medium">Browse</span>',
            // stylePanelLayout: 'compact circle',
            // styleLoadIndicatorPosition: 'center bottom',
            // styleProgressIndicatorPosition: 'center bottom',
            // styleButtonRemoveItemPosition: 'center bottom',
            // styleButtonProcessItemPosition: 'center bottom',
            // styleButtonDisabled: 'opacity-50 pointer-events-none',
        })
        pond.on('processfile', (error, file) => {
            if (error === null) {
                const { serverId } = file
                const body = JSON.parse(serverId)
                setResult((prev) => [body, ...prev])
            }
        });
        pond.appendTo(upload);
    });
    return (
        <div class="pt-10 container mx-auto px-5 sm:px-10 md:px-10 lg:px-10 xl:px-10 2xl:px-60 box-border">
            <div ref={upload} class="upload"></div>
            <div class="flex gap-[10px] items-center mb-[16px]">
                <span class="font-bold text-[16px] selct-none text-[#18181b]">选择接口</span>
                <Select.Root
                    defaultValue={value()}
                    value={value()}
                    onChange={setValue}
                    options={option}
                    disallowEmptySelection={true}
                    modal={false}
                    placeholder="Select a fruit…"
                    itemComponent={props => (

                        <Select.Item item={props.item} class="select__item">
                            <Select.ItemLabel>{props.item.rawValue}</Select.ItemLabel>
                            <Select.ItemIndicator class="select__item-indicator">
                                {/* <CheckIcon /> */}
                                {/* {JSON.stringify(props)} */}
                            </Select.ItemIndicator>
                        </Select.Item>
                    )}
                >
                    <Select.Trigger class="select__trigger" aria-label="Fruit">
                        <Select.Value class="select__value">
                            {state => state.selectedOption()}
                        </Select.Value>
                        <Select.Icon class="select__icon">
                            {/* <CaretSortIcon /> */}
                        </Select.Icon>
                    </Select.Trigger>
                    <Select.Portal>
                        <Select.Content class="select__content">
                            <Select.Listbox class="select__listbox" />
                        </Select.Content>
                    </Select.Portal>
                </Select.Root>
            </div>
            <Show
                when={result().length > 0}
                fallback={<></>}
            >
                <Tabs.Root aria-label="Main navigation" class="tabs" defaultValue={selectedTab()} value={selectedTab()} onChange={setSelectedTab}>
                    <Tabs.List class="tabs__list overflow-x-auto  [&::-webkit-scrollbar]:hidden">
                        <For each={["URL", "BBCode", "HTML", "Markdown", "Markdown with link"]}>{(tab) =>
                            <Tabs.Trigger class="hover:bg-gray-100 whitespace-nowrap flex px-8 py-2 border-indigo-500" value={tab}>{tab}</Tabs.Trigger>
                        }</For>
                        <Tabs.Indicator class="absolute transition-[all 250ms] bg-[#0284c5] data-[orientation='horizontal']:bottom--0px data-[orientation='horizontal']:h-2px" />
                    </Tabs.List>

                    <For each={["URL", "BBCode", "HTML", "Markdown", "Markdown with link"]}>{(tab) =>
                        <Tabs.Content class="tabs__content" value={tab}>
                            <For each={result()}>{(item) =>
                                <p onClick={copy} class={`[&::-webkit-scrollbar]:hidden select-all whitespace-nowrap bg-gray-50 hover:bg-gray-200 text-gray-600 rounded px-2 py-1 cursor-pointer overflow-scroll lh-normal mt-2`}>{item[tab]}</p>
                            }</For>
                        </Tabs.Content>
                    }</For>
                </Tabs.Root>
            </Show>


        </div>
    );
}
