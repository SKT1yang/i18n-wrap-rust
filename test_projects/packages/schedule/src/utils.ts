import { Good, Notify } from "./types";
function getNodifyData(nodify: Notify) {
  // 不执行notify.handler是因为这样有可能导致逻辑多执行一次而不符合预期
  return nodify.data;
}

function judgeGoodHandlerCanExecute(nodify: Notify, good: Good) {
  let nodifyData = getNodifyData(nodify);
  let notifyCanExecute = true;
  if (typeof nodify.executeGuard === "function") {
    notifyCanExecute = nodify.executeGuard(nodifyData);
  }
  let goodCanExecute = true;
  if (typeof good.executeGuard === "function") {
    goodCanExecute = good.executeGuard(nodifyData);
  }
  return nodify.executeGuardPolicy === "union"
    ? notifyCanExecute && goodCanExecute
    : notifyCanExecute;
}

export { getNodifyData, judgeGoodHandlerCanExecute };
