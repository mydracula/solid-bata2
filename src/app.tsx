import LayoutPortal from "~/layout/layoutPortal";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Toaster } from 'solid-toast';
import "./app.css";
export default function App() {
  return (
    <Router
      root={(props: PlainObjectType) => (
        <LayoutPortal>
          <Toaster position="bottom-right" gutter={8} />
          {props.children}
        </LayoutPortal>
      )}
    >
      <FileRoutes />
    </Router>
  );
}