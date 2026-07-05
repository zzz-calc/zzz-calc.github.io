# zzz-calc

Zenless Zone Zero 계산기입니다. 에이전트 이름과 W-Engine 이름은 정확성을 위해 영어로 유지하고, 나머지 UI와 데이터 라벨은 한국어로 표시합니다.

## Scope

- 에이전트 이미지 카드, 상세 보기, 추천 파티 프리셋
- 수동 스탯, W-Engine, 디스크, 파티 버프, 적 보정을 반영하는 딜량 계산기
- 에이전트, 스킬, 핵심 스킬, W-Engine 육성 재화 계산기
- 에이전트 40명, W-Engine 93종, 활성 디스크 28종, 재화 카테고리 데이터 표
- 정적 GitHub Pages 배포

## 로컬 미리보기

```powershell
python -m http.server 4173
```

그다음 `http://localhost:4173`을 엽니다.

## GitHub Pages

이 저장소에는 `.github/workflows/pages.yml`이 포함되어 있습니다. `main` 브랜치를 GitHub에 푸시한 뒤 GitHub Pages 소스를 `GitHub Actions`로 설정하면 됩니다.

```powershell
gh auth refresh -h github.com -s repo -s workflow
gh repo create zzz-calc --public --source . --remote origin --push
```

## 데이터 메모

GitHub Pages에서 빌드 없이 제공할 수 있도록 데이터는 `app.js`에 포함되어 있습니다. 현재 프로필은 에이전트 이름과 W-Engine 이름을 영어로 유지하고, UI/데이터 라벨은 한국어로 표시합니다.

3.0 데이터에는 영어 커뮤니티 데이터베이스 기준의 Pyrois, Velina Airgid, Norma Hollowell이 포함되어 있습니다. Pyrois와 Velina는 3.0 출시 에이전트로 처리했고, Norma는 세부 출시 정보가 더 확인될 때까지 프리뷰/예정 항목으로 표시합니다.

재화 수량표, 디스크 조건부 프리셋, 파티 버프 프리셋은 v0 기준 초안입니다. 데이터베이스 검증이 진행되면 확정 테이블로 교체해야 합니다.
