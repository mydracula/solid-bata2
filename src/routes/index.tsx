import { useNavigate } from "@solidjs/router"
import { onMount } from 'solid-js';

export default function Index() {
    onMount(() => {
        const navigate = useNavigate();
        navigate('/gpt')
    })
    return (
        <div>
            <a href="/">Index</a>
            <a href="/tuchuang">图床</a>
            <a href="/gpt">gpt</a>
        </div>
    )
}