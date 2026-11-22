/* 3장 · 다이애나와의 맹세 (원작 11~13장) */
CH[3] = {
  title:"다이애나와의 맹세", when:"여름", season:"summer", img:"ch3", bgm:"bgm_ch3.mp3", anne:"anne", who:"diana",
  intro:"앤은 언제나 '마음의 친구'를 꿈꿔 왔어요. 시냇물 건너 배리 씨네 집에 앤 또래 여자아이 다이애나가 산대요!",
  teaser:"가을이 오면 앤도 학교에 가요. 학교에는 어떤 아이들이 있을까요?",
  end:{canon:["섬에서 제일 행복한 아이", "마음의 친구가 생긴 날. 원작 속 앤처럼 '세상에서 제일 행복한 아이'가 되었어요."],
       imag:["해와 달이 증인이 된 밤", "해와 달과 별에게 맹세한 우정! 상상으로 우정을 더 반짝이게 했어요."],
       bal:["두 배로 달콤한 초콜릿", "기쁨은 나누면 두 배가 된다는 걸 알았어요. 따뜻한 마음의 친구예요."]},
  names:["spring"], minis:["hat", "vow"],
  quests:[
  {at:"church", label:"일요일에 혼자 교회 가기", bg:"ch3_path", nodes:[
    ["inner", "happy", null, "일요일, 마릴라 아주머니가 아파서 나 혼자 교회에 가게 됐어.\n아주머니가 만들어 준 수수한 모자를 쓰고."],
    ["inner", "dreamy", null, "가는 길에 미나리아재비와 들장미가 바람에 흔들렸어.\n모자가 너무 밋밋해 보이는걸…"],
    {mini:{kind:"decorate", id:"hat", title:"꽃 모자 꾸미기", how:"오른쪽 꽃바구니의 들꽃을 손가락으로 끌어서 모자 위 원하는 곳에 놓아요. 놓은 꽃도 다시 끌어 옮길 수 있고, 모자 밖으로 빼면 없어져요.",
      q:"길가의 들꽃으로 모자를 꾸며요", baseImg:"mini_hat", max:10, say:"꽃을 끌어다 모자 위에 놓아요",
      items:[{img:"hf_buttercup", e:"🌼", t:"미나리아재비"}, {img:"hf_rose", e:"🌹", t:"들장미"}, {img:"hf_daisy", e:"🌼", t:"데이지"}, {img:"hf_violet", e:"🪻", t:"제비꽃"},
             {img:"hf_forgetmenot", e:"💠", t:"물망초"}, {img:"hf_clover", e:"🌺", t:"붉은 토끼풀"}, {img:"hf_apple", e:"🌸", t:"사과꽃"}, {img:"hf_fern", e:"🌿", t:"고사리 잎"}],
      res:{1:"수수한 모자 그대로예요.", 2:"꽃이 몇 송이 달린 예쁜 모자!", 3:"모자가 꽃밭이 됐어요! 사람들이 깜짝 놀랄지도…"}},
     good:[{eff:{get:"wreath"}}]},
    ["inner", "surprised", null, "교회에 들어서자 사람들이 모두 나를 쳐다봤어.\n소곤소곤, 킥킥…", {bg:"church_in"}],
    {q:"사람들이 모자를 보고 수군거려요. 앤은 어떻게 할까요?", opts:[
      {t:"모르는 척 의젓하게 앉아 기도 시간을 보낸다.", type:"canon", then:[["inner", "dreamy", null, "나는 꽃 모자를 쓰고 꼿꼿이 앉아 있었어.\n설교는 길었지만 창밖 하늘을 보며 상상했지."]]},
      {t:"나는 들꽃 나라의 여왕이라고 상상한다.", type:"imag", eff:{hid:"flowerQueen"}, then:[["inner", "dreamy", null, "나는 들꽃 나라의 여왕이야.\n사람들은 내 왕관을 보고 감탄하는 거야!", {dream:true, still:"sc_flowerQueen"}]]},
      {t:"\"다음엔 먼저 여쭤볼게요\" 하고 꽃을 조금 뗀다.", type:"bal", eff:{hid:"askFirst", h:{marilla:1}}, then:[["inner", "sad", null, "꽃 모자가 이상한 거였구나.\n다음엔 마릴라 아주머니께 먼저 여쭤봐야겠어."]]}
    ]},
    ["marilla", "sad", "marilla_strict", "\"앤, 모자에 꽃을 잔뜩 꽂고 갔다며? 동네가 떠들썩하더구나.\"", {bg:"ch2"}],
    ["marilla", "happy", "marilla_warm", "\"…그건 그렇고, 배리 부인 댁에 치마 본을 빌리러 갈 거다.\n다이애나라는 네 또래 아이가 있단다.\""]
  ]},
  {at:"barry", label:"배리 씨네 집에서 다이애나 만나기", nodes:[
    ["inner", "surprised", null, "가슴이 두근두근했어.\n'다이애나가 나를 좋아하지 않으면 어떡하지?'"],
    ["barry", "surprised", "barry", "\"어서 오세요, 마릴라. 이 아이가 그 아이로군요.\"", {as:"배리 부인"}],
    {eff:{met:"barry"}},
    {q:"배리 부인께 처음 인사해요. 앤은 어떻게 할까요?", opts:[
      {t:"\"안녕하세요. 앤 셜리예요. 끝에 e가 붙는 앤이요.\"", type:"canon", eff:{hid:"withE"}, then:[["anne", "happy", "barry", "\"앤이라고 불러 주세요. 끝에 e가 붙는 앤이요.\n그게 훨씬 우아하거든요.\"", {still:"sc_withE"}]]},
      {t:"\"저를 코델리아라고 불러 주세요!\"", type:"imag", eff:{hid:"cordelia"}, then:[["anne", "dreamy", "barry", "\"제 진짜 이름은 앤이지만, 코델리아라고 불러 주시면 기쁠 거예요.\"\n배리 부인이 눈을 동그랗게 뜨셨어.", {still:"sc_cordelia"}]]},
      {t:"공손히 고개 숙여 인사하고 조용히 기다린다.", type:"bal", eff:{h:{barry:1}}, then:[["barry", "happy", "barry", "\"얌전한 아이로구나.\"\n배리 부인이 고개를 끄덕이셨어."]]}
    ]},
    ["diana", "surprised", "diana", "까만 머리에 장밋빛 뺨, 웃는 눈.\n다이애나가 나를 보고 수줍게 웃었어."],
    {eff:{met:"diana"}},
    ["barry", "happy", "barry", "\"다이애나, 앤에게 정원을 구경시켜 주렴.\""],
    {bg:"ch3_garden"},
    ["inner", "dreamy", "diana", "참나리와 장미가 가득한 정원이었어.\n꿀벌들이 붕붕 노래했지."],
    ["anne", "happy", "diana", "\"다이애나, 나를 좀 좋아해 줄 수 있을까?\n내 마음의 친구가 되어 줄 만큼?\""],
    ["diana", "happy", "diana", "\"응, 그럴 것 같아!\n여기서 같이 놀 친구가 생겨서 정말 기뻐.\""],
    {mini:{kind:"pace", id:"vow", title:"우정의 맹세", how:"다이애나와 손을 잡고 맹세의 말을 한 마디씩 해요. 움직이는 하트가 분홍 칸에 들어올 때 '지금!'을 눌러요.",
      say:"하트가 분홍 칸에 들어오면 맹세!", btn:"맹세!", n:4, zone:15, speed:1.7, drift:.35,
      lines:["\"나는 맹세합니다…\"", "\"해와 달이 빛나는 한…\"", "\"내 마음의 친구 다이애나에게…\"", "\"영원히 변치 않는 우정을!\""],
      res:{1:"조금 더듬었지만 마음은 진짜예요.", 2:"멋진 맹세였어요!", 3:"다이애나: \"앤, 너는 정말 말을 예쁘게 한다!\""}},
     good:[{eff:{h:{diana:1}}}]},
    {q:"맹세를 마친 뒤, 앤은 무엇을 할까요?", opts:[
      {t:"\"이제 우리는 영원한 마음의 친구야!\" 하고 웃는다.", type:"canon", eff:{get:"vow", h:{diana:1}}, then:[["diana", "happy", "diana", "\"너는 정말 이상한 아이야, 앤.\n그래도 나 너 정말 좋아질 것 같아!\""]]},
      {t:"참나리로 왕관을 만들어 서로 씌워 준다.", type:"imag", eff:{hid:"lilyCrown", get:"vow"}, then:[["inner", "dreamy", "diana", "참나리 왕관을 쓴 우리는 꽃 왕국의 두 공주가 되었어.\n해님이 맹세의 증인이야!", {dream:true, still:"sc_lilyCrown"}]]},
      {t:"새끼손가락을 걸고 약속한다.", type:"bal", eff:{hid:"pinky", get:"vow", h:{diana:1}}, then:[["diana", "happy", "diana", "\"약속!\"\n작은 새끼손가락이 꼭 걸렸어.", {still:"sc_pinky"}]]}
    ]}
  ]},
  {at:"spring", label:"다이애나와 숲속 샘 찾아가기", nodes:[
    ["inner", "happy", "diana", "다이애나와 나는 날마다 같이 놀았어.\n통나무 다리를 건너면 자작나무 아래 작은 샘이 있었어."],
    ["inner", "dreamy", "diana", "샘물은 유리처럼 맑았어.\n꼭 나무 요정이 거울로 쓰는 것 같았지."],
    {name:"spring", q:"숲속 작은 샘에 어떤 이름을 붙일까요?", pick:["나무 요정의 샘", "유리 거울 샘", "다이애나와 앤의 샘"]},
    ["diana", "happy", "diana", "\"'{spring}'! 앤, 너는 이름을 정말 잘 지어.\""],
    {q:"샘가에서 다이애나와 무엇을 할까요?", opts:[
      {t:"샘가 바위 위에 소꿉놀이 집을 꾸민다.", type:"canon", then:[["inner", "happy", "diana", "깨진 접시 조각과 이끼로 작은 집을 꾸몄어.\n우리만의 비밀 장소야."]]},
      {t:"우리는 같은 별에서 온 자매라고 상상한다.", type:"imag", eff:{hid:"starSisters"}, then:[["inner", "dreamy", "diana", "우리는 아주 먼 별에서 함께 온 자매일지도 몰라.\n그래서 처음부터 이렇게 반가웠던 거야!", {dream:true, still:"sc_starSisters"}]]},
      {t:"작은 상자에 서로의 보물을 넣어 묻는다.", type:"bal", eff:{hid:"treasure", h:{diana:1}}, then:[["inner", "happy", "diana", "다이애나는 예쁜 단추를, 나는 벚꽃잎을 넣었어.\n우정의 보석 상자야.", {still:"sc_treasure"}]]}
    ]}
  ]},
  {at:"home", label:"초록 지붕 집에 돌아가기", bg:"ch2", nodes:[
    ["matthew", "happy", "matthew", "\"앤, 카모디에 갔다가… 초콜릿을 좀 사 왔다.\""],
    {eff:{get:"choco"}},
    ["marilla", "sad", "marilla_strict", "\"오라버니도 참! 단것은 이에 좋지 않아요.\n앤, 한 번에 다 먹지는 마라.\""],
    {q:"매슈 아저씨의 초콜릿, 앤은 어떻게 할까요?", opts:[
      {t:"반은 남겨서 다이애나에게 나눠 준다.", type:"canon", eff:{h:{diana:1, marilla:1}}, then:[["anne", "happy", "marilla_warm", "\"반은 내일 다이애나 줄래요.\n같이 먹으면 두 배로 달콤할 거예요!\""], ["marilla", "happy", "marilla_warm", "\"…욕심 없는 아이로구나. 그건 기특하다.\""]]},
      {t:"초콜릿이 요정 나라 보석이라고 상상하며 한 조각씩 아껴 먹는다.", type:"imag", then:[["inner", "dreamy", "matthew", "갈색 보석을 한 조각 입에 넣으니\n요정 나라의 맛이 사르르 녹았어.", {dream:true}]]},
      {t:"매슈 아저씨에게 먼저 한 조각 드린다.", type:"bal", eff:{h:{matthew:1}}, then:[["matthew", "happy", "matthew", "\"글쎄다… 나는 괜찮은데…\"\n아저씨는 쑥스러워하며 한 조각을 받으셨어."]]}
    ]},
    ["inner", "happy", null, "그날 밤 나는 생각했어.\n나는 지금 프린스에드워드 섬에서 제일 행복한 아이야.", {bg:"ch8_attic"}]
  ]}
]};
