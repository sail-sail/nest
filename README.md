## 为什么会有此低代码架构
  
1. 传统的可视化低代码平台, 一般是通过拖拽组件的方式来生成页面, 但是这种方式对于开发人员来说, 有一定的学习成本, 且不够灵活, 很难定制化开发. 程序猿学习的最新技术栈, 也很难在这种平台上应用, 也无法紧跟最新的技术栈和生态链

2. 传统的代码生成器, 一般是通过模板生成代码, 但是这种方式生成的代码, 一旦修改了生成的代码, 再次生成代码时, 会覆盖掉之前的修改, 导致只能在项目初始化时使用, 无法在项目开发过程中使用, 很难满足项目的快速迭代需求

3. **所以, 我们的解决方案是, 通过代码生成器生成代码, 但是生成的代码手动修改之后, 会自动识别出来, 并且在下次生成代码时, 会保留之前的修改, 从而实现代码生成器和手动开发的完美结合, 利用 `git diff` 和 `git apply` 来识别代码的变化, 从而生成增量代码, 从而实现项目的快速迭代, 10 倍开发效率的提升**

4. 快速在线体验
    - http://39.104.15.113:7601
    - 用户名: `admin`
    - 密码: `a`
    
    - 其中 `系统管理` 菜单为系统内置模块 `base` 下面的功能, 用于管理 租户, 用户, 角色, 菜单等
    
    - 其中 `电子档案` 菜单为当前项目的功能, 业务逻辑功能并不完整, 用于本次示例测试

[![introduce1](https://sail-sail.github.io/docs/assets/introduce1.CzfXS-F9.jpg)](https://sail-sail.github.io/docs/assets/introduce1.CzfXS-F9.jpg)

5. 联系作者
    - 微信: `sailnode`
    - 邮箱: `151263555@qq.com`

6. 技术栈
    - 前端: vue3 + vite + element-plus + graphql + ejsexcel + uni-app + typescript
    - 后端: deno + mysql + graphql + typescript
    - 第二套有相同功能的后端: rust + mysql + async-graphql

7. [github](https://github.com/sail-sail/nest.git)
