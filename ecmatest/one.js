class A {

}

A.prototype.xy = 5;


class B extends A {

  sd() {
    console.log(this.xy);
  }
}

var obj = new B();
obj.sd();