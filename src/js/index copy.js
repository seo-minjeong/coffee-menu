// step1 요구사항 구현을 위한 전략

const $ = (selector) => document.querySelector(selector);

const store = {
  setLocalStorage(menu) {
    // JSON 형태를 문자열로 저장
    localStorage.setItem("menu", JSON.stringify(menu));
  },
  getLocalStorage() {
    localStorage.getItem("menu");
  },
};

function App() {
  // 업데이트 메뉴
  // 상태는 변하는 데이터, 이 앱에서 변하는 것이 무엇인가 - 갯수, 메뉴명
  this.menu = [];

  const updateMenuCount = () => {
    const menuCount = $("#espresso-menu-list").querySelectorAll("li").length;
    $(".menu-count").innerText = `총 ${menuCount}개`;
  };

  // 메뉴 추가
  const addMenuName = () => {
    if ($("#espresso-menu-name").value === "") {
      alert("값을 입력해주세요.");
      return;
    }

    const espressoMenuName = $("#espresso-menu-name").value;
    this.menu.push({ name: espressoMenuName });
    store.setLocalStorage(this.menu);
    const template = this.menu
      .map((item) => {
        return `
        <li data-menu-id="" class="menu-list-item d-flex items-center py-2">
            <span class="w-100 pl-2 menu-name">${item.name}</span>
            <button
                type="button"
                class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
            >
                수정
            </button>
            <button
                type="button"
                class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
            >
                삭제
            </button>
        </li>
      `;
      })
      .join("");

    $("#espresso-menu-list").innerHTML = template;
    updateMenuCount();
    $("#espresso-menu-name").value = "";
  };

  // 메뉴 수정
  const updateMenuName = (e) => {
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    const updateMenuName = prompt("메뉴명을 수정하세요.", $menuName.innerText);
    this.menu
    $menuName.innerText = updateMenuName;
  };

  // 메뉴 삭제
  const removeMenuName = (e) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      e.target.closest("li").remove();
      updateMenuCount();
    }
  };

  // form 태그가 자동으로 전송되는걸 막음
  $("#espresso-menu-form").addEventListener("submit", (e) => {
    e.preventDefault();
  });

  // 수정 / 삭제
  $("#espresso-menu-list").addEventListener("click", (e) => {
    if (e.target.classList.contains("menu-edit-button")) {
      updateMenuName(e);
    }

    if (e.target.classList.contains("menu-remove-button")) {
      removeMenuName(e);
    }
  });

  $("#espresso-menu-submit-button").addEventListener("click", addMenuName);

  // 메뉴의 이름을 입력받는건
  $("#espresso-menu-name").addEventListener("keypress", (e) => {
    if (e.key !== "Enter") {
      return;
    }
    addMenuName();
  });
}

App();
