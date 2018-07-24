// function timeout(ms) {
//     console.log("he");
//   }

//   async function asyncPrint(value, ms) {
//     await timeout(ms);
//       console.log(value);
//       await timeout(ms);
//       console.log(value);
//       await timeout(ms);
//       console.log(value);
//       await timeout(ms);
//       console.log(value);
//       await timeout(ms);

//       console.log(value);
//   }

//   asyncPrint('hello world', 1000);

var obj={
  data:'',
  store:function(a) {
    this.data=a;
  },
  user:function(){
    this.data();
  }
}


function f1(s) {
  var n = s;
  n=n*2;
  function f2() {
    console.log(n);
  }
  obj.store(f2);
  n=3785;
}

f1(120);
obj.user();



