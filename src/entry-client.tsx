import { mount, StartClient } from "@solidjs/start/client";
import '@/components/layui/css/layui.css'
import '@/components/layui/layui'

mount(() => <StartClient />, document.getElementById("app"));
