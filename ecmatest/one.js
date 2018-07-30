

var ll={aa:11};
// async function fun1(a) {
//       console.log("1");
//       ll.aa=ll.aa+11
//       await  console.log("2");
//       console.log(ll.aa);
// }

// async function fun2(a) {
//     console.log("4");
//     ll.aa=ll.aa+11;
//     await  console.log("5");
//     console.log(ll.aa);
// }

// fun1(ll);
// fun2(ll);
// console.log(ll.aa);

var prm=new Promise(function(res,rej){
  res(ll);
})
prm.then(val=>{
  console.log(val.aa);
})

ll.aa=33;