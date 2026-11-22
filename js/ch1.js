/* 1장 · 기차역의 기다림 (원작 1~3장) */
CH[1] = {
  title:"기차역의 기다림", when:"초여름", season:"spring", img:"ch1", bgm:"bgm_ch1.mp3", anne:"anne", who:"matthew",
  intro:"고아원에서 온 열한 살 앤 셜리. 오늘 처음으로 '내 집'이 생긴대요. 브라이트 리버 역에서 데리러 올 사람을 기다려요.",
  teaser:"그런데… 아저씨와 아주머니가 기다린 건 정말 여자아이였을까?",
  end:{canon:["꿈이 아니기를", "원작 속 앤이 했던 선택을 거의 그대로 따라갔어요. 앤의 마음을 정말 잘 읽었어요!"],
       imag:["별빛 아래의 코델리아", "원작과 다른 상상의 길을 많이 골랐어요. 앤처럼 상상력이 반짝이는 친구예요!"],
       bal:["고마워요, 매슈 아저씨", "앤의 마음도, 아저씨의 마음도 함께 생각했어요. 따뜻한 선택이었어요!"]},
  names:["avenue", "pond"], minis:["walk"],
  quests:[
  {at:"station", label:"기차역에서 나를 데리러 올 사람을 기다리기", lock:{except:[], why:"먼저 기차역에서 데리러 올 사람을 기다려야 해요"}, stage:{l:[26, 6, 66], r:[60, 6, 72]}, nodes:[
    ["inner", "dreamy", null, "나는 앤 셜리, 열한 살이야.\n오늘 고아원을 떠나 기차를 타고 브라이트 리버 역에 왔어."],
    ["inner", "happy", null, "초록 지붕 집의 커스버트 씨가 나를 데리러 온대.\n처음으로 진짜 내 집이 생기는 거야!"],
    ["station", "surprised", null, "\"얘야, 혼자 밖에 있지 말고 대합실 안에 들어가 기다리렴.\""],
    {q:"역장님이 대합실에 들어가 있으래요. 앤은 어디서 기다릴까요?", opts:[
      {t:"고맙지만 밖에서 기다릴래요. 밖이 상상할 게 더 많거든요!", type:"canon", then:[["anne", "happy", null, "\"고맙지만 밖에 있을래요. 밖이 상상할 게 더 많거든요.\"\n역장님은 \"참 별난 아이로군\" 하셨어."]]},
      {t:"철길 모퉁이의 하얀 벚나무에 올라가 본다.", type:"imag", eff:{hid:"cherry", get:"petal"},
        then:[["inner", "dreamy", null, "하얀 꽃이 가득한 벚나무 위는 대리석 궁전 같았어.\n나는 꽃잎 한 장을 주머니에 넣었어.", {dream:true, still:"sc_cherry"}]]},
      {t:"역장님 말씀대로 대합실에 들어가 얌전히 기다린다.", type:"bal", then:[["inner", "sad", null, "대합실은 깨끗했지만 답답했어.\n결국 살금살금 다시 밖으로 나왔지."]]}
    ]},
    ["inner", "surprised", "matthew", "그때 키 크고 등이 구부정한 아저씨가 서둘러 다가오셨어.\n초록 지붕 집의 매슈 커스버트 아저씨야!"],
    {eff:{met:"matthew"}},
    {q:"아저씨가 머뭇머뭇 다가와요. 앤은 어떻게 할까요?", opts:[
      {t:"벌떡 일어나 먼저 손을 내밀며 인사한다.", type:"canon", eff:{h:{matthew:1}}, then:[["anne", "happy", "matthew", "\"초록 지붕 집 매슈 커스버트 아저씨세요? 만나서 정말 반가워요!\"\n아저씨는 내 작은 손을 어색하게 잡아 주셨어."]]},
      {t:"기차역의 공주님처럼 우아하게 앉아 기다린다.", type:"imag", then:[["inner", "dreamy", "matthew", "나는 공주님처럼 앉아 있었어.\n그런데 아저씨는 모자만 만지작거리셨어. 결국 내가 먼저 일어났지!", {dream:true, still:"sc_princess"}]]},
      {t:"아저씨가 편하게 말할 수 있게 조용히 기다린다.", type:"bal", eff:{h:{matthew:1}}, then:[["matthew", "happy", "matthew", "\"…늦어서 미안하구나. 네가 앤이냐?\"\n아저씨 목소리가 생각보다 다정했어."]]}
    ]},
    ["matthew", "happy", "matthew", "\"자, 가자. 가방은 내가 들어 주마. 마차는 저쪽에 있다.\""],
    {eff:{get:"carpetbag"}},
    ["inner", "happy", "matthew", "아저씨 얼굴이 조금 당황한 것 같았어. 왜일까?\n그래도 괜찮아. 이제 초록 지붕 집으로 가는 거야!"]
  ]},
  {at:"avenue", label:"마차를 타고 가로수길로 가기", lock:{except:["station"], why:"매슈 아저씨 마차를 타고 가는 길이에요. 꽃길을 따라가요"}, nodes:[
    {mini:{kind:"catch", id:"walk", title:"꽃길 산책", roll:true, bg:false, how:"마차를 타고 가는 길이에요. 날아오는 예쁜 것을 톡 눌러 잡아요. 벌은 누르면 하나 줄어요! 20초 동안 많이 잡을수록 별이 늘어요.",
      say:"마차에서 보이는 예쁜 것을 톡!", time:20, goal:[8, 13], top:[8, 44], every:800,
      items:[{img:"fl_apple", e:"🌸", say:"하얀 레이스 같아!"}, {img:"fl_cherry", e:"🌸", say:"벚꽃잎이 춤춰요!"}, {img:"fl_daffodil", e:"🌼", say:"수선화가 인사해요!"},
             {img:"fl_rose", e:"🌹", say:"들장미 향기!"}, {img:"fl_butterfly", e:"🦋", say:"나비야, 안녕!"}, {img:"fl_bird", e:"🐦", say:"파랑새다!"},
             {img:"fl_dandelion", e:"🌼", say:"민들레 홀씨가 날아가요!"}, {img:"fl_violet", e:"💐", say:"보랏빛 제비꽃이에요!"},
             {img:"fl_bee", e:"🐝", bad:1, say:"앗, 벌이에요! 하나 놓쳤어요"}, {img:"fl_bee", e:"🐝", bad:1, say:"벌은 건드리지 마요!"}],
      res:{1:"매슈 아저씨: \"글쎄다, 천천히 봐도 괜찮단다.\"", 2:"매슈 아저씨: \"너는 정말 말을 잘하는구나. 실컷 말하렴.\"", 3:"매슈 아저씨: \"글쎄다… 나도 이렇게 예쁜 길인 줄 처음 알았구나.\""}},
     good:[{eff:{h:{matthew:1}}}]},
    ["matthew", "dreamy", "matthew", "\"여기는 그냥 가로수길이라고들 부르지.\"", {still:"sc_matthewTalk"}],
    ["inner", "dreamy", "matthew", "하얀 사과꽃이 지붕처럼 길을 덮고 있었어.\n저 끝에 노을이 성당의 장미창처럼 빛났어."],
    ["anne", "happy", "matthew", "\"가로수길이라니요! 그건 이름이 아니에요.\n제가 더 어울리는 이름을 붙여 줄래요.\""],
    {name:"avenue", q:"꽃이 핀 가로수길에 어떤 이름을 붙일까요?", pick:["기쁨의 하얀 길", "하얀 꽃 터널", "눈꽃 지붕길"], after:() => getItem("namecard")},
    ["matthew", "happy", "matthew", "\"'{avenue}'… 글쎄다, 참 좋은 이름이구나.\""]
  ]},
  {at:"pond", label:"연못 쪽으로 가기", lock:{except:["station", "avenue"], why:"매슈 아저씨 마차를 타고 가는 길이에요. 연못 쪽으로 가요"}, nodes:[
    ["inner", "dreamy", "matthew", "언덕을 내려가자 기다란 연못이 나타났어.\n물에 노을빛이 일렁여서 꼭 보석 같았어."],
    ["matthew", "dreamy", "matthew", "\"배리 씨네 연못이다. 저 언덕 위 집에 배리 씨네가 살지.\""],
    {name:"pond", hid:"mirror", q:"반짝이는 연못에 어떤 이름을 붙일까요?", pick:["반짝이는 호수", "노을 거울 연못", "은빛 물결 호수"],
     after:v => { if(v === "노을 거울 연못") hide("mirror"); }},
    ["anne", "happy", "matthew", "\"'{pond}'! 딱 맞는 이름이 떠오르면 온몸이 찌릿해요.\n아저씨도 그런 적 있으세요?\""],
    ["matthew", "happy", "matthew", "\"글쎄다… 그런 것 같기도 하구나.\""]
  ]},
  {at:"home", label:"초록 지붕 집에 도착하기", lock:{except:["station", "avenue", "pond"], why:"이제 초록 지붕 집으로 가요"}, stage:{l:[30, 4, 62], r:[58, 4, 70]}, nodes:[
    ["matthew", "surprised", "matthew", "\"저기가 초록 지붕 집이다.\""],
    ["inner", "happy", "matthew", "어둠 속 나무 사이로 창문 불빛이 반짝였어.\n저기가… 내 집이 될 곳이야."],
    {q:"초록 지붕 집 앞에 도착했어요. 앤은 무엇을 할까요?", opts:[
      {t:"꿈이 아닌지 팔을 꼬집어 본다.", type:"canon", then:[["inner", "surprised", "matthew", "나는 팔을 꼬집어 봤어. 아야!\n꿈이 아니야. 정말이야!"]]},
      {t:"탑이 일곱 개인 성이라고 상상한다.", type:"imag", eff:{hid:"castle"}, then:[["inner", "dreamy", "matthew", "눈을 감으니 탑이 일곱 개 있는 성이 보였어.\n창문마다 촛불이 켜져 있고, 정원에는 은빛 분수가 솟았어.", {dream:true, still:"sc_castle"}]]},
      {t:"아저씨께 데리러 와 줘서 고맙다고 말한다.", type:"bal", eff:{h:{matthew:1}}, then:[["anne", "happy", "matthew", "\"아저씨, 데리러 와 주셔서 정말 고마워요.\"\n아저씨 얼굴이 노을처럼 빨개지셨어."]]}
    ]}
  ]}
]};
