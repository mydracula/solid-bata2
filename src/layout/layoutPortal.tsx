import LayoutHeader from "./layoutHeader"
import LayoutIndex from "./layoutIndex"
export default function LayoutPortal(props: PlainObjectType) {
    return (
        <div class="bg-gray-50 dark:bg-neutral-900 h-full flex flex-col">
            <LayoutHeader></LayoutHeader>
            <LayoutIndex>
                {props.children}
            </LayoutIndex>
        </div>
    )
}