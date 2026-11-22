/* 10장 · 길모퉁이 (원작 36~38장) */
const myMapRounds = () => {
  const keys = Object.keys(S.names).filter(k => P[k]);
  const all = Object.keys(P);
  const rounds = keys.slice(0, 5).map(k => {
    const wrong = all.filter(x => x !== k).sort(() => Math.random() - .5).slice(0, 2);
    return {q:`'${S.names[k]}'(이)라고 이름 붙인 곳은 어디였을까요?`, opts:[{t:P[k].name, ok:1}, ...wrong.map(x => ({t:P[x].name}))], yes:"맞아요! 기억하고 있었네요."};
  });
  return rounds.length ? rounds : [{q:"앤이 처음 도착한 곳은 어디였을까요?", opts:[{t:"브라이트 리버 역", ok:1}, {t:"에이번리 학교"}, {t:"뒷목장"}]}];
};
CH[10] = {
  title:"길모퉁이", when:"열여섯 살의 봄부터 가을까지", season:"autumn", img:"ch10", bgm:"bgm_ch10.mp3", anne:"anne_grow", walker:"walk_grow", who:"matthew",
  intro:"퀸스 학교를 마친 앤이 에이버리 장학금을 받고 초록 지붕 집으로 돌아왔어요. 이제 대학에 갈 수 있어요. 그런데 길은 가끔 생각지 못한 모퉁이를 돌아요.",
  teaser:"앤의 이야기는 길모퉁이 너머로 계속돼요.",
  end:{canon:["하느님은 하늘에, 세상은 평안히", "원작 속 앤처럼 꿈을 잠시 내려놓고 초록 지붕 집을 지키기로 했어요. 길모퉁이 너머에도 좋은 것이 기다리고 있대요."],
       imag:["이름 지은 길들의 지도", "앤이 이름 붙인 길들이 모두 모여 한 장의 지도가 되었어요. 상상은 앤의 가장 큰 보물이에요."],
       bal:["셋이서 펼치는 공부 책상", "마릴라 아주머니 곁에서, 길버트와 함께 공부하며 꿈을 이어 가기로 했어요."]},
  names:[], minis:["cows", "mymap"],
  quests:[
  {at:"home", label:"장학금 소식 전하러 집에 가기", bg:"ch10_home", nodes:[
    ["inner", "happy", "matthew", "퀸스 학교 졸업식. 나는 에이버리 장학금을 받았어!\n이제 레드먼드 대학에 갈 수 있어."],
    {eff:{get:"avery"}},
    ["matthew", "happy", "matthew", "\"글쎄다… 나는 네가 해낼 줄 알았다.\""],
    ["marilla", "happy", "marilla_warm", "\"…수고했다, 앤.\"\n마릴라 아주머니의 눈이 반짝였어."],
    {q:"장학금을 받은 앤은 가장 먼저 무엇을 할까요?", opts:[
      {t:"매슈 아저씨를 꼭 안아 드린다.", type:"canon", eff:{h:{matthew:1}}, then:[["anne", "happy", "matthew", "\"아저씨, 이건 다 아저씨 덕분이에요.\"\n아저씨는 쑥스러워하며 웃으셨어."]]},
      {t:"대학 생활을 상상하며 다락방 창밖을 본다.", type:"imag", then:[["inner", "dreamy", null, "레드먼드 대학의 커다란 도서관, 새로운 친구들…\n창밖 벚나무가 '잘 다녀와' 하고 손을 흔드는 것 같았어.", {dream:true, bg:"ch8_attic"}]]},
      {t:"마릴라 아주머니께 \"이제 제가 집안일 많이 도울게요\"라고 한다.", type:"bal", eff:{h:{marilla:1}}, then:[["marilla", "happy", "marilla_warm", "\"…녀석, 다 컸구나.\""]]}
    ]}
  ]},
  {at:"pasture", label:"매슈 아저씨와 저녁에 소 몰기", bg:"ch10_pasture", nodes:[
    ["inner", "happy", "matthew", "노을 지는 저녁, 매슈 아저씨와 뒷목장에서 소를 몰았어.\n아저씨 걸음이 예전보다 많이 느려지셨어."],
    {mini:{kind:"pace", id:"cows", title:"노을 속 소 몰기", how:"매슈 아저씨와 천천히 소를 몰아요. 서두르지 말고, 표시가 초록 칸에 들어올 때 '이랴~'를 눌러요.",
      say:"아저씨 걸음에 맞춰요", btn:"이랴~", n:4, zone:26, speed:.9,
      lines:["\"천천히 가자꾸나.\"", "\"소들도 집에 가고 싶은 게지.\"", "\"노을이 참 곱구나.\"", "\"…다 왔다.\""],
      res:{1:"조금 서둘렀지만 괜찮아요.", 2:"아저씨 걸음에 잘 맞췄어요.", 3:"아저씨와 한마음으로 걸었어요."}}},
    ["anne", "sad", "matthew", "\"아저씨, 제가 남자아이였으면 아저씨 일을 많이 도와드렸을 텐데요.\""],
    ["matthew", "happy", "matthew", "\"글쎄다, 나는 남자아이 열둘보다 네가 더 좋다.\n장학금을 탄 건 남자아이가 아니라 여자아이였잖니. 내 딸 앤.\""],
    {q:"아저씨의 말씀에 앤은 어떻게 할까요?", opts:[
      {t:"\"아저씨, 사랑해요\" 하고 팔짱을 낀다.", type:"canon", eff:{h:{matthew:1}}, then:[["inner", "happy", "matthew", "아저씨는 아무 말 없이 웃으셨어.\n노을이 아저씨 얼굴을 따뜻하게 물들였어."]]},
      {t:"\"내일은 제가 소를 몰게요. 아저씨는 쉬세요.\"", type:"bal", eff:{h:{matthew:1}, hid:"restMatthew"}, then:[["matthew", "happy", "matthew", "\"…그래, 그래 주겠니.\"\n아저씨가 내 어깨를 가볍게 두드리셨어."]]},
      {t:"별에게 아저씨가 늘 건강하시길 비는 편지를 쓰기로 한다.", type:"imag", eff:{hid:"starLetter"}, then:[["inner", "dreamy", "matthew", "오늘 밤 첫 번째 별에게 편지를 쓸 거야.\n'매슈 아저씨가 오래오래 곁에 계시게 해 주세요.'", {dream:true}]]}
    ]}
  ]},
  {at:"home", label:"초록 지붕 집에서 매슈 아저씨 곁에 있기", bg:"ch10_home", nodes:[
    ["nar", null, null, "다음 날 아침, 매슈 아저씨가 쓰러지셨어.\n아저씨는 다시 일어나지 못하셨어."],
    ["inner", "sad", null, "아저씨는 이제 곁에 안 계셔.\n가로수길의 꽃도, 노을도 그대로인데."],
    ["marilla", "sad", "marilla_warm", "그날 밤, 마릴라 아주머니가 내 방에 오셨어.\n\"앤… 나는 마음을 잘 표현하지 못하지만, 너를 친자식처럼 사랑한다.\""],
    ["anne", "sad", "marilla_warm", "\"아주머니…\"\n우리는 처음으로 서로를 안고 함께 울었어."],
    {eff:{h:{marilla:2}}},
    ["inner", "sad", null, "아저씨가 심어 두신 장미가 피면, 그 곁에 꽃을 심어 드려야지.\n아저씨가 좋아하시던 하얀 장미를."]
  ]},
  {at:"church", label:"매슈 아저씨께 꽃 심어 드리러 가기", bg:"ch7", nodes:[
    ["inner", "sad", "marilla_warm", "마릴라 아주머니와 교회 뒤뜰에 갔어.\n매슈 아저씨 곁에 하얀 장미를 심어 드렸지."],
    ["inner", "sad", null, "\"아저씨, 저 잘 지낼게요.\"\n바람이 살랑 불어서, 아저씨가 '글쎄다' 하고 웃으시는 것 같았어."],
    ["marilla", "sad", "marilla_strict", "돌아오는 길에 아주머니가 조용히 말씀하셨어.\n\"앤, 의사가 그러는데 내 눈이 점점 나빠진대.\n초록 지붕 집을 팔아야 할 것 같구나.\""],
    ["inner", "surprised", "marilla_strict", "초록 지붕 집을 판다고? 아주머니 혼자 낯선 곳으로?\n나는 밤새 생각했어. 그리고 마음을 정했어."],
    {q:"앤은 어떤 길을 고를까요?", opts:[
      {t:"장학금을 포기하고 에이번리에 남아 아주머니 곁을 지킨다.", type:"canon", eff:{h:{marilla:2}}, then:[["anne", "happy", "marilla_warm", "\"아주머니, 저 대학 안 가요. 여기 남아서 학교 선생님을 할게요.\n초록 지붕 집은 절대 팔지 않아요.\""], ["marilla", "sad", "marilla_warm", "\"앤… 나 때문에 네 꿈을…\""], ["anne", "happy", "marilla_warm", "\"꿈은 사라지지 않아요. 길모퉁이를 돌았을 뿐이에요.\""]]},
      {t:"초록 지붕 집에서 일하며 혼자 대학 공부를 이어 간다.", type:"bal", eff:{h:{marilla:2}}, then:[["anne", "happy", "marilla_warm", "\"여기 남아서 선생님을 하면서 밤에는 대학 공부를 할게요.\n둘 다 할 수 있어요!\""]]},
      {t:"이름 붙인 길들을 떠올리며 이 마을이 내 꿈이라고 말한다.", type:"imag", eff:{h:{marilla:1}}, then:[["anne", "dreamy", "marilla_warm", "\"'{avenue}', '{pond}', '{lane}'…\n제가 이름 붙인 길들이 다 여기 있어요. 여기가 제 꿈이에요.\"", {dream:true}]]}
    ]}
  ]},
  {at:"lynde", label:"고마운 이웃들에게 인사 다니기", nodes:[
    ["lynde", "happy", "lynde", "\"앤, 마릴라 곁에 남기로 했다며? 잘했다, 정말 잘했어.\""],
    ["lynde", "happy", "lynde", "\"그리고 들었니? 길버트가 에이번리 학교 선생 자리를 너한테 양보했단다.\n네가 마릴라 곁에 있을 수 있게.\""],
    ["inner", "surprised", "lynde", "길버트가…? 나를 위해서?"],
    ["inner", "happy", "lynde", "린드 아주머니께 인사드리고, 다른 고마운 분들도 떠올려 봤어.", {when:() => (S.hearts.lynde || 0) >= 2}],
    ["diana", "happy", "diana", "\"앤, 네가 에이번리에 남는다니 세상에서 제일 기뻐!\n우리 다시 날마다 만날 수 있어!\"", {bg:"ch3", when:() => (S.hearts.diana || 0) >= 3}],
    ["allan", "happy", "allan", "\"앤, 네가 고른 길도 분명 아름다운 길일 거야.\"", {bg:"ch7_garden", when:() => (S.met.allan && (S.hearts.allan || 0) >= 2)}],
    ["barry", "happy", "barry", "\"미니 메이가 앤 언니 언제 오냐고 날마다 묻는단다.\"", {bg:"ch6_barry", when:() => (S.hearts.barry || 0) >= 3}],
    ["inner", "happy", null, "에이번리에는 고마운 사람들이 참 많아.\n처음 기차역에 혼자 앉아 있던 날엔 상상도 못 했어."]
  ]},
  {at:"hill", label:"길모퉁이 언덕에 올라가기", nodes:[
    ["gilbert", "happy", "gilbert", "언덕 길에서 길버트를 만났어.\n길버트가 모자를 벗고 조용히 지나가려 했어."],
    ["anne", "happy", "gilbert", "\"길버트, 학교 자리를 양보해 줘서 고마워.\n그리고… 우리 이제 친구 할래?\""],
    ["gilbert", "happy", "gilbert", "\"앤, 우리는 친구가 될 운명이었어.\n오 년 동안 운명을 거스르느라 고생했지.\""],
    {eff:{h:{gilbert:2}}},
    {mini:{kind:"pick", id:"mymap", title:"나의 지도 완성", bg:false, how:"앤이 지금까지 이름 붙인 곳들을 떠올려요. 그 이름이 원래 어디였는지 골라서 '나의 지도'를 완성해요.",
      say:"이름 붙인 곳을 기억해요", rounds:myMapRounds,
      res:{1:"조금 헷갈려도 괜찮아요. 지도는 마음속에 있으니까요.", 2:"앤의 지도를 거의 다 기억했어요!", 3:"이름 붙인 곳을 모두 기억했어요! 완벽한 '나의 지도'예요."}}},
    ["inner", "dreamy", null, "언덕 위에서 에이번리가 한눈에 보였어.\n기차역, 가로수길, 반짝이는 연못, 그리고 초록 지붕 집."],
    {q:"길모퉁이 언덕에서, 앤은 마지막으로 무슨 생각을 할까요?", opts:[
      {t:"\"길모퉁이 너머에도 분명 좋은 것이 있을 거야.\"", type:"canon", then:[["inner", "happy", null, "퀸스를 떠날 때 내 앞길은 곧게 뻗어 있었어.\n이제 길은 모퉁이를 돌지만, 그 너머에도 분명 가장 좋은 게 기다리고 있을 거야."]]},
      {t:"이름 붙인 길들이 모두 모여 한 장의 지도가 되는 상상을 한다.", type:"imag", eff:{hid:"namedMap"}, then:[["inner", "dreamy", null, "내가 이름 붙인 길들이 반짝반짝 이어져\n한 장의 커다란 지도가 되었어. 이건 나만의 에이번리 지도야.", {dream:true}]]},
      {t:"길버트, 마릴라 아주머니와 함께 공부할 날들을 떠올린다.", type:"bal", eff:{h:{gilbert:1, marilla:1}}, then:[["inner", "happy", "gilbert", "낮에는 아이들을 가르치고, 저녁엔 마릴라 아주머니 곁에서\n길버트와 편지로 대학 공부를 해야지."]]}
    ]},
    ["inner", "happy", null, "\"하느님은 하늘에 계시고, 세상은 모두 평안하도다.\"\n나는 조용히 속삭였어."]
  ]}
]};
