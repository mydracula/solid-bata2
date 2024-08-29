// @refresh reload
import { mount, StartClient } from "@solidjs/start/client";
import "preline/preline";

mount(() => <StartClient />, document.getElementById("app")!);
