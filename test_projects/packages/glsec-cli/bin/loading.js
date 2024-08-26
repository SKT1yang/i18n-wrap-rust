/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-05-30 08:29:39
 * @path: \mycli-master\bin\loading.js
 */
import ora from "ora";
const loading = ora("Loading");

function startLoading(text = "加载中...") {
  loading.text = text;
  loading.color = "green";
  loading.start();
}

function endLoading() {
  loading.stop();
}

export { startLoading, endLoading };
