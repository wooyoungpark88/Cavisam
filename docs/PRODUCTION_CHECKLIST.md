# CareVia 상용 서비스 사전 점검 체크리스트

> 대상: 초기 100명 미만 유저 운영 기준
> 작성일: 2026-03-19
> 스택: React 19 + Vite + Supabase + Railway(Docker/nginx)

---

## 1. 보안 (Security)

### 1-1. Supabase RLS 정책 보완

현재 여러 테이블에 INSERT 정책이 누락되어, 앱에서 데이터 생성이 RLS에 의해 차단될 수 있습니다.

| 테이블 | SELECT | INSERT | UPDATE | DELETE | 조치 필요 |
|--------|--------|--------|--------|--------|-----------|
| parent_messages | O | O | O | - | 정상 |
| morning_reports | O | O | O | - | 정상 |
| daily_records | O | O | O | - | 정상 |
| students | O | O | O | O(admin) | 정상 |
| behavior_events | O | **X** | O | - | INSERT 정책 추가 |
| care_team | O | **X** | O | - | INSERT 정책 추가 |
| ai_care_reports | O | **X** | - | - | INSERT 정책 추가 |
| notifications | O | **X** | O | - | INSERT 정책 추가 |
| team_meetings | O | **X** | O | - | INSERT 정책 추가 |
| event_groups | O | `for all` | `for all` | `for all` | 과도한 권한, 세분화 필요 |

**필요한 SQL:**
```sql
-- behavior_events
create policy "behavior_events_insert" on public.behavior_events
  for insert with check (public.get_my_role() in ('teacher', 'admin'));

-- care_team
create policy "care_team_insert" on public.care_team
  for insert with check (public.get_my_role() in ('teacher', 'admin'));

-- ai_care_reports
create policy "ai_care_reports_insert" on public.ai_care_reports
  for insert with check (public.get_my_role() in ('teacher', 'admin'));

-- notifications
create policy "notifications_insert" on public.notifications
  for insert with check (public.get_my_role() in ('teacher', 'admin'));

-- team_meetings
create policy "team_meetings_insert" on public.team_meetings
  for insert with check (public.get_my_role() in ('teacher', 'admin'));
```

- [ ] Supabase SQL Editor에서 위 정책 실행
- [ ] `event_groups`의 `for all` 정책을 SELECT/INSERT/UPDATE 개별 정책으로 분리

### 1-2. nginx 보안 헤더

현재 `nginx.conf`에 CSP, HSTS 헤더가 없습니다.

- [ ] 아래 헤더를 `nginx.conf`의 `server` 블록에 추가:
```nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src fonts.gstatic.com cdn.jsdelivr.net; connect-src 'self' https://*.supabase.co wss://*.supabase.co; img-src 'self' data: https:; frame-ancestors 'none';" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
```

### 1-3. 인증 / 세션

- [ ] Supabase Auth > Settings에서 JWT 만료 시간 확인 (권장: 1시간, refresh token으로 갱신)
- [ ] Google OAuth > Authorized redirect URIs에 프로덕션 도메인 등록
- [ ] Supabase Auth > URL Configuration에서 Site URL을 프로덕션 도메인으로 변경
- [ ] 데모 모드(`localStorage cavisam_demo`)가 프로덕션에서 비활성화되어야 하는지 결정
- [ ] 초대 코드 시스템이 실제 운영에서 동작하는지 확인 (seed.sql에 초대 코드 없음)

---

## 2. 데이터 & 백업

### 2-1. Supabase 플랜 확인

| 항목 | Free 플랜 | Pro 플랜 (권장) |
|------|-----------|-----------------|
| DB 용량 | 500MB | 8GB |
| 스토리지 | 1GB | 100GB |
| Realtime 동시 연결 | 200 | 500 |
| 일일 백업 | X | **O (자동)** |
| Point-in-time 복구 | X | O |
| 커스텀 도메인 | X | O |

- [ ] **Pro 플랜 전환** — 100명 운영 시 일일 자동 백업 필수
- [ ] 백업 시점 확인 및 복구 절차 문서화
- [ ] 주 1회 수동 데이터 Export 스케줄 설정 (Supabase Dashboard > Database > Backups)

### 2-2. 데이터 정합성

- [ ] 시드 데이터(`supabase/seed.sql`)가 프로덕션 DB에 들어가지 않았는지 확인
- [ ] 데모용 고정 UUID(`00000000-...`)가 실제 데이터와 충돌하지 않는지 확인
- [ ] `daily_records`, `behavior_events` 테이블에 인덱스 추가:
```sql
create index if not exists idx_daily_records_student_date on daily_records(student_id, date);
create index if not exists idx_behavior_events_student_date on behavior_events(student_id, occurred_at);
create index if not exists idx_parent_messages_student on parent_messages(student_id, created_at);
```

---

## 3. 에러 처리 & 모니터링

### 3-1. 에러 바운더리

현재 앱에 React Error Boundary가 없어, 컴포넌트 에러 발생 시 전체 화면이 흰색으로 크래시됩니다.

- [ ] 글로벌 Error Boundary 컴포넌트 추가 (`src/components/ErrorBoundary.tsx`)
- [ ] 라우트 레벨 에러 핸들링 추가

### 3-2. API 에러 처리

현재 대부분의 API 호출에서 에러가 무시되거나 `console.error`로만 출력됩니다.

- [ ] 모든 Context Provider의 `fetchAll()`에 try-catch 추가
- [ ] 사용자에게 에러 토스트/알림 표시 (네트워크 끊김, 권한 없음 등)
- [ ] Supabase 에러 시 데모 데이터로 자동 폴백하는 패턴 제거 (에러를 숨기는 문제)

### 3-3. 모니터링 서비스

- [ ] **Sentry** 또는 **LogRocket** 연동 (프론트엔드 에러 트래킹)
  - 무료 플랜으로도 100명 규모 충분
  - `npm install @sentry/react` → `Sentry.init()` in `main.tsx`
- [ ] Railway 대시보드에서 배포 알림 설정 (Slack/Email)
- [ ] Supabase Dashboard > Logs에서 RLS 차단 로그 주기적 확인

---

## 4. 배포 & 인프라

### 4-1. 환경 변수

- [ ] `.env` 파일이 git에 포함되지 않도록 `.gitignore` 확인
- [ ] Railway 환경 변수에만 Supabase 키를 설정 (로컬 `.env`와 분리)
- [ ] `.env.example` 파일 생성 (키 값 없이 변수명만 기재)

### 4-2. 헬스 체크

현재 `railway.json`의 헬스 체크가 `/` (전체 SPA)를 확인하므로, JS 오류가 있어도 200 OK를 반환합니다.

- [ ] 전용 `/health` 경로를 nginx에 추가:
```nginx
location = /health {
    access_log off;
    return 200 '{"status":"ok"}';
    add_header Content-Type application/json;
}
```
- [ ] `railway.json`의 `healthcheckPath`를 `/health`로 변경

### 4-3. 빌드 최적화

- [ ] `vite.config.ts`에 청크 분리 설정 추가:
```typescript
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ['react', 'react-dom', 'react-router-dom'],
        supabase: ['@supabase/supabase-js'],
      }
    }
  },
  sourcemap: false,
}
```
- [ ] 빌드 결과물 크기 확인 (`npm run build` 후 dist/ 용량)

### 4-4. 도메인 & SSL

- [ ] 커스텀 도메인 연결 (Railway 또는 Cloudflare)
- [ ] SSL 인증서 자동 갱신 확인
- [ ] Supabase Auth > URL Configuration에 프로덕션 도메인 반영

---

## 5. 기능 동작 검증

### 5-1. 인증 플로우

| 시나리오 | 확인 |
|----------|------|
| 신규 유저 Google 로그인 → `/auth/setup` 이동 | [ ] |
| 초대 코드 입력 → 역할(교사/보호자) 선택 | [ ] |
| 관리자 승인 대기 → `/auth/pending` 표시 | [ ] |
| 관리자 승인 후 → 역할별 대시보드 이동 | [ ] |
| 로그아웃 → 세션 완전 정리 | [ ] |
| 이미 로그인된 상태에서 시작하기 페이지 접근 | [ ] |

### 5-2. 교사 기능

| 기능 | 확인 |
|------|------|
| 이용인 목록 조회 | [ ] |
| 이용인 등록/수정/삭제 | [ ] |
| 일일 기록 작성 | [ ] |
| 보호자에게 알림장 발송 | [ ] |
| 케어톡 메시지 송수신 (Supabase 저장 확인) | [ ] |
| 행동 이벤트 기록 | [ ] |
| 행동 추이 차트 표시 | [ ] |
| 돌봄팀 관리 | [ ] |

### 5-3. 보호자 기능

| 기능 | 확인 |
|------|------|
| 등원 전 한마디 작성 및 발송 | [ ] |
| 발송 통계 확인 | [ ] |
| 케어톡 메시지 송수신 (Supabase 저장 확인) | [ ] |
| 알림장(생활알리미) 수신 확인 | [ ] |
| AI 케어 리포트 조회 | [ ] |
| 돌봄팀 멤버 확인 | [ ] |

### 5-4. 실시간 기능

| 기능 | 확인 |
|------|------|
| 교사가 보낸 메시지가 보호자에게 실시간 표시 | [ ] |
| 보호자가 보낸 메시지가 교사에게 실시간 표시 | [ ] |
| 읽음 처리 후 안읽은 메시지 배지 사라짐 | [ ] |
| Supabase Realtime 연결 안정성 (장시간 유지) | [ ] |

---

## 6. 사용자 관리 & 온보딩

### 6-1. 초기 운영 준비

- [ ] 관리자(admin) 계정 생성 및 역할 설정
- [ ] 교사 계정 사전 등록 또는 초대 코드 발급
- [ ] 보호자 초대 방법 확정 (초대 코드 / 관리자 직접 등록)
- [ ] `organizations` 테이블에 실제 기관 정보 등록

### 6-2. 사용자 가이드

- [ ] 교사용 사용 가이드 (PDF 또는 앱 내 온보딩)
- [ ] 보호자용 사용 가이드
- [ ] 관리자용 운영 가이드 (승인 절차, 역할 변경 등)

---

## 7. 개인정보 보호 (한국 개인정보보호법 기준)

### 7-1. 필수 조치

- [ ] **개인정보 처리방침** 작성 및 앱 내 게시 (푸터 또는 설정 메뉴)
  - 수집 항목: 이름, 이메일(Google), 건강 관련 기록(수면·식사·컨디션·배변·투약)
  - 수집 목적: 돌봄 서비스 제공
  - 보유 기간: 서비스 이용 종료 시까지
- [ ] **개인정보 수집 동의** — 최초 가입 시 동의 화면 추가
- [ ] 민감 정보(건강 기록) 처리에 대한 **별도 동의** 확보
- [ ] 데이터 열람/수정/삭제 요청 처리 절차 마련

### 7-2. 기술적 보호 조치

- [ ] Supabase의 TLS 암호화 통신 확인 (기본 활성화)
- [ ] DB 접근 로그 활성화 (Supabase Dashboard > Logs)
- [ ] 관리자 페이지 접근 기록 (감사 로그)

---

## 8. 성능 (100명 규모)

100명 미만 규모에서는 성능 병목이 적지만, 기본적인 최적화를 권장합니다.

- [ ] Supabase Free 플랜 API 요청 한도 확인 (무제한이지만 rate limit 존재)
- [ ] Realtime 동시 연결 수 모니터링 (Free: 200, Pro: 500)
- [ ] 이미지 자산이 CDN을 통해 서빙되는지 확인 (현재 Railway에서 직접 서빙)
- [ ] 정적 자산 캐싱 확인 (`nginx.conf`의 1년 캐시 설정 정상 동작)

---

## 우선순위 요약

### 출시 전 필수 (P0)
1. RLS INSERT 정책 누락 5건 추가
2. nginx 보안 헤더 (CSP, HSTS) 추가
3. 프로덕션 도메인 + Google OAuth redirect URI 설정
4. Supabase Auth URL을 프로덕션 도메인으로 변경
5. 교사/보호자 핵심 기능 E2E 수동 테스트
6. 개인정보 처리방침 게시

### 출시 후 2주 내 (P1)
1. Sentry 에러 모니터링 연동
2. React Error Boundary 추가
3. Supabase Pro 플랜 전환 (자동 백업)
4. DB 인덱스 추가
5. 사용자 가이드 배포

### 안정화 단계 (P2)
1. 자동화 테스트 (unit/integration)
2. 감사 로그 구현
3. 빌드 청크 최적화
4. 데이터 Export/삭제 기능 구현
