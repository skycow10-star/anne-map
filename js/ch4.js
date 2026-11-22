/* 4장 · 홍당무 석판 사건 (원작 15장) */
CH[4] = {
  title:"홍당무 석판 사건", when:"가을", season:"autumn", img:"ch4", bgm:"bgm_ch4.mp3", anne:"anne", who:"diana",
  intro:"9월, 앤도 에이번리 학교에 다니게 됐어요. 다이애나와 함께 걷는 등굣길은 꿈만 같아요. 그런데 학교에는 길버트 블라이스라는 아이가 있대요.",
  teaser:"다이애나와 함께라면 무엇이든 즐거워요. 앤은 다이애나를 차 마시러 초대하고 싶어요!",
  end:{canon:["가까운 데서 빌려 온 걱정", "원작 속 앤처럼 자존심을 지켰어요. 길버트와의 이야기는 이제 막 시작이에요."],
       imag:["영원한 성의 두 공주", "상상의 성 안에서 다이애나와 함께라면 무섭지 않아요. 앤다운 하루였어요."],
       bal:["다시 자작나무 길로", "화도 났지만 내일 다시 학교에 가 보기로 했어요. 용기 있는 선택이에요."]},
  names:["birch"], minis:["path", "spell"],
  quests:[
  {at:"birch", label:"다이애나와 학교 가는 길 걷기", nodes:[
    ["diana", "happy", "diana", "\"앤, 이 길로 가면 학교가 금방이야.\n내가 제일 좋아하는 길이야!\""],
    {mini:{kind:"find", id:"path", title:"숲길 등굣길", bg:"ch4_birch", how:"하얀 자작나무 숲에 숲속 친구들이 숨어 있어요. 오른쪽 목록에 있는 것만 찾아 톡 눌러요. 목록에 없는 걸 누르면 3초가 줄어요! 20초가 지나면 힌트를 한 번 쓸 수 있어요.",
      say:"숲속에 숨은 것을 찾아요", time:40, size:4.4, hide:.22,
      things:[{img:"hf_violet", e:"🪻", name:"제비꽃", n:3, say:"제비꽃이야!"}, {img:"fl_butterfly", e:"🦋", name:"나비", n:2, say:"나비다!"},
              {img:"fl_bird", e:"🐦", name:"파랑새", n:2, say:"파랑새!"}, {img:"hf_fern", e:"🌿", name:"고사리", n:2, say:"고사리 잎!"}, {img:"fl_dandelion", e:"🌼", name:"민들레 홀씨", n:1, say:"후— 불어 볼까?"}],
      fakes:[{img:"hf_daisy", e:"🌼"}, {img:"hf_buttercup", e:"🌼"}, {img:"hf_forgetmenot", e:"💠"}, {img:"fl_rose", e:"🌹"}, {img:"hf_clover", e:"🌺"}],
      res:{1:"천천히 걸어도 괜찮아요. 길은 도망가지 않으니까요.", 2:"숲속 친구들을 많이 만났어요!", 3:"다이애나: \"앤, 너는 숲의 비밀을 다 아는 것 같아!\""}},
     good:[{eff:{h:{diana:1}}}]},
    ["inner", "dreamy", "diana", "하얀 자작나무가 양쪽에 줄지어 선 길이었어.\n햇빛이 잎 사이로 금가루처럼 쏟아졌어."],
    {name:"birch", q:"자작나무 숲길에 어떤 이름을 붙일까요?", pick:["자작나무 길", "하얀 기둥 숲길", "금가루 오솔길"]},
    ["diana", "happy", "diana", "\"'{birch}'! 좋아, 오늘부터 우리 길이야.\""]
  ]},
  {at:"school", label:"에이번리 학교 첫날 보내기", bg:"ch4_yard", nodes:[
    ["inner", "happy", "diana", "학교에는 친구들이 많았어. 루비, 제인, 조지…\n모두 다이애나 친구들이야."],
    ["diana", "surprised", "diana", "\"앤, 저기 길버트 블라이스야. 공부도 잘하고 엄청 잘생겼어.\n그런데 장난이 정말 심해.\""],
    {q:"길버트 이야기를 들은 앤은 어떻게 생각할까요?", opts:[
      {t:"\"관심 없어. 나는 공부로 1등 할 거야.\"", type:"canon", eff:{hid:"rival"}, then:[["inner", "angry", "diana", "흥, 잘생긴 건 상관없어.\n나는 1등을 할 거야!", {still:"sc_rival"}]]},
      {t:"길버트는 성을 지키는 기사일지도 모른다고 상상한다.", type:"imag", eff:{hid:"knight"}, then:[["inner", "dreamy", "diana", "길버트 경, 은빛 갑옷을 입은 기사…\n아니, 아직은 모르는 일이야!", {dream:true, still:"sc_knight"}]]},
      {t:"\"직접 만나 보고 판단할래.\"", type:"bal", eff:{hid:"fair"}, then:[["anne", "happy", "diana", "\"사람은 직접 만나 봐야 알 수 있잖아.\"\n다이애나가 고개를 끄덕였어.", {still:"sc_fair"}]]}
    ]},
    ["gilbert", "surprised", "gilbert", "수업 시간, 뒤에서 누가 내 땋은 머리를 잡아당겼어.\n\"홍당무! 홍당무!\"", {bg:"ch4"}],
    {eff:{met:"gilbert"}},
    {q:"길버트가 '홍당무'라고 놀려요. 앤은 어떻게 할까요?", opts:[
      {t:"석판으로 길버트의 머리를 딱 내리친다.", type:"canon", then:[["anne", "angry", "gilbert", "\"이 나쁜 아이! 어떻게 그런 말을!\"\n딱! 석판이 두 동강 났어."]]},
      {t:"길버트는 불을 뿜는 용이라고 상상하며 노려본다.", type:"imag", eff:{hid:"dragon"}, then:[["inner", "angry", "gilbert", "불을 뿜는 용 앞에서 나는 물러서지 않아!\n나는 눈으로 용을 꽁꽁 얼려 버렸어.", {dream:true, still:"sc_dragon"}]]},
      {t:"벌떡 일어나 \"당장 사과해!\"라고 말한다.", type:"bal", eff:{hid:"sayIt"}, then:[["anne", "angry", "gilbert", "\"길버트 블라이스, 당장 사과해!\"\n교실이 쥐 죽은 듯 조용해졌어.", {still:"sc_sayIt"}]]}
    ]},
    {eff:{get:"slate"}},
    ["phillips", "sad", "phillips", "\"앤 셜리! 칠판 앞에 나와 서 있어라.\"", {as:"필립스 선생님"}],
    ["gilbert", "sad", "gilbert", "\"선생님, 제가 놀려서 그런 거예요!\"\n하지만 선생님은 들은 척도 안 하셨어."],
    ["inner", "sad", null, "칠판에는 '앤 셜리는 성질이 고약합니다'라고 쓰여 있었어.\n나는 길버트를 절대 용서하지 않을 거야."]
  ]},
  {at:"birch", label:"점심시간에 가문비나무 숲 다녀오기", bg:"ch4_spruce", nodes:[
    ["inner", "happy", "diana", "점심시간, 우리는 가문비나무 숲에서 송진을 따며 놀았어.\n그런데 노래를 부르다 그만 종소리를 못 들었어!"],
    ["phillips", "sad", "phillips", "\"늦었구나, 앤. 벌로 오늘은 길버트 옆에 앉아라.\"", {bg:"ch4", as:"필립스 선생님"}],
    ["inner", "sad", "gilbert", "왜 나만? 다른 아이들도 늦었는데…\n나는 얼굴이 빨개져서 길버트 옆에 앉았어."],
    ["gilbert", "happy", "gilbert", "길버트가 책상 위에 분홍 하트 사탕을 슬쩍 올려놓았어.\n'당신은 귀여워요'라고 쓰여 있었어."],
    {q:"길버트의 하트 사탕, 앤은 어떻게 할까요?", opts:[
      {t:"사탕을 바닥에 떨어뜨리고 발로 밟아 버린다.", type:"canon", then:[["inner", "angry", "gilbert", "나는 사탕을 손끝으로 집어 바닥에 떨어뜨리고 꾹 밟았어.\n길버트는 쳐다보지도 않았지."]]},
      {t:"우리 사이엔 보이지 않는 유리벽이 있다고 상상한다.", type:"imag", eff:{hid:"glassWall"}, then:[["inner", "dreamy", "gilbert", "나와 길버트 사이에는 투명한 유리벽이 있어.\n사탕도, 목소리도 넘어올 수 없지!", {dream:true, still:"sc_glassWall"}]]},
      {t:"사탕을 조용히 길버트 책상에 돌려준다.", type:"bal", eff:{hid:"returned", get:"candy"}, then:[["inner", "sad", "gilbert", "나는 사탕을 길버트 쪽으로 살짝 밀어 두었어.\n아직은… 마음이 풀리지 않았어.", {still:"sc_returned"}]]}
    ]}
  ]},
  {at:"school", label:"받아쓰기 시간에 실력 보여 주기", bg:"ch4", nodes:[
    ["phillips", "happy", "phillips", "\"자, 받아쓰기 시합이다. 앤 셜리와 길버트 블라이스, 앞으로.\"", {as:"필립스 선생님"}],
    {mini:{kind:"pick", id:"spell", title:"받아쓰기 대결", how:"길버트와 낱말 대결을 해요. 길버트가 먼저 답하기 전에(아래 막대가 차기 전에) 알맞은 것을 골라요.",
      say:"맞는 것을 골라요", rival:{name:"길버트", sec:7},
      rounds:[
        {q:"앤이 좋아하는 이름은 어떻게 쓸까요?", opts:[{t:"끝에 e가 붙는 Anne", ok:1}, {t:"그냥 Ann"}, {t:"An"}]},
        {q:"맞게 쓴 것은?", opts:[{t:"가르치다", ok:1}, {t:"갈치다"}, {t:"가리치다"}]},
        {q:"맞게 쓴 것은?", opts:[{t:"깨끗이", ok:1}, {t:"깨끗히"}, {t:"깨끄시"}]},
        {q:"앤의 머리 색깔을 길버트는 뭐라고 놀렸나요?", opts:[{t:"홍당무", ok:1}, {t:"고구마"}, {t:"사과"}]},
        {q:"맞게 쓴 것은?", opts:[{t:"며칠", ok:1}, {t:"몇일"}, {t:"몇칠"}]},
        {q:"맞게 쓴 것은?", opts:[{t:"설거지", ok:1}, {t:"설겆이"}, {t:"설거찌"}]},
        {q:"앤이 사는 프린스에드워드섬은 어느 나라에 있을까요?", opts:[{t:"캐나다", ok:1}, {t:"영국"}, {t:"호주"}]},
        {q:"맞게 쓴 것은?", opts:[{t:"왠지 기분이 좋아", ok:1}, {t:"웬지 기분이 좋아"}, {t:"왼지 기분이 좋아"}]},
        {q:"3 × 7 은?", opts:[{t:"21", ok:1}, {t:"24"}, {t:"18"}]},
        {q:"맞게 쓴 것은?", opts:[{t:"내일 할게요", ok:1}, {t:"내일 할께요"}, {t:"내일 할꼐요"}]}
      ],
      res:{1:"길버트가 이겼어요. 그래도 다음에는 꼭!", 2:"엎치락뒤치락, 막상막하였어요!", 3:"앤이 이겼어요! 길버트도 놀란 눈치예요."}},
     good:[["inner", "happy", null, "길버트한테 지지 않았어!\n하지만 이상하게 마음이 그렇게 시원하지는 않았어."]],
     bad:[["inner", "angry", null, "흥, 다음엔 절대 안 질 거야.\n별 백 개를 걸고서라도!"]]}
  ]},
  {at:"home", label:"집에 가서 마릴라 아주머니께 이야기하기", bg:"ch2", nodes:[
    ["anne", "sad", "marilla_strict", "\"아주머니, 저 다시는 학교에 안 갈래요.\n길버트 블라이스 옆에 앉는 건 싫어요.\""],
    ["marilla", "sad", "marilla_strict", "\"…린드 부인 말로는, 아이가 마음이 풀릴 때까지 기다려 주라더구나.\""],
    {q:"앤은 앞으로 어떻게 할까요?", opts:[
      {t:"집에서 공부하며 학교를 쉬겠다고 한다.", type:"canon", eff:{hid:"needTime"}, then:[["anne", "sad", "marilla_strict", "\"집에서 혼자 공부할게요.\n지금은 시간이 좀 필요해요.\"", {still:"sc_needTime"}]]},
      {t:"별 백 개를 모으는 시험에 도전하는 상상을 한다.", type:"imag", eff:{hid:"starQuest"}, then:[["inner", "dreamy", null, "별 백 개를 모으면 길버트보다 먼저 1등이 되는 거야.\n밤하늘의 별들이 나를 응원했어.", {dream:true, still:"sc_starQuest"}]]},
      {t:"\"다이애나랑 같이라면 내일 다시 가 볼게요.\"", type:"bal", eff:{h:{diana:1, marilla:1}}, then:[["marilla", "happy", "marilla_warm", "\"그래, 그게 좋겠구나.\"\n아주머니가 내 머리를 살짝 쓰다듬으셨어."]]}
    ]}
  ]}
]};
