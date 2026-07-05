# zzz-calc

Zenless Zone Zero 계산기입니다. 에이전트 이름과 W-Engine 이름은 정확성을 위해 영어로 유지하고, 나머지 UI와 데이터 라벨은 한국어로 표시합니다.

## Scope

- 에이전트 이미지 카드, 상세 보기, 추천 파티 프리셋
- 수동 스탯, W-Engine, 디스크, 파티 버프, 적 보정을 반영하는 딜량 계산기
- 에이전트, 스킬, 핵심 스킬, W-Engine 육성 재화 계산기
- 에이전트 56명, W-Engine 93종, 활성 디스크 28종, 재화 카테고리 데이터 표
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

3.0 live 데이터는 Nanoka static API의 `character.json`, `weapon.json`, `equipment.json` 기준으로 동기화합니다. 에이전트 로스터는 페이지 로드 시 API 스냅샷을 읽어 공개 아이콘이 있는 56명으로 구성하고, 실패 시 내장 fallback 데이터를 사용합니다.

- API 루트: https://static.nanoka.cc/zzz/3.0/
- 효과 DB는 W-Engine 재련 1~5단계와 에이전트 돌파 원문을 Nanoka static API에서 다시 생성합니다.
- 명파 캐릭터는 API의 `weapon_type: 6` 기준으로 분류하며, 피해 기준은 `명파력 = 현재 공격력 * 0.3 + 최대 HP * 0.1 + 고정 명파력`으로 계산합니다. 명파 피해는 방어/PEN 계수를 적용하지 않습니다.

재화 수량표, 디스크 조건부 프리셋, 파티 버프 프리셋은 v0 기준 초안입니다. 데이터베이스 검증이 진행되면 확정 테이블로 교체해야 합니다.
