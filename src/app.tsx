// @ts-nocheck

import { onMount } from "solid-js";
import { createSignal } from "solid-js";
import "./app.css";

export default function App() {
  const [index, setIndex] = createSignal(1);
  const [result, setResult] = createSignal([]);
  onMount(async () => {
    const upload = layui.upload;
    var $ = layui.$;
    layui.use(function () {
      const form = layui.form;
      form.on('radio(handleChange)', function (data) {
        setIndex(data.elem.value);
      });
    });
    // // 渲染
    upload.render({
      elem: '#upload',
      url: '/api/upload',
      data: {
        index
      },
      // auto: false,
      multiple: true,
      // bindAction: '',
      done: function (res) {
        setResult((prev) => prev.concat(res))
      }
    });


  });
  return (
    <>
      <div class="layui-upload-drag layui-show">
        <i class="layui-icon layui-icon-upload"></i>
        <div>将文件拖拽到此处或<span id="upload" class="layui-font-green">选择一个</span></div>
        <div class="layui-hide" id="ID-upload-demo-preview">
          <hr /><img src="" alt="上传成功后渲染" style="max-width: 100%"></img>
        </div>
      </div>

      <div class="layui-form">
        <input type="radio" name="AAA" value="0" title="接口1" lay-filter="handleChange" />
        <input type="radio" name="AAA" value="1" title="接口2" lay-filter="handleChange" checked />
        <input type="radio" name="AAA" value="2" title="接口3" lay-filter="handleChange" />
      </div>

      <div class="layui-tab layui-tab-brief">
        <ul class="layui-tab-title">
          <li class="layui-this">URL</li>
          <li>BBCode</li>
          <li>HTML</li>
          <li>Markdown</li>
          <li>Markdown with link</li>
        </ul>
        <div class="layui-tab-content">

          <For each={['URL', 'BBCode', 'HTML', 'Markdown', 'Markdown with link']}>{(item, index) =>
            <div class={`layui-tab-item ${index() == 0 ? 'layui-show' : ''}`}>
              <For each={result()}>{(rst, idx) =>
                <div >{rst[item]}</div>
              }</For>
            </div>
          }</For>
        </div>
      </div>
    </>
  );
}
