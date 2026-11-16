# 知微 · 高等数学

依照同济《高等数学》第八版上、下册目录组织的独立学习辅助网站。12章、82节；每节包含概念、关键公式、例题、提醒，以及一道选择题和一道填空题。提供四个可调参数的数学实验、搜索、公式手册、错题、收藏、浏览器本地进度与进度导出。

## 启动与检查

```sh
npm install
python3 scripts/build-data.py
npm run check
npm start
```

访问 http://localhost:4173 。网站为静态HTML/CSS/JavaScript，发布资源全部位于dist；KaTeX及字体本地加载，无外部运行时依赖。

教材目录来源：高等教育出版社产品检索系统，书目ID 62cdab46938b7cc2960eedb1（上册）、62bc8b97938b7cc2960eebb7（下册）。正文、例题与练习独立编写。选学标记对应星号节。

源内容位于scripts/course.txt，build-data.py生成dist/data.js。学习进度存储键为zhiwei-calculus-v1。记录属于当前浏览器；进度导出为只读JSON备份，当前不提供导入。

## 验证

scripts/check.cjs：全课程加载、全部164题正确答案、数学排版、错题订正、收藏、进度保存、筛选搜索与四个动态图形。
scripts/browser-check.cjs：本地Chrome桌面/手机布局检查与学生操作流程。
