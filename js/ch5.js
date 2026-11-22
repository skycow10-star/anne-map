/* 5장 · 다과회 소동 (원작 16장) */
CH[5] = {
  title:"다과회 소동", when:"10월", season:"autumn", img:"ch5", bgm:"bgm_ch5.mp3", anne:"anne", who:"diana",
  intro:"단풍이 곱게 물든 10월. 마릴라 아주머니가 외출하신 날, 앤은 다이애나를 초대해 어른처럼 차를 대접하기로 했어요!",
  teaser:"다이애나를 만날 수 없는 긴 겨울… 그런데 어느 추운 밤, 누군가 초록 지붕 집 문을 두드려요.",
  end:{canon:["이렇게 흥미로운 세상에서", "실수투성이 하루였지만, 원작 속 앤처럼 '내일은 아직 실수 없는 새날'이라고 믿었어요."],
       imag:["마녀 왕비의 마음이 녹는 날", "언젠가 배리 부인의 꽁꽁 언 마음도 녹을 거라고 상상했어요."],
       bal:["말 대신 보여 줄게요", "말로는 안 통해도, 행동으로 진심을 보여 주기로 했어요. 의젓한 선택이에요."]},
  names:[], minis:["bottle", "tea"],
  quests:[
  {at:"home", label:"마릴라 아주머니께 다과회 허락받기", bg:"ch5", nodes:[
    ["marilla", "happy", "marilla_warm", "\"내일 카모디에 다녀오마. 다이애나를 불러 차를 대접해도 좋다.\""],
    ["anne", "happy", "marilla_warm", "\"정말요? 어른처럼요? 장미꽃 무늬 찻잔도 써도 돼요?\""],
    ["marilla", "sad", "marilla_strict", "\"그건 안 된다. 갈색 찻잔을 쓰렴.\n거실 찬장 둘째 칸에 빨간 나무딸기 주스가 있으니 그걸 내거라.\""],
    {q:"마릴라 아주머니의 말씀을 듣고 앤은 어떻게 할까요?", opts:[
      {t:"\"찬장 둘째 칸, 빨간 병!\" 하고 꼭 기억한다.", type:"canon", eff:{hid:"careful"}, then:[["inner", "happy", "marilla_warm", "찬장 둘째 칸, 빨간 나무딸기 주스.\n나는 꼼꼼한 안주인이 될 거야!", {still:"sc_careful"}]]},
      {t:"여왕의 연회를 여는 상상에 빠진다.", type:"imag", eff:{hid:"banquet"}, then:[["inner", "dreamy", "marilla_warm", "은촛대, 레이스 식탁보, 금빛 찻잔…\n나는 여왕님의 연회를 여는 거야!", {dream:true, still:"sc_banquet"}]]},
      {t:"\"잘 모르면 다시 여쭤볼게요\" 하고 메모한다.", type:"bal", eff:{h:{marilla:1}}, then:[["marilla", "happy", "marilla_warm", "\"그래, 그게 좋겠구나.\"\n아주머니가 고개를 끄덕이셨어."]]}
    ]}
  ]},
  {at:"barry", label:"다이애나를 다과회에 초대하기", bg:"ch5_orchard", nodes:[
    ["diana", "happy", "diana", "다이애나는 제일 좋은 옷을 입고 와서\n문을 똑똑 두드렸어. 정말 어른처럼!"],
    ["anne", "happy", "diana", "\"어머, 배리 양. 어서 오세요. 어머님은 안녕하신가요?\"\n우리는 깔깔 웃음을 참으며 인사했어."],
    ["inner", "happy", "diana", "우리는 과수원에서 빨간 사과를 따며 놀았어.\n단풍잎이 비처럼 떨어졌어."],
    {q:"과수원에서 다이애나와 무엇을 할까요?", opts:[
      {t:"사과를 한 바구니 따서 다과회에 쓴다.", type:"canon", then:[["inner", "happy", "diana", "반짝반짝한 사과를 한 바구니 땄어.\n다과회가 더 풍성해지겠지!"]]},
      {t:"사과에 얼굴을 그려 손님으로 앉힌다.", type:"imag", eff:{hid:"appleFace"}, then:[["inner", "dreamy", "diana", "사과 손님들이 줄지어 앉았어.\n\"사과 부인, 차 한 잔 하시겠어요?\"", {dream:true, still:"sc_appleFace"}]]},
      {t:"다이애나에게 먼저 제일 예쁜 사과를 준다.", type:"bal", eff:{h:{diana:1}}, then:[["diana", "happy", "diana", "\"고마워, 앤! 너는 정말 다정해.\""]]}
    ]}
  ]},
  {at:"home", label:"다과회 준비하고 손님 대접하기", bg:"ch5", nodes:[
    ["inner", "happy", "diana", "이제 진짜 다과회야.\n찬장에서 나무딸기 주스를 꺼내 와야지."],
    {mini:{kind:"shelf", id:"bottle", title:"찬장 병 찾기", how:"찬장 문이 잠깐 열려요. 둘째 칸에 있는 빨간 병의 모양을 잘 봐 두세요! 문이 다시 열리면 병들이 뒤섞여 있고, 빨간 병도 여러 개예요.",
      say:"둘째 칸, 아까 본 그 빨간 병", say1:"거실 찬장 둘째 칸에 빨간 병이 있단다. 그게 나무딸기 주스야.",
      peek:() => S.hidden.includes("careful") ? 4 : 3, tries:3, per:5,
      res:{1:"조금 헷갈렸지만 빨간 병을 찾았어요.", 2:"아주머니 말씀을 잘 기억했어요!", 3:"완벽해요! 그런데… 이 병, 정말 나무딸기 주스일까요?"}},
     },
    {eff:{get:"currant"}},
    {mini:{kind:"pour", id:"tea", title:"손님 잔 채우기", how:"버튼을 꾹 누르고 있으면 빨간 음료가 차올라요. 초록 선 두 개 사이에서 손을 떼요. 세 잔을 따라요.",
      q:"다이애나의 잔을 채워요", say:"초록 선 사이에서 손을 떼요", n:3, lo:65, hi:88, speed:1.5,
      res:{1:"조금 넘치고 모자랐지만 괜찮아요.", 2:"안주인다운 솜씨예요!", 3:"한 방울도 안 흘렸어요! 진짜 어른 같아요."}}},
    ["diana", "happy", "diana", "\"앤, 이거 정말 맛있다! 나무딸기 주스가 이렇게 맛있는 줄 몰랐어.\"\n다이애나는 세 잔이나 마셨어."],
    ["diana", "sad", "diana", "\"앤… 어쩐지 머리가 빙빙 돌아. 나 집에 가야겠어.\""],
    {q:"다이애나가 어지럽대요. 앤은 어떻게 할까요?", opts:[
      {t:"\"벌써? 아직 과일 케이크도 안 먹었는데!\" 하고 붙잡는다.", type:"canon", then:[["inner", "sad", "diana", "다이애나는 비틀비틀 집으로 돌아가 버렸어.\n다과회가 이렇게 끝나다니…"]]},
      {t:"마법의 루비 물약이었나 하고 상상한다.", type:"imag", eff:{hid:"rubyPotion"}, then:[["inner", "dreamy", "diana", "혹시 저 빨간 병은 마법의 루비 물약이었을까?\n다이애나가 마법에 걸린 거야!", {dream:true, still:"sc_rubyPotion"}]]},
      {t:"병을 냄새 맡아 보고 이상하다고 느낀다.", type:"bal", eff:{hid:"oddTaste"}, then:[["inner", "surprised", "diana", "킁킁… 나무딸기 주스 냄새가 아니야.\n어딘가 이상한 냄새가 나.", {still:"sc_oddTaste"}]]}
    ]},
    ["marilla", "surprised", "marilla_strict", "\"앤! 이건 나무딸기 주스가 아니라 포도주다!\n주스는 지하실에 두었는데… 내가 깜빡했구나.\"", {bg:"ch5_dusk"}],
    ["inner", "sad", "marilla_strict", "그럼 다이애나는… 포도주에 취했던 거야?\n어떡해. 배리 부인이 아시면…"]
  ]},
  {at:"barry", label:"배리 부인께 사정 말씀드리기", bg:"ch3", nodes:[
    ["inner", "sad", "barry", "나는 배리 씨네 집으로 달려갔어.\n배리 부인은 문 앞에서 무섭게 나를 내려다보셨어."],
    {duel:{id:"barry5", who:"barry", o:"barry", f:"sad", need:5, turns:3, never:true,
      open:"\"우리 다이애나를 취하게 하다니!\n앞으로 다이애나와 놀 생각은 꿈에도 하지 마라.\"",
      hint:"배리 부인의 마음은 지금 말로는 녹지 않아요. 이야기는 계속돼요.",
      cards:[
        {k:"사과", t:"진심으로 머리 숙여 사과한다", say:"\"배리 부인, 정말 죄송해요. 일부러 그런 게 아니에요.\"", d:0, r:"\"일부러가 아니면 다 되는 줄 아니?\""},
        {k:"설명", t:"있는 그대로 사실을 말씀드린다", say:"\"주스인 줄 알았어요. 아주머니도 병을 헷갈리셨대요.\"", d:0, r:"\"핑계는 듣고 싶지 않다.\""},
        {k:"상상", t:"마법 물약 이야기로 설명한다", say:"\"그건 마법의 루비 물약 같은 거였어요…\"", d:0, r:"\"뭐라고? 말도 안 되는 소리!\""},
        {k:"약속", t:"다시는 그런 일 없게 하겠다고 약속한다", say:"\"앞으로 정말정말 조심할게요. 다이애나만은 만나게 해 주세요.\"", d:0, r:"\"안 된다. 돌아가거라.\""}
      ],
      win:[], lose:[
        ["inner", "sad", "barry", "쾅. 문이 닫혔어.\n어떤 말을 해도 배리 부인의 마음은 꽁꽁 얼어 있었어."],
        {q:"닫힌 문 앞에서 앤은 어떻게 할까요?", opts:[
          {t:"집에 돌아와 울며 마릴라 아주머니께 있었던 일을 그대로 말한다.", type:"canon", eff:{hid:"factsOnly", h:{marilla:1}}, then:[["marilla", "sad", "marilla_warm", "\"…네 잘못이 아니란다, 앤.\"\n아주머니가 처음으로 나를 꼭 안아 주셨어.", {still:"sc_factsOnly", bg:"ch5_dusk"}]]},
          {t:"백 일 동안 말하지 않는 벌을 스스로에게 내린다.", type:"imag", eff:{hid:"silence"}, then:[["inner", "dreamy", null, "나는 비극의 주인공이야. 백 일 동안 침묵하겠어!\n…그런데 그건 하루도 못 갈 것 같아.", {dream:true, still:"sc_silence"}]]},
          {t:"언젠가 행동으로 진심을 보여 주겠다고 다짐한다.", type:"bal", then:[["inner", "sad", null, "지금은 아무 말도 통하지 않아.\n그래도 언젠가 꼭 보여 드릴 거야."]]}
        ]}
      ]}}
  ]},
  {at:"spring", label:"샘가에서 다이애나와 작별하기", lock:{only:["barry"], why:"배리 부인이 다이애나와 놀지 말라고 하셨어요"}, bg:"ch7_spring", nodes:[
    ["diana", "sad", "diana", "다음 날, 다이애나가 몰래 샘가로 나왔어.\n\"엄마가 10분만 허락해 주셨어. 작별 인사하라고.\""],
    ["anne", "sad", "diana", "\"다이애나, 너는 나를 잊지 않을 거지?\n다른 마음의 친구가 생겨도?\""],
    ["diana", "sad", "diana", "\"절대 안 잊어, 앤. 너 같은 친구는 다시는 없을 거야.\""],
    {q:"다이애나와 헤어지기 전, 무엇을 나눌까요?", opts:[
      {t:"다이애나의 까만 머리카락 한 가닥을 정표로 받는다.", type:"canon", eff:{h:{diana:1}, get:"lock"}, then:[["inner", "sad", "diana", "다이애나의 머리카락 한 가닥을 받았어.\n평생 소중히 간직할 거야."]]},
      {t:"통나무 다리 아래에 비밀 우체통을 만든다.", type:"imag", eff:{hid:"mailbox"}, then:[["inner", "dreamy", "diana", "통나무 다리 틈새는 이제 우리만의 비밀 우체통이야.\n편지로라도 이야기할 수 있어!", {dream:true, still:"sc_mailbox"}]]},
      {t:"서로의 이름을 새긴 조약돌을 나눠 갖는다.", type:"bal", eff:{hid:"pebble", get:"pebble", h:{diana:1}}, then:[["diana", "sad", "diana", "\"이 조약돌을 볼 때마다 너를 생각할게.\"", {still:"sc_pebble"}]]}
    ]},
    ["inner", "sad", null, "다이애나가 떠난 샘가에 단풍잎이 떨어졌어.\n그래도… 내일은 아직 실수 없는 새날이야."]
  ]}
]};
