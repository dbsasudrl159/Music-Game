# 플리업 퀴즈

## 실행하기
브라우저 보안 때문에 `index.html`을 더블클릭하면 `data/*.json`을 읽지 못해요. (이때는 내장 예시 데이터로 열리고, 설정에 안내가 떠요.)
폴더 안에서 터미널을 열고 아래 한 줄을 실행한 뒤 주소창에 `http://localhost:8000` 을 입력하세요.

    python3 -m http.server 8000

## 새 인물 문제 추가하기
1. 사진을 `img/people/` 폴더에 넣어요. 예: `img/people/minsu.jpg` (파일명은 영문·숫자 추천)
2. `data/people.json`을 메모장으로 열어 `questions` 안의 마지막 문제 뒤에 쉼표(,)를 붙이고 아래를 추가해요.

       {"id": "people-004", "enabled": true, "name": "Minsu", "answers": ["Minsu", "민수"], "image": "img/people/minsu.jpg", "hints": ["첫 번째 힌트", "두 번째 힌트"], "description": ""}

3. 저장하고 브라우저를 새로고침해요.
4. 설정 > 인물 맞추기 > `이미지 경로 확인`에서 ✓가 뜨면 성공이에요.

## 새 가사 문제 추가하기
`data/lyrics.json`에 같은 방식으로 추가해요. 이미지가 없으면 `"image": null`.

    {"id": "lyrics-005", "enabled": true, "question": "가사 한 줄", "answers": ["곡 제목"], "hint": ["힌트"], "image": null, "description": ""}

## 규칙
- `id`는 문제마다 달라야 해요.
- `"enabled": false`면 출제하지 않아요 (지우지 않고 잠시 빼고 싶을 때).
- `answers`에 정답을 여러 개 적을 수 있어요. `answers`가 비면 출제에서 제외돼요.
- 문제와 문제 사이에는 쉼표(,)가 필요하고, 마지막 문제 뒤에는 없어야 해요. 이게 틀리면 설정 > 전체 설정에 오류가 표시돼요.
- 이미지 경로는 프로젝트 폴더 기준이에요 (`img/people/…`). 이미지가 없거나 경로가 틀리면 실루엣으로 대신 보여요.
- 문제 수에 맞춰 출제 개수 버튼이 자동으로 바뀌어요 (예: 문제가 4개면 1, 3, 4).

## 설정 화면에서 JSON 다루기
- `JSON 파일 불러오기`: 고친 파일을 골라 바로 확인해요. 이 브라우저에만 저장돼요.
- `JSON 내보내기`: 현재 데이터를 다운로드해요. 받은 파일을 `data/` 폴더에 직접 덮어써야 원본이 바뀌어요.
- `파일에서 다시 불러오기`: `data/` 파일을 고친 뒤 눌러 다시 읽어요 (불러온 파일 저장본은 지워져요).
- `이 게임 초기화`: 해당 게임의 설정과 불러온 데이터를 처음 상태로 돌려요.

## 파일 구조
`index.html` · `css/style.css` · `js/data-loader.js`(JSON 불러오기·검증) · `js/quiz.js`(진행·판정·점수) · `js/settings.js`(설정) · `js/app.js`(화면 전환) · `data/` · `img/`
# Music-Game
