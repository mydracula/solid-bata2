// @refresh reload
import { mount, StartClient } from "@solidjs/start/client";
import "virtual:uno.css";
import './app.css'

mount(() => <StartClient />, document.getElementById("app")!);