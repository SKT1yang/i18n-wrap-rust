<!--
 * 整理自
 * https://github.com/fex-team/styleguide.git
 * https://developer.aliyun.com/article/850913#slide-46
 * https://v2.cn.vuejs.org/v2/style-guide
-->

### 项目命名

#### [推荐] 全部采用 `小写方式，以中线分隔`

```html
<!-- good -->
mall-management-system
<!-- bad -->
mall_management-system
```

### 文件夹命名

#### [推荐] 全部采用 `小写方式， 以中划线分隔`，有复数结构时，要采用复数命名法， 缩写不用复数

```html
<!-- good -->
scripts/styles/components/images/utils/layouts/demo-styles/demo-scripts/img/doc

<!-- bad -->
script/style/demo scripts/demoStyles/imgs/docs
```

### 文件命名

#### [推荐] `PNG、HTML、CSS` 文件采用 `小写方式，以中划线分隔`

```html
<!-- good -->
signup.css/index.html/company-logo.png

<!-- bad -->
script/style/UserManagement.html
```

#### [推荐] `JS、TS、TSX` 文件 采用 `Camel命名法`

```html
<!-- good -->
ssrCompile.ts / ssrCompile.js

<!-- bad -->
ssrcompile.ts / ssrcompile.js
```

### HTML命名规范

#### [强制] `class` 必须单词全字母小写，单词间以 `-` 分隔

#### [强制] `class` 必须代表相应模块或部件的内容或功能，不得以样式信息进行命名

示例：

```html
<!-- good -->
<div class="sidebar"></div>

<!-- bad -->
<div class="left"></div>
```

#### [建议] `id` 建议单词全字母小写，单词间以 `-` 分隔。

#### [建议] `id`、`class` 命名，在避免冲突并描述清楚的前提下尽可能短

示例：

```html
<!-- good -->
<div id="nav"></div>
<!-- bad -->
<div id="navigation"></div>

<!-- good -->
<p class="comment"></p>
<!-- bad -->
<p class="com"></p>

<!-- good -->
<span class="author"></span>
<!-- bad -->
<span class="red"></span>
```

### JavaScript命名规范

#### [强制] `变量` 使用 `Camel命名法`

示例：

```javascript
var loadingModules = {};
```

#### [强制] `常量` 使用 `全部字母大写，单词间下划线分隔` 的命名方式

示例：

```javascript
var HTML_ENTITY = {};
```

#### [强制] `函数` 使用 `Camel命名法`



示例：

```javascript
function stringFormat(source) {
}
```

#### [强制] 函数的 `参数` 使用 `Camel命名法`

示例：

```javascript
function hear(theBells) {
}
```

#### [强制] `类` 使用 `Pascal命名法`

示例：

```javascript
function TextNode(options) {
}
```

#### [强制] 类的 `方法 / 属性` 使用 `Camel命名法`

示例：

```javascript
function TextNode(value, engine) {
    this.value = value;
    this.engine = engine;
}

TextNode.prototype.clone = function () {
    return this;
};
```

#### [强制] `枚举变量` 使用 `Pascal命名法`，`枚举的属性` 使用 `全部字母大写，单词间下划线分隔` 的命名方式

示例：

```javascript
var TargetState = {
    READING: 1,
    READED: 2,
    APPLIED: 3,
    READY: 4
};
```

#### [强制] `命名空间` 使用 `Camel命名法`

示例：

```javascript
equipments.heavyWeapons = {};
```

#### [强制] 由 `多个单词组成的缩写词`，在命名中，根据当前命名法和出现的位置，`所有字母的大小写与首字母的大小写保持一致`

示例：

```javascript
function XMLParser() {
}

function insertHTML(element, html) {
}

var httpRequest = new HTTPRequest();
```

#### [强制] `类名` 使用 `名词`

示例：

```javascript
function Engine(options) {
}
```

#### [建议] `函数名` 使用 `动宾短语`

动词推荐：

| 动词 | 含义 | 返回 |
| ---- | ----| ----|
| can  |判断是否可执行某个动作 ( 权限 ) | 函数返回一个布尔值。true：可执行；false：不可执行
| has | 判断是否含有某个值 | 函数返回一个布尔值。true：含有此值；false：不含有此值
| is | 判断是否为某个值 | 函数返回一个布尔值。true：为某个值；false：不为某个值
| get | 获取某个值 | 函数返回一个非布尔值
| set | 设置某个值 | 无返回值、返回是否设置成功或者返回链式对象

示例：

```javascript
function getStyle(element) {
}
```

#### [建议] `boolean` 类型的变量使用 `is` 或 `has` 开头

示例：

```javascript
var isReady = false;
var hasMoreCommands = false;
```

#### [建议] `Promise对象` 用 `动宾短语的进行时` 表达

示例：

```javascript
var loadingData = ajax.get('url');
loadingData.then(callback);
```

### VUE命名规范

#### [强制] 组件名为多个单词

解释：

**组件名应该始终是多个单词的，根组件 `App` 以及 `<transition>`、`<component>` 之类的 Vue 内置组件除外。**
这样做可以避免跟现有的以及未来的 HTML 元素[相冲突]，因为所有的 HTML 元素名称都是单个单词的。

示例：

```html
<!-- good -->
Vue.component('todo-item', {
  // ...
})

export default {
  name: 'TodoItem',
  // ...
}

<!-- bad -->
Vue.component('todo', {
  // ...
})

export default {
  name: 'Todo',
  // ...
}
```

#### [推荐] 单文件组件文件名的大小写

解释：

**[单文件组件]的文件名应该要么始终是单词大写开头 (PascalCase)，要么始终是横线连接 (kebab-case)。**

单词大写开头对于代码编辑器的自动补全最为友好，因为这使得我们在 JS(X) 和模板中引用组件的方式尽可能的一致。然而，混用文件命名方式有的时候会导致大小写不敏感的文件系统的问题，这也是横线连接命名同样完全可取的原因。

示例：

```html
<!-- good -->
components/
|- MyComponent.vue

components/
|- my-component.vue

<!-- bad -->
components/
|- mycomponent.vue

components/
|- myComponent.vue
```

#### [推荐] 基础组件名

解释：

**应用特定样式和约定的基础组件 (也就是展示类的、无逻辑的或无状态的组件) 应该全部以一个特定的前缀开头，比如 `Base`、`App` 或 `V`。**

这些组件为你的应用奠定了一致的基础样式和行为。它们可能**只**包括：

- HTML 元素
- 其它基础组件
- 第三方 UI 组件库

但是它们**绝不会**包括全局状态 (比如来自 Vuex store)。

这样做的几个好处：

- 当你在编辑器中以字母顺序排序时，你的应用的基础组件会全部列在一起，这样更容易识别。

- 因为组件名应该始终是多个单词，所以这样做可以避免你在包裹简单组件时随意选择前缀 (比如 `MyButton`、`VueButton`)。

示例：

```html
<!-- good -->
components/
|- BaseButton.vue
|- BaseTable.vue
|- BaseIcon.vue

components/
|- AppButton.vue
|- AppTable.vue
|- AppIcon.vue

components/
|- VButton.vue
|- VTable.vue
|- VIcon.vue

<!-- bad -->
components/
|- MyButton.vue
|- VueTable.vue
|- Icon.vue
```

#### [推荐]单例组件名

解释：

**只应该拥有单个活跃实例的组件应该以 `The` 前缀命名，以示其唯一性。**

这不意味着组件只可用于一个单页面，而是*每个页面*只使用一次。这些组件永远不接受任何 prop，因为它们是为你的应用定制的，而不是它们在你的应用中的上下文。如果你发现有必要添加 prop，那就表明这实际上是一个可复用的组件，*只是目前*在每个页面里只使用一次。

示例：

```html
<!-- good -->
components/
|- TheHeading.vue
|- TheSidebar.vue

<!-- bad -->
components/
|- Heading.vue
|- MySidebar.vue
```

#### [推荐]紧密耦合的组件名

解释：

**和父组件紧密耦合的子组件应该以父组件名作为前缀命名。**

如果一个组件只在某个父组件的场景下有意义，这层关系应该体现在其名字上。因为编辑器通常会按字母顺序组织文件，所以这样做可以把相关联的文件排在一起。

示例

```html
<!-- good -->

todo/
|- TodoList.vue
|- TodoListItem.vue
|- TodoListItemButton.vue

search/
|- SearchSidebar.vue
|- SearchSidebarNavigation.vue

<!-- bad -->

todo/
|- TodoList.vue
|- TodoItem.vue
|- TodoButton.vue

search/
|- SearchSidebar.vue
|- NavigationForSearchSidebar.vue
```

#### [推荐]组件名中的单词顺序

解释：

**组件名应该以高级别的 (通常是一般化描述的) 单词开头，以描述性的修饰词结尾。**

对于多级目录的方式，只推荐在非常大型 (如有 100+ 个组件) 的应用下才考虑这么做，因为：

- 在多级目录间找来找去，要比在单个目录下滚动查找要花费更多的精力。
- 存在组件重名的时候在编辑器里更难快速定位。
- 让重构变得更难，因为为一个移动了的组件更新相关引用时，查找/替换通常并不高效。

示例：

```html
<!-- good -->
search-button/
|- SearchButtonClear.vue
|- SearchButtonRun.vue
|- SearchInputQuery.vue
|- SearchInputExcludeGlob.vue
|- SettingsCheckboxTerms.vue
|- SettingsCheckboxLaunchOnStartup.vue

<!-- bad -->
search-button/
|- ClearSearchButton.vue
|- ExcludeFromSearchInput.vue
|- LaunchOnStartupCheckbox.vue
|- RunSearchButton.vue
|- SearchInput.vue
|- TermsCheckbox.vue
```

#### [推荐]模板中的组件名大小写

解释：

**对于绝大多数项目来说，在[单文件组件]和字符串模板中组件名应该总是 PascalCase 的, 但是在 DOM 模板中总是 kebab-case 的。**

PascalCase 相比 kebab-case 有一些优势：

- 编辑器可以在模板里自动补全组件名，因为 PascalCase 同样适用于 JavaScript。
- `<MyComponent>` 视觉上比 `<my-component>` 更能够和单个单词的 HTML 元素区别开来，因为前者的不同之处有两个大写字母，后者只有一个横线。
- PascalCase 确保了 Vue 组件在视觉上是易识别的。

由于 HTML 是大小写不敏感的，在 DOM 模板中必须仍使用 kebab-case。**在所有的地方都使用 kebab-case 是可以接受的。**

示例：

``` html
<!-- good -->

<!-- 在单文件组件和字符串模板中 -->
<MyComponent/>

<!-- 在 DOM 模板中 -->
<my-component></my-component>

或者

<!-- 在所有地方 -->
<my-component></my-component>

<!-- bad -->

<!-- 在单文件组件和字符串模板中 -->
<mycomponent/>

<!-- 在单文件组件和字符串模板中 -->
<myComponent/>

<!-- 在 DOM 模板中 -->
<MyComponent></MyComponent>
```

#### [推荐]完整单词的组件名

解释：

**组件名应该倾向于完整单词而不是缩写。**

编辑器中的自动补全已经让书写长命名的代价非常之低了，而其带来的明确性却是非常宝贵的。不常用的缩写尤其应该避免。

示例：

```html
<!-- good -->
components/
|- StudentDashboardSettings.vue
|- UserProfileOptions.vue

<!-- bad -->
components/
|- SdSettings.vue
|- UProfOpts.vue
```
