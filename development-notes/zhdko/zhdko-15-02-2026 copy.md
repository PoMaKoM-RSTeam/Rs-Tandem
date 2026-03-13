# Дата: 13.03.2026

## Code Review

- [PR #25: feat: authentication](https://github.com/PoMaKoM-RSTeam/Rs-Tandem/pull/25) — 3 комментария  
  - предложил улучшение производительности: вынести object literals из Angular template в TS, чтобы избежать пересоздания при change detection  
  - предложил рефакторинг: объединить ForgotPassword и UpdatePassword в один компонент или переиспользовать общий HTML/SCSS для устранения дублирования  
  - указал на потенциально рискованную логику с `setTimeout` для сброса ошибки и предложил удалить её, так как состояние уже сбрасывается при новом запросе
