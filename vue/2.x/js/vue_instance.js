// var vm = new Vue({
//     el: "#vue_det",
//     data: {
//         firstname: "Ria",
//         lastname: "Singh",
//         address: "Mumbai",
//     },
//     methods: {
//         mydetails: function () {
//             return "I am " + this.firstname + " " + this.lastname;
//         },
//     },
// });

var _obj = { fname: "Raj", lname: "Singh" };

// direct instance creation
var vm = new Vue({
    el: "#vue_det",
    data: _obj,
});
console.log(vm.fname);
console.log(vm.$data);
console.log(vm.$data.fname);

// must use function when in Vue.extend()
var Component = Vue.extend({
    data: function () {
        return _obj;
    },
});
var myComponentInstance = new Component();
console.log(myComponentInstance.lname);
console.log(myComponentInstance.$data);

function after(fun, time = 2000) {
    setTimeout(fun, time);
}
after(function () {
    myComponentInstance.lname = "tuan dep rtai vo dich thien ha";
    after(function () {
        _obj.lname = "the fuck";
    });
});
