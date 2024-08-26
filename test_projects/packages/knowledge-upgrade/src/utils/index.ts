/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-02-16 19:34:47
 * @path: \knowledge-upgrade\\utils\index.ts
 */
import { provideContext, injectContext } from '@guolisec/utils';

type Sn = 'csmp' | 'sid' | 'ahm';

interface PageUpgradeKnowledgeContext {
  sn: Sn;
  noLicense: boolean;
}

function provideUpgradeKnowledgeContext(
  context: Partial<PageUpgradeKnowledgeContext>
) {
  return provideContext('asset::list', context || {});
}

function injectUpgradeKnowledgeContext(): Partial<PageUpgradeKnowledgeContext> {
  return injectContext('asset::list', {
    sn: 'csmp',
    noLicense: false,
  });
}

export { provideUpgradeKnowledgeContext, injectUpgradeKnowledgeContext };
