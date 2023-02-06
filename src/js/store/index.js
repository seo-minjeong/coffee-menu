const store = {
  setLocalStorage(menu) {
    // JSON 형태를 문자열로 저장
    localStorage.setItem("menu", JSON.stringify(menu));
  },
  getLocalStorage() {
    return JSON.parse(localStorage.getItem("menu"));
  },
};

export default store;
