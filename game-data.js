/* ================================================================
 * BASKET 공용 경기 데이터 — 운영 콘솔(index.html)과 공개 경기 상세(game.html)가 같은 파일을 읽는다.
 * 예전엔 두 화면이 각자 목업을 들고 있어 공개 화면이 콘솔에 없는 점수를 보여줬다.
 * 서버가 붙기 전까지의 단일 소스 — 여기만 고치면 두 화면이 함께 바뀐다.
 * ================================================================ */
var BASKET_DAYS = [
  { date:'2026-07-23', day:'목', venue:'강남 실내체육관', items:[
    { id:'g1', court:'A', time:'12:00', label:'남자 일반부 8강', liveId:'g1',
      home:{ name:'서울 타이탄스', color:'#3b82f6', score:42 }, away:{ name:'인천 파이터스', color:'#ef4444', score:39 }, status:'live', clock:'3Q 04:32' },
    { id:'g2', court:'B', time:'12:00', label:'남자 일반부 8강', liveId:'g2',
      home:{ name:'강남 불꽃', color:'#8b5cf6', score:28 }, away:{ name:'마포 레이커스', color:'#22c55e', score:31 }, status:'live', clock:'2Q 06:10' },
    { id:'g3', court:'C', time:'12:00', label:'여자부 준결승', liveId:'g3',
      home:{ name:'송파 이글스', color:'#f59e0b', score:55 }, away:{ name:'용산 스톰', color:'#14b8a6', score:52 }, status:'live', clock:'4Q 01:45' },
    { id:'g4', court:'A', time:'14:00', label:'남자 일반부 4강',
      home:{ name:'종로 샤크스', color:'#0ea5e9', score:null }, away:{ name:'은평 코브라', color:'#84cc16', score:null }, status:'soon' },
    { id:'g5', court:'B', time:'15:30', label:'남자 일반부 4강',
      home:{ name:'동대문 피닉스', color:'#ec4899', score:null }, away:{ name:'강서 불스', color:'#6b7280', score:null }, status:'soon' },
    /* rec: 검수용 기록 요약 — 실제 구현에서는 GameEvent 집계를 서버가 내려준다.
       q는 쿼터별 [홈,원정]. 합이 최종 점수와 어긋나면 어딘가 기록이 새거나 겹친 것이다. */
    { id:'g6', court:'A', time:'09:00', label:'예선 3조',
      home:{ name:'종로 샤크스', color:'#0ea5e9', score:64 }, away:{ name:'은평 코브라', color:'#84cc16', score:61 }, status:'end',
      rec:{ events:58, deleted:2, q:[[18,16],[14,15],[17,14],[14,16]], pf5:[] } },
    { id:'g7', court:'B', time:'10:30', label:'예선 4조',
      home:{ name:'동대문 피닉스', color:'#ec4899', score:70 }, away:{ name:'강서 불스', color:'#6b7280', score:70 }, status:'end',
      rec:{ events:63, deleted:9, q:[[20,18],[16,17],[18,19],[16,16]], pf5:['강서 불스 12 오세훈'] } }
  ]},
  { date:'2026-07-20', day:'일', venue:'송파 체육관', items:[
    { id:'g8', court:'A', time:'13:00', label:'예선 1조',
      home:{ name:'서울 타이탄스', color:'#3b82f6', score:71 }, away:{ name:'송파 이글스', color:'#f59e0b', score:64 }, status:'fix' },
    { id:'g9', court:'A', time:'15:00', label:'예선 2조',
      home:{ name:'인천 파이터스', color:'#ef4444', score:58 }, away:{ name:'마포 레이커스', color:'#22c55e', score:66 }, status:'fix' }
  ]},
  { date:'2026-07-16', day:'수', venue:'강남 실내체육관', items:[
    { id:'g10', court:'B', time:'19:00', label:'예선 1조',
      home:{ name:'서울 타이탄스', color:'#3b82f6', score:80 }, away:{ name:'마포 레이커스', color:'#22c55e', score:72 }, status:'fix' },
    { id:'g11', court:'B', time:'20:30', label:'예선 2조',
      home:{ name:'강남 불꽃', color:'#8b5cf6', score:59 }, away:{ name:'용산 스톰', color:'#14b8a6', score:63 }, status:'fix' },
    { id:'g12', court:'C', time:'21:00', label:'예선 3조',
      home:{ name:'서울 타이탄스', color:'#3b82f6', score:67 }, away:{ name:'인천 파이터스', color:'#ef4444', score:64 }, status:'fix' }
  ]}
];

/* 경기별 상세 기록 — 기록원이 끝까지 입력하고 검수까지 끝난 경기에만 있다.
   없는 경기는 game.html이 "기록 준비 중"으로 비워 둔다. 없는 숫자를 지어내지 않는 게 요점이다.
   선수는 팀 명단(PLAYERS)에 등록된 사람만 쓴다 — 박스스코어에 없는 선수가 뛰면 명단과 어긋난다. */
var BASKET_RECORDS = {
  /* 확정 경기는 모두 기록을 갖는다 — "확정"인데 공개 화면이 비어 있으면 그 자체가 모순이다.
     아래 네 경기는 목록의 최종 점수에서 역산해 박스스코어·쿼터를 맞췄다(합계 일치 검산 완료).
     중계(pbp)는 g12에만 있다 — 이벤트 단위 로그는 지어내면 거짓이 되므로 없는 채로 둔다. */
  g8: {
    quarters:[ {h:22,a:16},{h:22,a:17},{h:16,a:11},{h:11,a:20} ],
    home:[
      { no:'7', name:'김민수', min:33, pts:19, reb:3, ast:6, stl:2, blk:0, to:2, pf:3, fg:[6,14], tp:[3,5], ft:[4,5] },
      { no:'11', name:'박정우', min:30, pts:19, reb:6, ast:4, stl:3, blk:2, to:0, pf:3, fg:[8,14], tp:[0,1], ft:[3,4] },
      { no:'23', name:'이현수', min:28, pts:16, reb:3, ast:2, stl:3, blk:0, to:0, pf:4, fg:[6,11], tp:[2,5], ft:[2,2] },
      { no:'15', name:'최영호', min:25, pts:11, reb:6, ast:4, stl:1, blk:2, to:2, pf:0, fg:[4,8], tp:[2,3], ft:[1,2] },
      { no:'32', name:'한지훈', min:22, pts:6, reb:10, ast:1, stl:1, blk:1, to:3, pf:0, fg:[2,5], tp:[2,4], ft:[0,0] }
    ],
    away:[
      { no:'31', name:'윤성민', min:33, pts:23, reb:7, ast:3, stl:0, blk:2, to:1, pf:0, fg:[10,17], tp:[2,4], ft:[1,2] },
      { no:'8', name:'조현우', min:30, pts:23, reb:2, ast:0, stl:0, blk:2, to:3, pf:3, fg:[10,14], tp:[0,2], ft:[3,5] },
      { no:'7', name:'양우석', min:28, pts:8, reb:6, ast:0, stl:1, blk:1, to:1, pf:4, fg:[3,9], tp:[2,6], ft:[0,0] },
      { no:'12', name:'백승현', min:25, pts:8, reb:1, ast:6, stl:3, blk:1, to:1, pf:2, fg:[3,11], tp:[0,1], ft:[2,3] },
      { no:'20', name:'구자운', min:22, pts:2, reb:2, ast:1, stl:2, blk:2, to:0, pf:3, fg:[1,9], tp:[0,2], ft:[0,1] }
    ]
  },
  g9: {
    quarters:[ {h:17,a:18},{h:15,a:21},{h:12,a:17},{h:14,a:10} ],
    home:[
      { no:'3', name:'이정호', min:33, pts:23, reb:6, ast:1, stl:3, blk:2, to:0, pf:4, fg:[9,15], tp:[2,3], ft:[3,3] },
      { no:'9', name:'최민석', min:30, pts:13, reb:2, ast:0, stl:2, blk:0, to:1, pf:4, fg:[5,12], tp:[0,4], ft:[3,3] },
      { no:'12', name:'박준영', min:28, pts:9, reb:2, ast:1, stl:3, blk:0, to:2, pf:1, fg:[4,10], tp:[0,1], ft:[1,3] },
      { no:'21', name:'김태호', min:25, pts:9, reb:8, ast:5, stl:1, blk:1, to:1, pf:2, fg:[3,11], tp:[3,4], ft:[0,2] },
      { no:'15', name:'심규현', min:22, pts:4, reb:10, ast:6, stl:0, blk:2, to:1, pf:2, fg:[1,6], tp:[1,5], ft:[1,1] }
    ],
    away:[
      { no:'5', name:'한승우', min:33, pts:24, reb:5, ast:2, stl:0, blk:0, to:0, pf:1, fg:[11,15], tp:[2,4], ft:[0,2] },
      { no:'4', name:'오세훈', min:30, pts:18, reb:8, ast:4, stl:3, blk:2, to:4, pf:2, fg:[7,10], tp:[1,4], ft:[3,4] },
      { no:'10', name:'강도현', min:28, pts:16, reb:6, ast:0, stl:1, blk:0, to:1, pf:2, fg:[6,9], tp:[3,5], ft:[1,1] },
      { no:'14', name:'문지환', min:25, pts:6, reb:3, ast:2, stl:1, blk:2, to:2, pf:4, fg:[2,4], tp:[0,3], ft:[2,2] },
      { no:'6', name:'배정훈', min:22, pts:2, reb:3, ast:7, stl:2, blk:1, to:0, pf:3, fg:[1,7], tp:[0,4], ft:[0,0] }
    ]
  },
  g10: {
    quarters:[ {h:22,a:22},{h:22,a:14},{h:18,a:16},{h:18,a:20} ],
    home:[
      { no:'7', name:'김민수', min:33, pts:24, reb:5, ast:6, stl:2, blk:0, to:4, pf:1, fg:[10,13], tp:[1,3], ft:[3,4] },
      { no:'11', name:'박정우', min:30, pts:20, reb:3, ast:7, stl:0, blk:0, to:3, pf:3, fg:[9,12], tp:[2,6], ft:[0,2] },
      { no:'23', name:'이현수', min:28, pts:17, reb:4, ast:5, stl:3, blk:0, to:4, pf:3, fg:[8,16], tp:[0,4], ft:[1,1] },
      { no:'15', name:'최영호', min:25, pts:12, reb:10, ast:2, stl:2, blk:0, to:0, pf:0, fg:[4,11], tp:[3,6], ft:[1,2] },
      { no:'32', name:'한지훈', min:22, pts:7, reb:7, ast:5, stl:0, blk:1, to:0, pf:3, fg:[2,6], tp:[0,1], ft:[3,5] }
    ],
    away:[
      { no:'5', name:'한승우', min:33, pts:22, reb:6, ast:3, stl:2, blk:2, to:2, pf:3, fg:[9,13], tp:[3,7], ft:[1,1] },
      { no:'4', name:'오세훈', min:30, pts:18, reb:2, ast:5, stl:1, blk:0, to:1, pf:2, fg:[7,13], tp:[1,5], ft:[3,5] },
      { no:'10', name:'강도현', min:28, pts:14, reb:2, ast:7, stl:3, blk:2, to:2, pf:3, fg:[7,12], tp:[0,4], ft:[0,1] },
      { no:'14', name:'문지환', min:25, pts:12, reb:5, ast:5, stl:0, blk:2, to:0, pf:0, fg:[3,11], tp:[3,5], ft:[3,4] },
      { no:'6', name:'배정훈', min:22, pts:6, reb:3, ast:5, stl:1, blk:2, to:4, pf:3, fg:[2,9], tp:[0,2], ft:[2,3] }
    ]
  },
  g11: {
    quarters:[ {h:19,a:17},{h:13,a:20},{h:14,a:16},{h:13,a:10} ],
    home:[
      { no:'2', name:'신재호', min:33, pts:21, reb:1, ast:2, stl:1, blk:2, to:2, pf:1, fg:[9,16], tp:[1,5], ft:[2,3] },
      { no:'13', name:'권민재', min:30, pts:16, reb:2, ast:0, stl:2, blk:1, to:0, pf:2, fg:[6,13], tp:[2,6], ft:[2,2] },
      { no:'17', name:'황준서', min:28, pts:10, reb:8, ast:7, stl:0, blk:2, to:1, pf:0, fg:[4,9], tp:[0,4], ft:[2,3] },
      { no:'22', name:'노태윤', min:25, pts:10, reb:9, ast:2, stl:3, blk:1, to:0, pf:1, fg:[4,12], tp:[2,6], ft:[0,0] },
      { no:'25', name:'서지호', min:22, pts:2, reb:10, ast:5, stl:2, blk:0, to:1, pf:0, fg:[1,4], tp:[0,3], ft:[0,1] }
    ],
    away:[
      { no:'1', name:'유하람', min:33, pts:14, reb:4, ast:5, stl:3, blk:1, to:4, pf:3, fg:[4,9], tp:[3,4], ft:[3,3] },
      { no:'16', name:'정우진', min:30, pts:14, reb:4, ast:1, stl:1, blk:2, to:0, pf:3, fg:[5,10], tp:[2,3], ft:[2,2] },
      { no:'18', name:'남기범', min:28, pts:13, reb:6, ast:5, stl:1, blk:1, to:0, pf:0, fg:[5,13], tp:[0,1], ft:[3,3] },
      { no:'27', name:'표현우', min:25, pts:13, reb:8, ast:7, stl:3, blk:2, to:2, pf:1, fg:[5,10], tp:[2,6], ft:[1,1] },
      { no:'33', name:'차민규', min:22, pts:9, reb:10, ast:2, stl:3, blk:1, to:2, pf:0, fg:[3,11], tp:[3,5], ft:[0,1] }
    ]
  },
  g12: {
    quarters:[ {h:17,a:16},{h:16,a:15},{h:18,a:17},{h:16,a:16} ],
    home:[
      /* photo — 선수가 올린 인물 사진(배경 제거본). 안 올린 선수는 이 필드가 없고 실루엣으로 떨어진다.
         실제 서비스에선 선수 프로필의 업로드 이미지가 그대로 내려온다. */
      { no:'7',  name:'김민수', min:31, pts:24, reb:6, ast:5, stl:2, blk:1, to:3, pf:3, fg:[9,16], tp:[3,7], ft:[3,4],
        photo:'https://images.pexels.com/photos/20615486/pexels-photo-20615486.jpeg?cs=srgb&dl=pexels-hanuman-photo-studio-564865561-20615486.jpg&fm=jpg' },
      { no:'11', name:'박정우', min:28, pts:14, reb:4, ast:7, stl:3, blk:0, to:2, pf:2, fg:[5,11], tp:[2,5], ft:[2,2] },
      { no:'23', name:'이현수', min:26, pts:12, reb:9, ast:1, stl:0, blk:3, to:1, pf:4, fg:[5,9],  tp:[0,1], ft:[2,3] },
      { no:'32', name:'한지훈', min:22, pts:9,  reb:7, ast:2, stl:1, blk:1, to:1, pf:2, fg:[4,8],  tp:[1,2], ft:[0,0] },
      { no:'15', name:'최영호', min:19, pts:8,  reb:5, ast:2, stl:1, blk:0, to:2, pf:5, fg:[3,7],  tp:[1,3], ft:[1,2], out:true }
    ],
    away:[
      { no:'3',  name:'이정호', min:33, pts:26, reb:5, ast:4, stl:1, blk:0, to:4, pf:3, fg:[10,19], tp:[4,9], ft:[2,2] },
      { no:'9',  name:'최민석', min:29, pts:15, reb:8, ast:2, stl:2, blk:2, to:2, pf:4, fg:[6,13],  tp:[1,4], ft:[2,3] },
      { no:'12', name:'박준영', min:27, pts:13, reb:3, ast:6, stl:3, blk:0, to:3, pf:2, fg:[5,10],  tp:[2,4], ft:[1,1] },
      { no:'21', name:'김태호', min:24, pts:10, reb:6, ast:1, stl:1, blk:1, to:1, pf:3, fg:[4,9],   tp:[0,2], ft:[2,2] }
    ],
    /* 중계 — 마지막 국면만 남긴다. 전체 이벤트는 서버가 붙은 뒤 콘솔 기록에서 그대로 내려온다. */
    pbp:[
      { q:4, t:'00:03', team:'home', no:'7',  name:'김민수', type:'ft',  made:true,  seq:'2/2', score:[67,64] },
      { q:4, t:'00:03', team:'home', no:'7',  name:'김민수', type:'ft',  made:true,  seq:'1/2', score:[66,64] },
      { q:4, t:'00:05', team:'away', no:'9',  name:'최민석', type:'pf',  sub:'일반' },
      { q:4, t:'00:24', team:'away', no:'3',  name:'이정호', type:'3pt', made:true,  score:[65,64] },
      { q:4, t:'00:41', team:'home', no:'11', name:'박정우', type:'ast' },
      { q:4, t:'00:41', team:'home', no:'23', name:'이현수', type:'2pt', made:true,  score:[65,61] },
      { q:4, t:'01:02', team:'away', no:'12', name:'박준영', type:'to' },
      { q:4, t:'01:19', team:'home', no:'32', name:'한지훈', type:'reb', sub:'수비' },
      { q:4, t:'01:22', team:'away', no:'21', name:'김태호', type:'2pt', made:false },
      { q:4, t:'01:48', team:'home', no:'7',  name:'김민수', type:'3pt', made:true,  score:[63,61] },
      { q:4, t:'02:10', team:'home', no:'15', name:'최영호', type:'pf',  sub:'일반' },
      { q:4, t:'02:31', team:'away', no:'3',  name:'이정호', type:'2pt', made:true,  score:[60,61] }
    ]
  }
};

/* 조회 도우미 — 두 화면이 같은 방식으로 경기를 찾는다 */
var BASKET = {
  days: BASKET_DAYS,
  items: function(){
    return BASKET_DAYS.reduce(function(a, d){
      return a.concat(d.items.map(function(it){
        var o = { date:d.date, day:d.day, venue:d.venue };
        for(var k in it) o[k] = it[k];
        return o;
      }));
    }, []);
  },
  find: function(id){ return BASKET.items().filter(function(g){ return g.id === id; })[0] || null; },
  record: function(id){ return BASKET_RECORDS[id] || null; }
};
