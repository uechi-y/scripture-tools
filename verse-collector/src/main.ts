fetch("https://google.com")
    .then((res) => res.text())
    .then((res) => console.log(res));
