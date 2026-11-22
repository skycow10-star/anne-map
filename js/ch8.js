/* 8장 · 초록 머리 (원작 27장) */
CH[8] = {
  title:"초록 머리", when:"4월", season:"spring", img:"ch8", bgm:"bgm_ch8.mp3", anne:"anne", who:"marilla",
  intro:"앤의 가장 큰 고민은 언제나 빨간 머리였어요. 마릴라 아주머니가 외출한 어느 오후, 초록 지붕 집 뒷문에 물건을 파는 행상인이 찾아와요.",
  teaser:"짧은 머리도 금방 자라요. 여름이 오면 앤과 친구들은 연못에서 연극 놀이를 하기로 했어요!",
  end:{canon:["이젠 익숙해진 수다", "원작 속 앤처럼 솔직하게 털어놓고 실수를 받아들였어요. 짧은 머리도 앤다워요."],
       imag:["까마귀 머리 공주의 비밀", "까마귀처럼 까만 머리를 꿈꾸던 공주의 비밀 이야기. 상상은 늘 앤의 편이에요."],
       bal:["서로를 돌보는 저녁", "마릴라 아주머니와 서로 위로하며 보낸 저녁. 따뜻한 마음이 오갔어요."]},
  names:[], minis:["peddler", "ribbon", "tease"],
  quests:[
  {at:"home", label:"뒷문에 찾아온 행상인 만나기", bg:"ch8_porch", nodes:[
    ["peddler", "happy", null, "\"아가씨, 좋은 물건 구경하고 가요!\n이 염색약만 바르면 어떤 머리든 까마귀처럼 새까매진다오!\"", {as:"행상인"}],
    ["inner", "dreamy", null, "까마귀처럼 새까만 머리…\n이제 아무도 나를 홍당무라고 놀리지 않을 거야!"],
    {mini:{kind:"pick", id:"peddler", title:"행상인의 말 따져 보기", how:"행상인이 이것저것 자랑해요. 믿어도 되는 말인지, 너무 좋은 말만 하는 건 아닌지 골라 봐요.",
      say:"진짜일까, 아닐까?",
      rounds:[
        {q:"\"바르기만 하면 무조건 새까매진다오!\" 이 말은?", opts:[{e:"🤔", t:"너무 좋은 말만 해서 의심스럽다", ok:1}, {e:"😍", t:"정말 그럴 것 같다"}], yes:"맞아요, '무조건'은 조심!"},
        {q:"\"오늘만 이 값에 파는 거라오!\" 이 말은?", opts:[{e:"🤔", t:"서두르게 하려는 말일 수 있다", ok:1}, {e:"🏃", t:"지금 꼭 사야 한다"}], yes:"맞아요, 서두르면 실수해요."},
        {q:"어른이 안 계실 때 처음 보는 물건을 살 때는?", opts:[{e:"🙋", t:"어른께 먼저 여쭤본다", ok:1}, {e:"💰", t:"내 돈이니까 그냥 산다"}], yes:"맞아요!"}
      ],
      res:{1:"앤처럼 행상인의 말에 홀딱 넘어갔어요.", 2:"조금 의심스러웠지만…", 3:"모두 맞혔어요! 그런데 원작 속 앤은 결국 염색약을 샀대요."}}},
    {q:"염색약을 살까요?", opts:[
      {t:"75센트를 내고 염색약을 산다.", type:"canon", eff:{get:"dye"}, then:[["inner", "happy", null, "나는 염색약을 꼭 끌어안았어.\n드디어 까만 머리가 되는 거야!"]]},
      {t:"까마귀 물약이라고 상상하며 산다.", type:"imag", eff:{get:"dye", hid:"magicPotion"}, then:[["inner", "dreamy", null, "이건 마법의 까마귀 물약이야.\n한 방울이면 까마귀 머리 공주로 변신!", {dream:true}]]},
      {t:"머리카락 한 가닥에만 먼저 발라 보기로 한다.", type:"bal", eff:{get:"dye", hid:"testStrand"}, then:[["inner", "surprised", null, "한 가닥에 발라 봤더니… 어? 색이 좀 이상한데?\n하지만 나는 결국 머리 전체에 발라 버렸어."]]}
    ]}
  ]},
  {at:"home", label:"다락방 거울 앞에 서기", bg:"ch8_mirror", nodes:[
    ["inner", "surprised", null, "거울을 본 순간 나는 비명을 지를 뻔했어.\n내 머리가… 초록색이야!"],
    ["inner", "anne_green_hair", null, "빨간 머리보다 백 배는 더 끔찍한 초록 머리.\n어떡해, 어떡해!"],
    ["marilla", "anne_green_hair", "marilla_strict", "\"앤 셜리! 네 머리가 왜 그 모양이냐?\"", {bg:"ch8"}],
    {q:"마릴라 아주머니가 놀라셨어요. 앤은 어떻게 할까요?", opts:[
      {t:"행상인에게 염색약을 산 일을 솔직하게 다 말한다.", type:"canon", eff:{h:{marilla:1}}, then:[["anne", "anne_green_hair", "marilla_strict", "\"제가 나빴어요. 빨간 머리가 너무 싫어서 그만…\n허영심 때문에 벌을 받은 거예요.\""]]},
      {t:"책 속 여주인공처럼 비극적으로 한탄한다.", type:"imag", then:[["anne", "anne_green_hair", "marilla_strict", "\"오, 저는 세상에서 가장 불행한 소녀예요!\n초록 머리의 비극이여!\"", {dream:true}]]},
      {t:"\"그래도 눈은 예쁘대요…\" 하고 작게 말한다.", type:"bal", then:[["marilla", "anne_green_hair", "marilla_warm", "\"…그래, 눈은 예쁘지.\"\n아주머니가 한숨을 쉬며 살짝 웃으셨어."]]}
    ]}
  ]},
  {at:"home", label:"마릴라 아주머니와 머리 손질하기", bg:"ch8", nodes:[
    ["marilla", "anne_green_hair", "marilla_strict", "일주일 동안 날마다 머리를 감았지만 초록색은 빠지지 않았어.\n\"앤, 이제는 자를 수밖에 없구나.\""],
    {eff:{get:"scissors"}},
    ["inner", "sad", "marilla_warm", "싹둑, 싹둑.\n나는 울지 않았어. 아니, 아주 조금만 울었어."],
    ["inner", "anne_short_sad", "marilla_warm", "거울 속에는 머리가 짧은 낯선 아이가 있었어."],
    {mini:{kind:"pace", id:"ribbon", title:"리본 묶기", how:"짧아진 머리에 검은 벨벳 리본을 예쁘게 묶어요. 표시가 초록 칸에 들어올 때 '묶기!'를 눌러요.",
      say:"초록 칸에서 눌러요", btn:"묶기!", n:3, zone:22, speed:1.5,
      lines:["리본을 머리에 대고…", "한 바퀴 돌려서…", "나비 모양으로 꼭!"],
      res:{1:"조금 삐뚤지만 귀여워요.", 2:"예쁘게 묶었어요!", 3:"마릴라 아주머니: \"…생각보다 잘 어울리는구나.\""}},
     good:[{eff:{get:"ribbon"}}]},
    {q:"짧아진 머리를 보며 앤은 무슨 생각을 할까요?", opts:[
      {t:"\"그래도 머리는 다시 자라요\" 하고 웃어 본다.", type:"canon", then:[["anne", "anne_short_happy", "marilla_warm", "\"머리는 다시 자라잖아요.\n그동안 거울은 안 볼래요!\""]]},
      {t:"까마귀 머리 공주의 비밀 이야기를 지어낸다.", type:"imag", eff:{hid:"ravenPrincess"}, then:[["inner", "anne_short_dreamy", null, "옛날에 마법에 걸려 머리를 잘린 공주가 있었대.\n그 공주의 머리는 봄이 오면 다시 자랐지…", {dream:true}]]},
      {t:"아주머니께 \"자르느라 힘드셨죠\" 하고 말한다.", type:"bal", eff:{h:{marilla:2}}, then:[["marilla", "anne_short_happy", "marilla_warm", "\"…녀석, 별걱정을 다 하는구나.\"\n아주머니가 내 짧은 머리를 쓰다듬어 주셨어."]]}
    ]}
  ]},
  {at:"school", label:"짧은 머리로 학교 가기", bg:"ch4", nodes:[
    ["inner", "anne_short_sad", null, "학교에 가자 모두 내 머리를 쳐다봤어.\n조지 파이가 킥킥 웃었지."],
    {mini:{kind:"calm", id:"tease", title:"놀림 꾹 참기", how:"조지 파이의 놀리는 말이 날아와요. 톡 눌러 흘려보내요. 앤에게 닿으면 속상함 게이지가 올라가요.",
      say:"말을 눌러 흘려보내요!", gauge:"앤의 속상함", ok:"괜찮아", boom:"속상해서 눈물이 났어요.",
      words:["허수아비 같아!", "머리가 왜 그래?", "초록 머리였대!", "남자애 같아!", "까까머리!", "이상해!", "킥킥킥!", "거울 봤니?"],
      res:{1:"속상한 게 당연해요. 그래도 끝까지 참았어요.", 2:"잘 참았어요!", 3:"놀림에도 흔들리지 않았어요!"}}},
    ["diana", "anne_short_happy", "diana", "\"앤, 나는 네 짧은 머리 좋아.\n얼굴이 더 잘 보여서 예쁜걸!\""],
    {eff:{h:{diana:1}}},
    ["inner", "anne_short_happy", "diana", "다이애나 말 한마디에 마음이 사르르 풀렸어.\n친구란 정말 좋은 거야."]
  ]}
]};
