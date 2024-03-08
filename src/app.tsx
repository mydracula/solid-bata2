// @ts-nocheck
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start";
import { Suspense } from "solid-js";
import "@/app.css";

export default function App() {
  return (
    <Router root={props => (
      <Suspense fallback={<h1>Loading...</h1>}>{props.children}</Suspense>
    )}>
      <FileRoutes />
    </Router>
  );
}



