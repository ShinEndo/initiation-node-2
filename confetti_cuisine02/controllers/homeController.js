// コースの配列を定義
let courses = [
  {
    title: "Event Dricen Cakes",
    cost: 50,
  },
  {
    title: "Asynchronous Artichoke",
    cost: 25,
  },
  {
    title: "Object oriented Orange Juice",
    cost: 10,
  },
];

// ここの経路のためにコールバック関数を追加
exports.showCourses = (req, res) => {
  res.render("courses", {
    // コースの配列をビューに渡す
    offeredCourses: courses,
  });
};
exports.showSignUp = (req, res) => {
  res.render("contact");
};
exports.postSignUpForm = (req, res) => {
  res.render("thanks");
};
