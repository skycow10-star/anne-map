/* 할 일이 아닌 장소를 눌렀을 때 나오는 장마다의 짧은 이야기.
   SAY[장][장소] = [대사 노드...]  (없으면 engine.js 의 P[장소].say 한 줄이 나옴)
   대사 노드 모양은 장 데이터와 같음: [말하는사람, 앤표정, 오른쪽인물, "대사", {덧붙임}] */
const SAY = {
1:{
  lynde:[["inner", "dreamy", null, "언덕 위 반듯한 집 창가에서 누가 길을 내다보고 있어.\n저 집에는 누가 살까?"]],
  church:[["inner", "happy", null, "하얀 교회에 뾰족한 종탑이 있어.\n일요일이면 종소리가 마을까지 울리겠지?"]],
  school:[["inner", "dreamy", null, "작은 학교야. 여기서 공부하면 어떤 기분일까?\n친구가 생기면 좋겠다."]],
  barry:[["inner", "dreamy", null, "시냇물 건너 꽃밭이 있는 집이야.\n저 집에도 나만 한 여자아이가 살까?"]]
},
2:{
  station:[["inner", "happy", null, "여기서 아저씨를 기다리던 날이 벌써 옛날 같아.\n그때는 이렇게 될 줄 몰랐는데!"]],
  avenue:[["inner", "dreamy", null, "'{avenue}'의 꽃이 하나둘 지고 있어.\n꽃잎이 눈처럼 내려."]],
  pond:[["inner", "dreamy", null, "'{pond}'에 오리 가족이 헤엄쳐 가.\n엄마 오리가 앞장서고 아기 오리가 졸졸."]],
  lynde:[["inner", "sad", null, "린드 부인 댁이야. 창문 커튼이 살짝 움직였어.\n…아직은 들어가고 싶지 않아."], {when:() => S.qi > 4, w:"lynde", f:"happy", o:"lynde", t:"\"오, 앤이로구나. 수선화는 잘 꽂아 두었니?\""}]
},
3:{
  lynde:[["lynde", "happy", "lynde", "\"앤, 꽃 모자 이야기 들었다.\n교회에 꽃밭을 이고 온 아이는 처음이라더구나!\""]],
  lane:[["inner", "dreamy", null, "'{lane}'에 여름 햇빛이 초록빛으로 쏟아져.\n다이애나랑 같이 걸으면 더 좋겠다."]],
  pond:[["inner", "happy", null, "'{pond}'에 수련이 피었어.\n하얀 접시 같은 꽃 위에 개구리가 앉아 있어!"]],
  school:[["inner", "dreamy", null, "가을이 오면 여기서 공부하게 될 거야.\n다이애나랑 짝꿍이 되면 좋겠다."]],
  avenue:[["inner", "happy", null, "'{avenue}'. 이제 초록 터널이 됐어.\n꽃이 진 자리에 작은 열매가 맺혔어."]]
},
4:{
  barry:[["diana", "happy", "diana", "\"앤, 내일도 같이 학교 가자!\n자작나무 길 입구에서 기다릴게.\""]],
  spring:[["inner", "dreamy", null, "'{spring}' 위에 단풍잎이 동동 떠 있어.\n요정이 띄운 작은 배 같아."]],
  church:[["inner", "happy", null, "교회 앞 단풍나무가 불타는 것처럼 빨개.\n가을은 정말 화려한 계절이야."]],
  lynde:[["lynde", "happy", "lynde", "\"학교는 어떠니, 앤? 필립스 선생은 영 시원찮다던데.\""]],
  pond:[["inner", "dreamy", null, "'{pond}'에 하늘이 통째로 비쳐.\n물속에도 가을이 있어."]]
},
5:{
  lane:[["inner", "dreamy", null, "'{lane}'에 단풍잎이 수북이 쌓였어.\n밟을 때마다 바스락바스락 노래를 해."]],
  school:[["diana", "happy", "diana", "\"앤, 다과회 정말 기대돼!\n엄마가 제일 좋은 옷 입고 가래.\"", {when:() => S.qi <= 2}],
          ["inner", "sad", null, "학교에 가도 다이애나 옆자리는 비어 있어.", {when:() => S.qi > 2}]],
  lynde:[["lynde", "happy", "lynde", "\"마릴라가 오늘 카모디에 간다더구나.\n앤, 집 잘 보고 있어라.\""]],
  church:[["inner", "happy", null, "추수 감사 예배 준비로 교회가 사과와 호박으로 가득해."]]
},
6:{
  pond:[["inner", "happy", null, "'{pond}'. 꽁꽁 얼었어!\n하얀 얼음 위에 별빛이 반짝여."]],
  lynde:[["inner", "dreamy", null, "린드 부인 댁 굴뚝에서 하얀 연기가 피어올라.\n다들 시내 연설회에 가셨을까?"]],
  church:[["inner", "dreamy", null, "눈 덮인 교회 지붕이 설탕을 뿌린 케이크 같아."]],
  school:[["inner", "sad", null, "학교에서도 다이애나랑 말을 못 해.\n쪽지만 몰래 주고받았어."]],
  avenue:[["inner", "dreamy", null, "'{avenue}'의 나뭇가지마다 눈꽃이 피었어.\n겨울에도 하얀 꽃길이야!"]]
},
7:{
  barry:[["diana", "happy", "diana", "\"앤, 앨런 사모님 정말 좋은 분이지?\n나도 사모님 반에 들어가고 싶어.\""]],
  pond:[["inner", "happy", null, "'{pond}'에서 아이들이 물수제비를 뜨고 있어.\n퐁, 퐁, 퐁!"]],
  lynde:[["lynde", "happy", "lynde", "\"새 목사님 설교는 괜찮더구나.\n사모님은… 너무 젊은 게 흠이지만.\""]],
  spring:[["inner", "dreamy", null, "'{spring}'에 무지개가 떴어.\n내일은 실수 없는 날이 될 거야."]]
},
8:{
  barry:[["diana", "happy", "diana", "\"앤, 오늘은 왜 학교에 안 왔어? 아파?\"", {when:() => S.qi < 3}],
         ["diana", "happy", "diana", "\"짧은 머리도 정말 귀엽다니까!\"", {when:() => S.qi >= 3}]],
  lynde:[["lynde", "happy", "lynde", "\"행상인한테 물건 사면 안 된다, 앤.\n그 사람들 말은 반만 믿어야 해.\""]],
  church:[["allan", "happy", "allan", "\"앤, 무슨 일이든 혼자 끙끙 앓지 말고 이야기하렴.\""]],
  avenue:[["inner", "happy", null, "'{avenue}'에 다시 꽃이 피기 시작했어.\n봄은 언제나 돌아와."]]
},
9:{
  lynde:[["lynde", "happy", "lynde", "\"연못에서 위험한 장난 하면 안 된다, 앤.\""]],
  school:[["gilbert", "happy", "gilbert", "길버트가 친구들과 공을 차고 있어.\n…모르는 척 지나가자."]],
  church:[["allan", "happy", "allan", "\"앤, 요즘 공부가 아주 즐겁다면서? 퀸스 학교에 가 보는 건 어떠니?\""]],
  spring:[["inner", "dreamy", null, "'{spring}' 옆에서 친구들이랑 이야기 클럽을 열었어.\n오늘 주제는 '비극의 공주'야."]]
},
10:{
  avenue:[["inner", "dreamy", null, "'{avenue}'. 아저씨랑 처음 지나던 길이야.\n그날 아저씨는 '글쎄다'만 하셨지."]],
  pond:[["inner", "dreamy", null, "'{pond}'. 그 여름 일레인 놀이가 생각나.\n이젠 웃으면서 이야기할 수 있어."]],
  spring:[["diana", "happy", "diana", "\"앤, 우리 여기서 맹세했던 거 기억나?\"\n\"그럼, 해와 달이 빛나는 한이라고 했잖아.\""]],
  school:[["inner", "happy", null, "이 학교에서 내가 아이들을 가르치게 될지도 몰라.\n신기하지?"]],
  station:[["inner", "dreamy", null, "브라이트 리버 역. 모든 게 여기서 시작됐어.\n그날 벤치에 앉아 있던 나에게 말해 주고 싶어. 괜찮아, 다 잘될 거야."]],
  lane:[["inner", "dreamy", null, "'{lane}'. 단풍잎이 아저씨 모자 색깔이야."]]
}
};
